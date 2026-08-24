# Baseline — measured before the SEO/performance pass

Method: `next build` (Next.js 16.3.0, React 19.2.8) + `next start` on port 3999,
resources enumerated from the served HTML and fetched individually. Sizes are
**uncompressed transfer** unless noted. No Lighthouse/CrUX run — Chrome and
`ffmpeg` are not available in this environment, so field Core Web Vitals
(LCP/INP/CLS/TTFB/FCP/TBT/Speed Index) are **not** part of this baseline.

## Rendering mode

All 47 routes prerender at build time (`○ Static` / `● SSG`) except the three
`/api/*` handlers — and, before this pass, `/contact`, which was `ƒ Dynamic`
because the page read `searchParams` for `?intent=`.

## Per-page weight

| Route | JS | CSS | HTML |
|---|---|---|---|
| `/` | 1428 KB | 234 KB | 236 KB |
| `/services` | 1031 KB | 234 KB | 102 KB |
| `/work` | 935 KB | 234 KB | 74 KB |
| `/contact` | 1246 KB | 248 KB | 82 KB |

## Build totals

- JS emitted: 1637 KB across 33 chunks; largest single chunk 321 KB.
- CSS: one 227 KB chunk (`globals.css`, 267 KB of source) loaded on every route.
  Served compressed at ~39 KB with `Cache-Control: public, max-age=31536000, immutable`.
- `public/media`: 61 MB. Six `.mp4` files are 2.5–2.8 MB each; several 2 MB+
  `.png` files sit beside `.webp` siblings that are the ones actually referenced.

## Structured data (before)

The full JSON-LD graph — including `FAQPage` (9 questions) and a 9-item work
`ItemList` — was emitted from the root layout onto **every** route.

## Console

`TypeError: gsap.to is not a function`, thrown on every page load by the hero,
work, process and contact motion enhancers.
