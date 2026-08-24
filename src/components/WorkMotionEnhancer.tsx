"use client";

/**
 * Work Motion Enhancer
 * Adds advanced scroll animations to project cards and gallery
 */

import { useEffect } from "react";
import { MOTION_CONFIG } from "@/motion/config";
import { prefersReducedMotion } from "@/motion/gsap-context";

const gsap = require("gsap/dist/gsap");

export function WorkMotionEnhancer() {
  const reduce = prefersReducedMotion();

  useEffect(() => {
    if (reduce || typeof window === "undefined") return;

    const workSection = document.querySelector("[data-section='work']");
    if (!workSection) return;

    try {
      // ========== PROJECT CARD PARALLAX IMAGE ==========
      const cards = workSection.querySelectorAll("[data-work-card]");
      cards.forEach((card) => {
        const image = card.querySelector("img, [data-image]");
        if (image) {
          gsap.to(image, {
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: MOTION_CONFIG.scroll.scrub,
              markers: false,
            },
            y: 40,
          });
        }
      });

      // ========== STAGGERED CARD ENTRANCE ==========
      gsap.from(cards, {
        scrollTrigger: {
          trigger: workSection,
          start: "top 75%",
          end: "top 25%",
          scrub: false,
          markers: false,
        },
        duration: MOTION_CONFIG.duration.standard,
        y: 60,
        opacity: 0,
        stagger: MOTION_CONFIG.stagger.item,
        ease: MOTION_CONFIG.ease.entrance,
      });

      // ========== HOVER SCALE EFFECT ==========
      cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            scale: 1.02,
            duration: MOTION_CONFIG.duration.ui,
            ease: MOTION_CONFIG.ease.smooth,
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            scale: 1,
            duration: MOTION_CONFIG.duration.ui,
            ease: MOTION_CONFIG.ease.smooth,
          });
        });
      });
    } catch (e) {
      console.warn("Work motion enhancement error:", e);
    }
  }, [reduce]);

  return null;
}
