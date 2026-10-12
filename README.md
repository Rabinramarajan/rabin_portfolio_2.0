# Rabin R — Portfolio

Angular 22 portfolio for [rabinr.in](https://rabinr.in): standalone components, Signals, zoneless change
detection, Signal Forms, GSAP + ScrollTrigger, and every route prerendered to static HTML. Hosted on
Cloudflare (static assets + one Worker for the contact form).

## Commands

| Command | What it does |
|---|---|
| `npm start` | Dev server at `http://localhost:4200` (no Worker, so the contact form cannot send) |
| `npm run build` | Production build + prerender (40 routes), then `scripts/postbuild.mjs` writes `404.html` and `sitemap.xml` |
| `npm run preview` | Build, then serve the real Worker + assets with `wrangler dev` at `http://localhost:8787` |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright smoke tests against `wrangler dev` (routes, 404, overflow at 320–1440px, menu, filters, keyboard, form, reduced motion) |
| `npm run typecheck` | Strict type check of the app and the Worker |
| `npm run deploy` | Build and upload a **preview version** (`wrangler versions upload`) — production is untouched |
| `npm run deploy:production` | Build and deploy to production. Only after the preview is approved |

## Layout

```text
src/app/
  core/        seo (meta, canonical, JSON-LD), motion (useGsap), contact (shared rules + HTTP service)
  data/        all site content, typed (ported from the previous site — edit copy here)
  shared/      button, icon, logo, section-heading, sticky-note, software-window, project-card,
               form-control, social-links, skill-badge, scroll-progress, reveal directive
  layout/      header, footer
  features/    home, about, experience, services, projects, skills, process, insights, faq,
               contact, pricing, resume, legal, not-found
worker/        Cloudflare Worker: POST /api/contact, host-aware /robots.txt
public/        media, self-hosted fonts, brand assets, _redirects, robots.txt
```

## Contact form setup (Cloudflare)

The Worker sends mail with the Email Service `send_email` binding, restricted to `rabinr.dev@gmail.com`.
Before the first deploy:

1. Onboard the sender domain: `npx wrangler email sending enable rabinr.in`.
2. `CONTACT_FROM_EMAIL` in `wrangler.jsonc` must be an address on that domain.
3. After changing bindings, run `npx wrangler types worker/worker-configuration.d.ts`.

Locally, `wrangler dev` simulates delivery; nothing is sent.

## Brand

`public/images/logo.webp` and `public/logo-*.png` are the approved raster logo and are what the site uses.
`public/brand/*.svg` is a hand-built vector recreation **pending approval**; the favicon SVG is the monogram
only so it stays legible at 16–32px.

## SEO and agent discovery

- Canonical domain: `https://rabinr.in` (set in `src/app/data/profile.ts` and `scripts/postbuild.mjs`).
  `www.rabinr.in` should 301 to it (Cloudflare redirect rule).
- `robots.txt` (`public/`): everything allowed except `/api/`, with
  `Content-Signal: search=yes, ai-input=yes, ai-train=yes`. Non-canonical hosts get `Disallow: /` from the Worker.
- Built by `scripts/postbuild.mjs` from the prerendered pages: `sitemap.xml`, `llms.txt`, and a Markdown twin
  of every page (`/work/index.md`). The Worker serves the twin on the page URL for `Accept: text/markdown`.
- Every HTML page carries `Link` headers (sitemap, llms.txt, API catalog, Markdown alternate) and `Vary: Accept`.
- `/.well-known/api-catalog` (RFC 9727) points to `public/openapi.json`, the description of `/api/contact`.
- The contact form registers a WebMCP tool, `draft_contact_message`, for in-browser agents. It only fills the form;
  the visitor still presses Send.
- Local audits: `.dev.vars` (git-ignored) sets `LOCAL_INDEXABLE=true` so `wrangler dev` serves the real robots.txt.
