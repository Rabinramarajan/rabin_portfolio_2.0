"use client";

import { useCallback, useEffect, useState } from "react";
import { experienceSections } from "@/content/experience";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/**
 * Desktop side index — a thin rule with six labels, not a pill bar.
 *
 * Real buttons, so it is keyboard reachable and announces the active section
 * through aria-current. Hidden below 1180px, where the page has no room for a
 * gutter and the sections are short enough to scroll.
 */

const HEADER_OFFSET = 96;

export function ExperienceNav() {
  const reduce = useReducedMotionSafe();
  const [active, setActive] = useState<string>(experienceSections[0].id);

  useEffect(() => {
    const targets = experienceSections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length) return;

    /*
     * Sections vary enormously in height — the expansion section is several
     * viewports tall, the closing statement is a fraction of one — so raw
     * intersectionRatio is not comparable between them: it is a fraction of
     * the section, and a tall section can never score highly. Coverage is
     * normalised against the smaller of the reading band and the section, and
     * every section's latest value is retained, because a section that has
     * finished crossing its thresholds stops sending entries.
     */
    const coverage = new Map<string, number>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const band = entry.rootBounds?.height ?? window.innerHeight;
          const reference = Math.min(band, entry.boundingClientRect.height || 1) || 1;
          coverage.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRect.height / reference : 0,
          );
        }

        let best = "";
        let bestScore = 0;
        for (const [id, score] of coverage) {
          if (score > bestScore) {
            bestScore = score;
            best = id;
          }
        }
        if (best) setActive(best);
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: "-20% 0px -50% 0px",
      },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  const goTo = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      window.scrollTo({
        top: window.scrollY + el.getBoundingClientRect().top - HEADER_OFFSET,
        behavior: reduce ? "auto" : "smooth",
      });
    },
    [reduce],
  );

  return (
    <nav className="xnav" aria-label="Experience sections">
      <ol className="xnav__list">
        {experienceSections.map((section) => (
          <li key={section.id}>
            <button
              type="button"
              className="xnav__item"
              data-state={active === section.id ? "now" : "off"}
              aria-current={active === section.id ? "true" : undefined}
              onClick={() => goTo(section.id)}
            >
              <span className="xnav__tick" aria-hidden />
              <span className="xnav__label">{section.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
