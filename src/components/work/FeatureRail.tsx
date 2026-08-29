"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SmartImage } from "@/components/SmartImage";
import { cn } from "@/lib/cn";
import type { ProjectFeature } from "@/content/types";

/**
 * The key-feature rail.
 *
 * A plain overflow-scrolling list with scroll snapping, so the primary way to
 * move it is the one every platform already gives the reader: a trackpad
 * swipe, a touch drag, or the keyboard once a card takes focus. The arrows are
 * an addition on top of that, not the mechanism — they are hidden outright
 * when everything already fits, and each one disables itself at its end of the
 * track rather than staying lit and doing nothing.
 */
export function FeatureRail({ features }: { features: ProjectFeature[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [at, setAt] = useState({ start: true, end: true });

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAt({ start: el.scrollLeft <= 4, end: el.scrollLeft >= max - 4 });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [measure]);

  const step = (delta: number) => {
    const el = trackRef.current;
    if (!el) return;
    // One card plus its gap, so a press always lands on a snap point.
    const card = el.querySelector<HTMLElement>(".wd__feat");
    const by = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: by * delta, behavior: "smooth" });
  };

  const fits = at.start && at.end;

  return (
    <div className="wd__rail">
      <ul className="wd__rail-track" ref={trackRef}>
        {features.map((f) => (
          <li className={cn("wd__feat", !f.image && "wd__feat--plain")} key={f.title}>
            {f.image ? (
              <span className="wd__feat-shot">
                <SmartImage
                  src={f.image.src}
                  alt=""
                  width={f.image.width}
                  height={f.image.height}
                  sizes="(min-width: 900px) 24vw, 70vw"
                />
              </span>
            ) : null}
            <p className="wd__feat-title">{f.title}</p>
            {f.description ? <p className="wd__feat-body">{f.description}</p> : null}
          </li>
        ))}
      </ul>

      {fits ? null : (
        <div className="wd__rail-nav">
          <button
            type="button"
            className={cn("wd__rail-btn", at.start && "is-off")}
            onClick={() => step(-1)}
            disabled={at.start}
            aria-label="Previous features"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M10 3.5 5.5 8l4.5 4.5" />
            </svg>
          </button>
          <button
            type="button"
            className={cn("wd__rail-btn", at.end && "is-off")}
            onClick={() => step(1)}
            disabled={at.end}
            aria-label="Next features"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M6 3.5 10.5 8 6 12.5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
