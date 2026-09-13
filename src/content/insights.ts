import type { Insight } from '@/content/types';

/**
 * An insight is published once it has body blocks AND its publication date has
 * arrived. A future `datePublished` genuinely holds the piece back: it is left
 * out of the listing and the sitemap, and its route is marked `noindex` until
 * the date passes.
 *
 * That distinction matters. `datePublished` is emitted in BlogPosting schema
 * and read as a freshness signal, so the date has to be the date the article
 * actually became available — scheduling forward is honest, backdating is not.
 *
 * Evaluated in UTC to match the ISO dates in the content and the `dateModified`
 * emitted in schema, so a build machine's timezone cannot flip an article's
 * state a few hours early or late.
 */
export const isPublished = (i: Insight, now: Date = new Date()): boolean => {
  if ((i.body?.length ?? 0) === 0) return false;
  if (!i.datePublished) return true;
  return i.datePublished <= now.toISOString().slice(0, 10);
};

/**
 * True unless the href points at an insight that is not live yet.
 *
 * Cross-links are authored against the whole set, but a scheduled piece is
 * noindex and unlisted — linking to it from a live page would point internal
 * links at a page we are asking Google to ignore. Non-insight hrefs always
 * pass, so this can filter a mixed list of services, case studies and
 * articles without knowing which is which.
 */
export const isLinkLive = (href: string, now: Date = new Date()): boolean => {
  const match = /^\/insights\/([^/#?]+)/.exec(href);
  if (!match) return true;
  const target = insights.find((i) => i.id === match[1]);
  return target ? isPublished(target, now) : false;
};

/** Insights that are live: written, and past their publication date. */
export const publishedInsights = (now: Date = new Date()): Insight[] =>
  insights.filter((i) => isPublished(i, now));

/**
 * The number shown against an article in the UI.
 *
 * The authored `number` is a stable slot across the whole set, so once
 * scheduled or unwritten pieces are filtered out those slots read as gaps — a
 * listing of four articles numbered 01, 02, 03, 08. The displayed number is
 * therefore the position within the *published* set, falling back to the
 * authored slot for a piece that is not live yet (its own page, viewed direct).
 */
export const insightNumber = (id: string, now: Date = new Date()): string => {
  const position = publishedInsights(now).findIndex((i) => i.id === id);
  if (position >= 0) return String(position + 1).padStart(2, '0');
  return insights.find((i) => i.id === id)?.number ?? '01';
};

export const insights: Insight[] = [
  {
    id: 'angular-signals-state-management',
    seoTitle: 'Angular Signals State Management: When You Don’t Need a Store',
    seoDescription:
      'When Angular Signals are enough and a store is overhead — the promotion rule I use, drawn from a pension portal and an immigration case system.',
    datePublished: '2026-09-12',
    number: '01',
    title: 'Signals before ceremony',
    dek: 'Most UI state does not need a store. Start in the template, promote only what the product actually shares.',
    related: [
      { label: 'Angular development services', href: '/services/angular-development' },
      { label: 'PRIMS Member Portal — where two pieces of state earned a store', href: '/work/prims-member-portal' },
      { label: 'Fiji Immigration internal system', href: '/work/fiji-immigration-internal' },
      { label: 'Going zoneless without a long-lived branch', href: '/insights/angular-zoneless-change-detection' },
    ],
    cta: 'If you have an Angular codebase where changing one screen means opening six files, that is usually a state-layer problem rather than a discipline problem. I do scoped assessments that say which parts are worth fixing, and in what order.',
    body: [
      'Every Angular codebase I have inherited has had the same layer in it: a store that exists because the team was told a store was best practice, not because any two parts of the application actually needed to agree on the same value. On the Fiji immigration internal system there were services holding BehaviorSubjects for state that never left the component that created it — a filter panel open/closed flag, the currently expanded row in a table. Each one cost a subscription, an unsubscribe, and a file to open before anyone could understand the template.',

      { type: 'heading', text: 'What the ceremony actually costs' },

      'Here is the shape it usually takes. A boolean that one template reads, wrapped in enough machinery to look like architecture:',

      {
        type: 'code',
        language: 'typescript',
        caption: 'The version I keep finding: two files, one boolean, exactly one reader.',
        code: `// filter-panel.service.ts
@Injectable({ providedIn: 'root' })
export class FilterPanelService {
  private readonly openSubject = new BehaviorSubject<boolean>(false);
  readonly open$ = this.openSubject.asObservable();

  toggle(): void {
    this.openSubject.next(!this.openSubject.value);
  }
}

// filter-panel.component.ts
export class FilterPanelComponent implements OnInit, OnDestroy {
  open = false;
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly panel: FilterPanelService) {}

  ngOnInit(): void {
    this.panel.open$
      .pipe(takeUntil(this.destroy$))
      .subscribe((open) => (this.open = open));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}`,
      },

      'Nothing here is wrong, exactly. It is that the entire file pair exists to do what one line does:',

      {
        type: 'code',
        language: 'typescript',
        caption: 'The same behaviour, declared where it is read.',
        code: `export class FilterPanelComponent {
  readonly open = signal(false);

  toggle(): void {
    this.open.update((v) => !v);
  }
}`,
      },

      'No subscription, no teardown, no second file. A developer reading the template sees the declaration without navigating anywhere. That proximity is the whole benefit, and it is worth more than it looks — most of the time I have spent being slow in an unfamiliar Angular codebase went on following a value backwards through layers to find out where it came from.',

      { type: 'heading', text: 'The promotion rule' },

      'The rule I now apply is narrow, and it has held up across immigration case management, a pension member portal and an insurance administration console: state starts in the template, and it is promoted only when a second consumer appears. Not when a second consumer is imagined — when one actually exists in the code.',

      'Promotion has three steps and I take them in order. First the signal moves from the component to a service, still a signal. Second, if derived values start being recomputed in more than one place, those become computed signals in the same service, so the derivation has exactly one definition. Third — and this is rare — if the state has to survive navigation or be written from unrelated parts of the tree, it earns a store.',

      {
        type: 'code',
        language: 'typescript',
        caption: 'Step two. The derivation has one definition, and every consumer reads it.',
        code: `@Injectable({ providedIn: 'root' })
export class CaseQueueStore {
  private readonly cases = signal<Case[]>([]);
  readonly filter = signal<CaseFilter>('all');

  readonly visible = computed(() => {
    const filter = this.filter();
    return filter === 'all'
      ? this.cases()
      : this.cases().filter((c) => c.status === filter);
  });

  readonly outstanding = computed(
    () => this.visible().filter((c) => !c.assignedTo).length,
  );

  load(cases: Case[]): void {
    this.cases.set(cases);
  }
}`,
      },

      'Most state never reaches step three. On the PRIMS member portal, exactly two pieces of state did: the authenticated member context, and the active claim being edited across a multi-step flow. Everything else — table filters, expanded rows, form step position, panel visibility — stayed local or stopped at a service.',

      { type: 'heading', text: 'Why the ordering matters' },

      'Ceremony is not free, and its cost is paid at the wrong time. A store adds actions, reducers or updaters, selectors, and a mental model that a new developer has to load before they can change a label. That cost is invisible while the team that wrote it is still on the project, and it is the dominant cost afterwards. I have spent more hours tracing a value back through three layers of abstraction to find it was only ever read once than I have spent fixing genuine shared-state bugs.',

      'Signals changed the economics here in a way I think is still underrated. Before signals, keeping state in a component and sharing it later meant a rewrite: template-local fields became observables, templates gained async pipes, and change detection behaviour shifted. The migration was expensive enough that teams pre-emptively started in the store to avoid it. With signals, a component-local signal and a service-level signal are the same primitive — moving one to the other is a cut and a paste. The cost of starting small dropped to nearly zero, which makes starting small the rational default rather than an optimistic one.',

      {
        type: 'aside',
        text: 'This is not an argument against NgRx. It is an argument against reaching for it before you can name the second consumer. On a genuinely event-driven workflow with auditable state transitions, a store is the right tool and I will use one.',
      },

      { type: 'heading', text: 'Zoneless makes the same point from the other side' },

      'Once change detection is driven by signal reads rather than by a zone patching every async API, the framework rewards state that is precisely scoped, because only the components that actually read a signal re-render. Broad, shared, store-held state means broad invalidation.',

      {
        type: 'code',
        language: 'typescript',
        caption: 'Zoneless: the re-render set is whatever the template read, not whatever the zone noticed.',
        code: `bootstrapApplication(AppComponent, {
  providers: [provideZonelessChangeDetection()],
});`,
      },

      'On the Zellavora resume builder, which is zoneless and signal-driven throughout, the components that re-render on a keystroke are the ones displaying the edited field — not because of an optimisation pass, but because that is what the state graph says should happen. When state is scoped precisely, performance is a consequence of the architecture rather than a separate workstream.',

      { type: 'heading', text: 'The test I actually use' },

      'Before adding a store: can I name the second consumer, and can I point at its file? If the answer is a shape the application might take next quarter, the state stays in the template.',

      'It is far easier to promote state that turned out to be shared than to demote state that turned out not to be. The first direction is a cut and paste; the second is a conversation with a product owner about why you want to spend a sprint changing nothing a user can see. That asymmetry is the entire argument. Refactors nobody schedules never happen, so the ceremony stays in the codebase for as long as the codebase lives.',
    ],
  },
  {
    id: 'angular-performance-core-web-vitals',
    seoTitle: 'Angular Performance: Core Web Vitals as a Product Requirement',
    seoDescription:
      'Why load behaviour belongs in the feature spec rather than an optimisation phase, and what that changes about how Angular applications get built.',
    datePublished: '2026-09-12',
    number: '02',
    title: 'Performance is a product requirement',
    dek: 'If Core Web Vitals are optional, they lose. Treat load, input delay and layout shift as part of the spec.',
    related: [
      { label: 'Angular performance optimization', href: '/services/angular-performance-optimization' },
      { label: 'Fiji Immigration internal system — the 40% API reduction', href: '/work/fiji-immigration-internal' },
      { label: 'InsureMet — the dense table views', href: '/work/insuremet' },
      { label: 'Inheriting someone else’s Angular codebase', href: '/insights/angular-codebase-audit' },
    ],
    cta: 'If your application is slow and nobody can say precisely why, that is a measurement problem before it is an engineering one. I start these engagements by establishing which of the three usual causes you actually have.',
    body: [
      'The Fiji immigration internal management system ended up roughly 50% faster on the frontend, with about 40% less API consumption. Neither number came from a performance sprint. They came from treating load behaviour as part of the acceptance criteria for the features being built, at the point they were being built, which is the only time the work is cheap.',

      { type: 'heading', text: 'Why a separate performance phase loses' },

      'When performance is its own phase it competes with features for schedule, and it loses, because a feature has a stakeholder asking for it and a percentage does not. Worse, by the time the phase arrives the causes are structural. A component that fires a request in its constructor is a one-line problem on the day it is written, and an architectural problem six months later when forty components do it and the fix is a caching layer nobody budgeted for.',

      { type: 'heading', text: 'The composition problem' },

      'Most of the API reduction on the immigration system was exactly that class of problem, caught late enough to be real work. Case management screens are dense — a single officer view composed reference data, applicant history, document status and audit trail. Each panel had been built independently, and each fetched what it needed on init.',

      {
        type: 'code',
        language: 'typescript',
        caption: 'Correct in isolation. Multiplied by the six panels sharing these lookups, it is a waterfall.',
        code: `export class DocumentPanelComponent implements OnInit {
  countries: Country[] = [];
  documentTypes: DocumentType[] = [];

  constructor(private readonly api: ReferenceApi) {}

  ngOnInit(): void {
    this.api.countries().subscribe((c) => (this.countries = c));
    this.api.documentTypes().subscribe((t) => (this.documentTypes = t));
  }
}`,
      },

      'Panels shared reference data heavily, so the same lookup endpoints were being called five and six times per page load. The fix was unglamorous — shared lookups behind a service that caches for the session, with in-flight deduplication so concurrent callers join one request rather than starting six:',

      {
        type: 'code',
        language: 'typescript',
        caption: 'shareReplay with refCount:false holds the value for the session; concurrent callers join the in-flight request instead of starting their own.',
        code: `@Injectable({ providedIn: 'root' })
export class ReferenceDataService {
  private readonly cache = new Map<string, Observable<unknown>>();

  private lookup<T>(key: string, fetch: () => Observable<T>): Observable<T> {
    if (!this.cache.has(key)) {
      this.cache.set(
        key,
        fetch().pipe(shareReplay({ bufferSize: 1, refCount: false })),
      );
    }
    return this.cache.get(key) as Observable<T>;
  }

  countries(): Observable<Country[]> {
    return this.lookup('countries', () => this.api.countries());
  }
}`,
      },

      'The second half of the fix was a rule rather than code: components receive reference data as inputs, and the route resolves it once. The interesting part of this episode is that no individual developer did anything wrong. Every panel was correct on its own. The composition was the defect, and composition is nobody’s ticket.',

      { type: 'heading', text: 'Layout shift has the same shape' },

      'It is almost never introduced deliberately; it accumulates from images without dimensions, content that swaps in after a fetch, and banners injected above the fold. Each instance is trivially fixable by the person who wrote it, on the day they wrote it. Collectively they become a score nobody owns.',

      {
        type: 'code',
        language: 'html',
        caption: 'Reserving space is a habit, not a task — and habits are only installable during implementation.',
        code: `<!-- shifts when the image arrives -->
<img [src]="applicant.photoUrl" alt="" />

<!-- reserves its box from first paint -->
<img [src]="applicant.photoUrl" alt="" width="240" height="320" />

<!-- async content: reserve the box, do not collapse it -->
<div class="panel" style="min-height: 18rem">
  @if (documents(); as docs) {
    <app-document-list [documents]="docs" />
  } @else {
    <app-skeleton-rows [count]="4" />
  }
</div>`,
      },

      { type: 'heading', text: 'What I put in the spec' },

      'The changes are small. A ticket that adds a view says what it may fetch on load and what it must receive from its parent. A ticket that adds an image or an embed says the space is reserved. Interaction work states what happens on the input that triggers it — whether the UI acknowledges immediately or waits for the server. These are one-line additions to tickets that were being written anyway, and they move the decision to the only moment when it costs nothing.',

      {
        type: 'aside',
        text: 'None of this needs a performance culture or a dashboard on a wall. It needs performance statements in the same document as the functional requirements, reviewed by the same people at the same time. In the spec, they get built. In a backlog labelled "optimisation", they get discussed.',
      },

      { type: 'heading', text: 'INP is the one that changed my habits' },

      'Interaction to Next Paint measures something users complained about long before there was a number for it. A button that runs a synchronous filter over a few thousand rows on click feels broken even when the total work is well under a second, and no amount of load-time optimisation compensates.',

      'On the insurance administration console the dense table views needed work here specifically. The fix is not to do less work — it is to let the browser paint the acknowledgement before doing it:',

      {
        type: 'code',
        language: 'typescript',
        caption: 'Same total work, entirely different product. The interface responds in the same frame; the expensive pass happens after the paint.',
        code: `applyFilter(filter: PolicyFilter): void {
  // Paints this frame: the user sees the click land.
  this.pending.set(true);
  this.activeFilter.set(filter);

  // Yields to the browser, then does the expensive pass.
  afterNextRender(() => {
    this.rows.set(this.filterPolicies(filter));
    this.pending.set(false);
  }, { injector: this.injector });
}`,
      },

      'For genuinely heavy work the same principle scales up: move it to a web worker, or page it so the first screenful renders and the rest streams. The constant is that the main thread must be free to acknowledge the input. A user who sees their click register will wait; a user who sees nothing assumes it failed and clicks again, which is how you get duplicate submissions in a system that handles money.',

      { type: 'heading', text: 'The measurement discipline' },

      'Measure before changing anything. Angular performance work divides into three causes with three different fixes: bundle and lazy-loading problems, change detection running more than it needs to, and network waterfalls from components that fetch on init. They look identical from the outside — "the page is slow" — and the fix for one does nothing for the others. Establishing which one you actually have is most of the work, and skipping that step is how teams spend a quarter optimising something that was never the bottleneck.',
    ],
  },
  {
    id: 'enterprise-ui-design-restraint',
    seoTitle: 'Enterprise UI Design: Why Quiet Interfaces Age Better',
    seoDescription:
      'Restraint as an engineering decision in software people are required to use every day, from government case systems and member portals.',
    datePublished: '2026-09-12',
    number: '03',
    title: 'Quiet interfaces age better',
    dek: 'Motion should explain hierarchy, not decorate it. One accent, one rhythm, and copy that can stand without animation.',
    related: [
      { label: 'Ionic and cross-platform mobile services', href: '/services/ionic-development' },
      { label: 'VNPF blo mi member app', href: '/work/vnpf-blo-mi' },
      { label: 'Angular UI component architecture', href: '/work/ui-component-architecture' },
      { label: 'Offline is a design input, not an error state', href: '/insights/ionic-offline-first-architecture' },
    ],
    cta: 'If your product looked right at launch and feels tiring a year in, that is usually a systems problem in the interface layer rather than a visual one. That is the kind of work I do.',
    body: [
      'The interfaces I have built that aged best are the ones where motion explains the structure and then gets out of the way. The ones that aged worst are the ones where the motion was the point. This is not a taste position — it is what I observed going back into these codebases a year later to add features.',

      { type: 'heading', text: 'The fortieth use is the real product' },

      'Government and pension software makes the argument clearly, because the usage pattern is extreme. An immigration officer works the same case queue for eight hours. A VNPF member opens the app to check a balance and leaves. Neither has any appetite for a transition they have seen four hundred times.',

      'Animation that reads as considered on first use reads as latency on the fortieth, and the fortieth use is the one that describes the actual product. Design review looks at the first use. Nobody schedules a review of the fortieth.',

      { type: 'heading', text: 'Does the motion do work the layout cannot?' },

      'The distinction I hold to is whether the motion carries information. A panel that slides in from the edge it will return to is telling the user where it came from and how to dismiss it — spatial information the static layout cannot express. A card that fades up because cards fade up is decoration. The first survives repetition because it answers a question the user is asking each time; the second only survives novelty.',

      {
        type: 'aside',
        text: 'The test: turn the animation off and read the screen. If the hierarchy collapses, the animation was carrying meaning the layout should have carried — fix the layout. If the screen still reads correctly, the animation is genuinely additive and free to stay.',
      },

      { type: 'heading', text: 'One accent, one job' },

      'A single accent colour applied to one job does more for coherence than any amount of transition polish. Across this portfolio and the client work behind it, the accent marks the thing you can act on next. Not headings, not decoration, not emphasis in running text.',

      'When the accent means exactly one thing, a user learns it in a single screen and carries it through the entire product, and every subsequent screen is cheaper to read. The moment it also marks a heading somewhere, it means nothing anywhere. This is easy to state and hard to hold, because there is always one screen where the accent would look good on something else.',

      {
        type: 'code',
        language: 'css',
        caption: 'A small token set, reused. Every ad-hoc duration is a small inconsistency; enough of them read as an interface assembled by several people who did not speak.',
        code: `:root {
  /* One accent. One job: the next action. */
  --color-accent: oklch(0.72 0.17 48);

  /* Three durations, one curve. Nothing else. */
  --duration-ui: 160ms;
  --duration-section: 420ms;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}`,
      },

      { type: 'heading', text: 'Reduced motion is not an edge case' },

      'A meaningful proportion of users browse with reduced motion enabled, and on a mid-range phone several years old the frames drop whether or not anyone asked. If the interface only works with motion running, both groups get a broken product.',

      'The correct default is to treat motion as an enhancement applied on top of a layout that already works, rather than a layer the layout depends on:',

      {
        type: 'code',
        language: 'css',
        caption: 'The layout is correct first; motion is added for users who can take it.',
        code: `.panel {
  /* Correct with no animation at all. */
  transform: none;
  opacity: 1;
}

@media (prefers-reduced-motion: no-preference) {
  .panel {
    animation: panel-in var(--duration-section) var(--ease-out-expo);
  }
}

@keyframes panel-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: none; }
}`,
      },

      'Writing it in this order matters more than it appears. The common alternative — animate by default, then disable under a reduced-motion query — means the no-motion path is the one nobody tests, and it is the path a real share of your users are on. Inverting the default makes the tested path the resilient one.',

      { type: 'heading', text: 'Density is the mobile version of the same argument' },

      'On the VNPF member app the constraint was not taste, it was thumbs. A pension member checking a balance is standing up, one-handed, often on a screen that has been dropped a few times. Interfaces designed on a desktop monitor and then made responsive tend to shrink everything uniformly, which keeps the visual composition and destroys the ergonomics.',

      'Restraint helps here for an unglamorous reason: fewer elements means each one can be bigger. Every decorative affordance you remove is space returned to the controls that actually get pressed.',

      {
        type: 'code',
        language: 'css',
        caption: 'The floor is the pointer-accurate one, not the mouse one. Padding expands the hit area without changing the visual weight of the control.',
        code: `.control {
  /* Visual size and hit size are different problems. */
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Coarse pointers get the larger floor even where the design is compact. */
@media (pointer: coarse) {
  .control {
    min-height: 48px;
    min-width: 48px;
  }
}`,
      },

      'The same logic applies to what the screen shows at all. A member app that opens on the balance, in the largest type on the screen, with everything else one tap away, beats a dashboard that shows nine things at once — because there is exactly one reason most people opened it, and the design either respects that or charges them a scan for it every single time.',

      { type: 'heading', text: 'Copy has to survive the same test' },

      'If a heading only makes sense once the words have staggered into place, it is a heading that depends on a rendering condition. That condition fails in a search result, in a screen reader’s heading list, in an AI-generated summary, and in a browser that decided this frame belonged to something else.',

      'This site is a working example of the rule. Its motion primitives compile down to plain markup — the animations are off, and the headings, the reading order and the document outline are identical with or without them. Text that stands still is text that works everywhere it gets quoted, which is now most of the places that matter.',

      { type: 'heading', text: 'What this buys you a year later' },

      'The payoff is not aesthetic. It is that a restrained interface has fewer places to be inconsistent, so the second team to touch it can stay consistent without reading a document. A product with three durations and one accent has a shape a new developer can infer from any single screen. A product with forty ad-hoc timings has a shape that exists only in the head of whoever left.',
    ],
  },
  {
    id: 'angular-zoneless-change-detection',
    seoTitle: 'Angular Zoneless Change Detection: Migrating Without a Long-Lived Branch',
    seoDescription:
      'An incremental path to zoneless Angular — what to make precise first, what ships independently, and the checks I run at each step.',
    datePublished: '2026-09-15',
    number: '04',
    title: 'Going zoneless without a long-lived branch',
    dek: 'Zoneless is the last step of a migration, not the first. What to fix before you flip the provider, and how to ship it in pieces.',
    related: [
      { label: 'Signals before ceremony', href: '/insights/angular-signals-state-management' },
      { label: 'Angular development services', href: '/services/angular-development' },
      { label: 'Zellavora AI Resume Builder — zoneless in production', href: '/work/zellavora-ai-resume-builder' },
    ],
    cta: 'If you are looking at a zoneless migration on a codebase that cannot stop shipping, the sequencing matters more than the flag. I plan and execute these incrementally, inside the running application.',
    body: [
      'Zoneless is the least interesting part of a zoneless migration. Turning it on is one provider. Everything that makes the migration succeed or fail happens before that line, and the teams that get into trouble are the ones that flip the flag first and then spend a quarter chasing views that stopped updating.',

      'The framing that works: zoneless is not a feature you adopt, it is a property your application earns once its change detection is driven by state rather than by side effects. Get the state right and the flag is a formality.',

      { type: 'heading', text: 'Why the big-bang branch fails' },

      'The instinct is to branch, migrate everything, and merge. On any codebase with active feature work this fails for a reason that has nothing to do with Angular: the branch diverges faster than it converges. Six weeks in you are resolving conflicts in files you already migrated, against features written by people who did not know the rules changed.',

      'Every step below ships independently to main. None of them require zoneless to be on. That is the point — if the migration is paused for a release, or for a quarter, the codebase is left in a coherent state rather than half-converted.',

      { type: 'heading', text: 'Step 1: find what actually depends on the zone' },

      'Zone.js patches async APIs and triggers change detection when they fire. Remove it and anything relying on that implicit trigger stops updating. The offenders are findable before you change anything:',

      {
        type: 'code',
        language: 'bash',
        caption: 'A morning of grep tells you the real size of the migration. Do this before estimating it.',
        code: `# Timers that mutate state and rely on the zone to notice
rg -n "setTimeout|setInterval" src --type ts

# Explicit zone usage — each one is a decision to re-make
rg -n "NgZone|runOutsideAngular|ApplicationRef.tick" src --type ts

# Manual change detection — often a symptom, sometimes the fix
rg -n "detectChanges|markForCheck|ChangeDetectorRef" src --type ts

# Non-Angular async sources: these never had a zone guarantee worth trusting
rg -n "addEventListener|new Worker|WebSocket|IntersectionObserver" src --type ts`,
      },

      'Sort the results into three piles: state mutations that should become signal writes, genuine outside-Angular work that should stay outside, and manual `detectChanges` calls that are papering over the first category. The third pile is usually the largest and the most informative — every one of them is a place where someone already noticed the zone was not doing what they expected.',

      { type: 'heading', text: 'Step 2: convert the triggers, not the components' },

      'The migration unit is not the component, it is the async source. A timer that writes to a signal is zoneless-safe regardless of which component reads it, which means you can convert data flows one at a time without touching the templates that consume them.',

      {
        type: 'code',
        language: 'typescript',
        caption: 'Before and after. The consuming template is unchanged in both cases — which is why this can be done incrementally.',
        code: `// Before: relies on the zone noticing the timer fired
export class SessionBannerComponent implements OnInit {
  remaining = 0;

  ngOnInit(): void {
    setInterval(() => {
      this.remaining = this.session.secondsLeft();
    }, 1000);
  }
}

// After: the write itself notifies. No zone required.
export class SessionBannerComponent {
  readonly remaining = signal(0);
  private readonly session = inject(SessionService);

  constructor() {
    const id = setInterval(() => {
      this.remaining.set(this.session.secondsLeft());
    }, 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }
}`,
      },

      {
        type: 'aside',
        text: 'A useful property of this step: converted code is strictly better under Zone.js too. Signal writes are more precise than zone-triggered global checks, so you get a performance improvement before the flag is ever flipped, and nothing to roll back if priorities change.',
      },

      { type: 'heading', text: 'Step 3: fix the RxJS boundary' },

      'Observables do not notify change detection by themselves — the `async` pipe does, by calling `markForCheck`. Under zoneless the async pipe still works, so a wholesale RxJS rewrite is not required. What does break is the pattern of subscribing manually and assigning to a field, which was only ever working because the zone saw the HTTP call.',

      {
        type: 'code',
        language: 'typescript',
        caption: 'toSignal is the smallest correct fix at the RxJS boundary. Keep the observable where it is genuinely a stream.',
        code: `// Breaks under zoneless: nothing tells the view the field changed
export class CaseListComponent implements OnInit {
  cases: Case[] = [];
  ngOnInit(): void {
    this.api.cases().subscribe((c) => (this.cases = c));
  }
}

// Works: the signal write is the notification
export class CaseListComponent {
  private readonly api = inject(CaseApi);
  readonly cases = toSignal(this.api.cases(), { initialValue: [] as Case[] });
}`,
      },

      'Do not take this as licence to delete RxJS. Debouncing a search box, merging a websocket with a poll, cancelling an in-flight request on navigation — these are still stream problems and signals are a poor substitute. Convert the boundary, keep the streams.',

      { type: 'heading', text: 'Step 4: third-party libraries' },

      'This is where migrations actually stall, and it is worth auditing early because it can change the plan. Any library that mutates state from a non-Angular callback — chart libraries with animation loops, older date pickers, map SDKs, anything wrapping a jQuery-era widget — assumed the zone was watching.',

      'The fix is a signal write inside the callback. The risk is the library you cannot patch, which is a reason to know about it in week one rather than week nine.',

      {
        type: 'code',
        language: 'typescript',
        caption: 'Wrap the boundary once, at the point the third-party callback re-enters your code.',
        code: `export class ChartHostComponent {
  readonly selectedPoint = signal<Point | null>(null);

  private init(el: HTMLElement): void {
    thirdPartyChart(el, {
      // Fires outside Angular. The signal write is what makes it visible.
      onSelect: (point: Point) => this.selectedPoint.set(point),
    });
  }
}`,
      },

      { type: 'heading', text: 'Step 5: flip the flag' },

      'Only now, and it is genuinely two lines. Angular v21 is zoneless by default; on v20 and earlier you opt in:',

      {
        type: 'code',
        language: 'typescript',
        caption: 'Then remove zone.js from the polyfills in angular.json — both the build and the test target, which is the one people forget.',
        code: `bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
  ],
});`,
      },

      'Removing `zone.js` from the test polyfills matters as much as the build one. Left in place, your tests keep passing under a zone your production application no longer has, which is the worst of both worlds: a green suite that is no longer testing the thing you ship.',

      { type: 'heading', text: 'What this costs, honestly' },

      'On an application of moderate size with disciplined state management, this is days. On a large codebase with years of manual `detectChanges` calls and a few unpatchable libraries, it is weeks — but they are weeks of small merged pull requests rather than one terrifying merge.',

      'The reason to do it is not the benchmark. It is that zoneless makes imprecise state expensive and precise state cheap, so it applies steady pressure in the direction you wanted the codebase to go anyway. Most of the value arrives during step two, before the flag is ever set.',
    ],
  },
  {
    id: 'ionic-offline-first-architecture',
    seoTitle: 'Ionic Offline-First Architecture with Angular and Capacitor',
    seoDescription:
      'Treating offline as a design input rather than an error state, in a member app shipped to iOS and Android.',
    datePublished: '2026-09-18',
    number: '05',
    title: 'Offline is a design input, not an error state',
    dek: 'Apps for real users on real networks need cached data with an honest age, queued actions, and failure messages that say what to do.',
    related: [
      { label: 'Ionic and cross-platform mobile services', href: '/services/ionic-development' },
      { label: 'VNPF blo mi member app', href: '/work/vnpf-blo-mi' },
      { label: 'Quiet interfaces age better', href: '/insights/enterprise-ui-design-restraint' },
    ],
    cta: 'If you are building a member or field app where the network is unreliable, the offline behaviour should be specified before the screens are designed. That is the part I would want to scope first.',
    body: [
      'The VNPF member app was built for provident fund members in Vanuatu, checking balances and statements on the phones they actually own, over the networks they actually have. That sentence contains the entire design brief, and most of it is about the network.',

      'Teams that have only shipped web applications tend to treat connectivity as a binary that is almost always true, and handle the false case with a toast. On a member app for a public institution, the false case is a substantial share of sessions, and a toast is not a design.',

      { type: 'heading', text: 'The three states, not two' },

      'Online and offline is the wrong model. The states that matter are: fresh data, stale data with a known age, and no data. Most apps collapse the middle state into one of the others, which is where the bad experiences come from — either stale data presented as current, or a spinner where a perfectly useful cached balance could have been.',

      {
        type: 'code',
        language: 'typescript',
        caption: 'The age is part of the value. A balance with no timestamp is a claim the app cannot support.',
        code: `export interface Cached<T> {
  value: T;
  fetchedAt: number;
}

@Injectable({ providedIn: 'root' })
export class BalanceStore {
  private readonly cached = signal<Cached<Balance> | null>(null);
  readonly balance = computed(() => this.cached()?.value ?? null);

  readonly freshness = computed(() => {
    const entry = this.cached();
    if (!entry) return 'none' as const;
    const age = Date.now() - entry.fetchedAt;
    return age < 5 * 60_000 ? ('fresh' as const) : ('stale' as const);
  });
}`,
      },

      'Rendering that third state honestly is a one-line template change and it removes an entire category of support call:',

      {
        type: 'code',
        language: 'html',
        caption: 'Show the number. Say when it is from. Never show a stale figure as though it were live.',
        code: `@switch (freshness()) {
  @case ('fresh') {
    <app-balance [value]="balance()" />
  }
  @case ('stale') {
    <app-balance [value]="balance()" />
    <p class="note">
      Last updated {{ updatedAt() | date: 'short' }} · showing saved data
    </p>
  }
  @case ('none') {
    <app-empty-state
      message="Your balance will appear here once you are back online." />
  }
}`,
      },

      { type: 'heading', text: 'Storage: pick by consequence, not convenience' },

      'On Capacitor the options are not equivalent and the choice should follow what happens if the data leaks or is lost. Preferences is a key-value store, fine for flags and the last-seen tab. SQLite is the right home for anything list-shaped you want to query offline. The secure store is the only acceptable home for tokens.',

      {
        type: 'code',
        language: 'typescript',
        caption: 'The common mistake is the first line being Preferences. Tokens in a key-value store survive backups and device transfers.',
        code: `// Credentials: platform secure storage, biometric-gated.
await SecureStoragePlugin.set({ key: 'refresh_token', value: token });

// Queryable member data: SQLite, so a statement list works offline.
await db.run(
  'INSERT OR REPLACE INTO statements (id, period, payload) VALUES (?, ?, ?)',
  [s.id, s.period, JSON.stringify(s)],
);

// Trivial UI state only.
await Preferences.set({ key: 'last_tab', value: 'balance' });`,
      },

      { type: 'heading', text: 'Queued actions and the idempotency problem' },

      'Reads are the easy half. Writes submitted with no connection have to be queued and replayed, and the moment you replay you have a duplicate-submission problem — because the failure you are recovering from may have been a response that was lost rather than a request that never arrived.',

      'The fix is a client-generated key on every mutation, checked by the server. Without it, a retry after a dropped response creates a second record, and in a system handling money that is a real incident rather than a glitch.',

      {
        type: 'code',
        language: 'typescript',
        caption: 'The key is generated once, when the user acts — not on retry. That is what makes the replay safe.',
        code: `async submit(claim: ClaimDraft): Promise<void> {
  const action: QueuedAction = {
    key: crypto.randomUUID(),   // generated once, reused on every retry
    kind: 'claim.submit',
    payload: claim,
    queuedAt: Date.now(),
  };

  await this.queue.add(action);
  void this.flush();            // best effort now, guaranteed later
}

private async flush(): Promise<void> {
  if (!(await Network.getStatus()).connected) return;

  for (const action of await this.queue.pending()) {
    try {
      await this.api.send(action, { idempotencyKey: action.key });
      await this.queue.remove(action.key);
    } catch (error) {
      if (isPermanent(error)) await this.queue.fail(action.key);
      break; // transient: keep order, retry on the next connectivity event
    }
  }
}`,
      },

      {
        type: 'aside',
        text: 'Breaking out of the loop on a transient failure rather than continuing is deliberate. Queued actions on a member account are frequently order-dependent, and a queue that skips ahead on failure produces states that are very hard to reason about afterwards.',
      },

      { type: 'heading', text: 'Tell the user which of the three things happened' },

      'A submission can be accepted, queued, or rejected, and these have completely different consequences for the person holding the phone. Collapsing them into "Something went wrong" is the single most common failure in this category.',

      'Queued should say so explicitly and say what happens next: the claim is saved on the device and will be submitted when there is a connection. That sentence turns an apparent failure into a completed task, and it is the difference between a member walking away satisfied and a member submitting four times.',

      { type: 'heading', text: 'Retrofitting this is close to a rewrite' },

      'Every decision above lives in the data layer — where state comes from, what shape it has, when it was fetched, and what a write means. An application built assuming connectivity has none of those seams, so adding them later means rewriting the layer every feature depends on.',

      'That is why this belongs in the specification rather than the backlog. Deciding on day one that reads are cached with an age and writes are queued with an idempotency key costs almost nothing. Deciding it in month eight costs the data layer.',
    ],
  },
  {
    id: 'accessible-angular-forms',
    seoTitle: 'Accessible Angular Forms: Validation and Error Recovery',
    seoDescription:
      'Form design when a failed submission costs the user something real — validation timing, error recovery and the accessibility that makes both work.',
    datePublished: '2026-09-22',
    number: '06',
    title: 'Forms that carry consequences',
    dek: 'What building immigration and pension forms teaches you about accessibility, error recovery and never losing what someone typed.',
    related: [
      { label: 'Fiji Immigration Citizen Portal', href: '/work/fiji-immigration-external' },
      { label: 'PRIMS Member Portal', href: '/work/prims-member-portal' },
      { label: 'Frontend architecture services', href: '/services/frontend-architecture' },
    ],
    cta: 'If you are building a form where failure costs the user something real — an application, a claim, a submission with a deadline — the error and recovery paths deserve as much design as the happy path. That is the work I would scope first.',
    body: [
      'Most form advice is written about forms people choose to fill in. A checkout, a signup, a newsletter box. If those forms frustrate someone, they leave, and the cost is a conversion.',

      'The forms I have spent most time on are not like that. A Fiji immigration application, a PRIMS pension claim — the person has no alternative, frequently has a deadline, and sometimes has one shot before an office closes. When those forms fail, the cost is not a conversion. It is somebody travelling to an office.',

      'That difference changes almost every default.',

      { type: 'heading', text: 'Never lose what someone typed' },

      'This is the first rule and the one most often broken. A validation failure that clears fields, a session timeout that discards a half-finished application, a back button that resets step two — each of these is a small technical event and a large human one, because the person now has to find their passport again.',

      'Persist the draft locally on every meaningful change, and restore it without being asked:',

      {
        type: 'code',
        language: 'typescript',
        caption: 'The debounce matters less than the restore. An application that comes back after a browser crash is the difference between a bad day and a lost afternoon.',
        code: `export class ApplicationFormComponent {
  private readonly drafts = inject(DraftStore);
  readonly form = inject(FormBuilder).group({ /* ... */ });

  constructor() {
    const restored = this.drafts.load('immigration.application');
    if (restored) this.form.patchValue(restored, { emitEvent: false });

    this.form.valueChanges
      .pipe(debounceTime(500), takeUntilDestroyed())
      .subscribe((value) => this.drafts.save('immigration.application', value));
  }
}`,
      },

      {
        type: 'aside',
        text: 'Session timeouts on government systems are usually non-negotiable — they come from a security policy, not a product decision. That makes the local draft more important, not less: the session can expire without the work expiring with it.',
      },

      { type: 'heading', text: 'Errors have to be findable, not just present' },

      'A red border is not error handling. On a long application the failing field is frequently off-screen, and for a screen reader user a colour change is nothing at all.',

      'Three things are needed together: a summary at the top that lists what failed and links to each field, programmatic association between each input and its message, and focus moved somewhere useful.',

      {
        type: 'code',
        language: 'html',
        caption: 'aria-invalid marks the state, aria-describedby carries the message, and the summary makes a twelve-field failure navigable rather than a hunt.',
        code: `<div role="alert" tabindex="-1" #errorSummary>
  <h2>There are {{ errors().length }} problems with this application</h2>
  <ul>
    @for (error of errors(); track error.field) {
      <li><a [href]="'#' + error.field">{{ error.message }}</a></li>
    }
  </ul>
</div>

<label for="passport-number">Passport number</label>
<input
  id="passport-number"
  formControlName="passportNumber"
  [attr.aria-invalid]="hasError('passportNumber')"
  [attr.aria-describedby]="
    hasError('passportNumber') ? 'passport-number-error' : 'passport-number-hint'
  " />
<p id="passport-number-hint">As printed on the photo page, without spaces.</p>
@if (hasError('passportNumber')) {
  <p id="passport-number-error">
    Enter your passport number. It is 7 to 9 characters, letters and numbers.
  </p>
}`,
      },

      'Note the hint exists before the error does. Describing the expected format up front prevents more failures than any error message repairs.',

      { type: 'heading', text: 'Write errors as instructions' },

      'The message has to say what to do, not what went wrong. "Invalid format" describes the system\'s state. "Enter your passport number — 7 to 9 characters, letters and numbers" describes the user\'s next action. The second one is longer and that is fine; nobody has ever been harmed by a clear sentence.',

      'Validate on blur rather than on keystroke. Telling someone their passport number is invalid while they are typing the third character of it is technically accurate and experientially hostile.',

      { type: 'heading', text: 'Multi-step flows need an honest position' },

      'Splitting a long application into steps is usually right. It reduces the sense of an endless page and lets you save progress meaningfully. But a step counter is load-bearing: a screen reader user who presses Next on step one of an unknown number of steps cannot plan their time or energy.',

      {
        type: 'code',
        language: 'html',
        caption: 'The heading carries the position, so it is announced on focus rather than only being visible.',
        code: `<nav aria-label="Application progress">
  <ol>
    @for (step of steps; track step.id; let i = $index) {
      <li [attr.aria-current]="i === current() ? 'step' : null">
        {{ i + 1 }}. {{ step.label }}
      </li>
    }
  </ol>
</nav>

<h1 tabindex="-1" #stepHeading>
  Step {{ current() + 1 }} of {{ steps.length }}: {{ steps[current()].label }}
</h1>`,
      },

      'Move focus to that heading on every step change. Without it, a keyboard user presses Next and their focus stays on a button that no longer relates to anything on screen, with no announcement that the page changed at all.',

      { type: 'heading', text: 'Why government work makes you better at this' },

      'On public-sector projects, accessibility is usually a procurement requirement rather than an aspiration, which removes the argument about whether it is worth doing. That constraint turns out to be a gift: it forces the keyboard path, the screen reader path and the error-recovery path to be designed rather than discovered.',

      'The side effect is that these forms are better for everyone. Preserved drafts help a distracted person on a laptop as much as a screen reader user. An error summary helps anyone who filled in twelve fields and got three wrong. Format hints help people who have never seen the form before — which, on a government service, is nearly all of them.',

      'The general rule I would take to any product: design the failure path with the same care as the success path, in proportion to what failure costs the person. For a newsletter box, a red border is proportionate. For something with a deadline attached, it is not remotely enough.',
    ],
  },
  {
    id: 'angular-codebase-audit',
    seoTitle: 'Inheriting an Angular Codebase: A Practical Audit',
    seoDescription:
      'What a scoped assessment of an unfamiliar Angular application covers, and why it comes before any code changes.',
    datePublished: '2026-09-25',
    number: '07',
    title: 'Inheriting someone else’s Angular codebase',
    dek: 'How I assess an inherited application: what to measure, what to ignore, and why the expensive problem is rarely the one the team reported.',
    related: [
      { label: 'Angular development services', href: '/services/angular-development' },
      { label: 'Performance is a product requirement', href: '/insights/angular-performance-core-web-vitals' },
      { label: 'Signals before ceremony', href: '/insights/angular-signals-state-management' },
    ],
    cta: 'A scoped assessment like this is usually how my engagements start: one to two weeks, ending in a prioritised plan with a cost against each item. You can act on it with or without me.',
    body: [
      'Most engagements start the same way. An Angular application that works, a team that has noticed changing it is getting more expensive than it should be, and a request for an opinion about what to do. The temptation is to propose an architecture in week one. I have learned not to, because the expensive problem is rarely the one that was reported.',

      'What follows is roughly what I actually do, in order.',

      { type: 'heading', text: 'Run it before reading it' },

      'Before opening a file I use the application as a user, on the slowest hardware I have, with the network throttled. Fifteen minutes of this tells you more about where the pain is than a day of reading, because it surfaces the things people have stopped noticing. Teams habituate to their own product; the third-second delay on every save became invisible eighteen months ago.',

      'I keep the network tab open while doing it. Duplicated requests are the single most common finding and they are visible in the first minute.',

      { type: 'heading', text: 'Measure the shape of the codebase, not its quality' },

      'Quality judgements this early are usually wrong and always unwelcome. Structural facts are neither:',

      {
        type: 'code',
        language: 'bash',
        caption: 'None of this is a quality judgement. It is a map, and it takes about an hour.',
        code: `# How much of the app is still NgModule-based?
rg -c "@NgModule" src --type ts | wc -l
rg -c "standalone: true" src --type ts | wc -l

# Where does state actually live?
rg -n "BehaviorSubject|new Subject" src --type ts | wc -l
rg -n "signal\\(|computed\\(" src --type ts | wc -l
rg -l "StoreModule|createReducer|createEffect" src --type ts

# Components fetching their own data — the composition smell
rg -n "ngOnInit" -A 6 src --type ts | rg -c "subscribe\\("

# Manual change detection: each one marks a place someone was surprised
rg -n "detectChanges\\(\\)" src --type ts | wc -l

# The components everything depends on
rg -o "app-[a-z-]+" src --type html | sort | uniq -c | sort -rn | head -20`,
      },

      'That last one is the most useful and the least obvious. The most-referenced components are where a change is most expensive and most valuable, and they are almost never the ones the team nominates.',

      { type: 'heading', text: 'Look at the git history, not just the code' },

      'Files that change constantly are where the cost actually is. A messy file nobody has touched in two years is not costing anything; a moderately messy file edited in forty of the last fifty pull requests is the tax.',

      {
        type: 'code',
        language: 'bash',
        caption: 'Change frequency over the last year. Cross-reference with file size: big and frequently edited is where to spend.',
        code: `git log --since="1 year ago" --name-only --pretty=format: \\
  | rg "^src/.*\\.(ts|html)$" \\
  | sort | uniq -c | sort -rn | head -25`,
      },

      {
        type: 'aside',
        text: 'This is also how you find the file everyone is afraid of. It is usually large, frequently edited, has no tests, and three people will independently mention it unprompted. That convergence is a strong signal and worth listening to.',
      },

      { type: 'heading', text: 'Ask what broke last' },

      'The most valuable hour of the assessment is not technical. Ask the team: what was the last thing that broke in production, what was the last change that took far longer than estimated, and what part of the codebase do you avoid?',

      'The answers locate the real problem with far more precision than static analysis. On one case management system the reported complaint was slow page loads. The answer to "what takes longer than you expect" was "adding a panel to the officer view" — which pointed straight at the composition problem where independently built panels each fetched their own shared reference data. Same root cause, but the second framing told me it was structural rather than a rendering issue.',

      { type: 'heading', text: 'Separate the three performance causes' },

      'If performance is in scope, it divides into three causes with three different fixes, and they are indistinguishable from the outside:',

      {
        type: 'code',
        language: 'bash',
        caption: 'Bundle first because it is the cheapest to rule out. Then change detection. Then the network waterfall, which is usually the real one.',
        code: `# 1. Bundle and lazy-loading: is everything in the initial chunk?
ng build --configuration production --stats-json
npx source-map-explorer dist/**/*.js

# 2. Change detection: how many components check on each cycle?
#    (Angular DevTools profiler, or count the always-checked ones)
rg -L "ChangeDetectionStrategy.OnPush" src --type ts -g "*.component.ts" | wc -l

# 3. Network waterfall: duplicated and serial requests on one route
#    — read this off the network tab, sorted by name.`,
      },

      'Fixing the wrong one costs a quarter and changes nothing. Establishing which you have is most of the work.',

      { type: 'heading', text: 'The deliverable' },

      'The assessment ends in a written document, not a conversation. For each finding: what it is, what it costs today in concrete terms, what fixing it involves, and roughly what that costs. Then a recommended order, with the dependencies stated — because some fixes unblock others and doing them out of sequence wastes both.',

      'I try hard to include the items that argue against work. "This is ugly and you should leave it alone" is a legitimate finding, and including a few of them is what makes the rest credible. A report where every observation conveniently requires the author to be hired is not an assessment, it is a proposal wearing one as a costume.',

      'The test of a good assessment is that the team can act on it without me. If they read it, agree with the ordering, and do the work themselves, it did its job. That happens reasonably often, and it is a better outcome than a long engagement that starts with a plan nobody understood.',
    ],
  },
  {
    id: 'rxjs-reduce-api-calls',
    seoTitle: 'RxJS: How I Cut Angular API Calls by 40%',
    seoDescription:
      'A government case system fired the same reference lookups five times per screen. The fix was one shared, cached RxJS stream — here is the pattern and what it cost.',
    datePublished: '2026-09-12',
    number: '08',
    title: 'The same request, five times',
    dek: 'A shared RxJS stream cut API consumption on a government case system by about 40%. No component logic changed.',
    related: [
      { label: 'Angular performance optimization', href: '/services/angular-performance-optimization' },
      { label: 'Fiji Immigration internal system — where this was measured', href: '/work/fiji-immigration-internal' },
      { label: 'Performance is a product requirement', href: '/insights/angular-performance-core-web-vitals' },
      { label: 'Signals before ceremony', href: '/insights/angular-signals-state-management' },
    ],
    cta: 'If your network tab shows the same endpoint several times per screen, that is usually a data-layer problem rather than a slow API. I do scoped performance investigations that say which of the four usual causes you actually have before anyone writes a fix.',
    body: [
      'The complaint was slow page loads. On the Fiji immigration internal system — the application officers use to assess visa and permit cases — opening a single case record took long enough that people noticed, and noticing is the threshold that matters on software somebody uses four hundred times a week.',

      'Slow page loads have an obvious suspect, so we checked it first and it was innocent. The bundle was not the problem. Lazy loading was already in place. The screen was not rendering an unreasonable number of components. What the network tab showed instead was the same three reference endpoints — country list, visa categories, office locations — being requested five and six times on a single navigation.',

      { type: 'heading', text: 'Why a good decision produced a bad outcome' },

      'The cause was not carelessness. It was a reasonable rule applied consistently. Each panel on the case screen — applicant details, document checklist, assessment history, routing — had been built to be self-sufficient: fetch what you need in ngOnInit, do not assume a parent has already loaded it. That rule is what lets panels be reordered, reused on other screens and tested alone.',

      'It also means that when four panels each need the country list, the country list is fetched four times. The duplication was structural. Nothing in any single file looked wrong, which is exactly why it had survived review for a year.',

      {
        type: 'code',
        language: 'typescript',
        caption: 'Four files that each look correct, and together are not.',
        code: `// Repeated, near-identically, in every panel on the screen.
export class DocumentChecklistComponent implements OnInit {
  countries: Country[] = [];

  constructor(private readonly api: ReferenceApi) {}

  ngOnInit(): void {
    this.api.getCountries().subscribe((list) => (this.countries = list));
  }
}`,
      },

      { type: 'heading', text: 'The fix: one stream, shared' },

      'The obvious repair — lift the fetch into the parent and pass it down — would have undone the property that made the panels reusable. The better repair leaves every component exactly as written and changes what the service does underneath them.',

      {
        type: 'code',
        language: 'typescript',
        caption: 'shareReplay turns N subscribers into one request.',
        code: `@Injectable({ providedIn: 'root' })
export class ReferenceApi {
  private readonly countries$ = this.http.get<Country[]>('/api/reference/countries').pipe(
    // refCount: false keeps the value after the last panel unsubscribes, so
    // navigating back to the screen does not re-fetch it.
    shareReplay({ bufferSize: 1, refCount: false }),
  );

  constructor(private readonly http: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.countries$;
  }
}`,
      },

      'Four subscribers, one HTTP request, and — because the observable is created once on the service rather than per call — a second navigation to the screen makes no request at all. Not one component changed. The panels still fetch what they need in ngOnInit and still work in isolation, which was the point of building them that way.',

      { type: 'aside', text: 'shareReplay without refCount: false is the version most codebases have. With refCount: true the subscription is torn down when the last subscriber leaves, so returning to the screen re-fetches — correct for volatile data, wasteful for a country list.' },

      { type: 'heading', text: 'The part that is actually hard' },

      'Caching reference data is easy. Deciding when the cache is wrong is not. A cached list that changes underneath you is a bug that reaches production quietly, weeks later, as a question about why the dropdown does not show the new office.',

      'So the cache is invalidated deliberately rather than expired on a timer. The workflow events that can change reference data — an administrator editing a category, a new office being registered — clear the relevant stream, and everything downstream re-fetches on next subscribe. A timeout would have been less code, and would have meant either stale data for its duration or pointless requests forever.',

      {
        type: 'code',
        language: 'typescript',
        caption: 'Invalidate on the event that can change the data, not on a clock.',
        code: `private countriesCache$?: Observable<Country[]>;

getCountries(): Observable<Country[]> {
  this.countriesCache$ ??= this.http
    .get<Country[]>('/api/reference/countries')
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));
  return this.countriesCache$;
}

invalidateCountries(): void {
  this.countriesCache$ = undefined;
}`,
      },

      { type: 'heading', text: 'What it was worth' },

      'API consumption on the case workflow screens dropped by approximately 40%, and frontend load time by roughly half. The second number is the one that mattered to the people using it: on a system somebody works in all day, a delay repeated across hundreds of case screens is not a metric, it is hours of a working week.',

      'The change was around thirty lines across two services. That ratio is typical of this work, and it is the reason I measure before touching anything — the expensive fix is rarely the invasive one, and the invasive one is rarely the fix.',

      { type: 'heading', text: 'The lesson worth keeping' },

      'The instinct when a screen is slow is to look at rendering, because rendering is what you can see. In four years of this the cause has more often been the data layer doing something reasonable too many times. Before optimising anything, sort the network tab by name and count the duplicates. A URL that appears more than once per navigation is work that costs nothing to remove.',
    ],
  },
  {
    id: 'angular-performance-checklist',
    seoTitle: 'Angular Performance Optimization Checklist (In Diagnostic Order)',
    seoDescription:
      'The checks I run on a slow Angular application, in the order that finds the cause fastest — network duplication, change detection, bundle, then rendering.',
    datePublished: '2026-09-27',
    number: '09',
    title: 'The order you check things in',
    dek: 'Most Angular performance checklists are alphabetical. This one is ordered by how often each item turns out to be the cause.',
    related: [
      { label: 'Angular performance optimization', href: '/services/angular-performance-optimization' },
      { label: 'The same request, five times', href: '/insights/rxjs-reduce-api-calls' },
      { label: 'Performance is a product requirement', href: '/insights/angular-performance-core-web-vitals' },
      { label: 'Fiji Immigration internal system', href: '/work/fiji-immigration-internal' },
    ],
    cta: 'If you have worked through this and the profile still does not explain what users are experiencing, that is the point at which an outside pass is worth it. I do scoped investigations that end in a written diagnosis you can act on without me.',
    body: [
      'Every Angular performance checklist I have read is a list of everything that can be slow. That is a reference, not a procedure: it tells you the twenty things to check and nothing about which to check first, so teams work down it alphabetically and spend a week on lazy loading for an application whose problem was never the bundle.',

      'This one is ordered by hit rate — how often, in four years of production Angular, each item has turned out to be the actual cause. Stop at the first one that explains what you are seeing.',

      { type: 'heading', text: '0. Measure on something a user owns' },

      'Before any of it: reproduce the slowness on hardware and a network comparable to the people complaining, and prefer field data over a lab score. A mid-range Android on a throttled connection tells you things a desktop Lighthouse run never will, and almost every application flatters itself in lab conditions. If you cannot reproduce it, you are about to optimise something that is not broken.',

      { type: 'heading', text: '1. Duplicate and serial requests' },

      'Open the network tab, sort by name, and count. Any URL that appears more than once per navigation is free work to remove — usually caused by independently built panels each fetching shared data on init. On a government case system this alone accounted for around 40% of API traffic.',

      'Then look at the waterfall shape. Requests that start only after an earlier one finishes, without needing its result, are a serial chain that should be parallel. Both of these are cheap to find and cheap to fix, which is why they go first.',

      { type: 'heading', text: '2. Change detection' },

      'Open Angular DevTools and profile the interaction that feels slow. You are looking for components checking on cycles that have nothing to do with them.',

      {
        type: 'code',
        language: 'bash',
        caption: 'A rough count of components that are not OnPush.',
        code: 'rg -L "ChangeDetectionStrategy.OnPush" src --type ts -g "*.component.ts" | wc -l'
      },

      'A high number is not automatically a problem — it is a problem when the profiler shows those components re-checking during unrelated interactions. Fix the ones the profiler names, not the ones the grep finds. Moving a whole codebase to OnPush at once is how teams introduce stale-view bugs in exchange for a metric nobody measured.',

      { type: 'heading', text: '3. What is actually in the bundle' },

      'Not "is it big" but "what is in it, and does the first screen need that". A date library imported in full for one format call, an icon set imported wholesale, a chart library on a route that is not the landing route. Then check that lazy loading is real: a route configured lazily whose module is eagerly imported somewhere else is not lazy, and this is common enough to be worth verifying rather than assuming.',

      { type: 'heading', text: '4. Rendering' },

      'Long lists without virtual scrolling, trackBy missing on a list that re-renders whole, images without dimensions causing layout shift, and work done in a template expression that therefore runs on every check. This is last not because it never matters but because it is where people start, and it is the cause less often than the three above.',

      { type: 'aside', text: 'A function call in a template — {{ formatTotal(row) }} — runs on every change detection cycle for every row. It is the single most common rendering mistake I find, and the fix is a pipe or a precomputed field.' },

      { type: 'heading', text: '5. Then stop it coming back' },

      'A fix without a guard is a fix with an expiry date. A bundle budget that fails the build, a Lighthouse or field-data check in CI, and the measurement written down where the next developer will find it. The regression that would have arrived three releases later gets caught by the pipeline instead of by a user, which is the only version of this that survives a team change.',

      { type: 'heading', text: 'The one that is not on the list' },

      'Sometimes the answer is that the frontend is not the problem. If the profile says the time is spent waiting on the API, no amount of Angular work will fix it, and the honest move is to say so early rather than tune the wrong layer for a month. That finding is worth as much as any optimisation on this page.',
    ],
  },
];
