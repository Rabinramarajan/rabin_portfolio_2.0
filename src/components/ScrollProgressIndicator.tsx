"use client";

/**
 * Premium Scroll Progress Indicator
 *
 * Desktop: thin vertical accent line on the right edge + percentage label
 * Mobile:  thin horizontal accent line below navbar
 *
 * Uses direct DOM updates (no React state) for 60 fps performance.
 */

import { useEffect, useRef } from "react";
import { prefersReducedMotion, hasPointerFine } from "@/motion/gsap-context";

export function ScrollProgressIndicator() {
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const reduce = prefersReducedMotion();
  const isDesktop = hasPointerFine();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fill = fillRef.current;
    const label = labelRef.current;
    if (!fill) return;

    let raf: number;
    let lastPercent = -1;

    const compute = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const percent = maxScroll > 0 ? Math.min(Math.max(scrolled / maxScroll, 0), 1) : 0;
      const rounded = Math.round(percent * 100);

      if (rounded !== lastPercent) {
        lastPercent = rounded;
        fill.style.transform = `scaleY(${percent})`;
        if (label) label.textContent = `${String(rounded).padStart(2, "0")}%`;
        document.documentElement.style.setProperty("--scroll-progress", `${rounded}%`);
      }
    };

    if (reduce) {
      // Reduced motion: update synchronously on scroll, no RAF
      window.addEventListener("scroll", compute, { passive: true });
      compute();
      return () => window.removeEventListener("scroll", compute);
    }

    const tick = () => {
      compute();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.removeProperty("--scroll-progress");
    };
  }, [reduce]);

  return (
    <>
      {/* ── Desktop: vertical track on right edge ── */}
      {isDesktop ? (
        <div
          ref={trackRef}
          className="scroll-track"
          aria-hidden
        >
          <div ref={fillRef} className="scroll-track__fill" />
          <div ref={labelRef} className="scroll-track__label">00%</div>
        </div>
      ) : null}

      {/* ── Mobile / Tablet: thin horizontal bar ── */}
      {!isDesktop ? (
        <div className="scroll-bar" aria-hidden>
          <div ref={fillRef} className="scroll-bar__fill" />
        </div>
      ) : null}
    </>
  );
}
