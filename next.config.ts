import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Standalone output exists for the container build (see Dockerfile), which
     copies .next/standalone and runs its server.js.

     It must NOT be set when Vercel builds the app itself: standalone makes
     Next do its own file tracing and skip .next/next-server.js.nft.json, and
     Vercel's post-build step then fails with ENOENT on that file. Vercel sets
     VERCEL=1 during the build, so the two pipelines stay out of each other's
     way. */
  output: process.env.VERCEL ? undefined : "standalone",
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
        ],
      },
    ];
  },
};

export default nextConfig;
