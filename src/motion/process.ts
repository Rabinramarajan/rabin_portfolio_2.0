/**
 * Process Section GSAP Animations
 * Pinned scroll storytelling, stage transitions, and progress tracking
 */

import { useRef } from "react";
import { useGSAPContext, prefersReducedMotion } from "./gsap-context";
import { MOTION_CONFIG } from "./config";

const gsap = require("gsap/dist/gsap");

/**
 * useProcessMotion — Pinned process timeline
 * - Pin section while stages transition
 * - Progress line animation
 * - Visual transformation between stages
 * - SVG path drawing
 */
export function useProcessMotion(ref: React.RefObject<HTMLElement>) {
  const reduce = prefersReducedMotion();

  useGSAPContext(ref, (ctx) => {
    if (reduce) return;

    const container = ref.current;
    if (!container) return;

    // ========== PINNED PROCESS SEQUENCE ==========
    const processStages = container.querySelectorAll("[data-motion='process-stage']");
    if (processStages.length === 0) return;

    // Find visual and content containers
    const visual = container.querySelector("[data-motion='process-visual']");
    const content = container.querySelector("[data-motion='process-content']");
    const progressLine = container.querySelector("[data-motion='process-progress']");

    const stageCount = processStages.length;
    const duration = 100 / stageCount; // % per stage

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        pin: true,
        pinSpacing: true,
        start: "top top",
        end: `+=${stageCount * 150}%`,
        scrub: MOTION_CONFIG.scroll.scrub,
        markers: false,
      },
    });

    // ========== STAGE TRANSITIONS ==========
    processStages.forEach((stage, index) => {
      const stageProgress = index * duration;
      const nextStageProgress = (index + 1) * duration;

      // *** ENTER STAGE ***
      // Stage content fades in and slides up
      tl.from(
        stage,
        {
          opacity: 0,
          y: 40,
          duration: MOTION_CONFIG.duration.standard,
        },
        stageProgress
      );

      // Stage number/indicator highlights
      const indicator = stage.querySelector("[data-motion='stage-indicator']");
      if (indicator) {
        tl.to(
          indicator,
          {
            color: "var(--accent)",
            textShadow: "0 0 20px rgba(255,255,255,0.5)",
            scale: 1.1,
            duration: MOTION_CONFIG.duration.micro,
          },
          stageProgress
        );
      }

      // *** VISUAL TRANSITION ***
      if (visual) {
        const stageVisual = stage.querySelector("[data-motion='stage-visual']");
        if (stageVisual) {
          // Cross-fade to new visual
          tl.to(
            visual,
            {
              opacity: 0.3,
              duration: MOTION_CONFIG.duration.micro,
            },
            stageProgress
          );

          // Replace with new visual
          tl.set(visual, { children: stageVisual });

          // Fade in new visual
          tl.to(
            visual,
            {
              opacity: 1,
              scale: 1,
              duration: MOTION_CONFIG.duration.standard,
            },
            stageProgress + 0.05
          );
        }
      }

      // *** PROGRESS LINE FILL ***
      if (progressLine) {
        tl.to(
          progressLine,
          {
            width: `${(index + 1) * (100 / stageCount)}%`,
            duration: MOTION_CONFIG.duration.standard,
          },
          stageProgress
        );
      }

      // *** DESCRIPTION TEXT ANIMATION ***
      const description = stage.querySelector("[data-motion='stage-description']");
      if (description) {
        tl.from(
          description,
          {
            opacity: 0,
            x: -20,
            duration: MOTION_CONFIG.duration.standard,
          },
          stageProgress + 0.1
        );
      }

      // *** EXIT STAGE ***
      if (index < stageCount - 1) {
        tl.to(
          stage,
          {
            opacity: 0,
            y: -40,
            duration: MOTION_CONFIG.duration.standard,
          },
          nextStageProgress - MOTION_CONFIG.duration.standard
        );

        // Indicator dims when exiting
        if (indicator) {
          tl.to(
            indicator,
            {
              color: "var(--text-muted)",
              textShadow: "none",
              scale: 1,
              duration: MOTION_CONFIG.duration.micro,
            },
            nextStageProgress - MOTION_CONFIG.duration.standard
          );
        }
      }
    });

    // ========== SVG PATH ANIMATION (optional) ==========
    const svgPath = container.querySelector("[data-motion='process-path']");
    if (svgPath) {
      const pathLength = (svgPath as SVGPathElement).getTotalLength?.();
      if (pathLength) {
        gsap.set(svgPath, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        tl.to(
          svgPath,
          {
            strokeDashoffset: 0,
            duration: MOTION_CONFIG.duration.epic,
          },
          0
        );
      }
    }
  });
}

/**
 * useProcessStageMotion — Individual stage animations
 * For when stages are displayed differently (horizontal, vertical, etc)
 */
export function useProcessStageMotion(
  ref: React.RefObject<HTMLElement>,
  stageIndex: number,
  isActive: boolean
) {
  useGSAPContext(ref, (ctx) => {
    if (!ref.current) return;

    const stage = ref.current;

    if (isActive) {
      gsap.to(stage, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: MOTION_CONFIG.duration.standard,
        ease: MOTION_CONFIG.ease.entrance,
      });
    } else {
      gsap.to(stage, {
        opacity: 0.5,
        scale: 0.95,
        y: 20,
        duration: MOTION_CONFIG.duration.standard,
        ease: MOTION_CONFIG.ease.exit,
      });
    }
  });
}
