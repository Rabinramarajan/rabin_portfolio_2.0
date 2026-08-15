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

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { threshold: [0.12, 0.4], rootMargin: "-20% 0px -50% 0px" },
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
