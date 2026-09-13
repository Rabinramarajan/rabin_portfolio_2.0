# Performance (CWV) — 75/100

## What works

- Preloaded woff2 fonts
- Hero poster with responsive imageSrcSet and fetchPriority high
- WebP throughout; loading=lazy on 10 of 17 homepage images

## Findings

### Duplicate hero image preload (Medium)

Two link rel=preload as=image tags for the same poster srcset: React auto-hoists one from ScrollVideoPlayer.tsx:217-223 and src/app/page.tsx:19-30 adds a manual one

**Recommendation:** Delete the manual preload block in src/app/page.tsx, then verify exactly one preload remains in the rendered head - revert if zero remain

### Homepage payload 291KB (Low)

Roughly 71KB inline script across 25 blocks, 19 JS chunks, 3 stylesheets; next heaviest page is 152KB

**Recommendation:** Acceptable for App Router; revisit only after field data confirms an LCP problem

### Performance not measured (Medium)

PageSpeed Insights returned HTTP 429 (anonymous quota exhausted) and no CrUX field data was available. This score is inferred from payload evidence only.

**Recommendation:** Obtain a PageSpeed API key or read Core Web Vitals from Search Console before further performance work
