"use client";

/**
 * Contact Motion Enhancer
 * Adds cinematic entrance animations to contact section
 */

import { useEffect } from "react";
import { MOTION_CONFIG } from "@/motion/config";
import { prefersReducedMotion } from "@/motion/gsap-context";

const gsap = require("gsap/dist/gsap");

export function ContactMotionEnhancer() {
  const reduce = prefersReducedMotion();

  useEffect(() => {
    if (reduce || typeof window === "undefined") return;

    const contactSection = document.querySelector("[data-section='contact']");
    if (!contactSection) return;

    try {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: contactSection,
          start: "top 70%",
          end: "top 20%",
          scrub: false,
          markers: false,
        },
      });

      // ========== HEADING ANIMATION ==========
      const heading = contactSection.querySelector("h2, h1");
      if (heading) {
        timeline.from(
          heading,
          {
            opacity: 0,
            y: 40,
            duration: MOTION_CONFIG.duration.cinematic,
            ease: MOTION_CONFIG.ease.entrance,
          },
          0
        );
      }

      // ========== DESCRIPTION ANIMATION ==========
      const description = contactSection.querySelector("[data-contact-intro]");
      if (description) {
        timeline.from(
          description,
          {
            opacity: 0,
            y: 30,
            duration: MOTION_CONFIG.duration.standard,
          },
          0.1
        );
      }

      // ========== FORM FIELD STAGGER ==========
      const formFields = contactSection.querySelectorAll("input, textarea, button");
      if (formFields.length > 0) {
        timeline.from(
          formFields,
          {
            opacity: 0,
            y: 20,
            duration: MOTION_CONFIG.duration.standard,
            stagger: MOTION_CONFIG.stagger.item,
          },
          0.2
        );
      }

      // ========== CONTACT CHANNELS ==========
      const channels = contactSection.querySelectorAll("[data-contact-channel]");
      if (channels.length > 0) {
        timeline.from(
          channels,
          {
            opacity: 0,
            x: -20,
            duration: MOTION_CONFIG.duration.standard,
            stagger: MOTION_CONFIG.stagger.item,
          },
          0.3
        );
      }

      // ========== BACKGROUND PARALLAX ==========
      gsap.to(contactSection, {
        scrollTrigger: {
          trigger: contactSection,
          start: "top center",
          end: "bottom center",
          scrub: MOTION_CONFIG.scroll.scrub,
          markers: false,
        },
        y: 30,
      });
    } catch (e) {
      console.warn("Contact motion enhancement error:", e);
    }
  }, [reduce]);

  return null;
}
