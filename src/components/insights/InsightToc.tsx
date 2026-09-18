"use client";

import { useEffect, useState } from "react";
import type { InsightSection } from "@/lib/insightSections";

/**
 * The contents rail, and the thin progress line across the top of the page.
 *
 * A client component because both are answers to "where am I" that only the
 * scroll position can give. Everything it renders is already in the server
 * HTML as a plain anchor list, so a reader without JavaScript gets working
 * in-page navigation and simply does not get the active mark.
 *
 * Active section is tracked with an IntersectionObserver rather than a scroll
 * handler: the observer fires only when a heading crosses the band, so there
 * is no per-frame work on a page whose whole job is to be read for six
 * minutes. The band is offset by the fixed header so the heading that reads
 * as current is the one just under the nav, not the one at the viewport's
 * geometric top.
 */
export function InsightToc({ sections }: { sections: InsightSection[] }) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (sections.length === 0) return;

    const headings = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    /* The current section is the last heading to have passed under the nav —
       not whichever heading happens to be on screen. Those differ for most of
       a long section, where the heading is far above the viewport and the
       reader is still inside it, and reading the intersecting entries alone
       would leave the mark stuck on the section before.

       The observer is only the trigger: it fires when a heading crosses the
       line, and the answer is then recomputed from all of them. Between two
       crossings the answer cannot change, so there is nothing to do and
       nothing runs. */
    const line = 96;
    const sync = () => {
      let current = headings[0]?.id ?? "";
      for (const el of headings) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
        else break;
      }
      setActive(current);
    };

    const observer = new IntersectionObserver(sync, {
      rootMargin: `-${line}px 0px 0px 0px`,
      threshold: 0,
    });

    for (const el of headings) observer.observe(el);
    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);
    };
    const onScroll = () => {
      /* Coalesced to one write per frame; the raw scroll event fires far more
         often than the bar can visibly change. */
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div
        className="insd-progress"
        role="progressbar"
        aria-label="Reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <span className="insd-progress__bar" style={{ scale: `${progress} 1` }} />
      </div>

      {sections.length ? (
        <nav className="insd-panel insd-toc" aria-labelledby="insd-toc-title">
          <p className="insd-panel__title" id="insd-toc-title">
            <ContentsIcon />
            Table of Contents
          </p>
          <ol className="insd-toc__list" data-plain={sections[0]?.number ? undefined : "true"}>
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  className="insd-toc__link"
                  href={`#${s.id}`}
                  aria-current={active === s.id ? "true" : undefined}
                >
                  {s.number ? (
                    <span className="insd-toc__no" aria-hidden>
                      {s.number}
                    </span>
                  ) : null}
                  <span className="insd-toc__dot" aria-hidden />
                  <span className="insd-toc__text">{s.text}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
    </>
  );
}

function ContentsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden focusable="false">
      <path
        d="M8 6h12M8 12h12M8 18h12M3.5 6h.01M3.5 12h.01M3.5 18h.01"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
