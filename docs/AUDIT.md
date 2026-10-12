# Phase 0 — Project Audit

_Date: 2026-10-12 · Branch: `portfolio_2.0` · Commit audited: `0a6dc47`_

## 1. Summary

The repo holds **two different products**:

| | Live site (Vercel, `rabin-portfolio-2-0.vercel.app`) | This branch (`portfolio_2.0`) |
|---|---|---|
| Framework | Next.js 16.3 + React 19, GSAP 3.15 | Angular 22.2, standalone, Signals, Signal Forms |
| Routes | ~30 indexable URLs (see §4) | 6 routes |
| Content | 12 articles, 4 service pages, 9 case studies, FAQ, process, pricing, résumé, legal | Profile, 2 roles, 9 projects (cards only), 5 skill groups |
| Contact | `/api/contact` server route (email provider, rate limit, attachments) | `mailto:` link, no backend |
| Deploy | Vercel | `wrangler.jsonc` → **Cloudflare** static assets |

The Angular rewrite (commits `8ba46d6`, `0a6dc47`) replaced the Next.js app wholesale. Everything removed is still in git at **`495ba20~1`**, which is the content source for preservation.

`https://www.rabinr.in/` did **not resolve** (DNS `ENOTFOUND`) at audit time. The Vercel URL is reachable and is the Next.js site. Per the brief, local source is the source of truth for content.

## 2. Current architecture (Angular branch)

- **Versions:** `@angular/*` 22.2, `@angular/build` 22.2.2, TypeScript 6.0, Vitest 5, jsdom 30. No GSAP, no Playwright, no `@angular/ssr`.
- **Bootstrap:** `bootstrapApplication`, no `zone.js` in deps/polyfills → **zoneless already** (v22 default).
- **Routing:** lazy `loadComponent` per page, `withInMemoryScrolling` (anchors enabled), static titles. `**` redirects to `/`, which turns unknown URLs into soft-200s.
- **Structure:** `core/models`, `data/*.data.ts`, `features/*`, `layout/{header,footer}`, `shared/{components,directives}`, `styles/` — already close to the target layout.
- **Styling:** tokens in `src/styles/_variables.scss` (palette matches the brief exactly), mixins, typography, animations. Fraunces + DM Sans from Google Fonts; **Caveat not loaded**.
- **Build:** `ng build` passes (initial 278 kB raw / 78 kB transfer). Component style budget 6 kB warn / 10 kB error.
- **Tests:** none. `ng test` fails with "No tests found".

## 3. Existing components

| Component | State | Verdict |
|---|---|---|
| `Button` | variant/size/loading/disabled; router link, external href, or `<button>` | **Preserve**, add icon + aria-label |
| `SectionHeading` | eyebrow/title/description/align/level | **Preserve** as-is |
| `ProjectCard` | single variant, `NgOptimizedImage` | **Refactor**: display variant, contribution, case-study link |
| `StickyNote` | colour + rotation, projected content | **Preserve**, add Caveat handwriting |
| `SkillBadge` | label + highlight | **Preserve** |
| `SocialLinks` | typed links | **Preserve** |
| `Illustration` | 4 decorative SVG shapes | **Preserve**; hero workspace needs a new dedicated SVG |
| `FormControl` | Signal Forms `FieldTree`, touched-gated errors, ARIA | **Preserve**, add required/disabled, `select` if needed |
| `Reveal` directive | IntersectionObserver + CSS, reduced-motion safe | **Preserve** for simple reveals; GSAP only where it adds something |
| `Header` | signal menu, Escape closes, `routerLinkActive` | **Refactor**: logo, scroll-aware state, focus handling |
| `Contact` | Signal Forms, `mailto:` submit | **Refactor**: real backend, subject field, honeypot |

**To create:** `SoftwareWindow`, `ScrollProgress`, `Accordion` (FAQ), hero workspace illustration, `Services`, `Process`, `Insights` (list + article layout), `FAQ`, project detail page, SEO service, logo SVGs.

## 4. Route & SEO preservation (highest risk)

Indexed URLs on the live site that the Angular branch **does not serve** (all currently redirect to `/`):

- `/work`, `/work/:slug` (9 slugs: `fiji-immigration-internal`, `fiji-immigration-external`, `prims-member-portal`, `vnpf-blo-mi`, `insuremet`, `galaxy-sofas`, `zellavora-ai-resume-builder`, `zellavora-control-center`, `ui-component-architecture`)
- `/services` + `/services/{angular-development, frontend-architecture, ionic-development, angular-performance-optimization}`
- `/insights` + 12 article slugs (`angular-signals-state-management`, `angular-performance-core-web-vitals`, `enterprise-ui-design-restraint`, `angular-zoneless-change-detection`, `ionic-offline-first-architecture`, `accessible-angular-forms`, `angular-codebase-audit`, `rxjs-reduce-api-calls`, `angular-performance-checklist`, `ux-problem-approach`, plus `angular-signal-forms-custom-controls`, `stopped-writing-angular-old-way-10-modern-patterns`)
- `/process`, `/pricing`, `/resume`, `/privacy`, `/terms`

The Angular branch introduced `/projects` and `/skills`, which never existed on the live site.

Also missing versus the old site: `sitemap.xml`, `robots.txt` (old one blocked non-canonical hosts), canonical URLs, Open Graph images, per-page meta descriptions, JSON-LD, `llms.txt`, `BingSiteAuth.xml`. Canonical domain was `https://www.rabinr.in`.

Because the Angular app is client-rendered only, crawlers and social previews currently get one generic `index.html`. **Prerendering is required** to keep parity with the Next.js SSR output.

## 5. Technical issues

1. **SEO regression** — §4. Wildcard redirect to `/` should become a real 404 page.
2. **No prerender/SSR** — needs `@angular/ssr` with `outputMode: 'static'` and route params for slugs.
3. **Contact has no backend** — the old `/api/contact` (validation, rate limit, email provider) was deleted; Angular static hosting needs a serverless function (Vercel Function or Cloudflare Worker).
4. **Deploy target conflict** — brief says Vercel; latest commit adds Cloudflare `wrangler.jsonc` and `npm run deploy` uses wrangler.
5. **No tests**, no Playwright, no lint config.
6. **`/images/logo.webp`** is a 160×160 raster. There is no vector logo in the repo, so the brief's "approved logo artwork" must be supplied or recreated.
7. Caveat font not loaded. Fonts render-block via Google CSS; consider self-hosting.
8. Old media (`public/media/**`, incl. article diagrams and MP4s) was deleted. The old site served it from **Vercel Blob** (`docs/vercel-blob*.md`), so restoring articles needs those assets back in `public/` or Blob URLs.

## 6. Design improvements (vs. current Angular UI)

- Single-page home with section storytelling (hero → about → experience → services → projects → skills → process → insights → FAQ → contact), keeping deep pages for SEO.
- Illustrated "developer workspace" hero in place of the portrait collage.
- Caveat annotations, a software-window card shell, and a skill-desk interaction with a detail panel.
- Keep the existing hard-offset "sticker" shadow and radius scale; it already fits the brief.

## 7. Migration risks

| Risk | Impact | Mitigation |
|---|---|---|
| Dropping indexed URLs | Lost rankings, 404s from backlinks | Keep old paths; `/projects`→`/work` redirect |
| Porting 12 rich articles (React block format) | Large effort, possible content loss | Port the data format to typed Angular blocks; render with one article layout |
| Contact backend choice | Broken form in production | Decide Vercel vs Cloudflare first |
| GSAP + prerender | `window` access at build time | Initialise only in `afterNextRender` |
| Component style budget (10 kB) | Build errors on illustrated sections | Move shared styles to globals/mixins; raise budget only if justified |
| Media restoration | Broken images | Restore from git `495ba20~1` or Blob |

## 8. Implementation phases

1. **Decisions** (below) → lock hosting, content scope, logo.
2. Tooling: `@angular/ssr` static prerender, GSAP, Playwright, Vitest specs, ESLint.
3. Design system: tokens rename to `_tokens.scss`, Caveat, spacing/radius audit.
4. Logo SVGs + favicon set + OG image.
5. Shared components (§3).
6. Header + hero.
7. Sections one by one; restore `/work/:slug`, `/services/*`, `/insights/:slug`, `/process`, `/pricing`, `/resume`, legal pages from `495ba20~1` content.
8. SEO service: per-route title/description/canonical/OG, JSON-LD, sitemap, robots.
9. Contact backend + spam protection.
10. Tests, responsive checks at 320/375/768/1024/1440, Lighthouse measurement.
11. Preview deployment only. Production untouched until approved.

## 9. Decisions needed before Phase 1

1. **Hosting:** Vercel (brief, current live site) or Cloudflare (latest commit)?
2. **Content scope:** restore all old indexed pages (articles, services, case studies, pricing, résumé, legal) or a subset with redirects for the rest?
3. **Logo:** is there approved vector artwork, or should a vector recreation of `logo.webp` be drafted for approval?
4. **Contact email provider:** which service and env vars to use for the serverless function?

---

## 10. Implementation status (2026-10-12)

Decisions: Cloudflare hosting · all live-site content restored · existing logo kept · contact mail to rabinr.dev@gmail.com.

**Done**
- All 37 indexed URLs from the live site prerender with their original titles/descriptions, canonical,
  Open Graph/Twitter tags and JSON-LD (Person, WebSite, BlogPosting). Unknown paths serve `404.html` with a
  real 404. `/projects` → `/work` and `/skills` → `/#skills` are 301s. Sitemap is generated from the
  prerendered routes; `robots.txt` blocks crawling on non-canonical hosts (Worker).
- Content ported verbatim from `495ba20~1` (`src/app/data`). Corrected only statements the rewrite made
  false: "built with Next.js" (about, FAQ) and the privacy/terms sections on chat, attachments, analytics
  and Vercel.
- Media restored from git history into `public/media` (7.8 MB); unused reels and art not shipped.
- Fonts self-hosted (no third-party requests); Worker contact endpoint with shared validation, honeypot,
  fill-time trap, same-origin check and rate limit.
- Tests: 31 Vitest unit tests, 29 Playwright checks — all passing.

**Measured (Lighthouse 12, local `wrangler dev`)**

| Page | Desktop perf / a11y / BP | Mobile perf / a11y / BP |
|---|---|---|
| `/` | 97 / 100 / 100 | 50–74 / 100 / 100 |
| `/work` | 98 / 98 / 100 | 62 / 98 / 100 |
| `/insights/rxjs-reduce-api-calls` | 98 / 100 / 100 | 70–75 / 96 / 100 |
| `/contact` | — | 60–78 / 100 / 100 |

SEO reads 69 locally only because `robots.txt` correctly disallows non-canonical hosts (localhost); it
must be re-measured on www.rabinr.in.

**Open issues**
1. Mobile performance is below the 90 target (simulated LCP ~4s, TBT 300–990 ms, high run-to-run
   variance on this machine). Observed LCP is 0.5–1.4 s; re-measure on the Cloudflare preview.
2. Home page mobile CLS 0.13 appears only under Lighthouse; it could not be reproduced with CDP throttling.
3. Vector logo is a recreation awaiting approval.
4. Email Service sender domain must be onboarded before the contact form can deliver in production.
5. `www.rabinr.in` did not resolve at audit time — DNS must point to the Cloudflare deployment.
