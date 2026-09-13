# Schema / Structured Data — 92/100

## What works

- All JSON-LD parses without error
- Person, WebSite, ProfessionalService sitewide plus BreadcrumbList, Service, CreativeWork, BlogPosting, ProfilePage, ItemList, Blog

## Findings

### FAQPage on homepage inconsistent with documented service-page decision (Info)

JsonLd.tsx:192 emits FAQPage while ServiceNarrative.tsx documents deliberately omitting it. Google retired FAQ rich results for all sites on 2026-05-07.

**Recommendation:** No removal needed - it earns nothing but costs nothing. Reconcile the two decisions deliberately.
