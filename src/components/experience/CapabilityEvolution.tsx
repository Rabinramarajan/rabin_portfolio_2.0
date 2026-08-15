"use client";

import { motion } from "motion/react";
import { capabilityEvolution } from "@/content/experience";
import { ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/**
 * WHAT CHANGED — four editorial statements about how the work itself evolved.
 *
 * No cards, no boxes: typography, a rule that draws itself, and space. Each
 * row reveals from a different direction so the section never settles into a
 * single repeated gesture.
 */

export function CapabilityEvolution() {
  const reduce = useReducedMotionSafe();

  return (
    <ol className="xcap">
      {capabilityEvolution.map((step, i) => {
        const offset =
          step.from === "left" ? { x: -28 } : step.from === "right" ? { x: 28 } : { y: 26 };

        return (
          <li className="xcap__row" key={step.number}>
            <motion.p
              className="xcap__num"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.86 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: reduce ? 0.2 : 0.5, ease }}
            >
              {step.number}
            </motion.p>

            <div className="xcap__body">
              {/* observed on the unclipped mask, not on the clipped line */}
              <motion.h3
                className="xcap__title-mask"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.5 }}
              >
                <motion.span
                  className="xcap__key"
                  variants={{
                    hidden: reduce ? { opacity: 0 } : { y: "108%" },
                    show: reduce
                      ? { opacity: 1, transition: { duration: 0.2 } }
                      : { y: "0%", transition: { duration: 0.68, delay: 0.06, ease } },
                  }}
                >
                  {step.key}
                </motion.span>
              </motion.h3>

              <motion.span
                className="xcap__rule"
                aria-hidden
                initial={reduce ? { opacity: 0 } : { scaleX: 0 }}
                whileInView={reduce ? { opacity: 1 } : { scaleX: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: reduce ? 0.2 : 0.7, delay: reduce ? 0 : 0.18, ease }}
              />

              <motion.div
                className="xcap__copy"
                initial={reduce ? { opacity: 0 } : { opacity: 0, ...offset }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: reduce ? 0.2 : 0.6, delay: reduce ? 0 : 0.24 + i * 0.02, ease }}
              >
                <p className="xcap__lead">{step.title}</p>
                <p className="xcap__desc">{step.description}</p>
                <p className="xcap__evidence">{step.evidence}</p>
              </motion.div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
