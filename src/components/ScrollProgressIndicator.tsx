"use client";

/**
 * Scroll Progress Indicator
 * Global progress bar showing scroll position
 * Uses CSS transitions instead of GSAP for simplicity
 */

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/motion/gsap-context";

export function ScrollProgressIndicator() {
  const barRef = useRef<HTMLDivElement>(null);
  const reduce = prefersReducedMotion();

  useEffect(() => {
    if (reduce || typeof window === "undefined") return;

    const bar = barRef.current;
    if (!bar) return;

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const scrollPercent = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;

      // Update width via style (CSS transition handles animation)
      bar.style.width = `${scrollPercent}%`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial update

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [reduce]);

  return (
    <div
      ref={barRef}
      data-motion="scroll-progress"
      aria-label="Scroll progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}
