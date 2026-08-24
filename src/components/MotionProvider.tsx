"use client";

/**
 * Motion Provider — GSAP Initialization and Setup
 * Initializes GSAP plugins and registers scroll triggers globally
 */

import { useEffect } from "react";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize GSAP only on browser
    if (typeof window === "undefined") return;

    try {
      const { gsap } = require("gsap/dist/gsap");
      const { ScrollTrigger } = require("gsap/dist/ScrollTrigger");
      const { ScrollToPlugin } = require("gsap/dist/ScrollToPlugin");

      // Register plugins once
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

      // Reduce motion preference handling
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        // Disable all scroll triggers on reduced motion preference
        ScrollTrigger.defaults({
          onUpdate: () => {}, // No-op updates
        });
      }
    } catch (e) {
      console.warn("Failed to initialize GSAP:", e);
    }
  }, []);

  return <>{children}</>;
}
