"use client";

import { motion } from "motion/react";
import { ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { TextReveal } from "@/components/motion";

/**
 * THE NEXT CHAPTER — the timeline leaves the page.
 *
 * The rail that has carried the whole page picks up one last time and extends
 * past the right edge toward the CTA. It draws once and stops; there is no
 * looping animation here, because "ongoing" is communicated by where the line
 * goes, not by it never settling.
 */

export function NextChapter() {
  const reduce = useReducedMotionSafe();

  return (
    <div className="xnext">
      <p className="xnext__kicker">Still being built</p>

      <TextReveal
        lines={["THE NEXT CHAPTER", "IS STILL BEING", "BUILT."]}
        as="h2"
        className="xnext__title"
        accentIndex={2}
      />

      <p className="xnext__lede">
        The work continues — Angular architecture, modern React and Next.js, and product surfaces where AI actually
        earns its place. Still learning, still shipping, still solving problems worth solving.
      </p>

      <div className="xnext__line" aria-hidden>
        <motion.span
          className="xnext__line-fill"
          initial={reduce ? { opacity: 1 } : { scaleX: 0 }}
          whileInView={reduce ? { opacity: 1 } : { scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: reduce ? 0.2 : 1.1, ease }}
        />
        <motion.span
          className="xnext__line-node"
          initial={reduce ? { opacity: 1 } : { scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: reduce ? 0.2 : 0.4, delay: reduce ? 0 : 0.2, ease }}
        />
      </div>
    </div>
  );
}
