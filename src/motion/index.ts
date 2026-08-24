/**
 * Motion Engine Exports
 * Central entry point for all motion utilities and animations
 */

export { MOTION_CONFIG } from "./config";
export type { MotionConfig } from "./config";

export { useGSAPContext, initializeGSAP, prefersReducedMotion, hasPointerFine } from "./gsap-context";

export {
  createLineReveal,
  createWordReveal,
  createParallax,
  createScaleReveal,
  createClipReveal,
  createVelocitySkew,
  createGridReveal,
  createScrollColor,
  createPinnedSequence,
} from "./animations";

export { useHeroMotion } from "./hero";
export { useWorkMotion } from "./work";
export { useProcessMotion } from "./process";
export { useScrollProgress } from "./scroll-progress";
export { useCursorMotion } from "./cursor";
