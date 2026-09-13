# SEO Audit — www.rabinr.in

**Date:** 2026-09-13 · **Pages crawled:** 30/30 (full sitemap) · **Business type:** Solo consultancy / professional service (Angular & frontend engineering), with publisher signals (`/insights`)

## SEO Health Score: 85 / 100

| Category | Weight | Score |
|---|---|---|
| Technical SEO | 22% | 90 |
| Content Quality | 23% | 80 |
| On-Page SEO | 20% | 85 |
| Schema / Structured Data | 10% | 92 |
| Performance (CWV) | 10% | 75 (lab-inferred — no field data) |
| AI Search Readiness | 10% | 88 |
| Images | 5% | 92 |

This is a well-built site. There are **no Critical issues** — nothing blocks indexing, and no
penalty risk was found. The remaining work is optimisation, and the single highest-leverage
item is strategic (internal link distribution), not technical.

---

## What already works

Worth stating plainly, because it constrains the recommendations below:

- All 30 sitemap URLs return **200**, every one with a **self-referencing canonical** and exactly **one H1**.
- **Zero duplicate titles, zero duplicate meta descriptions** across 30 pages. Every description is hand-written and 132–172 chars.
- **Zero images missing alt text** sitewide (17 images on the homepage alone).
- Schema coverage is genuinely good: `Person`, `WebSite`, `ProfessionalService` sitewide, plus `BreadcrumbList` + `Service` on service pages, `CreativeWork` on case studies, `BlogPosting` on articles, `ProfilePage`, `ItemList`, `Blog`.
- Security headers are set: HSTS with `includeSubDomains; preload`, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`.
- `/version` and `/maintenance` correctly carry `noindex` and are excluded from the sitemap.
- `llms.txt` is present and unusually well-structured for AI retrieval.
- LCP plumbing is deliberate: preloaded woff2 fonts, hero poster with responsive `imageSrcSet` + `fetchPriority="high"`, WebP throughout, `loading="lazy"` on 10 of 17 homepage images.

---

## Technical SEO — 90

**Redirect chain on the apex domain (Medium).**
`http://rabinr.in/` → `https://rabinr.in/` → `https://www.rabinr.in/` — two 308 hops.
Every apex-domain link (business cards, older backlinks, typed URLs) pays both. Collapse to a
single hop by redirecting `http://rabinr.in` straight to `https://www.rabinr.in`.

**Sitewide link to a `noindex` page (Low).**
`/version` appears in the footer on 29 of 30 pages but is `noindex, follow`. It is crawled on
every visit and returns nothing indexable. Either drop it from the footer or mark the link
`rel="nofollow"`.

**No Content-Security-Policy header (Low).**
The other five security headers are set; CSP is the gap. Not a ranking factor, but it is the
one "Best Practices" item a Lighthouse report will flag on an otherwise clean site.

**Verified clean:** robots.txt (`Allow: /`, `Disallow: /api/`, correct `Host` + `Sitemap`),
sitemap XML validity, 404 status on unknown paths, trailing-slash normalisation (308), HTTPS
everywhere, no `noindex` leakage onto real pages.

## Content Quality — 80

E-E-A-T is the strength here. First-person experience on named government and pension systems,
specific numbers (10,000+ users, 40% fewer API calls), a real résumé, and articles that take
positions drawn from shipped work rather than summarising documentation. This is the kind of
content that earns citations.

**Thin hub pages (Medium).** Three pages that should carry weight are short:

| Page | Words | Why it matters |
|---|---|---|
| `/insights` | 265 | Blog hub — the entry point for all article discovery |
| `/pricing` | 312 | High commercial intent; a page buyers search for |
| `/contact` | 367 | Conversion endpoint |
| `/process` | 420 | Differentiator for consulting buyers |

`/insights` at 265 words is a bare card list. A hub page that states what the writing covers
and why — 300–400 additional words — gives it a reason to rank for topic-level queries
instead of only serving as a click-through.

**Short case studies (Low).** Six case studies sit at 470–540 words (`/work/vnpf-blo-mi`,
`insuremet`, `galaxy-sofas`, `zellavora-ai-resume-builder`, `zellavora-control-center`,
`ui-component-architecture`), while the strongest (`fiji-immigration-internal`) runs 758.
The short ones describe *what* was built without the constraint/decision/outcome narrative
that makes the long one persuasive.

## On-Page SEO — 85

**Internal link equity flows to the wrong pages (High — highest-leverage finding).**

Excluding sitewide nav/footer chrome, contextual inbound links break down like this:

| Page | Contextual inbound links |
|---|---|
| `/work/fiji-immigration-internal` | 15 |
| `/work/prims-member-portal` | 10 |
| `/work/fiji-immigration-external` | 9 |
| … | … |
| `/services/angular-development` | 4 |
| `/services/frontend-architecture` | 4 |
| `/services/ionic-development` | 3 |
| **`/services/angular-performance-optimization`** | **2** |

The commercial pages — the ones targeting "Angular consultant", "Angular performance
optimization" — receive the *fewest* internal links, while case studies receive the most.
Case studies are the proof; service pages are the product. Both Google and an LLM reading the
site infer importance partly from internal link volume, and right now the site says the case
studies matter most.

**Under-length titles (Low).** `/resume` (16 chars), `/contact` (17), `/process` (17),
`/insights` (18), `/experience` (20) are all far short of the ~60-char SERP allowance. These
are pure "X | Rabin R" constructions carrying no query terms. Compare with the article titles
(50–71 chars), which are well-formed.

**Verified clean:** no duplicate titles or descriptions, all descriptions within display
limits, one H1 per page, OG and Twitter card tags present on all 30 pages.

## Schema / Structured Data — 92

All JSON-LD parses without error. Coverage is broad and correctly typed.

**`FAQPage` on the homepage (Info).** Google retired FAQ rich results for all sites on
2026-05-07, so this no longer earns a SERP feature. Notably, `ServiceNarrative.tsx` already
documents this decision and deliberately omits `FAQPage` on service pages — but
`JsonLd.tsx:192` still emits it on the homepage. That is an internal inconsistency rather than
a defect: it causes no harm, and there is no need to remove it. Flagging only so the two
decisions can be reconciled intentionally.

## Performance — 75 (lab-inferred)

PageSpeed Insights returned **HTTP 429** (anonymous daily quota exhausted), and CrUX field
data was therefore unavailable. This score is inferred from payload evidence, not measured —
treat it as the least reliable number in this report.

**Duplicate hero preload (Medium — concrete fix available).**
The homepage emits two `<link rel="preload" as="image">` tags for the same hero poster srcset:

1. `<link rel="preload" as="image" fetchPriority="high" imageSrcSet="…" imageSizes="100vw">` — emitted automatically by React from the `<img fetchPriority="high" srcSet>` in `ScrollVideoPlayer.tsx:217-223`
2. `<link rel="preload" as="image" href="…" imageSrcSet="…" fetchPriority="high">` — the manual hoist in `src/app/page.tsx:19-30`

The manual preload in `page.tsx` predates React's automatic hoisting of `fetchPriority="high"`
images and is now redundant. The comment in `page.tsx:13-15` explains it was added because the
poster "is only discoverable once the hero component's markup is parsed" — React's resource
hoisting now solves exactly that. Removing the manual block is safe and removes a duplicated
hint; verify tag 1 still appears in the rendered head afterwards.

**Homepage weight (Low).** 291 KB of HTML, of which ~71 KB is inline script (RSC flight
payload) across 25 inline blocks, plus 19 JS chunks and 3 stylesheets. Not alarming for a
Next.js App Router page, but it is by far the heaviest page (next is `/experience` at 152 KB).

**Action required before trusting this section:** re-run with a PageSpeed API key, or pull CrUX
field data, to replace inference with measurement.

## AI Search Readiness — 88

Strong. AI crawlers are unblocked (`Allow: /`, no `GPTBot`/`ClaudeBot`/`PerplexityBot`
restrictions). `llms.txt` is well-formed with grouped key pages and one-line descriptions.
Articles contain the traits that get cited: concrete numbers, named systems, stated positions,
and `BlogPosting` schema with clear authorship.

**Opportunity (Medium).** The articles answer engineering questions well but the *service*
pages do not answer the commercial question an LLM gets asked — "who should I hire for Angular
performance work". Adding a short, direct, quotable summary paragraph near the top of each
service page (the answer, stated plainly, before the narrative) is the single change most
likely to produce citations for hiring-intent prompts.

## Images — 92

Excellent. Zero missing alt attributes across 30 pages, WebP with responsive `srcset`,
`loading="lazy"` on below-fold images, `fetchpriority` on the LCP candidate.

**Missing dimensions (Low).** Three pages each have one `<img>` without both `width` and
`height`: `/`, `/contact`, `/process`. Each is a CLS risk on slow connections.

---

## Method & limitations

- Full crawl of all 30 sitemap URLs via HTTP; on-page signals parsed from server-rendered HTML.
- Internal-link analysis separates sitewide chrome (links present on 29+ of 30 pages) from
  contextual in-content links, so nav and footer do not mask the real distribution.
- **Not measured:** Core Web Vitals field data (PSI quota 429), backlink profile (no API
  credentials configured), Search Console impressions/clicks, and rendered-DOM differences
  (the bundled Playwright/Python tooling could not run — no Python 3.10+ on this machine).
- Performance findings are inferred from payload and markup evidence only.
