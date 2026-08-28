"use client";

/**
 * Experience Motion Enhancer
 *
 * GSAP-powered enhancements for the career timeline:
 * - Smooth node transition on active state change
 * - Card hover micro-interactions (subtle lift + glow)
 * - Tech tag hover ripple effect
 * - Achievement list stagger on scroll
 *
 * Only runs on desktop with fine pointer and no reduced-motion preference.
 */

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/motion/gsap-context";

export function ExperienceMotionEnhancer() {
  const reduce = prefersReducedMotion();
  const cleanupsRef = useRef<(() => void)[]>([]);

  useEffect(() => {
    if (reduce || typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { gsap } = require("gsap/dist/gsap");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { ScrollTrigger } = require("gsap/dist/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);

    const cleanups: (() => void)[] = [];

    try {
      // ========== ACHIEVEMENT LIST STAGGER ==========
      const winLists = document.querySelectorAll(".ctl__wins");
      winLists.forEach((list) => {
        const items = list.querySelectorAll("li");
        if (!items.length) return;

        const staggerTl = gsap.timeline({
          scrollTrigger: {
            trigger: list,
            start: "top 85%",
            once: true,
          },
        });

        staggerTl.from(items, {
          opacity: 0,
          x: -8,
          duration: 0.35,
          stagger: 0.06,
          ease: "power2.out",
        });

        cleanups.push(() => staggerTl.scrollTrigger?.kill());
      });

      // ========== TECH TAG STAGGER ==========
      const tagLists = document.querySelectorAll(".ctl__tags");
      tagLists.forEach((list) => {
        const tags = list.querySelectorAll("li");
        if (!tags.length) return;

        const tagTl = gsap.timeline({
          scrollTrigger: {
            trigger: list,
            start: "top 90%",
            once: true,
          },
        });

        tagTl.from(tags, {
          opacity: 0,
          y: 6,
          duration: 0.3,
          stagger: 0.04,
          ease: "power2.out",
        });

        cleanups.push(() => tagTl.scrollTrigger?.kill());
      });

      // ========== CARD HOVER MICRO-INTERACTIONS ==========
      const cards = document.querySelectorAll(".ctl__card");
      cards.forEach((card) => {
        const el = card as HTMLElement;
        const tagContainer = el.querySelector(".ctl__tags") as HTMLElement | null;

        const onEnter = () => {
          // Subtle tech tag shift on card hover
          if (tagContainer) {
            const tags = tagContainer.querySelectorAll("li");
            gsap.to(tags, {
              y: -1,
              duration: 0.25,
              stagger: 0.02,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        };

        const onLeave = () => {
          if (tagContainer) {
            const tags = tagContainer.querySelectorAll("li");
            gsap.to(tags, {
              y: 0,
              duration: 0.3,
              stagger: 0.02,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        };

        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);

        cleanups.push(() => {
          el.removeEventListener("mouseenter", onEnter);
          el.removeEventListener("mouseleave", onLeave);
          if (tagContainer) {
            gsap.killTweensOf(tagContainer.querySelectorAll("li"));
          }
        });
      });

      // ========== SECTION INTRO REVEAL ==========
      const journeySection = document.getElementById("journey");
      if (journeySection) {
        const statement = journeySection.querySelector(".xsec__statement");
        const lede = journeySection.querySelector(".xsec__lede");
        const head = journeySection.querySelector(".xsec__head");

        if (statement || lede || head) {
          const introTl = gsap.timeline({
            scrollTrigger: {
              trigger: journeySection,
              start: "top 75%",
              once: true,
            },
          });

          if (head) {
            introTl.from(head, { opacity: 0, y: 16, duration: 0.5, ease: "power2.out" }, 0);
          }
          if (statement) {
            introTl.from(statement, { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" }, 0.1);
          }
          if (lede) {
            introTl.from(lede, { opacity: 0, y: 14, duration: 0.5, ease: "power2.out" }, 0.2);
          }

          cleanups.push(() => introTl.scrollTrigger?.kill());
        }
      }

      cleanupsRef.current = cleanups;
    } catch (e) {
      console.warn("Experience motion enhancement error:", e);
    }

    return () => {
      cleanupsRef.current.forEach((fn) => fn());
      cleanupsRef.current = [];
    };
  }, [reduce]);

  return null;
}
