import Link from "next/link";
import type { Metadata } from "next";

/**
 * Next already emits `noindex` for the not-found route and the response still
 * carries a 404 status, so this only names the page — repeating the robots
 * directive here would render a second, conflicting meta tag.
 */
export const metadata: Metadata = {
  title: "Page not found",
};

const LINKS = [
  { href: "/work", label: "Selected work" },
  { href: "/services", label: "Services" },
  { href: "/experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <section className="not-found">
      <p className="mono faint">404</p>
      <h1 className="sec-title">Looks like this route went off the grid.</h1>
      <p className="sec-lede">This page doesn&apos;t exist. These do:</p>
      <nav aria-label="Suggested pages" className="nf-links">
        <ul>
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <Link className="btn btn--solid" href="/">
        <span className="btn__label">Back to Home</span>
      </Link>
    </section>
  );
}
