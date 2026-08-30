# PORTFOLIO_REVIEW.md
### Complete architecture, design, performance, SEO & UX audit

**Repository:** `rabin_portfolio_2.0` · **Branch:** `main` · **Audited:** 2026-08-30
**Method:** static inspection of every source file, config, content module, stylesheet and asset in the repo. `tsc --noEmit`, `eslint .` and `vitest run` were executed. No files were modified during the audit.

---

## 1. Executive Summary

This is **not** a typical portfolio codebase. It is a genuinely well-engineered Next.js 16 / React 19 application with a real content layer, a typed media manifest, a grounded AI assistant, a hardened contact pipeline, 114 passing unit tests and 3 Playwright specs. Type checking is clean; ESLint reports **0 errors and 4 warnings**.

The problems are therefore not "beginner" problems. They are **accretion** problems — the site has been redesigned in place several times and the old layers were never removed:

- **CSS is the single biggest liability.** 33 stylesheets, ~11,000 lines, hand-ordered by cascade dependency in `globals.css` with a comment explicitly warning that the order must not change. Three separate process stylesheets, four contact stylesheets, a `redesign-v2.css`, and a `--premium-*` token block that duplicates the core palette in a *light* theme.
- **Two parallel design-token systems and two parallel type scales** exist in `tokens.css`, one of them labelled "deprecated" but still referenced everywhere (`--text-*` is used by `base.css` and most modules; `--type-*` is barely used).
- **Two animation libraries ship to the client**: `motion` (73 files) and GSAP + ScrollTrigger (4 files). Both are justified individually but nobody has drawn the line between them.
- **`/public/media` is 45 MB and still the fallback path** for every asset. The Blob migration (`src/lib/media.ts`, `scripts/migrate-media-to-blob.mjs`) is built and correct, but the manifest still points at PNGs of 1.6–2.4 MB each and a 9.4 MB hero MP4. Until `NEXT_PUBLIC_BLOB_BASE_URL` is set *and* the sources are re-encoded, LCP on the process/contact/faq pages will be poor regardless of Blob.
- **Dead code** — a whole commented-out `ProcessJourney` subtree (5 components), `TechnologyBadge`, `ArrowLink`, and `tech-badge.css` with no consumer.
- **Content credibility gap** — `credentials.needsReview` in `src/content/profile.ts` self-documents that "20+ projects" and "15+ clients" are unverified. Shipping unverifiable numbers on a recruiter-facing site is a trust risk.

**Overall score: 7.4 / 10** — a strong, above-average build held back by CSS debt, asset weight, and missing conversion affordances.

The highest-leverage work, in order: **(1) compress/convert media, (2) collapse the token system to one scale, (3) delete the dead CSS/components, (4) consolidate the duplicated stylesheets, (5) add the missing conversion elements (header CTA, outcome metrics, testimonials).** Everything else is polish.

---

## 2. Current Architecture

| Concern | What is actually in the repo |
|---|---|
| Framework | **Next.js 16.3.0**, App Router, `src/app` |
| React | **19.2.8** (`react`, `react-dom`) |
| Language | **TypeScript 5** — `tsc --noEmit` passes with **zero `any`** anywhere in `src` |
| CSS | **Tailwind CSS v4** (`@import "tailwindcss"` + `@theme inline`) used almost exclusively as a token bridge — actual styling is **33 hand-written CSS modules** under `src/app/css/**` plus 2 CSS-Modules files and 2 loose stylesheets |
| UI libraries | None. No shadcn, no Radix, no component kit. All components are bespoke. |
| Animation | `motion` ^13.1.0 (Framer Motion successor) in 73 files; `gsap` ^3.15 + `@gsap/react` in 4 files (`Hero`, `ScrollVideoPlayer`, `ServicesHorizontalScroll`, `lib/gsap.ts`) |
| Icons | `lucide-react` (8 files) + hand-authored SVG sets (`brand-icons.tsx`, `case-icons.tsx`, `tech-icons-data.ts`, `StackTechIcon`) |
| Images | `next/image` via a `SmartImage` wrapper (blur-up tone placeholder, forced lazy/async); AVIF+WebP enabled; `deviceSizes` tuned; 1-year cache TTL |
| Media hosting | **Vercel Blob** via a typed manifest (`src/lib/media.ts`), with automatic fallback to `/public/media` while `NEXT_PUBLIC_BLOB_BASE_URL` is unset |
| Fonts | `next/font/google` — **Inter** (300–700) and **JetBrains Mono** (400–700), `display: swap`, self-hosted by Next |
| Deployment | Vercel (`.vercel` present, `@vercel/analytics`, `@vercel/speed-insights`, `productionBrowserSourceMaps: true`) |
| API routes | `/api/contact`, `/api/chat`, `/api/chat/lead`, `/api/blob/upload` — all `runtime = "nodejs"` |
| Email | **Resend** ^6.22 behind a provider abstraction (`lib/contact/email-service.ts`) with an HTML template, a file/memory message store, and reference IDs. **No Nodemailer anywhere.** |
| Forms | `react-hook-form` + `@hookform/resolvers` + `zod` v4, shared validation in `lib/contact/validation.ts`, toasts via `sonner` |
| AI assistant | Custom RAG pipeline in `src/chat/` — Groq + Gemini providers, intent detection, retriever, output guard, deterministic fallback, SSE streaming |
| Analytics | Vercel Analytics + Speed Insights; internal `chat/analytics.ts` event logging |
| SEO | Centralised `lib/seo.ts` (`pageMetadata`), per-route metadata on **every** page, `sitemap.ts`, `robots.ts`, dynamic OG images, a full `@graph` JSON-LD block |
| Security headers | `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` in `next.config.ts` |
| Testing | Vitest + Testing Library (**8 files / 114 tests, all passing**), Playwright (`e2e/chat|contact|work.spec.ts`) |

---

## 3. Current Folder Structure

```text
src/
├── app/                       # App Router: 22 routes + 4 API routes
│   ├── css/                   # 33 stylesheets (base / components / sections / pages)
│   ├── api/{contact,chat,chat/lead,blob/upload}/
│   ├── work/[slug]/, insights/[slug]/, services/{3 sub-routes}/
│   ├── about, contact, experience, process, pricing, resume, skills,
│   │   freelance-angular-developer, maintenance, insights, work, services
│   ├── layout.tsx template.tsx loading.tsx not-found.tsx
│   └── globals.css manifest.ts robots.ts sitemap.ts opengraph-image.tsx
├── chat/                      # AI assistant domain (17 files, 3 test files)
├── components/                # 90+ components, partly flat / partly foldered
│   ├── about/ chat/ contact/ custom-cursor/ experience/ faq/ pages/ process/ work/
│   ├── (flat) Hero, Navbar, Footer, Sidebar, TechEcosystem, HomePage, …
│   └── maintenance.css services-horizontal-scroll.module.css
├── content/                   # 17 typed content modules — the data layer
├── hooks/                     # 1 file: use-parallel.ts
├── lib/                       # 16 files + lib/contact/ (7 files)
├── motion/motion.css
├── test/setup.ts
└── types/contact.ts
```

### Folder-by-folder evaluation

#### `src/app/` — **Good, with one severe exception**
- ✅ Every `page.tsx` exports `metadata` or `generateMetadata` — verified with a negative grep, zero misses.
- ✅ Route segmentation is sensible; the service sub-routes are real SEO landing pages, not padding.
- ❌ **`src/app/css/` does not belong under `app/`.** It is not routable; it sits inside the router tree purely because `globals.css` lives there. It should be `src/styles/`.
- ❌ `globals.css` is a 60-line hand-ordered import list whose own header states the order "IS the cascade order and is unchanged" — i.e. the cascade is load-bearing and fragile. Any reorder silently changes the design.

#### `src/app/css/` — **Poorly structured**
- ✅ The four-bucket split (base / components / sections / pages) is the right idea.
- ❌ Files do not respect their bucket: `pages/redesign-v2.css` styles *four* different pages; `pages/misc.css` is a bucket of leftovers; `sections/seo-extras.css` is named after a *reason*, not a thing.
- ❌ **Three process stylesheets** (`process.css` 851, `process-flow.css` 629, `process-cinematic.css`), **four contact stylesheets** (`pages/contact.css`, `contact-premium.css` 610, `contact-fields.css` 333, `sections/contact.css`), **four ecosystem stylesheets** (`tech-ecosystem.css`, `-tree` 558, `-notes` 504, `-mobile`).
- ❌ `components/tech-badge.css` has **no consumer** — `TechnologyBadge.tsx` is never imported.
- ❌ `-mobile.css` as a separate file is an anti-pattern: responsive rules should live next to the rules they override.

#### `src/components/` — **Mixed**
- ✅ Domain folders (`work/`, `experience/`, `contact/`, `chat/`, `process/`, `faq/`) are clean.
- ❌ **Flat/foldered inconsistency**: `Hero.tsx`, `WorkSection.tsx`, `SkillsSection.tsx`, `ProcessSection.tsx`, `JourneySection.tsx`, `FaqSection.tsx`, `InsightsSection.tsx`, `PricingSection.tsx` are homepage *sections* sitting at the root next to `Navbar`/`Footer`/`SmartImage`. There is no `sections/` folder even though `HomePage.tsx` composes exactly that.
- ❌ `components/pages/` contains **page bodies** (`ServicesPage`, `WorkPage`, `ExperiencePage`) mixed with **shared primitives** (`MagneticButton`, `PageHero`, `PageCta`, `Breadcrumbs`, `PageSectionHead`, `ArrowLink`). Two responsibilities, one folder.
- ❌ Two stray stylesheets live here (`maintenance.css` 838 lines, `services-horizontal-scroll.module.css` 414) while every other stylesheet is under `app/css`. Three CSS strategies coexist: global imports, CSS Modules, and component-local plain CSS.
- ❌ `TechEcosystem.tsx` is **1,589 lines** — data, geometry, SVG paths, state and rendering in one file. The single largest maintainability risk in the component tree.
- ❌ Dead: `TechnologyBadge.tsx`, `pages/ArrowLink.tsx`, and the entire `ProcessJourney` subtree (`ProcessJourney`, `ProcessSpine`, `ProcessNav`, `ProcessVisual`, `LineReveal`) — reachable only from a commented-out import at `ProcessSection.tsx:5`.
- ❌ **57 of ~90 components are `"use client"`** (64 across `src`). Several are static presentation that only need client-ness for an entrance animation.

#### `src/content/` — **Excellent. The best part of this repo.**
- ✅ 17 typed modules, one `types.ts` (457 lines) as the schema, a `content.test.ts` guarding invariants, and honest self-documentation (`credentials.needsReview`).
- 🟡 `projects.ts` at 641 lines and `types.ts` at 457 are getting large but remain coherent.

#### `src/lib/` — **Good**
- ✅ `contact/` is properly layered: route → service → provider + store + template + logger, all unit-tested.
- ✅ `media.ts`, `seo.ts`, `blob-server.ts`, `motion-tier.ts` are genuinely well-designed with real reasoning in the comments.
- 🟡 `rate-limit.ts` is a 9-line in-memory `Map` — correct for one process, **ineffective across serverless instances**.
- 🟡 Flat mix of concerns: SEO, media, motion, DOM helpers and React hooks in one folder. `useHydrated`, `useReducedMotionSafe`, `useSideRevealSafe` are hooks living in `lib/` while `hooks/` holds a single file.

#### `src/hooks/` — **Under-used**
One file (`use-parallel.ts`) while three hooks live in `lib/`. Pick one home.

#### `public/` — **The performance problem**
45 MB of media. See §13.

#### Config files — **Good**
`next.config.ts` is thoughtful (tuned `deviceSizes`, remote patterns scoped to Blob, real 301s for previously indexed URLs, security headers). `.gitignore` correctly excludes `.env*`, `.contact-messages/`, `.claude/`. **Verified with `git ls-files`: no env file and no message store is tracked.**

---

## 4. Recommended Architecture

```text
src/
├── app/                        # routing + metadata ONLY
│   ├── (existing route tree, unchanged)
│   ├── api/…
│   ├── globals.css             # 2 lines: tailwind + ../styles/index.css
│   └── layout.tsx sitemap.ts robots.ts manifest.ts
│
├── styles/                     # MOVED out of app/
│   ├── index.css               # the ordered import list
│   ├── tokens.css              # ONE token system
│   ├── base.css typography.css primitives.css motion.css motion-off.css
│   ├── components/             # header footer form card cursor chat sidebar logo
│   ├── sections/               # hero about skills ecosystem work-preview journey
│   └── pages/                  # work work-detail process experience contact insights
│
├── components/
│   ├── ui/                     # Btn Magnetic SmartImage Logo badges icons PageHero…
│   ├── layout/                 # Navbar Sidebar Footer Toaster CustomCursor JsonLd
│   ├── sections/               # Hero WorkSection SkillsSection ProcessSection …
│   ├── features/
│   │   ├── work/ experience/ contact/ process/ faq/ chat/ about/
│   │   └── tech-ecosystem/     # split from the 1,589-line file
│   └── pages/                  # ServicesPage WorkPage ExperiencePage HomePage
│
├── content/  chat/  lib/  hooks/  types/  test/
```

### Keep
`src/content/**` · `src/chat/**` · `src/lib/contact/**` · `lib/media.ts` · `lib/seo.ts` · `lib/blob-server.ts` · `lib/motion-tier.ts` · `next.config.ts` · `app/sitemap.ts` · `app/robots.ts` · `components/SmartImage.tsx` · all tests.

### Move
| From | To |
|---|---|
| `src/app/css/**` | `src/styles/**` |
| `components/{Hero,WorkSection,SkillsSection,ProcessSection,JourneySection,FaqSection,InsightsSection,PricingSection,ServicesHorizontalScroll,TechEcosystem}.tsx` | `components/sections/` |
| `components/{Navbar,Sidebar,Footer,Toaster,ChatLauncher,JsonLd,ProgressSync}.tsx`, `custom-cursor/` | `components/layout/` |
| `components/{ui.tsx,motion.tsx,SmartImage,Logo,StackTechIcon,ProjectCover,brand-icons}` | `components/ui/` |
| `components/pages/{MagneticButton,PageHero,PageCta,PageSectionHead,Breadcrumbs}` | `components/ui/` |
| `lib/{useHydrated,useReducedMotionSafe,useSideRevealSafe}.ts` | `src/hooks/` |
| `components/maintenance.css` | `styles/pages/maintenance.css` |

### Rename
| From | To | Why |
|---|---|---|
| `css/pages/redesign-v2.css` | split into `about.css`, `services.css`, `work.css`, `experience.css` | "v2" is a changelog, not a name; it styles 4 pages |
| `css/pages/misc.css` | `css/pages/case-study.css` | its own header says "CASE STUDY / MISC PAGES" |
| `css/sections/seo-extras.css` | `css/sections/content-blocks.css` | named after a motive, not a thing |
| `components/contact/Premium*.tsx` | `contact/Contact*.tsx` | `Premium` is a design-era label, not a role |

### Merge
- `process.css` + `process-flow.css` + `process-cinematic.css` → **`styles/pages/process.css`**
- `pages/contact.css` + `contact-premium.css` + `contact-fields.css` + `sections/contact.css` → **`styles/pages/contact.css`** + `styles/components/form.css`
- `tech-ecosystem.css` + `-tree` + `-notes` + `-mobile` → **`styles/sections/tech-ecosystem.css`** (media queries inline)
- `--premium-*` tokens → fold into the core token set or scope to `[data-surface="light"]`
- `--text-*` (legacy) and `--type-*` scales → **one** scale
- `content/{services,serviceOfferings,service-highlights}.ts` → one `services.ts`

### Delete
`components/TechnologyBadge.tsx` · `css/components/tech-badge.css` · `components/pages/ArrowLink.tsx` · `components/process/{ProcessJourney,ProcessSpine,ProcessNav,ProcessVisual,LineReveal}.tsx` · the commented import at `ProcessSection.tsx:5` · everything under `public/media/` once Blob is verified (archive originals outside the repo).

### Create
`styles/typography.css` (a real type system) · `components/ui/index.ts` barrel · durable `lib/rate-limit` · `BreadcrumbList`/`Article`/`CreativeWork` JSON-LD · `.github/workflows/ci.yml` · `docs/decisions.md` to record the design-direction history currently encoded in filenames.

---

## 5. Page-by-Page Audit

Scores are relative to a premium freelance/recruiter portfolio, not to an average site.

### `/` — Home (`app/page.tsx` → `components/HomePage.tsx`)
**Current structure:** `Hero` → `ServicesHorizontalScroll` → `WorkSection(limit=3)` → `JourneySection` → `SkillsSection` → `ProcessSection` → `FaqSection` → `FaqJsonLd`. All imports are static, with a documented rationale: `next/dynamic` was removed because the Suspense holes caused a measured **~0.70 CLS** on roughly one load in three. The hero is a GSAP-scrubbed video (`ScrollVideoPlayer`) gated on `prefers-reduced-motion` alone (also documented — the motion tier was deliberately removed from that gate).

| UI/UX | Visual | Responsive | Perf | A11y | SEO |
|---|---|---|---|---|---|
| 8 | 9 | 7 | **5** | 8 | 9 |

**Problems**
- 🔴 The hero reel `hero/home-reel.mp4` is **9.39 MB**. Even scrubbed and even from Blob, it dominates the connection during LCP. The `banner-poster.webp` mitigates but does not solve it.
- 🟠 `ServicesHorizontalScroll` is a GSAP pinned rail — the most common source of mobile scroll-jacking complaints. Verify it degrades to a vertical stack at `basic` tier and small widths.
- 🟠 No mid-page CTA between Work and the footer.
- 🟡 Seven full sections plus an FAQ is a long page; recruiters bounce before reaching `/work`.

**Improvements**
1. Re-encode the reel to ≤2 MB at ~1280px with a 3–5s loop; keep the scrub on `full` tier + wide viewports only. 🔴
2. Add a compact proof strip under the hero: years · core stack · 2 CTAs (View Work / Let's Talk). 🟠
3. Move Work above Services and end with a CTA block instead of the FAQ. 🟡

---

### `/work` and `/work/[slug]`
**Current structure:** `WorkPage` + `WorkExplorer` / `WorkOrbit` / `ProjectCard`; case studies compose `CaseChapter`, `CaseGallery`, `FeatureRail`, `ShareCase`, `case-icons`, with a per-slug `opengraph-image.tsx`. Data from `content/projects.ts` (641 lines, 9 projects).

| UI/UX | Visual | Responsive | Perf | A11y | SEO |
|---|---|---|---|---|---|
| 8 | 8 | 7 | 7 | 7 | **9** |

**Problems**
- 🟠 `work-detail.css` is **1,093 lines** — the largest stylesheet in the project.
- 🟠 `app/work/[slug]/page.tsx` at 516 lines mixes data resolution, layout and section variants.
- 🟠 No `BreadcrumbList` JSON-LD despite a `Breadcrumbs` component existing.
- 🟡 `ProjectCover` renders a text poster where a screenshot was never captured — honest, but three of nine projects showing a placeholder weakens the showcase.
- 🟡 The `Sidebar` is hidden on `/work` (`HIDE_ON = ["/work"]`) — a documented overlap workaround, but navigation now silently differs by route.

**Improvements**
1. Split `[slug]/page.tsx` into `CaseHero` / `CaseOverview` / `CaseChapters` / `CaseNext`. 🟠
2. Add `BreadcrumbList` + `CreativeWork` JSON-LD per case study. 🟠
3. Capture real screenshots for the three placeholder projects, or demote them to a compact "also built" list. 🟠
4. Add outcome metrics to every card — recruiters scan for numbers. 🔴

---

### `/services` + `/services/{angular-development,web-application-development,mobile-app-development}`
**Current structure:** `ServicesPage` + `services-page.module.css` (595 lines) + `ServiceIcons`; three sub-routes as dedicated SEO landing pages; content from `services.ts` + `serviceOfferings.ts` + `service-highlights.ts`.

| UI/UX | Visual | Responsive | Perf | A11y | SEO |
|---|---|---|---|---|---|
| 8 | 8 | 7 | 6 | 8 | 9 |

**Problems**
- 🟠 **Three** service content modules with overlapping purpose — a content-drift trap.
- 🟠 Service art ships three MP4s at 2.5–2.7 MB each plus seven WebPs; the videos are decorative loops.
- 🟡 `services-page.module.css` is the only large CSS Module — a third styling strategy for one page.
- 🟡 `/pricing` exists but is not linked from here.

**Improvements**
1. Collapse the three service modules into one, with `highlights` and `offerings` as fields. 🟠
2. Replace decorative MP4s with short AV1/animated-WebP loops, or a static WebP at `basic` tier. 🟠
3. Add per-service pricing anchors and a "typical engagement" band. 🟡

---

### `/contact`
**Current structure:** `PremiumContactHero` + a 3-column `PremiumContactLayout` (left info / center orbital visual / right form). Form is `PremiumContactForm` → `ContactForm` (528 lines, RHF + zod, unit-tested).

| UI/UX | Visual | Responsive | Perf | A11y | SEO |
|---|---|---|---|---|---|
| 8 | 9 | **6** | **5** | 8 | 8 |

**Problems**
- 🔴 Contact media is **7.3 MB**: `contact_h.png` 1.99 MB, `intelligent.png` 1.60 MB, `hero_b.png` 1.39 MB, `hero.mp4` 2.56 MB — decorative weight on the highest-intent page on the site.
- 🟠 A 3-column layout must collapse twice (3→2→1); with an orbital visual in the middle, 768–1024px is the likely failure zone.
- 🟠 Four contact stylesheets, ~1,300 lines combined.
- 🟡 `ContactForm.tsx` at 528 lines mixes field config, validation wiring, attachment UI and submission state.

**Improvements**
1. Convert every contact PNG to WebP/AVIF at display resolution — realistically 1.99 MB → **<120 KB**. 🔴
2. On mobile, drop the center visual and lead with the form. 🟠
3. Extract `ContactFormFields`, `AttachmentField`, `useContactSubmit`. 🟡

---

### `/experience`
`ExperiencePage` + 10 sub-components (`CareerTimeline`, `CurrentChapter`, `MilestoneTrace`, `CapabilityEvolution`, `EngineeringMap`, `StackEvolution`, `NextChapter`, `StatPills`, `ExperienceHero`, `ExperienceNav`).

| UI/UX | Visual | Responsive | Perf | A11y | SEO |
|---|---|---|---|---|---|
| 8 | 8 | 7 | 7 | 7 | 8 |

**Problems** — 🟠 `experience.css` (562) + `experience-stack.css` (700) = 1,262 lines for one route. 🟠 `banner_img.png` is **2.28 MB**. 🟠 `CareerTimeline.tsx:197` and `CurrentChapter.tsx:68` use raw `<img>` for company logos (2 of the 4 ESLint warnings). 🟡 Ten sub-components edges toward over-decomposition.
**Improvements** — logos → `SmartImage`; compress the banner; merge the two stylesheets. 🟠

---

### `/process`
`app/process/page.tsx`, `ProcessSection`, `ProcessFlow` (389 lines), `ProcessPrinciples`.

| UI/UX | Visual | Responsive | Perf | A11y | SEO |
|---|---|---|---|---|---|
| 7 | 8 | 6 | **4** | 7 | 7 |

**Problems**
- 🔴 **12 MB of process art** — eight PNGs at 1.6–1.8 MB each (`Engineer`, `discover`, `Design`, `Define`, `Launch`, `Validate`, `Evolve`, plus `process_hero`). The worst asset offender on the site.
- 🔴 Inconsistent naming: `Define.png`/`Design.png` capitalised, `discover.png` lower — case-sensitivity risk. (Already normalised in the Blob manifest; the sources remain.)
- 🟠 Three process stylesheets, ~1,600 lines.
- 🟠 `ProcessSection.tsx:40` uses a raw `<img>`.
- 🟠 The dead `ProcessJourney` subtree still ships in the tree behind a commented import.

**Improvements** — convert all eight to WebP at real display width (expect **12 MB → ~400 KB**); merge the stylesheets; delete the dead subtree; use `SmartImage`. 🔴

---

### `/about`, `/skills`, `/pricing`, `/insights`, `/insights/[slug]`, `/resume`, `/freelance-angular-developer`

| Route | UI/UX | Visual | Resp | Perf | A11y | SEO | Note |
|---|---|---|---|---|---|---|---|
| `/about` | 8 | 8 | 8 | 8 | 8 | 8 | Clean; portrait already WebP |
| `/skills` | 7 | 8 | 7 | 7 | 7 | 8 | Overlaps the home `SkillsSection` + `TechEcosystem` — three views of one dataset |
| `/pricing` | 7 | 7 | 8 | 9 | 8 | 8 | Not linked from `/services`; discoverability gap |
| `/insights` | 6 | 7 | 8 | 9 | 8 | 8 | `publishedInsights()` correctly excludes stubs from the sitemap — good discipline, but a near-empty blog reads as abandoned |
| `/insights/[slug]` | 7 | 7 | 8 | 9 | 8 | 8 | `type: "article"` + `publishedTime` handled correctly |
| `/resume` | 7 | 7 | 8 | 9 | 7 | 8 | `PrintButton` exists; verify a real print stylesheet and add a downloadable PDF |
| `/freelance-angular-developer` | 7 | 7 | 8 | 8 | 8 | 9 | Well-targeted SEO landing page |

**Priority for this group:** 🟡 — decide whether `/insights` ships or is hidden until there are ≥3 real posts; link `/pricing` from `/services`; add a real PDF resume.

---

### `/maintenance`, `not-found`, `loading`, `template`
- 🟠 `maintenance.css` is **838 lines** for a page nobody should see, and it is the only component-local global stylesheet.
- 🔴 `under-maintain/1.png` is **2.43 MB** — for that same page.
- ✅ `MAINTENANCE_MODE` gating with 503 + `Retry-After` is correct behaviour.
- 🟡 `not-found.tsx` should offer the three highest-value links (Work, Services, Contact).

---

## 6. Design System Audit

### What exists (`src/app/css/base/tokens.css`, 199 lines)
✅ Real tokens for color, spacing (8dp), radius, easing, duration, z-index, layout. ✅ A documented contrast fix on `--color-text-faint` (`#83838c`, 5.2:1) with the failing original recorded in a comment. ✅ The `--sbw` scrollbar-width trick via `@property` — genuinely sophisticated. ✅ One accent (`#c9f24d` lime) on near-black — a coherent, premium direction.

### Inconsistencies found

| # | Problem | Evidence |
|---|---|---|
| 1 | **Two type scales** | `--type-xs…--type-3xl` (fixed rem) *and* `--text-xs…--text-display` (clamp), the latter labelled "legacy type scale (deprecated)" — yet `base.css` sets `body { font-size: var(--text-base) }` and modules use `--text-*` throughout. The "deprecated" scale is the live one. |
| 2 | **Two spacing scales** | `--space-2…--space-80` (px, "unified") plus `--space-1/3/5` (rem, "legacy deprecated"). `--space-2` is `2px` while `--space-1` is `0.25rem` — the name does not imply the unit. |
| 3 | **A second, light-theme palette in the same `:root`** | `--premium-bg: #FAFAF9`, `--premium-foreground: #0C0A09`, `--premium-border`… Nothing indicates which surface owns them. |
| 4 | **Two spacing vocabularies for one idea** | `--space-*` and `--premium-spacing-xs…2xl` |
| 5 | **Four font-family aliases, one font** | `--font-sans`, `--font-display`, `--font-body`, `--font-accent` all resolve to Inter |
| 6 | **Only 3 radii, 4 shadow tokens** | Across ~11k lines of CSS, one-off radii and shadows almost certainly exist outside the tokens |
| 7 | **Three styling strategies** | global CSS imports · CSS Modules (`services-page`, `services-horizontal-scroll`) · component-local global CSS (`maintenance.css`) |
| 8 | **Tailwind installed but barely used** | `@theme inline` exposes 5 tokens; the utility layer is effectively unused |

**Score: 6/10** — strong intent, doubled implementation.

### Recommended unified system
1. **Delete** the `--type-*` scale; keep the clamp-based one and **rename** it `--fs-*` so "deprecated" stops being the default.
2. **Delete** `--space-1/3/5`; convert their usages to the px scale.
3. **Scope** `--premium-*` under `[data-surface="light"]`, or fold it into `--color-*` with a light variant.
4. **Collapse** the font aliases to `--font-sans` + `--font-mono`.
5. **Add** `--radius-pill`/`--radius-full` and a 4-step shadow scale; then grep for literal `border-radius:` / `box-shadow:` values and replace.
6. **Decide on Tailwind**: commit to it for layout utilities, or remove it. Half-in is the worst position.

---

## 7. Typography System

Both fonts are correct choices, well-loaded (`next/font`, `display: swap`, `latin` subset). The **hierarchy** is what is missing — `base.css` gives `h1, h2, h3, h4` a single shared rule (`font-weight: 500`, `letter-spacing: -0.03em`, `line-height: var(--leading-snug)`), so heading level carries no typographic meaning beyond size.

### Recommended scale (replaces both existing scales)

| Role | Family | Weight | Desktop (≥1280) | Tablet (768) | Mobile (375) | Line-height | Tracking |
|---|---|---|---|---|---|---|---|
| Display | Inter | 600 | 76px | 56px | 40px | 1.02 | −0.035em |
| H1 | Inter | 600 | 56px | 44px | 34px | 1.06 | −0.03em |
| H2 | Inter | 500 | 40px | 34px | 28px | 1.12 | −0.025em |
| H3 | Inter | 500 | 28px | 25px | 22px | 1.20 | −0.02em |
| H4 | Inter | 500 | 21px | 20px | 18px | 1.30 | −0.01em |
| Body-lg | Inter | 400 | 19px | 18px | 17px | 1.60 | 0 |
| Body | Inter | 400 | 17px | 16px | 16px | 1.60 | 0 |
| Small | Inter | 400 | 15px | 14px | 14px | 1.50 | 0 |
| Caption | Inter | 500 | 13px | 13px | 12px | 1.40 | 0.01em |
| Button | Inter | 500 | 15px | 15px | 15px | 1.00 | 0.01em |
| Navigation | Inter | 500 | 15px | 15px | 16px | 1.00 | 0.005em |
| Eyebrow / code | JetBrains Mono | 500 | 12px | 12px | 11px | 1.20 | 0.14em, uppercase |

Implement as `--fs-display … --fs-caption` with `clamp()` between the mobile and desktop values, plus `--lh-*` and `--track-*` companions, in a new `styles/typography.css`. Then style `h1..h4` individually rather than as one grouped selector.

**Score: 6/10** — good fonts, no hierarchy, two competing scales.

---

## 8. CSS Architecture

**Current: 33 stylesheets under `src/app/css/` (~11,000 lines) + `motion/motion.css` + `maintenance.css` (838) + 2 CSS Modules (1,009 combined).**

Largest offenders: `work-detail.css` 1093 · `process.css` 851 · `maintenance.css` 838 · `experience-stack.css` 700 · `process-flow.css` 629 · `contact-premium.css` 610 · `services-page.module.css` 595 · `chat-widget.css` 590 · `experience.css` 562 · `tech-ecosystem-tree.css` 558 · `hero.css` 509 · `tech-ecosystem-notes.css` 504.

**Critical structural issue:** `globals.css` is a manually-ordered import list whose header states the order *is* the cascade and must not be regrouped. Specificity conflicts are being resolved by **import order**, not by selector design. That is fragile, and it is why `motion-off.css` "must stay last."

### Recommended structure
```text
src/styles/
├── index.css          # the ordered import list (only file that knows order)
├── tokens.css         # ONE color/space/type/radius/shadow/motion token set
├── base.css           # reset, element defaults, focus, selection, grain
├── typography.css     # h1–h4, body, .mono, .eyebrow — the §7 scale
├── primitives.css     # .shell .section .rule .muted .faint .visually-hidden
├── motion.css         # keyframes, transition helpers, tier gates
├── motion-off.css     # kill-switch — stays last, by design
├── components/        # header footer sidebar form card project-card cursor chat logo
├── sections/          # hero about skills tech-ecosystem work-preview engagement journey
└── pages/             # work work-detail process experience contact insights case-study
                       #   pricing maintenance
```

**Rules to adopt**
1. **One file per surface.** No `-mobile`, `-notes`, `-tree`, `-premium`, `-cinematic`, `-v2` suffixes — responsive and variant rules live in the file they modify.
2. **Cap specificity at two levels** (`.block__element`, `.block--modifier`). The naming is already BEM-ish (`ft__crest-rail`, `chero__title`) — enforce it and import order stops mattering.
3. **No `!important`** — grep and remove before refactoring.
4. Every `border-radius`, `box-shadow`, `color` and `font-size` must be a token.
5. Target: **~18 files / ~7,000 lines** after dedupe.

**Score: 4/10** — the weakest area of the project.

---

## 9. Component Architecture

### Actual composition
```text
RootLayout (app/layout.tsx)
├── JsonLd  ProgressSync
├── Navbar ──── Logo · sliding indicator · MobileMenu (focus-trapped)
├── Sidebar ─── scroll-spy rail (hidden on /work)
├── main
│   ├── HomePage
│   │   ├── Hero ─────────── ScrollVideoPlayer (GSAP scrub) + motion text
│   │   ├── ServicesHorizontalScroll (GSAP pinned rail) + ServiceIcon
│   │   ├── WorkSection ──── ProjectCard · ProjectCover
│   │   ├── JourneySection
│   │   ├── SkillsSection ── TechEcosystem (1589 LOC) · StackTechIcon
│   │   ├── ProcessSection ─ ProcessFlow · ProcessPrinciples
│   │   └── FaqSection ───── FaqAccordion · FaqOrbit · FaqJsonLd
│   ├── WorkPage / [slug] ── WorkExplorer · WorkOrbit · CaseChapter ·
│   │                        CaseGallery · FeatureRail · ShareCase
│   ├── ServicesPage · ExperiencePage (10 sub-components)
│   └── Contact ─────────── PremiumContactHero · PremiumContactLayout
│                            (Left · CenterVisual · Right → PremiumContactForm
│                             → ContactForm)
├── Footer  ChatLauncher → ChatWindow → useChat · ChatMessageView · LeadForm
├── Toaster  CustomCursor  Analytics  SpeedInsights
```

### Findings
| Issue | Detail | Priority |
|---|---|---|
| Component too large | `TechEcosystem.tsx` **1,589 lines** — split into `data.ts` (branches/nodes/paths), `EcosystemSvg`, `NodeDetail`, `Legend` | 🟠 |
| Components too large | `ContactForm.tsx` 528 · `work/[slug]/page.tsx` 516 · `ProcessFlow.tsx` 389 | 🟠 |
| Dead components | `TechnologyBadge`, `pages/ArrowLink`, `process/{ProcessJourney,ProcessSpine,ProcessNav,ProcessVisual,LineReveal}` | 🟠 |
| Wrapper with no value | `PremiumContactForm` only wraps `ContactForm` | 🟡 |
| Mixed responsibilities | `components/pages/` holds page bodies **and** shared primitives | 🟠 |
| Naming | `Premium*` is a design-era label, not a role — same problem as `redesign-v2.css` | 🟡 |
| Over-clienting | 57 of ~90 components are `"use client"` | 🟠 |
| Duplicate concept | `SkillsSection`, `TechEcosystem` and `/skills` present one dataset three ways | 🟡 |
| Good | `SmartImage`, `ScrollVideoPlayer`, `Magnetic`, `Btn`, `SectionKicker` are genuinely reusable and well-scoped | ✅ |

---

## 10. Animation & GSAP Audit

**Inventory**
- **`motion` (Framer) — 73 files.** Entrance fades/slides (`whileInView`, `once: true`), `AnimatePresence` for the ecosystem detail panel and mobile menu, footer/hero staggers.
- **GSAP + ScrollTrigger — 4 files.** `lib/gsap.ts` (single registration point — correct), `Hero` (scroll-indicator fade on the scrub track), `ScrollVideoPlayer` (video scrub), `ServicesHorizontalScroll` (pinned rail).
- **CSS** — `motion/motion.css`, `css/base/motion.css`, `motion-off.css` kill-switch, and a film-grain `body::after` overlay.
- **Cursor** — `CustomCursor` driven by `data-cursor` / `data-cursor-label` attributes across the site.
- **Tiering** — `lib/motion-tier.ts`: `basic` | `full`, from `prefers-reduced-motion`, `deviceMemory ≤ 2`, `hardwareConcurrency ≤ 4`, plus a persisted localStorage preference.

**Assessment**

| Animation | Useful? | Perf | Mobile | Reduced motion | Cleanup | CLS risk |
|---|---|---|---|---|---|---|
| Hero video scrub | Yes — it is the page | ⚠️ 9.4 MB source | ⚠️ verify | ✅ gated on `reduce` (documented decision) | ✅ explicit `kill()` | Low (poster) |
| Scroll-indicator fade | Yes | ✅ | ✅ | ✅ | ✅ | None |
| Services pinned rail | Debatable | ⚠️ pin + transform | ⚠️ scroll-jack risk | ⚠️ verify tier gate | verify | Pinning can shift |
| `whileInView` entrances (×70) | Mostly | ✅ `once: true` | ✅ | ✅ `useReducedMotion` | n/a | Low |
| Sidebar stagger | Marginal | ✅ | hidden | ❌ **not gated** — raw `initial`/`animate`, `Sidebar.tsx:38-41` | n/a | None |
| Film grain overlay | Aesthetic | ⚠️ full-viewport `mix-blend-mode: overlay` at `z-index: 9999` — a composited layer over everything | ⚠️ | not gated | n/a | None |
| Custom cursor | Aesthetic | ✅ | should not mount on touch — verify | verify | verify | None |
| Magnetic buttons | Nice | ✅ | pointer-only | verify | ✅ | None |

**Strengths:** one GSAP registration point; `useGSAP` with `revertOnUpdate`; explicit ScrollTrigger kills; a real motion-tier system; **57 files reference reduced motion** — far above average.

**Problems**
- 🟠 **No stated boundary** between `motion` and GSAP; both ship. Adopt: **GSAP only for scroll-linked / pinned / scrubbed timelines; `motion` for everything discrete** — and write it into `docs/`.
- 🟠 `Sidebar.tsx` animates unconditionally, bypassing the reduced-motion contract every other component honours.
- 🟠 The grain overlay at `z-index: 9999` with `mix-blend-mode: overlay` composites over every page — measure its paint cost on mobile and gate it to `full` tier.
- 🟡 Give the pinned rail an explicit vertical fallback at `basic` tier and ≤1024px.

**Recommended "premium cinematic" system:** one scrubbed hero moment, one pinned rail (desktop / `full` only), a single `once: true` reveal primitive shared by everything else, and zero continuous idle animation. That is close to what already exists — it needs the boundary written down and the two ungated cases fixed.

**Score: 7/10**

---

## 11. Responsive Audit

`deviceSizes` in `next.config.ts` are tuned to real layouts (360→3840), and `--gutter` / `--container-max: 1360px` give a sane container. `body { overflow-x: hidden }` is set — which **hides** horizontal overflow rather than preventing it, so overflow bugs are invisible rather than absent.

| Width | Class | Expected risk |
|---|---|---|
| 1920 / 2560 | Desktop XL | Content caps at 1360px — verify the hero and pinned rail do not letterbox awkwardly; the grain layer spans the full viewport |
| 1440 | Desktop | Primary design target — likely fine |
| 1366 / 1280 | Laptop | 🟠 Contact 3-column + fixed `Sidebar` rail + a 1360px shell is tight; the rail's overlap on `/work` was already worked around by hiding it |
| 1024 | Small laptop / landscape tablet | 🟠 The 3→2 collapse on `/contact`; the pinned services rail |
| 768 | Tablet | 🔴 Highest-risk breakpoint: `PremiumContactLayout`, `ServicesHorizontalScroll`, the `TechEcosystem` SVG (fixed `1100×740` viewBox), the `experience-stack` horizontal stream |
| 430 / 390 / 375 | Modern phones | 🟠 `TechEcosystem` needs a genuinely different mobile view, not a scale-down — the existence of `tech-ecosystem-mobile.css` + `-notes.css` suggests repeated patching |
| 360 | Small Android | 🟠 Display type at `clamp(2.6rem, …)` = 41.6px minimum — verify hero lines do not wrap to 4+ rows |

**Actions**
1. Remove `overflow-x: hidden` temporarily and fix what actually overflows. 🟠
2. Add a Playwright visual sweep at 360/390/768/1024/1440 across all routes — the harness already exists. 🟠
3. Give `TechEcosystem` an explicit mobile component (list/accordion), not a scaled SVG. 🟠
4. Test `/contact` specifically at 768 and 1024. 🔴

**Score: 7/10**

---

## 12. Mobile-First Review

✅ `touch-targets.css` exists as a dedicated concern. ✅ The mobile menu is focus-trapped with ESC, body-scroll-lock and focus restored to the toggle (`Navbar.tsx`) — better than most production sites. ✅ `motion-tier` downgrades on low-memory / low-core devices.

❌ **Content density** — seven homepage sections including a 1,589-line ecosystem visual and a pinned horizontal rail. On a 390px phone this is a long, heavy scroll.
❌ **Image weight is not mobile-aware at source** — `next/image` resizes, but a 2.4 MB PNG source still costs a CDN transform and bounds the AVIF result's quality.
❌ **Pinned horizontal scroll** on touch competes with native scrolling.
❌ **Custom cursor + film grain** are pure desktop value shipped to mobile as JS and paint cost.

**Recommendations**
1. Gate `CustomCursor` on `(pointer: fine)` at the *component* level so it never mounts on touch. 🟠
2. Gate the grain overlay to `full` tier. 🟡
3. Replace the pinned rail with a vertical stack below 1024px. 🟠
4. Add a sticky mobile CTA bar (Contact / Resume) — the highest-converting single change for a phone visitor. 🟠
5. Verify every interactive target is ≥44×44 CSS px (the file exists; audit its coverage). 🟠

**Score: 7/10**

---

## 13. Image & Asset Audit

### The numbers (`public/media`, 45 MB total)
| Directory | Size | Worst file |
|---|---|---|
| `process/` | **12 MB** | 8 PNGs at 1.6–1.8 MB each |
| `hero/` | **9.0 MB** | `banner_v.scrub.mp4` **9.39 MB** |
| `service/` | **8.3 MB** | 3 MP4s at 2.5–2.7 MB |
| `contact/` | **7.3 MB** | `contact_h.png` 1.99 MB · `hero.mp4` 2.56 MB · `intelligent.png` 1.60 MB · `hero_b.png` 1.39 MB |
| `under-maintain/` | 2.4 MB | `1.png` 2.43 MB — for a page nobody should see |
| `faq/` | 2.2 MB | `banner_h.png` 2.25 MB |
| `experience/` | 2.2 MB | `banner_img.png` 2.28 MB |
| `galaxy-sofas/`, `about/`, `working/` | small | already WebP ✅ |

**19 files exceed 300 KB. Every file over 1 MB is a PNG or an MP4 that should not be.**

### Naming
Inconsistent and inherited: `image1.png` / `image2.png` / `image3.png` across three different projects, `1.png…7.webp`, `Define.png` vs `discover.png` (case), `banner_v.scrub.mp4`, `hero_b.png`, `contact_h.png`, `banner_h.png`. The **Blob manifest already fixes this** (`projects/galaxy-sofas/gallery-01.webp`) — which is the strongest argument for finishing the migration.

### CDN decision: Vercel Blob — **already the right call, already built, finish it**

| Option | Pros | Cons |
|---|---|---|
| **Vercel Blob** (chosen) | Already implemented, typed and tested; keeps the repo small; `next/image` still optimises from it (`remotePatterns` configured); one vendor; the manifest doubles as a rename map | Paid per GB stored/transferred; requires `NEXT_PUBLIC_BLOB_BASE_URL` in every environment |
| Cloudinary | On-the-fly transforms, automatic format/quality | Second vendor; duplicates what `next/image` already does here; more config surface |
| Stay in `/public` | Zero config | 45 MB in git; shipped on every deploy; no rename path |

**Verdict: Blob, unambiguously.** But **compress before uploading** — migrating 45 MB of unoptimised PNGs to a CDN relocates the problem and adds a bill.

### Action plan
1. 🔴 Re-encode **before** `npm run blob:migrate`: every `.png` → WebP/AVIF at ≤1600px. `scripts/optimize-media.js` already exists and `sharp` is a devDependency.
   *Expected: 12 MB of process art → ~400 KB; the 1.99 MB contact PNG → ~110 KB; roughly 30 MB saved overall.*
2. 🔴 Re-encode videos (`scripts/optimize-videos.js` exists): hero reel ≤2 MB; service loops ≤500 KB each, or replace with stills.
3. 🟠 Set `NEXT_PUBLIC_BLOB_BASE_URL` locally **and** on Vercel; confirm `isBlobConfigured` is true in production.
4. 🟠 Delete `/public/media` once Blob is verified (archive originals outside the repo). Keep `logo-*.png`, `icon.png`, `apple-icon.png`.
5. 🟠 Replace the 4 raw `<img>` uses with `SmartImage` (ESLint already flags them).
6. 🟡 Re-verify every `alt` is meaningful (decorative images correctly use `alt=""` today).

**Score: 4/10 as shipped · 8/10 for the architecture that is built but not yet finished.**

---

## 14. SEO Audit

**This is the strongest area of the project.**

✅ `lib/seo.ts` centralises title/description/canonical/OG/Twitter, with a documented reason (Next merges parent OG, so partial page metadata silently inherits the homepage social preview). ✅ **Every** `page.tsx` exports metadata — verified with a negative grep, zero misses. ✅ `sitemap.ts` is curated: explicit priorities, projects from content, and **only** insights with a written body (`publishedInsights()`) — thin content deliberately excluded. ✅ `robots.ts` disallows `/api/` and declares sitemap + host. ✅ Dynamic OG images at the root and per case study. ✅ JSON-LD `@graph` with Person / WebSite / Service, `sameAs` restricted to verified profiles, `knowsAbout` derived from the real skill matrix, and XSS-safe serialisation (`replace(/</g, "\\u003c")`). ✅ 301 redirects for the previously indexed `/projects` and `/case-studies/:slug`. ✅ Real SEO landing pages (`/freelance-angular-developer`, three service sub-routes). ✅ Verification tokens read from env, never hardcoded.

**Gaps**
| Gap | Priority |
|---|---|
| No `BreadcrumbList` JSON-LD despite a `Breadcrumbs` component | 🟠 |
| No `Article` / `CreativeWork` schema on insights or case studies | 🟠 |
| Heading hierarchy not verified end-to-end (`h1..h4` share one style rule, so visual size ≠ semantic level) | 🟠 |
| Internal linking is thin: `/pricing` unlinked from `/services`; `/insights` unlinked from case studies | 🟠 |
| Large unoptimised images will cost Core Web Vitals, a ranking input | 🔴 |
| Twitter card has no `creator` / `site` handle | 🟡 |
| No `hreflang` / `en-IN` alternate (fine for a single-locale site) | 🟢 |

**Recommended per-page structure (using existing project data — nothing invented)**
```text
Title            <Page> | Rabin R              (template already in layout.tsx)
Meta Description 150–160 chars, unique per route (already unique)
OG Title         = full title                  (already handled by pageMetadata)
OG Description   = meta description
OG Image         /opengraph-image  or a per-route opengraph-image.tsx
Canonical        SITE_URL + path               (already handled)
Keywords         from content/profile.ts defaultSeo.keywords
Schema           Person + WebSite + Service (site-wide, exists)
                 + FAQPage (home, exists)
                 + BreadcrumbList (all sub-routes)   <- ADD
                 + Article (insights)                <- ADD
                 + CreativeWork (case studies)       <- ADD
```

**Score: 8.5/10** — best-in-class metadata plumbing; missing three schema types and hurt by asset weight.

---

## 15. Accessibility Audit (target WCAG 2.2 AA)

### Already right
✅ `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px }` globally. ✅ Mobile menu: ESC to close, Tab trapped, focus moved in and restored to the toggle. ✅ `aria-labelledby` on the hero section, `aria-label` on nav landmarks, `aria-hidden` on decorative marks. ✅ A `.visually-hidden` utility. ✅ `#main` landmark with a `min-height: 100dvh` CLS guard. ✅ `color-scheme: dark`. ✅ A documented contrast fix (`--color-text-faint` raised from 3.8:1 to 5.2:1). ✅ 57 files honour reduced motion. ✅ `touch-targets.css` as a first-class concern.

### Critical / high issues
| # | Issue | Where | Priority |
|---|---|---|---|
| 1 | **No skip-to-content link.** `#main` exists but nothing skips to it — keyboard users traverse Navbar + Sidebar on every page. WCAG 2.4.1. | `app/layout.tsx` | 🔴 |
| 2 | **`Sidebar` animation ignores reduced motion** — raw `initial`/`animate` with a per-item stagger. WCAG 2.3.3. | `Sidebar.tsx:38-41` | 🟠 |
| 3 | **Accent contrast unverified on light surfaces.** `#c9f24d` on `#0a0a0c` is fine (~15:1), but `--premium-accent` (`#c9f24d`) on `--premium-bg` (`#FAFAF9`) is **~1.5:1** — unusable for text. Audit every text usage. | `tokens.css`, contact page | 🔴 if used for text |
| 4 | **Heading semantics ≠ hierarchy.** `h1,h2,h3,h4` share one weight/tracking/line-height rule; verify no page skips a level for visual reasons. | `base.css` | 🟠 |
| 5 | **Pinned horizontal scroll** — verify it is reachable and escapable by keyboard and is not the only path to its content. | `ServicesHorizontalScroll` | 🟠 |
| 6 | **Custom cursor** must not suppress the native cursor for keyboard/AT users or on touch. | `CustomCursor` | 🟠 |
| 7 | **Form error announcement** — verify `aria-live` / `aria-describedby` wiring on field errors and the submit result. | `ContactForm.tsx` | 🟠 |
| 8 | **`TechEcosystem` SVG** — an interactive 1100×740 diagram needs roles, accessible names on nodes, and keyboard focusability, or a documented text equivalent. | `TechEcosystem.tsx` | 🟠 |
| 9 | Grain overlay `mix-blend-mode: overlay` at `z-index: 9999` can reduce effective contrast site-wide. Measure post-blend. | `base.css` | 🟡 |
| 10 | Verify focus visibility **inside** the pinned rail and the chat window. | | 🟡 |

**Score: 7/10** — clearly built with accessibility in mind; the missing skip link is the one outright violation.

---

## 16. Contact Form Audit

**No Nodemailer. No legacy implementation.** This is a modern, layered, tested pipeline — the best-architected feature in the repo.

```
ContactForm (RHF + zod)
   └─> POST /api/contact (nodejs runtime)
         ├─ content-length pre-check (32 KB JSON / attachment + headroom for multipart)
         ├─ rateLimit(clientKey, 4 per 10 min)
         ├─ multipart parse -> MIME allow-list AND extension allow-list
         └─> submitContact(body, { email, store, attachment })
               ├─ lib/contact/validation.ts    (zod, shared client+server)
               ├─ lib/contact/email-service.ts (Resend behind an interface)
               ├─ lib/contact/email-template.ts (498-line HTML template)
               ├─ lib/contact/message-store.ts  (file | memory | none)
               ├─ lib/contact/reference-id.ts
               └─ lib/contact/mail-logger.ts
```

| Check | Status |
|---|---|
| Validation | ✅ zod v4, shared client/server, `validation.test.ts` |
| Error handling | ✅ Typed results, field-level errors, distinct 400/413/429/503/500 |
| Success state | ✅ Reference ID + expected response time returned to the client |
| Loading state | ✅ RHF `isSubmitting` |
| Attachments | ✅ Size cap + **MIME and extension** double-check, with a comment noting `accept` is advisory |
| Spam protection | 🟠 **Rate limit only** — no honeypot, no timing check, no BotID/Turnstile |
| Rate limiting | 🔴 **In-memory `Map`** — resets on cold start, per-instance on Vercel, trivially bypassed |
| Email delivery | ✅ Resend behind an interface; failures degrade gracefully and the message is still persisted |
| Env vars | ✅ Server-only, documented, never `NEXT_PUBLIC_`; the route returns 503 rather than failing silently when unconfigured |
| Security | ✅ Body-size caps, no secret in any client bundle, `sanitize.ts` present |
| Persistence | 🟠 `CONTACT_PERSIST=file` writes to `.contact-messages/` — **local disk on Vercel is ephemeral**, so "saved" is not durable in production |

**Recommendations**
1. 🔴 Replace `lib/rate-limit.ts` with a durable store (Upstash Redis via the Vercel Marketplace, or Vercel BotID for bot filtering). The current implementation gives false confidence.
2. 🟠 Add a honeypot field plus a minimum time-to-submit check — near-zero cost, removes most bot volume.
3. 🟠 For production persistence, write failed sends to Blob or a marketplace database instead of `.contact-messages/`, or document the store as development-only.
4. 🟡 Split `ContactForm.tsx` (528 lines) into fields / attachment / submit-hook.

**Score: 8/10** (9 with durable rate limiting).

---

## 17. Security Audit

**No secret values are reproduced in this document. Only filenames and variable names appear below.**

### Verified good
✅ `.gitignore` covers `.env*`, `.vercel`, `.contact-messages/`, `.claude/` — and `git ls-files` confirms **no env file and no message store is tracked**.
✅ **No hardcoded secrets found in `src/`.** All keys are read from `process.env` at the server boundary.
✅ `NEXT_PUBLIC_` is used only for genuinely public values: `NEXT_PUBLIC_BLOB_BASE_URL` (a read-only CDN origin), `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION`.
✅ `src/lib/blob-server.ts` is marked `server-only`; the Blob write token never reaches the client.
✅ `/api/blob/upload` **fails closed** — with `BLOB_UPLOAD_SECRET` unset it returns 401, and auth uses `timingSafeEqual` on length-equalised buffers plus an explicit length check.
✅ The upload route validates folder against an allow-list, MIME against an allow-list, and size bounds; `overwrite` defaults to false.
✅ Chat route: body cap, rate limit, intent gate, retrieval grounding, output guard (`chat/guard.ts` with tests), no CORS header (same-origin by design), `nosniff` on the SSE stream, AI key server-side only.
✅ JSON-LD escapes `<` so it cannot break out of its `<script>`.
✅ Security headers set globally in `next.config.ts`.
✅ `lib/sanitize.ts` exists and is used.

### Issues
| # | Issue | Priority |
|---|---|---|
| 1 | **Rate limiting is in-memory** (`lib/rate-limit.ts`) and therefore ineffective on serverless. It guards `/api/contact` (4/10min) and `/api/chat` (20/10min). | 🔴 |
| 2 | **No Content-Security-Policy header.** Four headers are set but not CSP. With inline JSON-LD and Vercel Analytics this needs a nonce-based policy — real work, real payoff. | 🟠 |
| 3 | `productionBrowserSourceMaps: true` publishes readable source maps. Intentional for Speed Insights, but it exposes the full client source — decide deliberately. | 🟡 |
| 4 | `CONTACT_ALLOW_UNCONFIGURED` — verify it can never be true in production. | 🟠 |
| 5 | `/api/chat/lead` — confirm it carries the same rate limit and validation as `/api/contact`. | 🟠 |
| 6 | No explicit `Strict-Transport-Security` header (Vercel sets HSTS at the edge, but declaring it is clearer). | 🟡 |
| 7 | `.contact-messages/` is gitignored but holds real submitted PII on any machine that ran it — ensure it is never packaged or backed up. | 🟡 |
| 8 | No CI at all, so no `npm audit` gate. | 🟠 |

**Score: 8/10** — genuinely careful work; the rate limiter is the one real hole.

---

## 18. Content Audit

The content layer (`src/content/`, 17 typed modules with a test) is a real strength: single-sourced, typed, and honest enough to self-flag unverified claims.

| Area | Assessment |
|---|---|
| Hero | ✅ Availability pill + accent-word display lines + disciplines + quote. Strong. 🟡 Add one quantified proof point. |
| About | ✅ Portrait already WebP; coherent. |
| Services | 🟠 Split across `services.ts`, `serviceOfferings.ts`, `service-highlights.ts` — real drift risk. |
| Skills | 🟡 Presented three ways (`SkillsSection`, `TechEcosystem`, `/skills`). Pick a primary. |
| Experience | ✅ `experience.ts` (325 lines) with `calculateExperienceYears()` deriving the years label — no stale number. Excellent. |
| Projects | ✅ 9 typed case studies. 🟠 3 lack real screenshots (`ProjectCover` placeholder). 🔴 Outcomes/metrics are the missing ingredient. |
| Process | ✅ 7 stages, well-written. |
| Pricing | 🟡 Exists but is orphaned from the service pages. |
| Contact | ✅ Response-time expectation is set — a good trust signal. |
| Footer | ✅ Filters out the self-referential "website" social link — a real, thoughtful detail. |
| **Credibility** | 🔴 `credentials.needsReview: ["projects", "clients"]` — "20+ projects" and "15+ clients" are, by the codebase's own admission, unverifiable. On a recruiter/client-facing site this is the highest-risk content in the repo. |
| Insights | 🟠 Thin. `publishedInsights()` correctly hides stubs, but a visible blog with almost nothing in it reads worse than no blog. |

**Recommendations**
1. 🔴 Verify or replace the `needsReview` figures. Prefer defensible specifics ("9 shipped case studies across 4 countries") over round numbers.
2. 🔴 Add a measurable outcome to every project (`LCP 4.1s → 1.2s`, `12k daily users`, `40% fewer support tickets`).
3. 🟠 Merge the three service modules.
4. 🟡 Hide `/insights` from the nav until ≥3 real posts exist (the sitemap logic is already correct).

**Score: 7.5/10**

---

## 19. Project Showcase Audit

**Current:** `/work` (`WorkPage` + `WorkExplorer` + `WorkOrbit` + `ProjectCard`) → `/work/[slug]` (516-line page composing `CaseChapter`, `CaseGallery`, `FeatureRail`, `ShareCase`) with per-slug OG images and 9 typed projects.

| Element | State |
|---|---|
| Project cards | ✅ Exist, styled (`project-card.css`) |
| Images | 🟠 3 of 9 fall back to `ProjectCover` text posters; the rest are 100–480 KB PNGs |
| Hover previews | 🟡 Verify — no evidence of a video/GIF hover preview |
| Case studies | ✅ Real, chaptered case studies with galleries — **well above portfolio average** |
| Technologies | ✅ Typed per project |
| **Results / metrics** | 🔴 **The critical gap** — case studies describe *what* was built, not what changed |
| Links | 🟡 Verify live/repo links per project; government work may legitimately have none — say so explicitly |
| CTA | 🟡 Verify each case study ends with a contact CTA and a next-project link |
| Filtering | 🟡 `WorkExplorer` exists — verify it filters by stack/industry and that filter state is URL-addressable |
| Animations | ✅ `WorkOrbit` + motion reveals |

**Recommended premium architecture** (mostly additive to what exists):
```text
/work
  ├─ Hero: "9 case studies · Angular · government & enterprise scale"
  ├─ Filter rail (stack / industry / year) — URL-synced (?stack=angular)
  ├─ Card grid: cover · client · one-line outcome · 3 tech chips · year
  └─ CTA
/work/[slug]
  ├─ Hero: title · role · stack · duration · headline metric
  ├─ Context -> Problem -> Approach -> Architecture -> Outcome (metrics)
  ├─ Gallery (real screenshots)
  ├─ "What I would do differently" — the highest-signal section for engineers
  ├─ Next project
  └─ CTA + BreadcrumbList / CreativeWork JSON-LD
```

**Score: 7/10** — structurally strong, undermined by missing screenshots and missing outcomes.

---

## 20. Navigation Audit

**Header (`Navbar.tsx`, 249 lines)** — sticky, with a sliding active indicator driven by `useScrollSync`, a hash/route-aware active resolver, a full-screen mobile overlay with focus trap + ESC + scroll lock + focus restore, and `isStandaloneRoute` to hide chrome on standalone pages.

**Rail (`Sidebar.tsx`)** — a fixed scroll-spy rail, hidden on `/work` because it overlapped that page's full-width grid.

| Aspect | Assessment |
|---|---|
| Desktop nav | ✅ 5 items (Service, Work, Experience, Skills, Process) — well-scoped |
| Active indicator | ✅ Real measured transform, repositioned on resize |
| Mobile menu | ✅ Best-practice focus management |
| Scroll behaviour | ✅ `scroll-padding-top: calc(var(--header-h) + 1.5rem)` — anchors clear the header |
| Sticky | ✅ |
| **CTA in the header** | 🔴 **Missing.** The nav has no "Contact" / "Hire me" button. The single highest-value conversion element on a freelance portfolio is absent from the persistent chrome. |
| Logo | ✅ `Logo` + `Monogram` |
| **Two navigations** | 🟠 Navbar + Sidebar are redundant on desktop, and the Sidebar's per-route hiding makes navigation inconsistent |
| Sidebar a11y | 🟠 Ungated animation (§10); also duplicates nav landmarks for screen readers |
| Breadcrumbs | 🟠 Component exists; no `BreadcrumbList` schema |
| `aria-current` | 🟡 Not set on the active nav item |

**Recommendations**
1. 🔴 Add a persistent accent "Let's talk" CTA to the Navbar (desktop and inside the mobile overlay).
2. 🟠 Decide: keep the Sidebar as a *progress indicator only* (dots, no labels, `aria-hidden`, homepage only), or delete it. Two navs pointing at overlapping targets is worse than one.
3. 🟠 Gate the Sidebar animation behind `useReducedMotion`.
4. 🟡 Add `aria-current` to the active nav item.

**Score: 7/10**

---

## 21. Footer Audit

`Footer.tsx` — a crest with the monogram notched into the top edge, brand + role + blurb, a `Magnetic` "Let's Work Together" CTA, `footerNavigation.explore` columns, and socials filtered to those with a real icon *and* a real destination.

✅ Clear hierarchy · ✅ Prominent CTA · ✅ Real social links only · ✅ `aria-labelledby` on each nav column with an `h2` label · ✅ Reduced-motion-aware reveal helper · ✅ Hidden on standalone routes.

🟠 The column headings are `<h2>` inside the footer — defensible, but they compete with page `h2`s in the document outline.
🟡 No direct email/phone in the footer even though `profile.email` and `profile.phone` exist — recruiters look there first.
🟡 No availability echo or "last updated" line.
🟡 Verify column stacking order and the crest rail at 360px.

**Score: 8/10** — the best-executed single component in the project.

---

## 22. User Experience Flow

**Actual homepage order:** Hero → Services → Work(3) → Journey → Skills (TechEcosystem) → Process → FAQ.

| Question | Answer |
|---|---|
| Is the flow logical? | Mostly. Services-before-Work is a client-first ordering; a recruiter wants Work first. |
| Is the CTA clear? | 🟠 Partly. The footer CTA is strong; there is **no header CTA** and no mid-page CTA between Work and Skills. |
| Is the personal brand clear? | ✅ Yes — availability pill, role, disciplines, one accent colour, consistent voice. |
| Can a recruiter understand the profile in 10s? | 🟠 Not quite — years, core stack and resume are not all above the fold. |
| Can a client understand the services in 10s? | ✅ Yes, Services is section two. |
| Can a visitor find projects quickly? | 🟠 Third section on the home page; second in the nav. Acceptable, not immediate. |

**Recommended conversion-oriented flow**
```text
Hero  (availability · role · 2 CTAs: View Work / Let's Talk)
 ↓
Proof strip  (4+ yrs · Angular/TS/React · 9 case studies · Chennai, remote-friendly)   <- NEW
 ↓
Selected Work (3 cards, each with an outcome metric)                                   <- MOVED UP
 ↓
Services (what I do for clients)
 ↓
Process (how I work)
 ↓
Skills / Tech Ecosystem (depth for engineers)
 ↓
Journey / Experience
 ↓
FAQ (objection handling)
 ↓
CTA block -> Contact                                                                    <- NEW
```
Plus a persistent header CTA and a sticky mobile CTA bar.

**Score: 7/10**

---

## 23. Recruiter Experience (Frontend / Angular Developer)

A recruiter typically gives a portfolio **10–30 seconds**.

| They look for | Found? | Where | Time to find |
|---|---|---|---|
| Years of experience | 🟡 Partial | `credentials.years` "4+", derived from `experience.ts` | Not above the fold |
| Angular expertise | ✅ Strong | Hero focus line, `/services/angular-development`, `/freelance-angular-developer`, TechEcosystem | Immediate |
| Frontend depth | ✅ Strong | Skills, TechEcosystem, case studies | ~15s |
| Projects | ✅ 9 real case studies | `/work` | ~10s |
| Professional impact | 🔴 **Weak** | No outcome metrics anywhere | Never |
| Contact information | 🟠 Footer only | `profile.email` / `profile.phone` exist but are not in the header | ~20s |
| Resume | 🟠 `/resume` + `PrintButton` | Not linked from the hero; no direct PDF | ~20s |
| Employment history | ✅ `/experience` with a real timeline | Nav item | ~10s |

**Improvements (ranked by conversion impact)**
1. 🔴 **Outcome metrics on every case study.** "Rebuilt the Fiji Immigration internal portal" → "…cutting officer processing time 35% for 400 daily users."
2. 🔴 **Header CTA + a Resume link** in the persistent chrome.
3. 🟠 **A downloadable PDF resume**, not just a print view.
4. 🟠 **A proof strip under the hero**: years · core stack · notable domains · location/availability.
5. 🔴 **Fix the unverifiable "20+ / 15+"** — a recruiter who cannot reconcile "20+ projects" with 9 case studies discounts everything else on the page.
6. 🟡 Add a GitHub/open-source line if there is real substance behind it.

**Score: 7/10**

---

## 24. Client / Freelance Experience

| They need | Found? | Notes |
|---|---|---|
| Services | ✅ Excellent — `/services` + 3 dedicated sub-routes | Best-covered area |
| Expertise | ✅ Case studies + skills | |
| Process | ✅ A real 7-stage `/process` page — rare and differentiating | |
| Previous work | ✅ 9 case studies | Weakened by 3 missing screenshots |
| Pricing | 🟠 `/pricing` exists but is **not linked from `/services`** | |
| Engagement models | ✅ `content/engagement-models.ts` | |
| Trust signals | 🔴 **No testimonials anywhere.** No client logos. `credentials` self-flagged as unverified. | |
| CTA | 🟠 Footer + `/contact`; no header CTA, per-service CTAs unverified | |
| Contact options | ✅ Form with attachments, email, phone, a stated response time, plus an AI assistant | |
| Availability | ✅ Explicit availability pill and response time — strong | |

**Improvements**
1. 🔴 **Add testimonials.** Even two short, attributed quotes outperform every visual effect on this site for client conversion.
2. 🟠 Link `/pricing` from every service page; add a "typical engagement" band per service.
3. 🟠 Add client/employer logos where permitted — government work may not permit it; say so explicitly rather than leaving a gap.
4. 🟠 Per-service CTA plus a "book a call" option alongside the form.
5. 🟡 Publish 2–3 real insights posts — expertise evidence for clients evaluating you.

**Score: 7/10**

---

## 25. Code Quality Audit

| Dimension | Assessment |
|---|---|
| TypeScript | ✅ `tsc --noEmit` clean |
| Type safety | ✅ **Zero `any` / `as any` / `<any>` in the entire `src/` tree** — verified by grep. `content/types.ts` (457 lines) is a real schema. |
| Lint | ✅ 0 errors, **4 warnings** — all `@next/next/no-img-element` (`ProcessSection.tsx:40`, `CareerTimeline.tsx:197`, `CurrentChapter.tsx:68`, `ProcessVisual.tsx:19`) |
| Tests | ✅ 8 files / **114 tests, all passing** — chat guard/intent/retriever, contact validation/service, content invariants, `ContactForm`, chat route |
| E2E | ✅ 3 Playwright specs (chat, contact, work) |
| Naming | 🟠 Good at the symbol level; poor at the *file* level where design eras leaked in (`redesign-v2`, `Premium*`, `process-cinematic`, `seo-extras`, `misc`) |
| Duplicated logic | 🟠 Three service content modules; three skills presentations; four contact stylesheets |
| Magic numbers | 🟡 `TechEcosystem` embeds SVG coordinates inline (`1100×740`, per-node x/y) — acceptable for a diagram, but it should be a data module |
| Constants | ✅ Well-handled (`ATTACHMENT`, `MAX_BODY_BYTES`, `BLOB_FOLDERS`, `HIDE_ON`) |
| Error handling | ✅ Excellent in API routes — typed results, distinct statuses, graceful degradation, logged causes |
| Hooks | ✅ Correct dependency arrays and cleanups; `useSyncExternalStore` used properly in `motion-tier.ts` |
| Utilities | ✅ Small and focused, except `rate-limit.ts` which is *too* small for its job |
| Component complexity | 🟠 `TechEcosystem` 1589 · `ContactForm` 528 · `work/[slug]/page.tsx` 516 · `ProcessFlow` 389 |
| Dead code | 🟠 7 unused components + 1 orphan stylesheet + a commented-out import |
| **Comments** | ✅ **Outstanding.** They explain *why*, not *what* — the CLS reasoning in `HomePage.tsx`, the OG-inheritance reasoning in `seo.ts`, the `--sbw` `@property` note, the contrast-fix note, the `Sidebar` hiding rationale, the reduced-motion gating decision in `Hero.tsx`. Professional-grade documentation. |
| Maintainability | 🟠 High in `content/`, `lib/`, `chat/`; low in `css/` |

**Code quality score: 8/10** — the TypeScript is excellent; CSS debt and dead code drag it down.

---

## 26. Dependency Audit

Every dependency below was checked against actual imports in `src/` and `scripts/`.

### Runtime
| Package | Used? | Files | Verdict |
|---|---|---|---|
| `next` 16.3.0 | ✅ | — | Keep |
| `react` / `react-dom` 19.2.8 | ✅ | — | Keep |
| `gsap` ^3.15 + `@gsap/react` ^2.1 | ✅ | 4 | **Keep** — scroll scrub + pinning genuinely need it |
| `motion` ^13.1 | ✅ | 73 | **Keep** — the primary animation layer |
| `lucide-react` ^1.31 | ✅ | 8 | Keep — tree-shakes per icon |
| `react-hook-form` ^7.85 | ✅ | 1 (`ContactForm`) | Keep — one form, but a complex one with attachments |
| `@hookform/resolvers` ^5.8 | ✅ | 1 | Keep (required by the above) |
| `zod` ^4.4 | ✅ | 3 | Keep — shared client/server validation |
| `sonner` ^2.0 | ✅ | 2 | Keep — small |
| `resend` ^6.22 | ✅ | 1 | Keep |
| `server-only` | ✅ | 1 (`blob-server`) | Keep — a real safety boundary |
| `@vercel/blob` ^2.8 | ✅ | 2 | Keep |
| `@vercel/analytics` ^2.0 | ✅ | `layout.tsx` | Keep |
| `@vercel/speed-insights` ^2.0 | ✅ | `layout.tsx` | Keep |

### Dev
| Package | Used? | Verdict |
|---|---|---|
| `typescript`, `@types/*` | ✅ | Keep |
| `eslint` ^9 + `eslint-config-next` | ✅ | Keep |
| `vitest` ^4.1, `jsdom`, `@testing-library/*` | ✅ 114 tests | Keep |
| `@playwright/test` ^1.62 | ✅ 3 specs | Keep |
| `sharp` ^0.35 | ✅ 4 script files | Keep — **and actually run the scripts** |
| `tailwindcss` ^4 + `@tailwindcss/postcss` | 🟠 Installed, imported, `@theme inline` exposes 5 tokens — but the utility layer is essentially unused given ~11k lines of hand-written CSS | **Decide** (§6) |

**Nothing here is unused enough to recommend removal.** That is unusual and worth noting. The only open question is Tailwind's role.

**Performance note:** shipping both `motion` and GSAP+ScrollTrigger is the largest avoidable JS cost. Both are justified today; the fix is a documented boundary plus route-level lazy loading of GSAP (used only on `/` and `/services`), not removal.

**Score: 8.5/10**

---

## 27. Architecture Scorecard

| Category | Score | Priority |
|---|---:|---|
| Architecture | 7/10 | 🟠 High |
| UI/UX | 7.5/10 | 🟠 High |
| Visual Design | 8.5/10 | 🟢 Low |
| Responsive | 7/10 | 🟠 High |
| Performance | **5/10** | 🔴 Critical |
| SEO | 8.5/10 | 🟡 Medium |
| Accessibility | 7/10 | 🟠 High |
| Animation | 7/10 | 🟡 Medium |
| Code Quality | 8/10 | 🟡 Medium |
| Security | 8/10 | 🟠 High (rate limiting) |
| Content | 7.5/10 | 🟠 High (credibility) |
| Recruiter Experience | 7/10 | 🔴 Critical |
| Client Experience | 7/10 | 🟠 High |
| *(CSS Architecture)* | *4/10* | 🔴 Critical |
| *(Design System)* | *6/10* | 🟠 High |

**Overall: 7.4 / 10** — a strong senior-level build with three concentrated liabilities: **assets, CSS, and conversion affordances**.

---

## 28. Priority Matrix

### 🔴 Critical — do first
1. Compress `/public/media` (45 MB → target <6 MB) **before** running the Blob migration.
2. Re-encode the 9.4 MB hero reel and the three 2.5 MB service MP4s.
3. Add a **skip-to-content link** (WCAG 2.4.1 violation).
4. Add a **header CTA** ("Let's talk") — the site's biggest conversion gap.
5. Replace the in-memory rate limiter with a durable one.
6. Resolve `credentials.needsReview` ("20+ projects", "15+ clients").
7. Add outcome metrics to every case study.
8. Verify accent-on-light contrast wherever `--premium-accent` is used for text.

### 🟠 High
9. Collapse the duplicate token systems (two type scales, two spacing scales, two palettes).
10. Merge 3 process + 4 contact + 4 ecosystem stylesheets.
11. Delete the 7 dead components and `tech-badge.css`.
12. Move `src/app/css/` → `src/styles/`; reorganise `components/` into `ui / layout / sections / features / pages`.
13. Split `TechEcosystem.tsx` and give it a real mobile view.
14. Gate the `Sidebar` animation behind `useReducedMotion`; decide the Sidebar's fate.
15. Replace the 4 raw `<img>` with `SmartImage`.
16. Add `BreadcrumbList` + `Article` / `CreativeWork` JSON-LD.
17. Add testimonials / trust signals.
18. Merge the three service content modules.
19. Add a honeypot + time-to-submit check to the contact form.
20. Fix `/contact` at 768px and 1024px.
21. Capture real screenshots for the 3 placeholder projects.
22. Add a downloadable PDF resume and link it from the hero.
23. Add a CI workflow (typecheck + lint + test + e2e + `npm audit`).

### 🟡 Medium
24. Build the §7 typography system; stop styling `h1..h4` as one rule.
25. Add a Content-Security-Policy header.
26. Write down the GSAP-vs-`motion` boundary; lazy-load GSAP per route.
27. Reduce `"use client"` where only an entrance fade needs it.
28. Split `ContactForm.tsx` and `app/work/[slug]/page.tsx`.
29. Link `/pricing` from `/services`.
30. Decide Tailwind's role.
31. Rename the design-era files (`redesign-v2`, `Premium*`, `misc`, `seo-extras`).
32. Gate the grain overlay and `CustomCursor` to desktop / `full` tier.
33. Reorder the homepage per §22.

### 🟢 Low
34. Add `aria-current` to nav items.
35. Add contact details to the footer.
36. Add Twitter `creator` / `site` handles.
37. Declare HSTS explicitly.
38. Publish 2–3 real insights posts, or hide `/insights`.
39. Improve `not-found.tsx` with the three highest-value links.
40. Add `docs/decisions.md` to record design-direction history.

---

## 29. Implementation Roadmap

### Phase 0 — Assets (do this before anything else) · ~1 day
- Run `scripts/optimize-media.js` and `scripts/optimize-videos.js` over `/public/media`.
- Targets: every PNG → WebP ≤200 KB; hero reel ≤2 MB; service loops ≤500 KB.
- `npm run blob:migrate:dry`, then `npm run blob:migrate`.
- Set `NEXT_PUBLIC_BLOB_BASE_URL` locally and on Vercel; verify `isBlobConfigured`.
- Archive originals outside the repo, then delete `/public/media`.
- **Measure Lighthouse before and after.** This phase alone should move Performance from ~5 to ~8.

### Phase 1 — Foundation · ~2–3 days
- Move `src/app/css/` → `src/styles/`; reduce `globals.css` to a 2-line entry.
- Collapse the token systems: one type scale (`--fs-*`), one spacing scale, one palette (+ a scoped light variant).
- Create `styles/typography.css` from §7; style `h1..h4` individually.
- Merge process ×3, contact ×4, ecosystem ×4; split `work-detail.css` and `redesign-v2.css`.
- Delete the 7 dead components, `tech-badge.css`, and the commented import.
- Reorganise `components/` into `ui / layout / sections / features / pages`.
- Move the three hooks out of `lib/` into `hooks/`.
- **Gate: `tsc`, `eslint`, `vitest` (114), Playwright all still green.**

### Phase 2 — Core UX & Conversion · ~2–3 days
- Header CTA + mobile sticky CTA bar + skip-to-content link.
- Hero proof strip; reorder the homepage (Work above Services; CTA block before the footer).
- Add outcome metrics to `content/projects.ts`; capture the 3 missing screenshots.
- Testimonials section (content + component).
- Merge the three service modules; link `/pricing` from `/services`.
- Resolve the `needsReview` credibility figures.
- PDF resume + hero link.

### Phase 3 — Visual & Motion Polish · ~2 days
- Split `TechEcosystem` into data + SVG + detail + legend; add a real mobile view.
- Gate the `Sidebar` animation; decide the Sidebar's fate.
- Write the GSAP/`motion` boundary into `docs/`; lazy-load GSAP per route.
- Gate the grain overlay and cursor to `(pointer: fine)` + `full` tier.
- Vertical fallback for the pinned services rail ≤1024px.

### Phase 4 — Performance · ~1–2 days
- Audit the 57 `"use client"` components; convert what can be server-rendered.
- Route-level bundle analysis; verify GSAP is not in the shared chunk.
- Re-verify the documented CLS fix after the homepage reorder.
- Confirm the LCP element per route and that it is `priority`-loaded.
- Targets: **LCP < 2.0s**, **CLS < 0.05**, **INP < 200ms**.

### Phase 5 — SEO & Accessibility · ~1–2 days
- `BreadcrumbList`, `Article`, `CreativeWork` JSON-LD.
- Full heading-hierarchy pass across all routes.
- Contrast audit of every accent-on-light usage.
- `TechEcosystem` SVG accessibility (roles, names, keyboard) or a text equivalent.
- Form error announcement audit; `aria-current` on nav.
- Add a CSP header.

### Phase 6 — Hardening & Final QA · ~1–2 days
- Durable rate limiting; honeypot + time-to-submit; audit `/api/chat/lead`.
- Decide on `productionBrowserSourceMaps`; declare HSTS.
- CI workflow: typecheck · lint · vitest · playwright · `npm audit`.
- Remove `body { overflow-x: hidden }`, fix real overflow, restore only if needed.
- Playwright visual sweep at 360/390/768/1024/1440 × all routes.
- Cross-browser QA (Safari especially — `mix-blend-mode`, `100dvh`, `@property`).
- Final Lighthouse on all routes.

**Total: roughly 10–15 focused days.**

---

## 30. Exact File-by-File Action Plan

*(actual repository files only)*

| File | Action | Reason | Priority |
|---|---|---|---|
| `public/media/process/*.png` (8 files, 12 MB) | **Optimize + migrate** | 1.6–1.8 MB each; worst offender on the site | 🔴 |
| `public/media/hero/banner_v.scrub.mp4` | **Re-encode** | 9.39 MB blocks LCP | 🔴 |
| `public/media/contact/*` | **Optimize** | 7.3 MB on the highest-intent page | 🔴 |
| `public/media/service/*.mp4` (3) | **Re-encode or replace** | 2.5–2.7 MB decorative loops | 🔴 |
| `public/media/{faq,experience,under-maintain}/*.png` | **Optimize** | 2.2–2.4 MB each | 🔴 |
| `src/lib/rate-limit.ts` | **Replace** | In-memory Map is ineffective on serverless | 🔴 |
| `src/app/layout.tsx` | **Edit** | Add a skip-to-content link | 🔴 |
| `src/components/Navbar.tsx` | **Edit** | Add a persistent contact CTA; `aria-current` | 🔴 |
| `src/content/profile.ts` | **Edit** | Resolve `credentials.needsReview` figures | 🔴 |
| `src/content/projects.ts` | **Edit** | Add outcome metrics; real covers for 3 projects | 🔴 |
| `src/app/css/base/tokens.css` | **Refactor** | Two type scales, two spacing scales, two palettes | 🟠 |
| `src/app/globals.css` | **Split** | 60-line order-dependent import list | 🟠 |
| `src/app/css/**` | **Move** → `src/styles/**` | Not routable; does not belong under `app/` | 🟠 |
| `src/app/css/pages/{process,process-flow,process-cinematic}.css` | **Merge** | ~1,600 lines for one page | 🟠 |
| `src/app/css/pages/{contact,contact-premium,contact-fields}.css` + `sections/contact.css` | **Merge** | ~1,300 lines for one page | 🟠 |
| `src/app/css/sections/tech-ecosystem{,-tree,-notes,-mobile}.css` | **Merge** | 4 files for one section | 🟠 |
| `src/app/css/pages/work-detail.css` | **Split** | 1,093 lines — largest stylesheet | 🟠 |
| `src/app/css/pages/redesign-v2.css` | **Split + rename** | 185 lines styling 4 different pages | 🟠 |
| `src/app/css/pages/misc.css` | **Rename** → `case-study.css` | Its own header says so | 🟡 |
| `src/app/css/sections/seo-extras.css` | **Rename** → `content-blocks.css` | Named after a motive | 🟡 |
| `src/app/css/components/tech-badge.css` | **Delete** | No consumer | 🟠 |
| `src/components/TechnologyBadge.tsx` | **Delete** | Never imported | 🟠 |
| `src/components/pages/ArrowLink.tsx` | **Delete** | Never imported | 🟠 |
| `src/components/process/{ProcessJourney,ProcessSpine,ProcessNav,ProcessVisual,LineReveal}.tsx` | **Delete** | Reachable only from a commented import | 🟠 |
| `src/components/ProcessSection.tsx` | **Edit** | Remove the commented import (L5); `<img>` → `SmartImage` (L40) | 🟠 |
| `src/components/TechEcosystem.tsx` | **Split** | 1,589 lines; needs a real mobile view | 🟠 |
| `src/components/Sidebar.tsx` | **Refactor** | Ungated animation; redundant nav; per-route hiding | 🟠 |
| `src/components/experience/CareerTimeline.tsx` | **Edit** | `<img>` at L197 → `SmartImage` | 🟠 |
| `src/components/experience/CurrentChapter.tsx` | **Edit** | `<img>` at L68 → `SmartImage` | 🟠 |
| `src/components/maintenance.css` | **Move** → `styles/pages/` | Only component-local global CSS | 🟠 |
| `src/app/work/[slug]/page.tsx` | **Refactor** | 516 lines; add BreadcrumbList / CreativeWork JSON-LD | 🟠 |
| `src/content/{services,serviceOfferings,service-highlights}.ts` | **Merge** | Three modules, one concept | 🟠 |
| `src/components/contact/PremiumContactLayout.tsx` | **Fix** | 3→2→1 collapse at 768 / 1024 | 🟠 |
| `src/components/JsonLd.tsx` | **Extend** | Add BreadcrumbList / Article / CreativeWork | 🟠 |
| `src/app/api/chat/lead/route.ts` | **Audit** | Confirm rate-limit + validation parity with `/api/contact` | 🟠 |
| `next.config.ts` | **Edit** | Add CSP + HSTS; reconsider source maps | 🟠 |
| `src/app/css/base/touch-targets.css` | **Audit** | Verify 44×44 coverage | 🟠 |
| `src/components/ServicesHorizontalScroll.tsx` | **Edit** | Vertical fallback ≤1024px; keyboard reachability | 🟠 |
| `src/components/contact/ContactForm.tsx` | **Split** | 528 lines; verify error announcement | 🟡 |
| `src/components/contact/PremiumContactForm.tsx` | **Inline / merge** | Wrapper with no added behaviour | 🟡 |
| `src/app/css/base/base.css` | **Edit** | Split `h1..h4` into a real hierarchy; gate the grain overlay | 🟡 |
| `src/components/custom-cursor/CustomCursor.tsx` | **Gate** | `(pointer: fine)` at mount | 🟡 |
| `src/components/pages/{MagneticButton,PageHero,PageCta,PageSectionHead,Breadcrumbs}.tsx` | **Move** → `components/ui/` | Shared primitives in a page folder | 🟡 |
| `src/components/pages/{ServicesPage,WorkPage,ExperiencePage}.tsx` | **Keep, move** | Fine as page bodies; separate from primitives | 🟡 |
| `src/lib/{useHydrated,useReducedMotionSafe,useSideRevealSafe}.ts` | **Move** → `src/hooks/` | Hooks in `lib/` while `hooks/` holds one file | 🟡 |
| `e2e/*.spec.ts` | **Extend** | Add a responsive visual sweep | 🟡 |
| `src/content/**` | **Keep** | Best-designed layer in the repo | 🟢 |
| `src/lib/{media,seo,blob-server,motion-tier}.ts` | **Keep** | Well-designed and documented | 🟢 |
| `src/lib/contact/**` | **Keep** | Properly layered and tested | 🟢 |
| `src/chat/**` | **Keep** | Self-contained, guarded, tested | 🟢 |
| `src/components/SmartImage.tsx` | **Keep** | Correct defaults; use it more | 🟢 |
| `src/app/{sitemap,robots,manifest}.ts` | **Keep** | Correct and curated | 🟢 |
| *(new)* `.github/workflows/ci.yml` | **Create** | No CI exists | 🟠 |
| *(new)* `src/styles/typography.css` | **Create** | The §7 system | 🟡 |
| *(new)* `docs/decisions.md` | **Create** | Record design-era history so filenames stop carrying it | 🟢 |

---

## 31. Final Recommended Structure

```text
rabin_portfolio_2.0/
├── .github/workflows/ci.yml            # NEW: typecheck · lint · test · e2e · audit
├── docs/{vercel-blob.md, decisions.md}
├── e2e/{chat,contact,work,responsive}.spec.ts
├── public/                             # favicons + PWA logos ONLY (~50 KB)
├── scripts/{optimize-media,optimize-videos,generate-video-posters,
│            migrate-media-to-blob,ui-audit}
└── src/
    ├── app/                            # routing + metadata only
    │   ├── api/{contact,chat,chat/lead,blob/upload}/
    │   ├── (all existing routes, unchanged)
    │   ├── globals.css                 # @import tailwindcss + ../styles/index.css
    │   └── {layout,template,loading,not-found,sitemap,robots,manifest,opengraph-image}
    │
    ├── styles/                         # ~18 files, ~7,000 lines
    │   ├── index.css tokens.css base.css typography.css primitives.css
    │   ├── motion.css motion-off.css
    │   ├── components/{header,footer,sidebar,form,card,project-card,cursor,chat,logo}.css
    │   ├── sections/{hero,about,skills,tech-ecosystem,work-preview,engagement,journey}.css
    │   └── pages/{work,work-detail,process,experience,contact,insights,case-study,
    │              pricing,maintenance}.css
    │
    ├── components/
    │   ├── ui/          Btn Magnetic SmartImage Logo ProjectCover StackTechIcon
    │   │                brand-icons PageHero PageCta PageSectionHead Breadcrumbs
    │   ├── layout/      Navbar Sidebar Footer Toaster ChatLauncher CustomCursor
    │   │                ProgressSync JsonLd
    │   ├── sections/    Hero ServicesHorizontalScroll WorkSection JourneySection
    │   │                SkillsSection ProcessSection FaqSection InsightsSection
    │   │                PricingSection Testimonials(NEW)
    │   ├── features/
    │   │   ├── work/ experience/ contact/ process/ faq/ chat/ about/
    │   │   └── tech-ecosystem/  {data.ts, EcosystemSvg, NodeDetail, Legend, Mobile}
    │   └── pages/       ServicesPage WorkPage ExperiencePage MaintenancePage HomePage
    │
    ├── content/         # unchanged, minus the service-module merge
    ├── chat/            # unchanged
    ├── lib/             # seo media blob-server motion motion-tier cn sanitize
    │                    # scroll-sync animation-controller chrome-routes
    │                    # rate-limit(durable) + contact/
    ├── hooks/           # use-parallel useHydrated useReducedMotionSafe useSideRevealSafe
    ├── types/
    └── test/
```

**Not recommended:** a monorepo, a component-library package, a CMS, a state manager, or replacing `motion`/GSAP. The architecture is right — it needs consolidation, not reinvention.

---

## 32. Master TODO Checklist

**Phase 0 — Assets (highest ROI)**
```text
[ ] Run optimize-media.js over all PNGs -> WebP/AVIF <=200 KB
[ ] Re-encode hero reel 9.4 MB -> <=2 MB
[ ] Re-encode 3 service MP4s -> <=500 KB each (or replace with stills)
[ ] Optimize faq / experience / under-maintain / contact banners (2.0-2.4 MB each)
[ ] npm run blob:migrate:dry, then blob:migrate
[ ] Set NEXT_PUBLIC_BLOB_BASE_URL locally + on Vercel; verify isBlobConfigured
[ ] Archive originals outside the repo; delete /public/media
[ ] Lighthouse before/after on /, /process, /contact
```
**Phase 1 — Foundation**
```text
[ ] Move src/app/css -> src/styles
[ ] Delete the --type-* scale; rename --text-* -> --fs-*
[ ] Delete --space-1/3/5; unify on the px scale
[ ] Scope or fold the --premium-* palette
[ ] Collapse 4 font aliases -> --font-sans + --font-mono
[ ] Create styles/typography.css; style h1..h4 individually
[ ] Merge process x3 · contact x4 · tech-ecosystem x4
[ ] Split work-detail.css (1,093 lines) and redesign-v2.css
[ ] Rename misc.css -> case-study.css; seo-extras.css -> content-blocks.css
[ ] Delete TechnologyBadge, ArrowLink, 5 ProcessJourney components, tech-badge.css
[ ] Remove the commented import at ProcessSection.tsx:5
[ ] Reorganise components/ -> ui · layout · sections · features · pages
[ ] Move 3 hooks from lib/ -> hooks/; move maintenance.css -> styles/pages/
[ ] Verify: tsc · eslint · 114 vitest · 3 playwright all green
```
**Phase 2 — Core UX & Conversion**
```text
[ ] Header CTA ("Let's talk") — desktop + mobile overlay
[ ] Skip-to-content link in layout.tsx
[ ] Sticky mobile CTA bar
[ ] Hero proof strip (years · stack · case studies · location)
[ ] Reorder homepage: Work above Services; CTA block before the footer
[ ] Outcome metrics on all 9 projects
[ ] Real screenshots for the 3 ProjectCover placeholders
[ ] Testimonials section (content + component)
[ ] Resolve credentials.needsReview ("20+" / "15+")
[ ] Merge the 3 service content modules
[ ] Link /pricing from /services + per-service CTAs
[ ] Downloadable PDF resume + hero link
[ ] Decide /insights: publish 3 posts or hide from nav
```
**Phase 3 — Visual & Motion**
```text
[ ] Split TechEcosystem.tsx (1,589 lines) into data + svg + detail + legend
[ ] Real mobile view for TechEcosystem (not a scaled 1100px SVG)
[ ] Gate Sidebar animation behind useReducedMotion; decide the Sidebar's fate
[ ] Document the GSAP vs motion boundary in docs/
[ ] Lazy-load GSAP per route
[ ] Gate grain overlay + CustomCursor to (pointer: fine) / full tier
[ ] Vertical fallback for the pinned services rail <=1024px
```
**Phase 4 — Performance**
```text
[ ] Audit the 57 "use client" components; convert what can be server
[ ] Route-level bundle analysis; confirm GSAP is not in the shared chunk
[ ] Re-verify the documented CLS fix after the homepage reorder
[ ] Confirm the LCP element per route is priority-loaded
[ ] Targets: LCP < 2.0s · CLS < 0.05 · INP < 200ms
```
**Phase 5 — SEO & Accessibility**
```text
[ ] BreadcrumbList JSON-LD on all sub-routes
[ ] Article schema on insights; CreativeWork on case studies
[ ] Heading-hierarchy pass across all routes
[ ] Contrast audit of every --premium-accent text usage
[ ] TechEcosystem SVG a11y (roles, names, keyboard) or a text equivalent
[ ] Form error announcement audit (aria-live / aria-describedby)
[ ] aria-current on nav items
[ ] Content-Security-Policy header
[ ] Replace the 4 raw <img> with SmartImage (clears all ESLint warnings)
```
**Phase 6 — Hardening & QA**
```text
[ ] Durable rate limiting (Upstash / BotID) for /api/contact + /api/chat
[ ] Honeypot + time-to-submit check on the contact form
[ ] Audit /api/chat/lead for rate-limit + validation parity
[ ] Verify CONTACT_ALLOW_UNCONFIGURED can never be true in production
[ ] Decide on productionBrowserSourceMaps; declare HSTS
[ ] .github/workflows/ci.yml — typecheck · lint · test · e2e · npm audit
[ ] Remove body{overflow-x:hidden}; fix real overflow; restore only if needed
[ ] Playwright visual sweep 360/390/768/1024/1440 x all routes
[ ] Cross-browser QA (Safari: mix-blend-mode, 100dvh, @property)
[ ] Final Lighthouse on all routes
```

---

*End of audit. No source files were modified.*
