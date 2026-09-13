/**
 * Long-form copy for the three service detail routes.
 *
 * The service records in `services.ts` are deliberately terse — they feed cards
 * and list items across the site. These are the detail pages' own prose: the
 * problem being solved, how the work actually runs, and the questions that
 * come up before an engagement starts. Kept separate so shortening a card
 * cannot silently gut a page.
 */

export interface ServiceNarrativeSection {
  title: string;
  paragraphs: string[];
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServicePageContent {
  /** The insight articles arguing the positions this page takes. */
  furtherReading?: { label: string; href: string; note: string }[];
  /**
   * The direct answer to "should I hire this person for this", stated before
   * the narrative starts.
   *
   * Written to survive being quoted with no surrounding page: reader's symptom
   * first, then what is actually done, then one piece of evidence with a number.
   * `intro` is good prose but only reads correctly in place, which gives an AI
   * search surface nothing it can lift. This is the passage meant to be lifted,
   * so every figure in it has to be one of the verified ones — an invented
   * number here is the worst place on the site to put one.
   */
  answer: string;
  /** Sets the scene directly under the hero, before the deliverables list. */
  intro: string[];
  problem: ServiceNarrativeSection;
  approach: ServiceNarrativeSection;
  engagement: ServiceNarrativeSection;
  faqs: ServiceFaq[];
}

export const servicePages: Record<'angular' | 'web' | 'mobile' | 'performance', ServicePageContent> = {
  angular: {
    furtherReading: [
      {
        label: 'Signals before ceremony',
        href: '/insights/angular-signals-state-management',
        note: 'The state-promotion rule above, argued at length with the projects it came from.',
      },
      {
        label: 'Going zoneless without a long-lived branch',
        href: '/insights/angular-zoneless-change-detection',
        note: 'The incremental migration path, step by step, with the grep commands I actually run.',
      },
      {
        label: 'Inheriting someone else’s Angular codebase',
        href: '/insights/angular-codebase-audit',
        note: 'What a scoped assessment looks like before any code changes.',
      },
    ],
    answer:
      'If you have a large Angular application that several people maintain, and changing one screen has started to mean opening six files, that is the work I do. I take on enterprise Angular codebases — immigration case management for the Fiji government, a pension member portal, an insurance administration console — and work on architecture, state and change detection rather than on features alone. The Fiji internal system serves 10,000+ users and recorded roughly a 50% frontend performance gain over that work. Engagements run from a scoped assessment of an existing codebase through to sustained architecture work.',
    intro: [
      'I have spent most of the last four years inside large Angular applications that other people have to keep working after I leave — immigration case management for the Fiji government, a pension member portal, an insurance administration console. That context shapes how I build: the interesting problem is rarely getting a feature to work, it is getting it to work in a codebase that will take another twenty features without becoming unmaintainable.',
    ],
    problem: {
      title: 'The problem this usually solves',
      paragraphs: [
        'Most teams that bring me in are not starting from zero. They have an Angular application that works, and a growing sense that changing it is getting more expensive than it should be. Builds are slow. A change in one module breaks something unrelated. The state management layer has become the thing everyone routes around. New developers take weeks to become productive because understanding any single screen means opening six files.',
        'The other common case is a version gap. An application on Angular 12 or 14 with NgModules everywhere, where the team knows standalone components and signals exist but cannot find a safe path from here to there without stopping feature work for a quarter. Both problems are structural, and both are fixable incrementally — but only with a plan that survives contact with a delivery schedule.',
      ],
    },
    approach: {
      title: 'How I work on Angular',
      paragraphs: [
        'I start by reading the codebase and running it, not by proposing an architecture. The first deliverable is usually a written assessment: what the actual bottlenecks are, which of them are worth money to fix, and what order to fix them in. Often the expensive problem is not the one the team flagged. On one case management system the complaint was slow page loads; the cause was that independently built panels each fetched shared reference data on init, so the same lookup endpoints were being called five and six times per load. Deduplicating that cut API consumption by around 40% and frontend load time by about half, and it touched no component logic at all.',
        'For migrations I work in the running application rather than in a branch that diverges for three months. Standalone components can be adopted one route at a time. Signals can be introduced in new code before any existing observable is touched. Zoneless comes last, after the state layer is precise enough that it is a configuration change rather than a rewrite. Each step ships independently, so the work can pause for a release without leaving the codebase half-migrated.',
        'On state, my bias is strongly toward less machinery. State starts local to the component and is promoted to a service, then to a store, only when a second consumer actually exists in the code. A store adds actions, selectors and a mental model that every future developer pays for, and in most applications only a handful of pieces of state genuinely earn it.',
      ],
    },
    engagement: {
      title: 'What working together looks like',
      paragraphs: [
        'I work embedded and senior: in your repository, your review process and your standups, accountable for the frontend rather than delivering a detached artefact. Practically that means pull requests that your team reviews, decisions written down where the next person will find them, and no dependency on me being available in six months.',
        'Engagements usually start with a scoped assessment of one to two weeks, which produces a prioritised plan and a cost estimate for each item. From there it is either a fixed-scope project, an ongoing retainer for teams that want a senior frontend owner alongside their own developers, or focused consulting for a specific problem such as a migration plan or a performance investigation.',
      ],
    },
    faqs: [
      {
        question: 'Which Angular versions do you work with?',
        answer:
          'Angular 17 through 22 for new work, including standalone components, signals, zoneless change detection and SSR. For migrations I regularly start from Angular 12 and upward, including NgModule-based codebases that need a path to standalone.',
      },
      {
        question: 'Can you migrate an old Angular application without stopping feature work?',
        answer:
          'Yes, and that is the only way I do it. Standalone adoption and signal introduction are both incremental — route by route, new code first — so each step merges independently and feature delivery continues alongside. A long-lived migration branch is the failure mode to avoid.',
      },
      {
        question: 'Do you work with an existing team or replace one?',
        answer:
          'Alongside one. I work in your repository and your review process as the senior frontend owner, which means your developers keep building and gain a reviewer and an architecture reference. Handover is part of the engagement, not an afterthought.',
      },
      {
        question: 'How do you approach Angular performance problems?',
        answer:
          'By measuring before changing anything. Most Angular performance work divides into bundle and lazy-loading issues, change detection running more than it needs to, and network waterfalls from components that fetch on init. These have different fixes and different costs, so the first step is establishing which one you actually have.',
      },
      {
        question: 'What size of project is a good fit?',
        answer:
          'Applications complex enough that architecture matters — case management systems, member portals, admin consoles, dashboards with real data volume. For a brochure site, Angular is usually the wrong tool and I will say so.',
      },
    ],
  },
  web: {
    furtherReading: [
      {
        label: 'Performance is a product requirement',
        href: '/insights/angular-performance-core-web-vitals',
        note: 'Why load behaviour belongs in the feature spec rather than a later optimisation phase.',
      },
      {
        label: 'Forms that carry consequences',
        href: '/insights/accessible-angular-forms',
        note: 'Accessibility and error recovery when failure costs the user something real.',
      },
    ],
    answer:
      'If your frontend works but every new feature costs more than the last, the problem is usually structure rather than effort. I do frontend architecture consulting — component boundaries, design systems, state flow and rendering strategy — in Angular, React and Next.js. The work is aimed at the third release rather than the demo: deciding what belongs in a shared layer, what should stay local, and which abstractions are worth what they cost to maintain. These engagements usually open with a scoped assessment of the codebase you already have.',
    intro: [
      'Web application work covers the surfaces where structure, data and rendering strategy matter more than page count: dashboards, portals, admin consoles and product interfaces that people use as a tool rather than read as a document. I build these with Angular or with React and Next.js, chosen by what the application is rather than by preference.',
    ],
    problem: {
      title: 'The problem this usually solves',
      paragraphs: [
        'The applications I get called into tend to share a symptom: the first version worked, and the second one is fighting the architecture. Data fetching is scattered across components, so nothing can be reasoned about or cached. Rendering strategy was never decided, so everything is client-rendered including content that should have been static. Types stop at the API boundary, so a backend change becomes a runtime error in production rather than a build failure.',
        'The cost shows up as a slow feedback loop. Small changes require large amounts of careful testing because nobody is confident about what else they touch, and that uncertainty is what actually slows a team down — not typing speed.',
      ],
    },
    approach: {
      title: 'How I build web applications',
      paragraphs: [
        'Rendering strategy is a decision I make explicitly and early, per route rather than per application. Content that can be static should be static. Data that is per-user belongs on the server where it can be fetched without a waterfall. Only genuinely interactive state belongs in the client. Getting this right at the routing layer removes entire categories of performance problem before any optimisation work is needed, and it is nearly free at the start and expensive to retrofit.',
        'Data flow gets a defined shape: typed models, fetching that lives in one layer rather than scattered through components, and components that receive data as inputs. This is what makes caching, deduplication and testing possible later, and it is the single structural decision that most reliably determines whether the application is pleasant to work in at version three.',
        'Performance statements go into feature tickets rather than into a later optimisation phase. A ticket adding a view says what it may fetch on load and what it must receive from its parent. A ticket adding an image says the space is reserved. These are one-line additions at the point of writing, and they are what stops Core Web Vitals from becoming a score nobody owns.',
      ],
    },
    engagement: {
      title: 'What working together looks like',
      paragraphs: [
        'For a new application, the first week produces a working routed skeleton with the data layer and rendering strategy settled and one real feature built through it end to end. That gives everyone something concrete to react to before the expensive decisions calcify, and it is far more useful than a document describing what will be built.',
        'For an existing application, it starts with an assessment: what is slow, what is fragile, what is expensive to change, and what each of those is worth fixing. Work then proceeds in increments that ship, rather than a rewrite. Rewrites are occasionally right and usually a way of converting a known problem into an unknown one.',
      ],
    },
    faqs: [
      {
        question: 'Angular or React for a new web application?',
        answer:
          'Angular when the application is large, form and data heavy, built by a team that benefits from strong conventions — admin consoles, case management, portals. React with Next.js when rendering strategy and content are central, or the surface is public facing and performance sensitive. I will recommend based on your team and the product, not a preference.',
      },
      {
        question: 'Can you work with our existing backend and API?',
        answer:
          'Yes. Most of my work integrates with backends built by other teams, including REST APIs on Sails.js, Node and .NET. I do not require the backend to change, though I will flag places where a small API change removes a large amount of frontend complexity.',
      },
      {
        question: 'Do you handle the design as well?',
        answer:
          'I implement designs to a pixel-accurate standard and I can design interfaces where none exist, working from the product requirements. If you have a designer, I work from their files and handle the engineering decisions that designs do not specify — states, edge cases, responsive behaviour, accessibility.',
      },
      {
        question: 'How do you handle accessibility?',
        answer:
          'It is built in, not audited afterwards. Semantic markup, keyboard operability, visible focus, and WCAG 2.1 AA as the working standard. Retrofitting accessibility is substantially more expensive than building it correctly, and on government and pension work it is generally a requirement rather than an aspiration.',
      },
      {
        question: 'What about testing?',
        answer:
          'Unit tests for logic that has a right answer, and end-to-end tests with Playwright for the flows that would cost real money if they broke. I do not chase coverage percentages; I aim for the property that a green build means the important paths still work.',
      },
    ],
  },
  performance: {
    furtherReading: [
      {
        label: 'The same request, five times',
        href: '/insights/rxjs-reduce-api-calls',
        note: 'The shared-stream pattern behind the 40%, with the code and the cache-invalidation problem it creates.',
      },
      {
        label: 'The order you check things in',
        href: '/insights/angular-performance-checklist',
        note: 'The diagnostic sequence I work through, ordered by how often each item is the actual cause.',
      },
      {
        label: 'Performance is a product requirement',
        href: '/insights/angular-performance-core-web-vitals',
        note: 'Why load behaviour belongs in the spec rather than in a phase after it.',
      },
      {
        label: 'Signals before ceremony',
        href: '/insights/angular-signals-state-management',
        note: 'State precision as a performance decision, not only an architectural one.',
      },
    ],
    answer:
      'If your Angular application is slow and nobody can say precisely why, that is the engagement. I measure before changing anything: bundle size, render behaviour, network waterfalls and change detection are the four usual causes, and the one a team suspects is frequently not the one costing users time. On a government case system the same reference lookups were firing five times per screen; one shared, cached RxJS stream cut API calls by about 40%. The work starts with a diagnosis, not with a fix.',
    intro: [
      'Performance work is measurement first and code second. Most of the frontend slowness I am asked to look at is not caused by the thing the team suspects, and the fastest way to waste a month is to start optimising before knowing which of the four common causes — bundle size, render behaviour, network waterfalls, or change detection — is actually costing the user time.',
    ],
    problem: {
      title: 'The problem this usually solves',
      paragraphs: [
        'The application works, and it feels heavy. Core Web Vitals are failing in field data while the lab score looks acceptable. A screen that was fine at launch now takes several seconds because the data behind it grew. Someone has already tried lazy loading and it did not move the number, because the number was never about the bundle.',
        'The other version of this is operational rather than commercial. On an internal system used all day by the same people, a two-second delay repeated across hundreds of case screens is not a metric — it is hours of somebody’s working week. That is the framing I bring to it: load behaviour is a product requirement with a cost attached, not a polish item to schedule after the features.',
      ],
    },
    approach: {
      title: 'How I work on performance',
      paragraphs: [
        'The first deliverable is a measurement, not a patch: field data where it exists, a profile of the slow interaction on hardware comparable to what users actually have, and a network trace of the screen in question. That usually separates the problem into one of four buckets — what is downloaded, what is rendered, what is requested, and what re-runs — each of which has a different fix and a different price.',
        'On a government case management system the reported symptom was slow page loads, and the cause was none of the usual suspects: independently built panels each fetched the same shared reference data on init, so opening one record fired the same lookups five or six times. Putting those behind a shared, cached stream cut API consumption by around 40% and load time by roughly half, without touching a single component’s logic. That is the typical shape of this work — the expensive fix is rarely the invasive one.',
        'After the fix comes the guard. A budget in CI, a check on the bundle, and the measurement written down where the next developer will see it, so the regression that would have arrived three releases later gets caught by the pipeline instead of by a user.',
      ],
    },
    engagement: {
      title: 'What working together looks like',
      paragraphs: [
        'Performance engagements are usually short and scoped: an investigation of one to two weeks that produces a written diagnosis, a prioritised list of fixes with estimated cost and expected gain, and the measurements behind both. You can hand that to your own team, or I can implement it.',
        'I will also tell you when the answer is no. If the profile says the time is being spent in the API rather than in the browser, frontend work will not fix it, and saying so at the end of week one is worth more than a month of tuning the wrong layer.',
      ],
    },
    faqs: [
      {
        question: 'Can you guarantee a Lighthouse score?',
        answer:
          'No, and be careful with anyone who does. A lab score is a proxy; what I commit to is measuring the real bottleneck, fixing what is fixable in the frontend, and showing you the before and after on field-comparable conditions. On most projects the honest gains are large — around 40% fewer API calls and roughly half the load time on the case system above — but they are the result of the diagnosis, not a number promised before it.',
      },
      {
        question: 'What do you measure?',
        answer:
          'Core Web Vitals (LCP, INP, CLS) as the user-facing frame, plus the things that cause them: bundle composition, render and change-detection behaviour, request waterfalls, and payload sizes. Field data first where it exists, because lab conditions flatter almost every application.',
      },
      {
        question: 'Is this only for Angular?',
        answer:
          'No. Angular is where most of my depth is — change detection, zoneless, RxJS-level request behaviour — but bundle, network and rendering work applies equally to React and Next.js applications.',
      },
      {
        question: 'How long does an investigation take?',
        answer:
          'One to two weeks for a diagnosis with a prioritised plan. Implementation depends entirely on what the diagnosis finds, which is why I do not quote it in advance.',
      },
    ],
  },
  mobile: {
    furtherReading: [
      {
        label: 'Quiet interfaces age better',
        href: '/insights/enterprise-ui-design-restraint',
        note: 'Why restraint matters most in apps people are required to use every day.',
      },
      {
        label: 'Offline is a design input, not an error state',
        href: '/insights/ionic-offline-first-architecture',
        note: 'Cached reads with an honest age, queued writes, and idempotent replay.',
      },
    ],
    answer:
      'If you need genuine iOS and Android applications out of a single codebase, I build them with Ionic, Angular and Capacitor. The clearest example is the VNPF member app in Vanuatu: a provident fund app used to check balances, contributions and loans on devices that are frequently not new and connections that are frequently poor, with biometric sign-in and offline behaviour specified before any screen was designed. That constraint, rather than the framework, is what shapes how I build these.',
    intro: [
      'I build cross-platform mobile applications with Ionic, Angular and Capacitor — one codebase producing genuine iOS and Android apps that ship through the App Store and Play Store. The VNPF member app in Vanuatu is the clearest example: a pension member app used by people checking balances and statements on the devices they actually own, which are frequently not new and frequently on poor connections.',
    ],
    problem: {
      title: 'The problem this usually solves',
      paragraphs: [
        'The usual situation is an organisation that already has a web platform and needs a mobile app, without the budget or the team to maintain two native codebases. The genuine question is whether cross-platform will be good enough, and the honest answer depends on what the app does. For content, forms, accounts, dashboards, statements and notifications — the shape of most institutional apps — it is not a compromise. For heavy real-time graphics or deep platform integration, it is the wrong choice and I will say so before we start.',
        'The second problem is store delivery. Teams that have only shipped web are frequently surprised by what release actually involves: signing, provisioning, review cycles, staged rollouts, and the fact that a bad release cannot simply be reverted the way a deployment can.',
      ],
    },
    approach: {
      title: 'How I build mobile',
      paragraphs: [
        'One Angular codebase, with Capacitor bridging to native capability where it is needed — biometric authentication, secure storage, push notifications, camera, file handling. Platform differences are handled deliberately at the points where iOS and Android genuinely differ rather than being papered over with a lowest common denominator that feels wrong on both.',
        'Offline and poor connectivity are design inputs rather than error states. An app for members checking a balance has to behave sensibly when the network is slow or absent: cached data displayed with an honest indication of its age, queued actions that complete when connectivity returns, and failure messages that tell the user what to do. This is most of the difference between an app that feels solid and one that feels broken, and it is very hard to add later.',
        'Performance targets are set against real devices, not a simulator on a fast laptop. The relevant question is how the app behaves on a mid-range Android handset several years old, because for a public-facing institutional app that is a large share of the actual users.',
      ],
    },
    engagement: {
      title: 'What working together looks like',
      paragraphs: [
        'Store delivery is part of the engagement. That means the build pipeline, signing and provisioning, store listings, review submission and the first release, plus the update path for subsequent ones. I would rather set this up correctly at the start than hand over an app that works locally and leave the hardest part undone.',
        'Engagements are typically fixed scope for a first release, followed by a retainer for maintenance — because mobile has ongoing obligations that web does not. Operating systems update annually, store requirements change, and an app left untouched for a year will eventually be rejected or stop installing.',
      ],
    },
    faqs: [
      {
        question: 'Is Ionic good enough compared with native?',
        answer:
          'For content, forms, accounts, dashboards and notification-driven apps, yes — users do not perceive a difference when it is built carefully. For heavy real-time graphics, intensive camera processing or deep platform integration, native is the right answer and I will tell you that rather than take the work.',
      },
      {
        question: 'Do you handle App Store and Play Store submission?',
        answer:
          'Yes. Build pipeline, signing and provisioning, store listings, review submission and the first release are included, along with the process your team needs for subsequent updates.',
      },
      {
        question: 'Can it reuse our existing web application code?',
        answer:
          'Often substantially. If your web application is Angular, business logic, models, validation and API layers are frequently shared directly. The interface layer should be rebuilt for mobile rather than reused — a responsive web layout squeezed into an app is the most common reason cross-platform apps feel wrong.',
      },
      {
        question: 'What about offline use?',
        answer:
          'Designed in from the start where the product needs it: cached data shown with its age, actions queued and completed when the connection returns, and clear messaging when something genuinely cannot proceed. Retrofitting offline behaviour into an app that assumed connectivity is close to a rewrite of the data layer.',
      },
      {
        question: 'How long does a first release take?',
        answer:
          'For a typical account-and-content app with an existing backend, in the order of six to ten weeks to a store-ready first release, depending on the number of flows and how ready the API is. Store review itself adds days, occasionally longer for a first submission.',
      },
    ],
  },
};
