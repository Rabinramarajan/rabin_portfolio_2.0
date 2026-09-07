"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary: catches failures in the root layout itself, which the
 * segment-level error.tsx cannot. It replaces the whole document, so it must
 * render its own <html>/<body> and cannot rely on the site stylesheets or
 * fonts being applied — hence the inline styling, kept to the same dark
 * palette as globals.css (--color-bg #0a0a0c) so the fallback still reads as
 * this site rather than a white browser page.
 *
 * As in error.tsx, nothing from `error` reaches the visitor.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error.digest ?? error.message);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
          background: "#0a0a0c",
          color: "#f2f1ec",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <main style={{ maxWidth: "34rem", textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#83838c",
            }}
          >
            Rabin R
          </p>
          <h1
            style={{
              margin: "1rem 0 0.75rem",
              fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
              lineHeight: 1.15,
              fontWeight: 700,
            }}
          >
            The site hit an unexpected error.
          </h1>
          <p style={{ margin: "0 0 1.75rem", color: "#9a9aa3", lineHeight: 1.6 }}>
            Reloading usually clears it. If it doesn&apos;t, email{" "}
            <a href="mailto:hello@rabinr.in" style={{ color: "#c9f24d" }}>
              hello@rabinr.in
            </a>
            .
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              cursor: "pointer",
              border: "1px solid #c9f24d",
              background: "#c9f24d",
              color: "#0a0a0c",
              borderRadius: "999px",
              padding: "0.75rem 1.75rem",
              fontSize: "0.9375rem",
              fontWeight: 600,
            }}
          >
            Reload
          </button>
        </main>
      </body>
    </html>
  );
}
