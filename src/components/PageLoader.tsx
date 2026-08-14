"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { duration, ease } from "@/lib/motion";

const R1_STEM = "M10 6 V38";
const R1_BOWL = "M10 6 H26 L32 12 V20 L26 26 H10";
const R1_LEG = "M10 26 L30 42";
const R2_STEM = "M34 6 V38";
const R2_BOWL = "M34 6 H50 L56 12 V20 L50 26 H34";
const R2_LEG = "M34 26 L54 42";

export function PageLoader() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        if (sessionStorage.getItem("rr-loaded") === "1") return false;
      } catch {
        /* ignore */
      }
    }
    return true;
  });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (reduce || !visible) return;

    // Cinematic sequence: R1 draws → R2 draws → name → exit
    const a = window.setTimeout(() => setPhase(1), 160);
    const b = window.setTimeout(() => setPhase(2), 420);
    const done = window.setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem("rr-loaded", "1");
      } catch {
        /* ignore */
      }
    }, 950);

    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
      window.clearTimeout(done);
    };
  }, [reduce, visible]);

  if (reduce) return null;

  const pathProps = {
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="loader"
          aria-hidden
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.interaction, ease }}
        >
          <div className="loader__mark">
            <svg viewBox="0 0 64 48" fill="none" aria-hidden>
              {/* R1 — warm white */}
              <motion.path
                d={R1_STEM}
                stroke="#f2f1ec"
                strokeWidth="4.4"
                {...pathProps}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: phase >= 1 ? 1 : 0, opacity: phase >= 1 ? 1 : 0 }}
                transition={{ duration: duration.section, ease }}
              />
              <motion.path
                d={R1_BOWL}
                stroke="#f2f1ec"
                strokeWidth="4.4"
                {...pathProps}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: phase >= 1 ? 1 : 0, opacity: phase >= 1 ? 1 : 0 }}
                transition={{ duration: duration.section, ease, delay: 0.06 }}
              />
              <motion.path
                d={R1_LEG}
                stroke="#f2f1ec"
                strokeWidth="4.4"
                {...pathProps}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: phase >= 1 ? 1 : 0, opacity: phase >= 1 ? 1 : 0 }}
                transition={{ duration: duration.section, ease, delay: 0.12 }}
              />
              {/* R2 — lime */}
              <motion.path
                d={R2_STEM}
                stroke="#c9f24d"
                strokeWidth="4.4"
                {...pathProps}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: phase >= 2 ? 1 : 0, opacity: phase >= 2 ? 1 : 0 }}
                transition={{ duration: duration.section, ease }}
              />
              <motion.path
                d={R2_BOWL}
                stroke="#c9f24d"
                strokeWidth="4.4"
                {...pathProps}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: phase >= 2 ? 1 : 0, opacity: phase >= 2 ? 1 : 0 }}
                transition={{ duration: duration.section, ease, delay: 0.06 }}
              />
              <motion.path
                d={R2_LEG}
                stroke="#c9f24d"
                strokeWidth="4.4"
                {...pathProps}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: phase >= 2 ? 1 : 0, opacity: phase >= 2 ? 1 : 0 }}
                transition={{ duration: duration.section, ease, delay: 0.12 }}
              />
            </svg>
          </div>

          <motion.p
            className="loader__name"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 6 }}
            transition={{ duration: duration.section, ease }}
          >
            RABIN R
          </motion.p>

          <motion.span
            className="loader__line"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: phase >= 2 ? 1 : 0, opacity: phase >= 2 ? 1 : 0 }}
            transition={{ duration: duration.section, ease }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}