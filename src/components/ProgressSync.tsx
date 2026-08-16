"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useEffect } from "react";
import { animationController } from "@/lib/animation-controller";
import { HOME_SECTIONS, setActiveSection, setScrollPercent } from "@/lib/scroll-sync";

/**
 * The single writer for all three progress indicators.
 *  - The top reading bar tracks page scroll (spring-smoothed motion value).
 *  - The same scroll progress feeds the shared store's percent, which the
 *    footer readout renders.
 *  - Homepage sections register with the central controller (one observer);
 *    whichever crosses the threshold becomes the store's active section,
 *    which drives the navbar's scroll-spy.
 * The bar hides under reduced motion; the section tracking keeps running so
 * the nav state stays correct.
 */
export function ProgressSync() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", setScrollPercent);
    return unsubscribe;
  }, [scrollYProgress]);

  useEffect(() => {
    const unsubscribes = HOME_SECTIONS.map((id) => {
      const el = document.getElementById(id);
      if (!el) return () => {};
      return animationController.register(el, {
        threshold: 0.3,
        once: false,
        onPhase: (phase) => {
          if (phase === "active") setActiveSection(id);
          else setActiveSection((current) => (current === id ? null : current));
        },
      });
    });
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
      setActiveSection(null);
    };
  }, []);

  if (reduce) return null;
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden />;
}