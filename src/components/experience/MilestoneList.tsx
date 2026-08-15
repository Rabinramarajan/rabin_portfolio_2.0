"use client";

import { motion } from "motion/react";
import { careerMilestones } from "@/content/experience";
import { ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/**
 * MILESTONES — real, dated turning points and why each one mattered.
 *
 * The rows are content, not controls: there is nothing here to activate, so
 * they are deliberately NOT focusable. Adding tabindex would hand keyboard
 * users five dead stops in exchange for a hover flourish they cannot use.
 * The marker emphasis is a pointer affordance only; every row reads
 * identically without it.
 */

export function MilestoneList() {
  const reduce = useReducedMotionSafe();

  return (
    <ol className="xms">
      {careerMilestones.map((m, i) => (
        <motion.li
          className="xms__row"
          key={m.id}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0.2 : 0.5, delay: reduce ? 0 : i * 0.06, ease }}
        >
          <span className="xms__marker" aria-hidden />
          <p className="xms__year">{m.year}</p>
          <div className="xms__body">
            <h3 className="xms__event">{m.event}</h3>
            <p className="xms__why">{m.why}</p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
