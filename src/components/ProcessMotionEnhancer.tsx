"use client";

/**
 * Process Motion Enhancer
 * Adds pinned scroll sequence animations to process section
 */

import { useEffect } from "react";
import { MOTION_CONFIG } from "@/motion/config";
import { prefersReducedMotion } from "@/motion/gsap-context";

const gsap = require("gsap/dist/gsap");

export function ProcessMotionEnhancer() {
  const reduce = prefersReducedMotion();

  useEffect(() => {
    if (reduce || typeof window === "undefined") return;

    const processSection = document.querySelector("[data-section='process']");
    if (!processSection) return;

    try {
      const stages = processSection.querySelectorAll("[data-process-stage]");
      if (stages.length === 0) return;

      // ========== PROCESS TIMELINE ANIMATION ==========
      const progressBar = processSection.querySelector("[data-process-progress]");
      const stageCount = stages.length;

      // Calculate total distance for pinning
      const pinDistance = stageCount * 150;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: processSection,
          pin: true,
          pinSpacing: true,
          start: "top center",
          end: `+=${pinDistance}%`,
          scrub: MOTION_CONFIG.scroll.scrub,
          markers: false,
        },
      });

      // ========== STAGE TRANSITIONS ==========
      stages.forEach((stage, index) => {
        const stageDuration = 100 / stageCount;
        const stageStart = index * stageDuration;

        // Fade in stage
        timeline.from(
          stage,
          {
            opacity: 0,
            y: 40,
            duration: MOTION_CONFIG.duration.standard,
          },
          stageStart
        );

        // Update progress bar
        if (progressBar) {
          timeline.to(
            progressBar,
            {
              width: `${(index + 1) * (100 / stageCount)}%`,
              duration: MOTION_CONFIG.duration.standard,
            },
            stageStart
          );
        }

        // Fade out when done (except last)
        if (index < stageCount - 1) {
          timeline.to(
            stage,
            {
              opacity: 0,
              y: -40,
              duration: MOTION_CONFIG.duration.standard,
            },
            stageStart + stageDuration - MOTION_CONFIG.duration.standard
          );
        }
      });

      // ========== SVG PATH ANIMATION (if exists) ==========
      const svgPath = processSection.querySelector("svg path") as SVGPathElement;
      if (svgPath && typeof (svgPath as any).getTotalLength === "function") {
        const pathLength = (svgPath as SVGPathElement).getTotalLength();
        gsap.set(svgPath, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        timeline.to(
          svgPath,
          {
            strokeDashoffset: 0,
            duration: MOTION_CONFIG.duration.epic,
          },
          0
        );
      }
    } catch (e) {
      console.warn("Process motion enhancement error:", e);
    }
  }, [reduce]);

  return null;
}
