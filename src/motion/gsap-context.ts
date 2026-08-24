/**
 * GSAP Context & Initialization
 * Safe browser-only initialization with automatic cleanup on route change or component unmount.
 */

import { useEffect, useRef } from "react";

interface GSAPContextOptions {
  selector?: string;
  once?: boolean;
  onCleanup?: () => void;
}

/**
 * useGSAPContext — React hook for managing GSAP animations with automatic cleanup.
 * Wraps animations in gsap.context() to prevent memory leaks and handle route changes.
 *
 * Usage:
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * useGSAPContext(ref, (ctx) => {
 *   // GSAP animations here — automatically scoped to ref element
 *   gsap.to(".item", { duration: 1, opacity: 1 });
 * });
 * ```
 */
export function useGSAPContext(
  ref: React.RefObject<HTMLElement>,
  setupFn: (ctx: any) => void,
  options?: GSAPContextOptions
) {
  const contextRef = useRef<any>(null);

  useEffect(() => {
    // Only run on browser
    if (typeof window === "undefined") return;

    // Import here to avoid SSR issues
    const { gsap } = require("gsap");

    const element = ref.current;
    if (!element) return;

    // Create GSAP context — all animations are scoped to this element
    contextRef.current = gsap.context(() => {
      setupFn(contextRef.current);
    }, element);

    return () => {
      // Cleanup: revert all animations in this context
      if (contextRef.current) {
        contextRef.current.revert();
        contextRef.current = null;
      }
      options?.onCleanup?.();
    };
  }, [ref, setupFn, options]);
}

/**
 * Safe GSAP initialization at module level.
 * Registers plugins and sets global defaults.
 */
export function initializeGSAP() {
  if (typeof window === "undefined") return;

  const { gsap, ScrollTrigger } = require("gsap");
  const { ScrollToPlugin } = require("gsap/ScrollToPlugin");

  // Register plugins
  if (!gsap.plugins.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (!gsap.plugins.ScrollToPlugin) {
    gsap.registerPlugin(ScrollToPlugin);
  }

  // Set global defaults
  gsap.defaults({
    ease: "power2.inOut",
    duration: 0.6,
  });

  return { gsap, ScrollTrigger };
}

/**
 * Detect if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Detect if pointer is fine (desktop/tablet with precise pointing)
 */
export function hasPointerFine(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
}
