import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Standalone output exists for the container build (see Dockerfile.vercel), which
     copies .next/standalone and runs its server.js. That container is what
     Vercel itself builds and runs: it detects Dockerfile.vercel, builds the
     OCI image, stores it in Vercel Container Registry, and serves it from a
     Vercel Function on Fluid Compute.

     The VERCEL branch below covers the other pipeline — Vercel building the
     app directly from the Next.js framework preset, with no container. That
     is not how this project deploys any more, but the branch stays as the
     escape hatch back to it.

     It must NOT be set when Vercel builds the app itself: standalone makes
     Next do its own file tracing and skip .next/next-server.js.nft.json, and
     Vercel's post-build step then fails with ENOENT on that file. Vercel sets
     VERCEL=1 during the build, so the two pipelines stay out of each other's
     way.

     DOCKER_BUILD=1 forces standalone back on. Without it the container build
     is at the mercy of whoever runs it: Vercel sets VERCEL=1 in its own build
     container, so building Dockerfile.vercel there would take the `undefined`
     branch, never emit .next/standalone, and fail the COPY in the runner
     stage. Dockerfile.vercel sets the flag, so the container build states what
     it needs rather than inferring it. */
  output: process.env.DOCKER_BUILD ? "standalone" : process.env.VERCEL ? undefined : "standalone",
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
