/**
 * Hero Section GSAP Animations
 * Advanced cinematic entrance, parallax depth, and pointer field interactions
 */

import { useEffect, useRef, useState } from "react";
import { useGSAPContext, prefersReducedMotion, hasPointerFine } from "./gsap-context";
import { MOTION_CONFIG } from "./config";

const gsap = require("gsap/dist/gsap");

/**
 * useHeroMotion — Advanced hero animations
 * - Staggered intro sequence
 * - Parallax depth planes
 * - Scroll-linked scale and fade
 * - Optional pointer field interaction
 */
export function useHeroMotion(ref: React.RefObject<HTMLElement>) {
  const reduce = prefersReducedMotion();
  const hasPointer = hasPointerFine();
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const interpolatedRef = useRef({ x: 0, y: 0 });

  useGSAPContext(ref, (ctx) => {
    if (reduce) return;

    const hero = ref.current;
    if (!hero) return;

    // ========== PAGE INTRO SEQUENCE ==========
    // Background -> Navigation -> Eyebrow -> Title -> Description -> CTA -> Visual

    const tl = gsap.timeline({
      defaults: { duration: MOTION_CONFIG.duration.standard, ease: MOTION_CONFIG.ease.entrance },
    });

    // Stagger intro elements
    const bgElement = hero.querySelector("[data-motion='hero-bg']");
    const navElement = hero.querySelector("[data-motion='hero-nav']");
    const eyebrowElement = hero.querySelector("[data-motion='hero-eyebrow']");
    const titleElement = hero.querySelector("[data-motion='hero-title']");
    const descElement = hero.querySelector("[data-motion='hero-desc']");
    const ctaElement = hero.querySelector("[data-motion='hero-cta']");
    const visualElement = hero.querySelector("[data-motion='hero-visual']");

    // Background entrance
    if (bgElement) {
      tl.from(
        bgElement,
        {
          opacity: 0,
          duration: MOTION_CONFIG.duration.cinematic,
          ease: "power1.out",
        },
        0
      );
    }

    // Navigation fade in
    if (navElement) {
      tl.from(
        navElement,
        {
          opacity: 0,
          y: -20,
        },
        0.1
      );
    }

    // Eyebrow reveal
    if (eyebrowElement) {
      tl.from(
        eyebrowElement,
        {
          opacity: 0,
          y: 20,
        },
        0.2
      );
    }

    // Title reveal line-by-line
    if (titleElement) {
      const lines = titleElement.querySelectorAll("[data-motion='line']");
      tl.from(
        lines,
        {
          opacity: 0,
          y: 40,
          stagger: MOTION_CONFIG.stagger.reveal,
        },
        0.3
      );
    }

    // Description fade up
    if (descElement) {
      tl.from(
        descElement,
        {
          opacity: 0,
          y: 20,
        },
        0.45
      );
    }

    // CTA magnetic entrance
    if (ctaElement) {
      tl.from(
        ctaElement,
        {
          opacity: 0,
          scale: 0.9,
        },
        0.55
      );
    }

    // Visual scale reveal
    if (visualElement) {
      tl.from(
        visualElement,
        {
          opacity: 0,
          scale: 0.95,
        },
        0.5
      );
    }

    // ========== SCROLL-LINKED PARALLAX DEPTH ==========
    // Create multiple depth planes for cinematic effect

    const scroll = gsap.registerPlugin("ScrollTrigger") ? gsap.ScrollTrigger : null;
    if (!scroll) return;

    // Background parallax (slowest)
    const bgParallax = hero.querySelector("[data-motion='parallax-bg']");
    if (bgParallax) {
      gsap.to(bgParallax, {
        y: 60,
        opacity: 0.8,
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: MOTION_CONFIG.scroll.scrub,
          markers: false,
        },
      });
    }

    // Midground parallax
    const midParallax = hero.querySelector("[data-motion='parallax-mid']");
    if (midParallax) {
      gsap.to(midParallax, {
        y: 40,
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: MOTION_CONFIG.scroll.scrub,
          markers: false,
        },
      });
    }

    // Content parallax (slight counter-motion)
    const contentParallax = hero.querySelector("[data-motion='parallax-content']");
    if (contentParallax) {
      gsap.to(contentParallax, {
        y: -20,
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: MOTION_CONFIG.scroll.scrub,
          markers: false,
        },
      });
    }

    // Visual scale on scroll
    if (visualElement) {
      gsap.to(visualElement, {
        scale: 1.08,
        opacity: 0.7,
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "center top",
          scrub: MOTION_CONFIG.scroll.scrub,
          markers: false,
        },
      });
    }
  });

  // ========== POINTER FIELD INTERACTION ==========
  // Desktop only: pointer movement influences subtle element movement

  useEffect(() => {
    if (reduce || !hasPointer) return;
    const hero = ref.current;
    if (!hero) return;

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", onMove);

    // Animate cursor fields
    const animatePointerField = () => {
      if (!hero) return;

      // Get field targets
      const fieldTargets = hero.querySelectorAll("[data-motion='pointer-field']");
      if (fieldTargets.length === 0) return;

      fieldTargets.forEach((target) => {
        const rect = (target as HTMLElement).getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = mouseRef.current.x - centerX;
        const dy = mouseRef.current.y - centerY;

        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 300;

        if (distance < maxDistance) {
          const influence = 1 - distance / maxDistance;
          const moveX = (dx / distance) * 8 * influence;
          const moveY = (dy / distance) * 8 * influence;

          gsap.to(target, {
            x: moveX,
            y: moveY,
            duration: 0.3,
            overwrite: "auto",
          });
        } else {
          gsap.to(target, {
            x: 0,
            y: 0,
            duration: 0.5,
            overwrite: "auto",
          });
        }
      });

      requestAnimationFrame(animatePointerField);
    };

    animatePointerField();

    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, [reduce, hasPointer, ref]);
}
