import { headers } from "next/headers";
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/profile";

const CANONICAL_HOST = new URL(SITE_URL).host;

/**
 * The site answers on more than one hostname — the canonical domain plus the
 * *.vercel.app deployment URLs. Those alternates serve byte-identical HTML, so
 * an open robots.txt invites crawlers to index a second copy of every page and
 * split the signals that should accrue to one. Canonical tags alone are a hint,
 * not a directive; refusing the crawl on non-canonical hosts is the directive.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host");
  const isCanonicalHost = host === null || host === CANONICAL_HOST;

  if (!isCanonicalHost) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // API routes are transport, not content — nothing indexable lives there.
        disallow: ["/api/"],
      },
    ],
    sitemap: SITE_URL + "/sitemap.xml",
    host: SITE_URL,
  };
}
