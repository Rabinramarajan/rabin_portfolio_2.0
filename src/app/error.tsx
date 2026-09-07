"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Route-segment error boundary.
 *
 * Reuses the `.not-found` layout so a failure looks like part of the site
 * rather than a browser default. Nothing from `error` is rendered: the digest
 * is logged for correlation with server logs, but the visitor never sees a
 * message, a stack, or a file path.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[route-error]", error.digest ?? error.message);
  }, [error]);

  return (
    <section className="not-found">
      <p className="mono faint">ERROR</p>
      <h1 className="sec-title">That section didn&apos;t load.</h1>
      <p className="sec-lede">
        Something broke on my side, not yours. Try again — and if it keeps
        happening, tell me and I&apos;ll fix it.
      </p>
      <nav aria-label="Suggested pages" className="nf-links">
        <ul>
          <li>
            <Link href="/work">Selected work</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
      <button className="btn btn--solid" type="button" onClick={reset}>
        <span className="btn__label">Try again</span>
      </button>
    </section>
  );
}
