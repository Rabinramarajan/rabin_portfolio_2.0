# Technical SEO — 90/100

## What works

- All 30 URLs return 200 with self-referencing canonicals
- robots.txt correct with Host and Sitemap directives
- HSTS includeSubDomains preload, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy
- 404 returns proper status; /version and /maintenance correctly noindex and excluded from sitemap

## Findings

### Two-hop redirect chain on apex domain (Medium)

http://rabinr.in -> https://rabinr.in -> https://www.rabinr.in, two 308 hops

**Recommendation:** Redirect http://rabinr.in directly to https://www.rabinr.in at the Vercel domain layer

### Sitewide footer link to noindex page (Low)

/version is linked on 29 of 30 pages but is noindex, follow

**Recommendation:** Remove from footer or add rel=nofollow

### No Content-Security-Policy header (Low)

Five other security headers are set; CSP is absent

**Recommendation:** Add a CSP header to complete the security header set
