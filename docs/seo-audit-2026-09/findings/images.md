# Images — 100/100

## What works

- Zero missing alt attributes across all 30 pages
- WebP with responsive srcset, lazy loading below the fold, fetchpriority on the LCP candidate

## Findings

### Withdrawn: three images missing dimensions (Info)

Originally reported as a CLS risk on `/`, `/contact` and `/process`. On inspection all three
are absolutely-positioned fill images — the homepage hero poster is `position: absolute;
inset: 0; width/height: 100%` in `hero.css`, and the other two are Next.js `<Image fill>`
(`data-nimg="fill"`). Images out of normal flow inside a sized container cannot shift layout,
and `fill` images are specified to carry no width/height attributes.

**Recommendation:** No change needed — finding withdrawn.
