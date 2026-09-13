# Phase 2 — draft copy for review (NOT applied)

Every factual claim below is drawn from existing verified content: `credentials`
(10K+ users, 3 countries, 4+ years), the `fiji-immigration-internal` metrics
(10,000+ active users, ~50% frontend performance gain), and the `rxjs-reduce-api-calls`
article (same lookups five times per screen, ~40% fewer API calls). Nothing is invented.
If any number is not one you want stated this plainly, say so and I will cut it.

## Why these paragraphs are shaped this way

Each opens with the reader's symptom in the first clause, states what is done, then
gives one piece of evidence with a number. They are written to survive being quoted
with no surrounding page — that is the property that makes a passage citable by an
LLM answering "who should I hire for X", and it is exactly what the current intros,
which are good narrative prose, do not have.

Proposed implementation: a new `answer: string` field on `ServicePageContent`,
rendered as a lead paragraph above `intro`. That keeps the existing intros intact.

---

## 1. `/services/angular-development`

> If you have a large Angular application that several people maintain and where
> changing one screen has started to mean opening six files, that is the work I do.
> I take on enterprise Angular codebases — immigration case management for the Fiji
> government, a pension member portal, an insurance administration console — and work
> on architecture, state and change detection rather than on features alone. The Fiji
> internal system serves 10,000+ users and recorded roughly a 50% frontend performance
> gain over the course of that work. Engagements run from a scoped assessment of an
> existing codebase through to sustained architecture work.

## 2. `/services/frontend-architecture`

> If your frontend works but every new feature costs more than the last, the problem
> is usually structure rather than effort. I do frontend architecture consulting —
> component boundaries, design systems, state flow and rendering strategy — in Angular,
> React and Next.js. The work is aimed at the third release rather than the demo:
> deciding what belongs in a shared layer, what should stay local, and which
> abstractions are worth what they cost to maintain. These engagements usually open
> with a scoped assessment of the codebase you already have.

## 3. `/services/ionic-development`

> If you need genuine iOS and Android applications out of a single codebase, I build
> them with Ionic, Angular and Capacitor. The clearest example is the VNPF member app
> in Vanuatu: a provident fund app used to check balances, contributions and loans on
> devices that are frequently not new and connections that are frequently poor, with
> biometric sign-in and offline behaviour specified before any screen was designed.
> That constraint, rather than the framework, is what shapes how I build these.

## 4. `/services/angular-performance-optimization`

> If your Angular application is slow and nobody can say precisely why, that is the
> engagement. I measure before changing anything: bundle size, render behaviour,
> network waterfalls and change detection are the four usual causes, and the one a
> team suspects is frequently not the one costing users time. On a government case
> system the same reference lookups were firing five times per screen; one shared,
> cached RxJS stream cut API calls by about 40%. The work starts with a diagnosis,
> not with a fix.

---

## 5. `/insights` hub — expansion (currently 265 words)

Add above the article grid:

> These are engineering notes rather than tutorials. Each one argues a position I
> arrived at on a specific production system — a government case management platform,
> a pension member portal, a cross-platform member app — and says what the decision
> cost as well as what it bought.
>
> The recurring subjects are Angular architecture and state, where the useful question
> is usually when Signals are enough and a store is overhead rather than which library
> to adopt; rendering and network performance, where load behaviour belongs in the
> feature spec rather than in a later optimisation phase; and restraint in interfaces
> for software people are required to use every day rather than choose to.
>
> I write one of these when a problem turns out to have a general shape worth naming.
> That means there are fewer of them than a publishing schedule would produce, and
> each is drawn from work that actually shipped.

This adds ~150 words of substance. To reach the 300–400 recommended, the remainder is
best spent on one-line framings under each article card (what position it takes), which
also gives the hub unique text per article rather than repeating the meta descriptions.

---

## Falsifiability

If these paragraphs are added and, after 8 weeks, service pages still show no
impression growth in Search Console **and** no AI-assistant citations appear for
hiring-intent prompts, then citability was not the constraint — the pages are
competing for queries with established competitors and the next lever is either
demand-side (backlinks, directories) or targeting different, longer queries.
