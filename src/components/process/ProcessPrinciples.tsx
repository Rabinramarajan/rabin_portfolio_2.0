"use client";

import { motion } from "motion/react";
import { processPrinciples } from "@/content/process";
import { ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/**
 * Five principle badges rendered as a horizontal strip.
 * Grid on desktop, horizontally scrollable on mobile.
 */

const ICONS: React.ReactNode[] = [
  /* Goal Focused — target */
  <g key="0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" />
  </g>,
  /* Connected Decisions — link */
  <g key="1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none">
    <path d="M8 12h8M15 8l5 4-5 4M9 8L4 12l5 4" />
  </g>,
  /* Quality Built In — shield-check */
  <g key="2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none">
    <path d="M12 3.5 5 6.5v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9v-5z" />
    <path d="M9 12.5l2.2 2.2L15 10.5" />
  </g>,
  /* Transparent Progress — eye */
  <g key="3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none">
    <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </g>,
  /* Scale Ready — trending-up */
  <g key="4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none">
    <path d="M4 17l5-5 3 3 7-8" />
    <path d="M15 7h4v4" />
  </g>,
];

export function ProcessPrinciples() {
  const reduce = useReducedMotionSafe();

  return (
    <div className="pprin">
      <motion.div
        className="pprin__grid"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-12%" }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduce ? 0 : 0.07 } },
        }}
      >
        {processPrinciples.map((p, i) => (
          <motion.div
            key={p.title}
            className="pprin__badge"
            variants={{
              hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.52, ease } },
            }}
          >
            <span className="pprin__icon" aria-hidden>
              <svg viewBox="0 0 24 24" width={24} height={24} focusable="false">
                {ICONS[i]}
              </svg>
            </span>
            <div className="pprin__copy">
              <p className="pprin__title">{p.title}</p>
              <p className="pprin__body">{p.body}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
