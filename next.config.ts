import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  images: {
    formats: ["image/avif", "image/webp"],
    /* Production media is served from Vercel Blob. Optimization stays ON —
       next/image fetches from the Blob CDN and re-encodes to AVIF/WebP at the
       requested width. */
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com", pathname: "/**" },
    ],
    /* Matched to the layouts actually shipped: small/large phones, tablets,
       14" and 16" laptops, and large desktop monitors at 1x and 2x. */
    deviceSizes: [360, 420, 640, 750, 828, 1080, 1200, 1512, 1920, 2560, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    /* 75 is the default and covers photography. The insight diagrams carry
       small UI text and thin 1px rules, which are exactly what a lossy encoder
       smears first, so those are requested at 90. Next 16 requires every
       quality the app asks for to be listed here. */
    qualities: [75, 90],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  async redirects() {
    return [
      // Old indexed URLs — content now lives at /work.
      { source: "/projects", destination: "/work", permanent: true },
      { source: "/case-studies", destination: "/work", permanent: true },
      { source: "/case-studies/:slug", destination: "/work/:slug", permanent: true },
      // Service URLs renamed to match what each page is actually about.
      { source: "/services/web-application-development", destination: "/services/frontend-architecture", permanent: true },
      { source: "/services/mobile-app-development", destination: "/services/ionic-development", permanent: true },
      /* Insight slugs rewritten to what the article is about rather than to
         its headline. The headline still rides in the <h1>. */
      { source: "/insights/signals", destination: "/insights/angular-signals-state-management", permanent: true },
      { source: "/insights/vitals", destination: "/insights/angular-performance-core-web-vitals", permanent: true },
      { source: "/insights/quiet-ui", destination: "/insights/enterprise-ui-design-restraint", permanent: true },
      { source: "/insights/zoneless-migration", destination: "/insights/angular-zoneless-change-detection", permanent: true },
      { source: "/insights/offline-first", destination: "/insights/ionic-offline-first-architecture", permanent: true },
      { source: "/insights/consequential-forms", destination: "/insights/accessible-angular-forms", permanent: true },
      { source: "/insights/inheriting-angular", destination: "/insights/angular-codebase-audit", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          /* HSTS. Safe to send unconditionally here: rabinr.in is HTTPS-only
             on Vercel and there is no plaintext host to lock out. Two years
             with subdomains, which is what the preload list requires — submit
             at hstspreload.org once this has been live for a release or two.
             Note this header is a no-op over plain HTTP by spec, so it costs
             nothing in local development. */
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          /* CSP, deliberately Report-Only for now.
             Enforcing this today would break the site: Next.js inlines the RSC
             flight payload and its bootstrap as inline <script>, so a policy
             without 'unsafe-inline' blocks the app from starting, and
             'unsafe-inline' in an *enforced* policy buys little over having no
             policy at all. Doing it properly means per-request nonces, which
             needs middleware and makes every page dynamic — a real cost for a
             personal site with no user-generated content and no auth.
             Report-Only gets the violation data at zero risk. Violations appear
             in the browser console; add a `report-to` endpoint if that becomes
             worth wiring up. Promote to `Content-Security-Policy` only after a
             nonce strategy is in place and the console is quiet. */
          {
            key: "Content-Security-Policy-Report-Only",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://cdn.cookiescript.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://www.googletagmanager.com",
              "media-src 'self' https://*.public.blob.vercel-storage.com",
              "font-src 'self' data:",
              "connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://*.public.blob.vercel-storage.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
