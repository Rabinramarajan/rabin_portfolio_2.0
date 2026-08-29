"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * One numbered chapter of a case study.
 *
 * The same markup answers two very different shapes. From the tablet
 * breakpoint up it is a two-column editorial spread — the numbered heading and
 * its lede on the left, the evidence on the right — and everything is visible
 * at once. Below that breakpoint the page has no room for a spread, so each
 * chapter becomes a row in an accordion and only the heading stays on screen.
 *
 * The collapsing is done in CSS, keyed off `is-open`: at desktop widths the
 * body is displayed regardless of state, so a chapter the reader happened to
 * collapse on a phone is not still collapsed when the layout widens, and the
 * toggle itself is removed from the accessibility tree there rather than
 * offering a control that would do nothing.
 */
export function CaseChapter({
  id,
  no,
  label,
  title,
  lede,
  link,
  icon,
  children,
}: {
  id: string;
  no: string;
  label: string;
  title: string;
  lede?: string;
  link?: { href: string; text: string };
  /**
   * The chapter's mark, passed as an element rather than a component: this is
   * a client boundary, and a function prop cannot cross one.
   */
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const bodyId = useId();

  return (
    <section className={cn("wd__sec", open && "is-open")} id={id} aria-labelledby={`${id}-title`}>
      <div className="wd__sec-head">
        <p className="wd__eyebrow">
          <span className="wd__eyebrow-icon">{icon}</span>
          <span className="wd__eyebrow-no">{no}</span>
          <span className="wd__eyebrow-slash" aria-hidden>
            /
          </span>
          <span className="wd__eyebrow-label">{label}</span>
        </p>

        <h2 className="wd__sec-title" id={`${id}-title`}>
          {title}
        </h2>

        <div className="wd__sec-aside">
          {lede ? <p className="wd__sec-lede">{lede}</p> : null}
          {link ? (
            <a className="wd__arrowlink" href={link.href}>
              {link.text}
              <svg viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
                <path d="M1 6h17M13.5 1.5 18 6l-4.5 4.5" />
              </svg>
            </a>
          ) : null}
        </div>

        <button
          type="button"
          className="wd__sec-toggle"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? `Hide ${label}` : `Show ${label}`}</span>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M8 3v10" className="wd__sec-toggle-bar" />
            <path d="M3 8h10" />
          </svg>
        </button>
      </div>

      <div className="wd__sec-body" id={bodyId}>
        {children}
      </div>
    </section>
  );
}
