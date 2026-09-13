# Action Plan — www.rabinr.in

Ordered by leverage, with dependencies noted. **No Critical items exist** — nothing is broken.
Each item states how you would know it failed, and what to watch without re-running the audit.

## Status as of 2026-09-13

| Item | Status |
|---|---|
| 1. Redistribute internal links to service pages | **Done** — partially met target (see below) |
| 2. Collapse apex redirect chain | **Not done** — Vercel dashboard change, not code |
| 3. Remove redundant hero preload | **Done and verified** |
| 4. Quotable answer paragraph on service pages | **Done** — all four, +85–97 words each |
| 5. Expand `/insights` hub | **Done** — 265 → 362 words |
| 6. Deepen six short case studies | Not started — needs your source material |
| 7. Replace inferred performance data | **Blocked** — needs a PSI API key or GSC access |
| 8. Install Python 3.10+ | **Not done** — a machine-level install, your call |
| 9. Housekeeping | **Done**, except one item withdrawn (see correction) |

### Correction to this audit

**The "three images missing width/height (CLS risk)" finding was wrong, and is withdrawn.**
All three are absolutely-positioned fill images — the homepage hero poster is
`position: absolute; inset: 0; width/height: 100%` in `hero.css`, and `/contact` and
`/process` use Next.js `<Image fill>` (`data-nimg="fill"`). Images out of normal flow
inside a sized container contribute no layout shift, and `fill` images are *supposed*
to carry no width/height attributes. Adding them would have been a cosmetic change
justified by a CLS risk that does not exist. No change was made.

### Item 9, as completed

- Five short titles lengthened to 44–53 chars (`/resume`, `/contact`, `/process`,
  `/insights`, `/experience`), each now carrying a query term.
- Sitewide footer link to the `noindex` `/version` page marked `rel="nofollow"`.
- CSP added as **`Content-Security-Policy-Report-Only`**, deliberately not enforced.
  Enforcing it would break the site: Next.js inlines the RSC flight payload as inline
  `<script>`, so a policy without `'unsafe-inline'` stops the app booting, and
  `'unsafe-inline'` in an enforced policy buys little. Doing it properly needs
  per-request nonces via middleware, which makes every page dynamic — a real cost for a
  site with no auth and no user content. Report-Only gets the data at zero risk;
  violations surface in the browser console.
- Homepage `FAQPage` kept, with the decision now documented in `JsonLd.tsx` so the
  asymmetry with `ServiceNarrative.tsx` reads as deliberate rather than as an oversight.

**Item 1 measured result.** Contextual inbound links per service page, before → after:

| Service page | Before | After | Target |
|---|---|---|---|
| `/services/angular-development` | 4 | **8** | ✅ 6+ |
| `/services/frontend-architecture` | 4 | **5** | ✖ short |
| `/services/ionic-development` | 3 | **4** | ✖ short |
| `/services/angular-performance-optimization` | 2 | **4** | ✖ short |

Every service page improved and the worst case doubled, but three of four are still below the
6+ target. The ceiling is honesty: there are nine case studies, each genuinely evidencing one
service, so project→service linking cannot go much further without asserting work that was not
done. Closing the remaining gap needs *more evidence pages* (case studies or articles), not more
links between the existing ones — which is what Phase 2 produces.

**Item 3 verification.** Confirmed against a production build (`next build` + `next start`):
exactly **one** `<link rel="preload" as="image">` for the hero poster remains, React-hoisted,
carrying the full responsive srcset, `imageSizes="100vw"` and `fetchPriority="high"`.
`tsc --noEmit`, `eslint` and all 147 unit tests pass.

---

## Phase 1 — Highest leverage (Week 1)

### 1. Redistribute internal links toward service pages — **High**

**Observation:** `/services/angular-performance-optimization` has 2 contextual inbound links;
`/work/fiji-immigration-internal` has 15. The pages that convert get the least link equity.

**Do:** From each case study, link to the service page the project demonstrates, using the
service's own language as anchor text. Concretely:

| Case study | Should link to | Suggested anchor |
|---|---|---|
| `fiji-immigration-internal`, `prims-member-portal`, `insuremet` | `/services/angular-development` | "enterprise Angular development" |
| `vnpf-blo-mi` | `/services/ionic-development` | "Ionic cross-platform mobile development" |
| `ui-component-architecture`, `zellavora-control-center` | `/services/frontend-architecture` | "frontend architecture consulting" |
| `galaxy-sofas`, and the Core Web Vitals article | `/services/angular-performance-optimization` | "Angular performance optimization" |

Target: no service page below 6 contextual inbound links.

**Falsifiable:** if impressions for service pages in Search Console are flat after 6–8 weeks
while case-study impressions stay unchanged, internal linking was not the constraint — the
pages are competing for queries they cannot win, and the next move is query targeting, not links.

**Leading indicator:** Search Console → Pages → compare impressions for `/services/*` before
and after. Movement should show in 3–4 weeks.

**Unblocks:** item 4 (AI citability) reads better once service pages are prominent.

---

### 2. Collapse the apex redirect chain — **Medium**

**Observation:** `http://rabinr.in/` → `https://rabinr.in/` → `https://www.rabinr.in/` (two 308s).

**Do:** Add a redirect so `http://rabinr.in` goes directly to `https://www.rabinr.in`. On Vercel
this is a domain-level redirect config, not a `next.config.ts` change — the first hop happens
before your app runs.

**Falsifiable:** `curl -sSI -L -o /dev/null -w "%{num_redirects}" http://rabinr.in/` should
print `1`, not `2`. If it still prints `2`, the redirect was added in the app rather than at
the domain layer.

**Leading indicator:** none needed — this is a one-time binary check.

---

### 3. Remove the redundant hero preload — **Medium**

**Observation:** Two `<link rel="preload" as="image">` tags for the same hero poster. React
already hoists one automatically from the `<img fetchPriority="high" srcSet>` in
`ScrollVideoPlayer.tsx:217-223`; the manual block in `src/app/page.tsx:19-30` duplicates it.

**Do:** Delete the manual `<link rel="preload">` block from `src/app/page.tsx` (the whole
`{poster ? (...) : null}` expression), leaving `<HomePage />`.

**Falsifiable — check this, do not assume:** after deploying, run
`curl -s https://www.rabinr.in/ | grep -c 'rel="preload" as="image".*banner2-poster'`.
It must print `1`, not `0`. **If it prints `0`, revert** — that would mean React is not
hoisting the hint and you have removed your LCP preload rather than de-duplicated it.

**Leading indicator:** LCP in CrUX once field data is available (see item 7).

---

## Phase 2 — Content depth (Weeks 2–3)

### 4. Add a quotable answer paragraph to each service page — **Medium**

**Observation:** Service pages narrate well but never state the answer plainly up front. LLMs
cite short, self-contained, factual passages; they cannot cite a narrative arc.

**Do:** Open each of the four service pages with 2–3 sentences that stand alone out of context —
who the service is for, what specifically is done, and one piece of evidence with a number.
It must make sense quoted with no surrounding page.

**Falsifiable:** if a passage still only makes sense with the paragraph above it, it will not
get cited. Test by pasting the paragraph alone into a new context and asking whether it answers
"who should I hire for this and why".

**Leading indicator:** brand-name prompts in ChatGPT/Perplexity ("Angular performance consultant
India") — check monthly, not weekly.

### 5. Expand `/insights` from 265 words — **Medium**

**Do:** Add 300–400 words stating what the writing covers, the perspective it comes from, and
why these four topics. This turns a card list into a page with a topical claim.

**Falsifiable:** if `/insights` gains words but still has no inbound clicks in Search Console
after 8 weeks, the hub is not a search target and the effort belongs in the articles instead.

### 6. Lengthen the six short case studies — **Low**

**Do:** Bring `vnpf-blo-mi`, `insuremet`, `galaxy-sofas`, `zellavora-ai-resume-builder`,
`zellavora-control-center`, `ui-component-architecture` toward the 750-word shape of
`fiji-immigration-internal`: the constraint, the decision, the trade-off rejected, the outcome.
Add depth, not padding.

**Falsifiable:** word count is not the goal. If the added text does not contain a decision or a
number, it will not help and may dilute the page.

---

## Phase 3 — Measurement (Month 2)

### 7. Replace inferred performance data with measurement — **Medium**

The Performance score (75) in this audit is **inferred, not measured** — PageSpeed returned 429
and no CrUX field data was retrievable. Before acting further on performance:

- Get a PageSpeed Insights API key (free) and re-run, or
- Connect Search Console and read the Core Web Vitals report directly.

**Do not optimise performance further until this is done** — you would be tuning against a guess.

### 8. Install Python 3.10+ to unlock the bundled tooling — **Low**

This audit ran entirely on `curl` + Node because no Python interpreter is present (only the
Microsoft Store alias stubs). Installing Python 3.10+ and running `/seo setup` enables the
rendered-DOM crawler, Playwright screenshots, mobile rendering checks, and PDF report generation.

### 9. Housekeeping — **Low**

- Add `width` and `height` to the one unsized `<img>` on `/`, `/contact`, `/process` (CLS).
- Drop `/version` from the sitewide footer, or add `rel="nofollow"` (it is `noindex`).
- Lengthen the five short titles (`/resume`, `/contact`, `/process`, `/insights`, `/experience`)
  to carry a query term — e.g. "Contact | Rabin R" → "Contact Rabin R — Angular Consultant, Chennai".
- Consider a Content-Security-Policy header to complete the security header set.
- Reconcile the homepage `FAQPage` schema with the deliberate no-FAQPage decision already
  documented in `ServiceNarrative.tsx`. **No removal is recommended** — FAQ rich results were
  retired for all sites on 2026-05-07, so it earns nothing, but it also costs nothing. Decide
  once, deliberately, and note it.

---

## Phase 4 — Ongoing

- Capture a drift baseline now so future deploys can be diffed against a known-good state.
- Watch Search Console impressions for `/services/*` as the primary signal that Phase 1 worked.
- Re-audit after Phase 2 lands, once field data is available.
