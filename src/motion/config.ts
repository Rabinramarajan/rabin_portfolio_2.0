/**
 * Motion Engine Configuration
 * Centralized GSAP configuration, timing, and constants.
 * One rhythm, one easing, one vocabulary across all scroll and animation patterns.
 */

export const MOTION_CONFIG = {
  /* ========== TIMING ========== */
  duration: {
    micro: 0.15, // 150ms — hovers, presses, tiny state changes
    fast: 0.3,   // 300ms — button clicks, simple reveals
    ui: 0.35,    // 350ms — micro interactions
    standard: 0.6, // 600ms — section entries, text reveals
    cinematic: 0.85, // 850ms — hero, page-level choreography
    epic: 1.2,   // 1200ms — dramatic multi-stage sequences
  },

  /* ========== EASING ========== */
  ease: {
    // cubic-bezier values — use directly with gsap.to/from
    standard: "cubic.inOut", // [0.16, 1, 0.3, 1] — responsive, bouncy
    smooth: "power2.inOut",   // smooth power curve
    entrance: "power2.out",   // snappy entry
    exit: "power2.in",        // smooth exit
    bounce: "elastic.out(1, 0.5)", // subtle bounce
    back: "back.out(1.7)",    // slight overshoot
  },

  /* ========== STAGGER ========== */
  stagger: {
    text: 0.05,      // 50ms per character/word
    item: 0.08,      // 80ms per child
    reveal: 0.12,    // 120ms per reveal
  },

  /* ========== SCROLL BEHAVIOR ========== */
  scroll: {
    scrub: 0.6,      // link animation to scroll (0.6 = smooth lag)
    snapTo: 0.1,     // 100ms minimum for snap calculations
  },

  /* ========== PARALLAX ========== */
  parallax: {
    subtle: 0.15,    // 15% of scroll distance
    medium: 0.25,    // 25% — standard depth
    intense: 0.4,    // 40% — dramatic depth
    extreme: 0.6,    // 60% — rare, for special effects
  },

  /* ========== MOTION LIMITS ========== */
  limits: {
    skewMax: 3,              // max skew angle (degrees)
    scaleMin: 0.95,          // minimum scale
    scaleMax: 1.08,          // maximum scale
    rotationMax: 8,          // max rotation (degrees)
    magneticRange: 80,       // pixel distance for magnetic attraction
    magneticStrength: 0.3,   // 0-1 strength factor
  },

  /* ========== VIEWPORT ========== */
  viewport: {
    triggerMargin: "-8%",    // start animation 8% before visible
    once: true,              // animation plays only once
  },

  /* ========== DEVICE DETECTION ========== */
  breakpoints: {
    mobile: 640,
    tablet: 1024,
    desktop: 1920,
  },
} as const;

export type MotionConfig = typeof MOTION_CONFIG;
