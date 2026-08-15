"use client";

import { motion } from "motion/react";
import { careerMilestones } from "@/content/experience";
import { ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/**
 * MILESTONES — real, dated turning points rendered as blips on a signal line.
 *
 * Each milestone is a spike that draws up from a shared baseline. The rows are
 * content, not controls: deliberately NOT focusable, so the spike emphasis is
 * a pointer affordance only — every row reads identically without it.
 */

export function MilestoneTrace() {
  const reduce = useReducedMotionSafe();

  return (
    <ol className="xbl">
      {careerMilestones.map((m, i) => (
        <motion.li
          className="xbl__row"
          key={m.id}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0.2 : 0.5, delay: reduce ? 0 : i * 0.06, ease }}
        >
          <span className="xbl__spike" aria-hidden>
            <motion.span
              className="xbl__spike-fill"
              initial={reduce ? { opacity: 0 } : { scaleY: 0, opacity: 0 }}
              whileInView={reduce ? { opacity: 1 } : { scaleY: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: reduce ? 0.2 : 0.6, delay: reduce ? 0 : 0.15 + i * 0.06, ease }}
              style={{ transformOrigin: "bottom center" }}
            />
            <motion.span
              className="xbl__dot"
              initial={reduce ? { opacity: 0 } : { scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: reduce ? 0.2 : 0.4, delay: reduce ? 0 : 0.3 + i * 0.06, ease }}
              style={{ transformOrigin: "center" }}
            />
          </span>
          <p className="xbl__year">{m.year}</p>
          <div className="xbl__body">
            <h3 className="xbl__event">{m.event}</h3>
            <p className="xbl__why">{m.why}</p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}