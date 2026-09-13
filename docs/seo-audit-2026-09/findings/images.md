# Images — 92/100

## What works

- Zero missing alt attributes across all 30 pages
- WebP with responsive srcset, lazy loading below the fold, fetchpriority on the LCP candidate

## Findings

### Three images missing explicit dimensions (Low)

One img each on /, /contact and /process lacks both width and height

**Recommendation:** Add width and height to prevent layout shift
