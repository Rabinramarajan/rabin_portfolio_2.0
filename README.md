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

## Contact form setup (SMTP)

The Worker delivers contact messages to `rabinr.dev@gmail.com` through your own mailbox's SMTP server
(`worker-mailer`, TLS). Host, port and addresses are vars in `wrangler.jsonc`; credentials are secrets:

```bash
npx wrangler secret put SMTP_USER       # e.g. hello@rabinr.in
npx wrangler secret put SMTP_PASSWORD   # for Zoho with 2FA: an application-specific password
```

`CONTACT_FROM_EMAIL` must be the mailbox `SMTP_USER` signs in as (or an alias it may send from).
Zoho custom-domain mailboxes use `smtppro.zoho.in` (India data centre). Port 465 uses TLS; 587 uses STARTTLS.
Locally, `.dev.vars` sets `CONTACT_DRY_RUN=true`, so `wrangler dev` logs messages instead of sending them.

## Brand

The logo is the glossy R monogram (`public/brand/logo-mark.png`, 1024px, transparent). Sizes are derived from it:
`images/logo.webp` (header/footer), `logo-192.png` / `logo-512.png` (manifest), `apple-touch-icon.png`,
`favicon.ico` (16/32/48), `brand/logo-horizontal.png` (lockup) and `brand/og-image.png` (social preview).
