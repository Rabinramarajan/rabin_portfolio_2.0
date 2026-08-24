import { NextResponse, type NextRequest } from "next/server";

/**
 * MAINTENANCE MODE — single on/off switch for the whole site.
 *
 *   MAINTENANCE_MODE=true    every page serves the maintenance screen
 *   MAINTENANCE_MODE=false   normal site; /maintenance is hidden (404)
 *
 * The flag is read per request rather than at build time, so flipping it on
 * the host (e.g. `vercel env add MAINTENANCE_MODE`) takes effect on redeploy
 * without a code change.
 *
 * When on, the maintenance screen is *rewritten* in place — the visitor keeps
 * the URL they asked for, and the response carries 503 + Retry-After so
 * crawlers treat the outage as temporary and don't drop the pages from the
 * index.
 *
 * `/api/*`, Next internals and static files are deliberately untouched: the
 * maintenance page itself needs its image and fonts to load, and API routes
 * should fail on their own terms rather than return HTML.
 */

const MAINTENANCE_PATH = "/maintenance";

/** How long crawlers should wait before re-checking, in seconds (1 hour). */
const RETRY_AFTER = "3600";

export function isMaintenanceMode(): boolean {
  return process.env.MAINTENANCE_MODE === "true";
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isMaintenanceMode()) {
    // Already on the maintenance screen — rewrite it onto itself so the 503
    // status is attached here too, rather than serving a plain 200.
    if (pathname === MAINTENANCE_PATH) {
      return NextResponse.rewrite(request.nextUrl, {
        status: 503,
        headers: { "Retry-After": RETRY_AFTER, "Cache-Control": "no-store" },
      });
    }

    const url = request.nextUrl.clone();
    url.pathname = MAINTENANCE_PATH;
    url.search = "";

    return NextResponse.rewrite(url, {
      status: 503,
      headers: {
        "Retry-After": RETRY_AFTER,
        "Cache-Control": "no-store",
      },
    });
  }

  // Flag off: the maintenance screen must not be reachable, or search engines
  // will index a "we're down" page for a site that is perfectly up.
  if (pathname === MAINTENANCE_PATH) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = search;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /* Everything except API routes, Next internals, and files with an
       extension (images, fonts, robots.txt, sitemap.xml, …). */
    "/((?!api|_next/static|_next/image|.*\\.[^/]+$).*)",
  ],
};
