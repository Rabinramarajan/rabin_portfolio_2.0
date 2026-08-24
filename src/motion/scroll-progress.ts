/**
 * Global Scroll Progress Indicator
 * Thin progress bar at top showing scroll position
 */

import { useEffect } from "react";

const gsap = require("gsap/dist/gsap");

/**
 * useScrollProgress — Animate a progress indicator based on scroll
 * Place a thin element with data-motion="scroll-progress" in layout
 */
export function useScrollProgress(selectorOrRef?: string | React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const selector = typeof selectorOrRef === "string" ? selectorOrRef : "[data-motion='scroll-progress']";
    const progressBar = document.querySelector(selector);

    if (!progressBar) return;

    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const scrollPercent = (scrolled / documentHeight) * 100;

      gsap.to(progressBar, {
        width: `${scrollPercent}%`,
        duration: 0.3,
        ease: "power1.out",
      });
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress(); // Initial

    return () => {
      window.removeEventListener("scroll", updateProgress);
    };
  }, [selectorOrRef]);
}

/**
 * useScrollColor — Transition background color based on scroll
 * Useful for sections with scroll-linked color changes
 */
export function useScrollColor(
  triggerSelector: string,
  colors: string[],
  options?: { duration?: string; scrub?: number }
) {
  const { duration = "100vh", scrub = 0.6 } = options || {};

  useEffect(() => {
    if (typeof window === "undefined") return;

    const trigger = document.querySelector(triggerSelector);
    if (!trigger) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: "top center",
        end: duration,
        scrub,
        markers: false,
      },
    });

    // Animate through colors
    colors.forEach((color, index) => {
      if (index === 0) {
        tl.to(trigger, { backgroundColor: color, duration: 0 }, 0);
      } else {
        tl.to(trigger, { backgroundColor: color, duration: 1 });
      }
    });

    return () => {
      tl.scrollTrigger?.kill();
    };
  }, [triggerSelector, colors, duration, scrub]);
}
