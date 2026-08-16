# Performance Report — Rabin Portfolio

> Status: baseline template. Fill in measured numbers from the methodology below
> after each performance work item. Targets: **Lighthouse ≥ 95**, **60 fps
> desktop**, **30 fps+ mobile**, **no layout shift from images**.

## 1. Targets

| Metric | Target | Measured | Notes |
| --- | --- | --- | --- |
| Lighthouse Performance | ≥ 95 | — | desktop + mobile emulation |
| LCP | < 2.0 s | — | Next-image `priority` already on About/Hero/LCP covers |
| CLS | < 0.05 | — | tone placeholders reserve image box |
| INP | < 200 ms | — | rAF-driven, transform/opacity-only animation |
| FPS desktop | 60 | — | DevFps HUD during scroll |
| FPS mobile | ≥ 30 | — | DevFps HUD at 1× scroll velocity |
| Animation JS bundle | < 60 kB gzip | — | `motion` is the only animation dep |

## 2. Progressive motion tiers

Implemented in `src/lib/motion-tier.ts`:

| Tier | Selection | Behaviour |
| --- | --- | --- |
| base | no JS (SSR output) | static, complete, readable |
| basic | reduced-motion / ≤2 GB RAM / ≤4 cores | fades, short durations, no parallax/continuous/hover motion |
| full | capable device, no reduced-motion pref | all layers: parallax, stagger, count-up, hover spring |

- Preference persisted in `localStorage` (`rr-motion-tier`) via the footer
  **Motion: Auto/Reduced/Full** toggle.
- Tier re-evaluates live when the OS reduced-motion setting flips.
- All primitives consume `useMotionTier()` and collapse to fade-only via a
  `quiet` flag — see `src/components/motion.tsx`, `src/components/parallel.tsx`,
  `src/hooks/use-parallel.ts`, `src/components/Hero.tsx`.

## 3. Lazy loading & progressive enhancement

- `src/components/SmartImage.tsx` wraps `next/image` with:
  - `loading="lazy"` + `decoding="async"` by default;
  - a data-URI SVG **tone placeholder** (aspect-accurate) so the box is painted
    before the network responds → zero layout shift + blur-up fade;
  - `priority` images keep preload and skip lazy.
- Swapped into: Hero portrait, About portrait, WorkSection covers, WorkPage
  covers. Remaining `next/image` uses (`contact`, services, case-study covers)
  already lazy; consider SmartImage for those if report shows LCP/CLS movement.
- Static export + `images.formats: ["avif", "webp"]` (see `next.config.ts`).

## 4. Reduced motion & memory management

- `prefers-reduced-motion` honoured everywhere via `useReducedMotion()` plus the
  persisted tier (covers users who set the OS once and the site remembers).
- `src/lib/animation-controller.ts`:
  - single shared `IntersectionObserver` (no observer-per-section);
  - one rAF loop, paused on `visibilitychange` → no battery burn in background
    tabs, callbacks can't pile up;
  - detached elements are released when targets leave the DOM;
  - `completeDelay` + `once` unobserves finished sections.
- `DevFps` (dev only) also pauses its counter on tab hide.

## 5. Rendering budget

- Animation touches **transform / opacity / clip-path only** (compositor).
- CSS containment scopes invalidation: `.sdance`, `.plx`, `.work-item`,
  `.image-reveal` → `contain: layout style paint`; `.hpar` keeps `paint`
  off (hover box-shadow must not clip).
- `will-change` sparingly on continuously-transforming layers only
  (`.work-item`, `.image-reveal`, `.magnetic`, `.plx__layer`).

## 6. Benchmark methodology

Run on a mid-range device (the tier floor: ≤4 cores, ≤2 GB) **and** a flagship.

1. `npm run dev`, open DevTools Performance, start recording, scroll the full
   homepage at constant velocity, stop.
2. Record main-thread time (%), longest task, and dropped frames (fps < 30).
3. Repeat with the footer toggle set to **Reduced**, then **Full**.
4. Lighthouse on production build (`npm run build && npm run start`) in a
   clean incognito profile, no throttle emulation for the first pass.
5. Record LCP element candidates, CLS origin, and the animation bundle weight
   (`next build` output / browser network panel, gzip).

## 7. Regression checklist

- [ ] `npx tsc --noEmit` clean
- [ ] `npx eslint .` clean
- [ ] `npm run build` green
- [ ] Toggle Auto → Reduced → Full persists across reload
- [ ] OS reduced-motion on → tier flips to `basic` without reload
- [ ] No image layout shift at any viewport
- [ ] Background tab: `DevFps` counter pauses (visibilitychange)