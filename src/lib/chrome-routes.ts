/**
 * Routes that render as a standalone full-screen experience and therefore
 * suppress the site chrome (navbar, footer, chat launcher). The maintenance
 * screen carries its own header and footer; showing the global ones on top of
 * it would duplicate the brand and offer navigation to a site that is, by
 * definition, not currently available.
 */
const STANDALONE_ROUTES = ["/maintenance"];

export function isStandaloneRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return STANDALONE_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
}
