"use client";

/**
 * Hero Motion Enhancer
 * Augments existing Hero component with advanced GSAP scroll and parallax effects
 * without modifying the core Hero component
 */

import { useEffect, useRef } from "react";
import { MOTION_CONFIG } from "@/motion/config";
import { prefersReducedMotion, hasPointerFine } from "@/motion/gsap-context";


export function HeroMotionEnhancer() {
  const heroRef = useRef<HTMLDivElement>(null);
  const reduce = prefersReducedMotion();
  const hasPointer = hasPointerFine();

  useEffect(() => {
    if (reduce || typeof window === "undefined") return;

    const hero = document.querySelector("#hero");
    if (!hero) return;

    const { gsap } = require("gsap/dist/gsap");

    try {
      // ========== HERO REEL PARALLAX DEPTH ==========
      // Background video scales and drifts slightly for cinematic effect
      const reel = hero.querySelector(".chero__reel");
      if (reel) {
        gsap.to(reel, {
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom 50%",
            scrub: MOTION_CONFIG.scroll.scrub,
            markers: false,
          },
          y: 60,
          scale: 1.08,
          opacity: 0.75,
        });
      }

      // ========== COPY PARALLAX (counter-motion) ==========
      const shell = hero.querySelector(".chero__shell");
      if (shell) {
        gsap.to(shell, {
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom 50%",
            scrub: MOTION_CONFIG.scroll.scrub,
            markers: false,
          },
          y: -30,
        });
      }

      // ========== POINTER FIELD INTERACTION (Desktop only) ==========
      if (hasPointer) {
        const vignette = hero.querySelector(".chero__vignette");
        if (vignette) {
          let mouseX = 0;
          let mouseY = 0;

          const handleMouseMove = (e: MouseEvent) => {
            const rect = hero.getBoundingClientRect();
            if (
              e.clientX < rect.left ||
              e.clientX > rect.right ||
              e.clientY < rect.top ||
              e.clientY > rect.bottom
            ) {
              return;
            }

            mouseX = (e.clientX - rect.left) / rect.width;
            mouseY = (e.clientY - rect.top) / rect.height;

            gsap.to(vignette, {
              background: `radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
                rgba(0,0,0,0.2) 0%,
                rgba(0,0,0,0.5) 100%)`,
              duration: 0.5,
              ease: "power1.out",
            });
          };

          window.addEventListener("mousemove", handleMouseMove);
          return () => window.removeEventListener("mousemove", handleMouseMove);
        }
      }
    } catch (e) {
      console.warn("Hero motion enhancement error:", e);
    }
  }, [reduce, hasPointer]);

  return null; // This is a non-rendering enhancer
}
