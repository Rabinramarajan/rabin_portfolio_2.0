/**
 * Reusable Animation Presets
 * Common choreography patterns used across sections.
 * Each function returns GSAP timeline-ready configuration.
 */

import { MOTION_CONFIG } from "./config";

const { gsap } = require("gsap/dist/gsap");
const { ScrollTrigger } = require("gsap/dist/ScrollTrigger");

gsap.registerPlugin(ScrollTrigger);

/* ========== TEXT REVEALS ========== */

/**
 * Line reveal — lines enter from below with staggered timing.
 * Used for major headings.
 */
export function createLineReveal(
  selector: string,
  options?: {
    duration?: number;
    stagger?: number;
    delay?: number;
    trigger?: HTMLElement;
  }
) {
  const { duration = MOTION_CONFIG.duration.standard, stagger = MOTION_CONFIG.stagger.text, delay = 0, trigger } = options || {};

  return {
    targets: selector,
    duration,
    delay,
    stagger,
    y: [40, 0],
    opacity: [0, 1],
    ease: MOTION_CONFIG.ease.entrance,
    scrollTrigger: trigger
      ? {
          trigger,
          start: "top 80%",
          end: "top 20%",
          scrub: false,
          markers: false,
        }
      : undefined,
  };
}

/**
 * Word reveal — words enter sequentially
 */
export function createWordReveal(
  selector: string,
  options?: {
    duration?: number;
    stagger?: number;
    delay?: number;
  }
) {
  const { duration = MOTION_CONFIG.duration.standard, stagger = 0.08, delay = 0 } = options || {};

  return {
    targets: selector,
    duration,
    delay,
    stagger,
    y: [30, 0],
    opacity: [0, 1],
    ease: MOTION_CONFIG.ease.entrance,
  };
}

/* ========== PARALLAX EFFECTS ========== */

/**
 * Scroll-linked parallax — moves element slower than scroll
 * Used for background, midground, and depth planes
 */
export function createParallax(
  selector: string,
  intensity: "subtle" | "medium" | "intense" = "medium",
  options?: {
    trigger?: HTMLElement;
    distance?: string;
    direction?: "y" | "x";
  }
) {
  const { trigger, distance = "100vh", direction = "y" } = options || {};
  const intensityMap = {
    subtle: MOTION_CONFIG.parallax.subtle,
    medium: MOTION_CONFIG.parallax.medium,
    intense: MOTION_CONFIG.parallax.intense,
  };

  const moveDistance = 100 * intensityMap[intensity];
  const movement = direction === "y" ? [0, moveDistance] : [0, moveDistance];
  const property = direction === "y" ? "y" : "x";

  return {
    targets: selector,
    [property]: movement,
    duration: 0,
    ease: "none",
    scrollTrigger: {
      trigger: trigger || selector,
      start: `top top`,
      end: distance,
      scrub: MOTION_CONFIG.scroll.scrub,
      markers: false,
    },
  };
}

/* ========== SCALE & FADE ========== */

/**
 * Fade in with scale — element scales up while fading in
 * Common entrance for images and cards
 */
export function createScaleReveal(
  selector: string,
  options?: {
    duration?: number;
    delay?: number;
    scaleFrom?: number;
    trigger?: HTMLElement;
  }
) {
  const { duration = MOTION_CONFIG.duration.cinematic, delay = 0, scaleFrom = 0.92, trigger } = options || {};

  return {
    targets: selector,
    duration,
    delay,
    scale: [scaleFrom, 1],
    opacity: [0, 1],
    ease: MOTION_CONFIG.ease.entrance,
    scrollTrigger: trigger
      ? {
          trigger,
          start: "top 80%",
          end: "top 30%",
          scrub: false,
        }
      : undefined,
  };
}

/* ========== CLIP REVEALS ========== */

/**
 * Clip path reveal — reveals image with moving clip-path
 * Direction: 'left', 'right', 'top', 'bottom'
 */
export function createClipReveal(
  selector: string,
  direction: "left" | "right" | "top" | "bottom" = "left",
  options?: {
    duration?: number;
    delay?: number;
  }
) {
  const { duration = MOTION_CONFIG.duration.standard, delay = 0 } = options || {};

  const clipPaths = {
    left: ["inset(0 100% 0 0)", "inset(0 0 0 0)"],
    right: ["inset(0 0 0 100%)", "inset(0 0 0 0)"],
    top: ["inset(100% 0 0 0)", "inset(0 0 0 0)"],
    bottom: ["inset(0 0 100% 0)", "inset(0 0 0 0)"],
  };

  return {
    targets: selector,
    duration,
    delay,
    clipPath: clipPaths[direction],
    ease: MOTION_CONFIG.ease.entrance,
  };
}

/* ========== ROTATION & SKEW ========== */

/**
 * Velocity-based skew — skew increases with scroll velocity
 * Subtle effect for dynamic feel
 */
export function createVelocitySkew(
  selector: string,
  maxSkew: number = MOTION_CONFIG.limits.skewMax,
  options?: {
    sensitivity?: number;
  }
) {
  const { sensitivity = 1 } = options || {};

  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

  return {
    targets: selector,
    duration: 0.3,
    skewY: 0,
    ease: "power2.out",
    modifiers: {
      skewY: gsap.utils.unitize((x: number) => clamp(x, -maxSkew, maxSkew)),
    },
  };
}

/* ========== STAGGER & CHOREOGRAPHY ========== */

/**
 * Staggered grid reveal — children reveal with delay
 * Common for project cards, skill items, process steps
 */
export function createGridReveal(
  containerSelector: string,
  childSelector: string,
  options?: {
    duration?: number;
    stagger?: number;
    delay?: number;
    trigger?: HTMLElement;
  }
) {
  const { duration = MOTION_CONFIG.duration.standard, stagger = MOTION_CONFIG.stagger.item, delay = 0, trigger } = options || {};

  return {
    targets: `${containerSelector} ${childSelector}`,
    duration,
    delay,
    stagger,
    y: [40, 0],
    opacity: [0, 1],
    ease: MOTION_CONFIG.ease.entrance,
    scrollTrigger: trigger
      ? {
          trigger,
          start: "top 75%",
          end: "top 25%",
          scrub: false,
        }
      : undefined,
  };
}

/* ========== SCROLL-LINKED COLOR ========== */

/**
 * Scroll-linked background color transition
 * Changes background as user scrolls through section
 */
export function createScrollColor(
  selector: string,
  colors: string[],
  options?: {
    trigger?: HTMLElement;
    distance?: string;
  }
) {
  const { trigger, distance = "100vh" } = options || {};

  // Create timeline for color transitions
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: trigger || selector,
      start: "top center",
      end: distance,
      scrub: MOTION_CONFIG.scroll.scrub,
      markers: false,
    },
  });

  // Animate through colors
  colors.forEach((color, index) => {
    if (index === 0) {
      tl.to(selector, { backgroundColor: color, duration: 0 }, 0);
    } else {
      tl.to(selector, { backgroundColor: color, duration: 1 }, index - 1);
    }
  });

  return tl;
}

/* ========== PINNED SEQUENCES ========== */

/**
 * Pinned section with scroll-driven content change
 * Used for Process and similar sequences
 */
export function createPinnedSequence(
  containerSelector: string,
  contentSelector: string,
  stageCount: number,
  options?: {
    duration?: number;
  }
) {
  const { duration = 300 } = options || {};

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerSelector,
      pin: true,
      pinSpacing: true,
      start: "top center",
      end: `+=${duration * stageCount}%`,
      scrub: MOTION_CONFIG.scroll.scrub,
      markers: false,
    },
  });

  // Add animations for each stage
  for (let i = 0; i < stageCount; i++) {
    tl.to(
      contentSelector,
      {
        opacity: 0,
        duration: MOTION_CONFIG.duration.standard,
      },
      i * (duration / 100)
    );
  }

  return tl;
}
