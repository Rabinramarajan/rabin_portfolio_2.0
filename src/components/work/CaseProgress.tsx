"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export interface CaseSection {
  id: string;
  label: string;
}

/**
 * The case-study progress rail.
 *
 * A sticky index of the sections that actually rendered — the page passes in
 * the list it built, so a project with no gallery never advertises a gallery
 * step. Position comes from an IntersectionObserver rather than a scroll
 * handler, so it costs nothing per frame, and the whole rail collapses to a
 * single "03 / 06" counter below the desktop breakpoint (CSS), keeping mobile
 * free of a navigation column it has no room for.
 *
 * It is a real `<nav>` of in-page links: keyboard and screen-reader users get
 * the same jump targets the rail offers visually.
 */
export function CaseProgress({ sections }: { sections: CaseSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => !!n);
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      // A band across the upper third: the section being read, not the one
      // merely touching the viewport edge.
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [sections]);

  const at = Math.max(0, sections.findIndex((s) => s.id === active));

  return (
    <nav className="cprog" aria-label="Case study sections">
      <p className="cprog__counter" aria-hidden>
        {String(at + 1).padStart(2, "0")}
        <span> / {String(sections.length).padStart(2, "0")}</span>
      </p>
      <ol className="cprog__list">
        {sections.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={cn("cprog__link", s.id === active && "is-on")}
              aria-current={s.id === active ? "true" : undefined}
            >
              <span className="cprog__no">{String(i + 1).padStart(2, "0")}</span>
              <span className="cprog__label">{s.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
