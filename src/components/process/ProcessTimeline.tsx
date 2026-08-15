"use client";

import { motion } from "motion/react";
import type { ProcessStep } from "@/content/types";
import { ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/**
 * PROCESS TIMELINE — a zigzag, week-by-week map of the engagement.
 *
 * Same shape as a client-facing project-timeline infographic: numbered nodes
 * alternating left/right of a spine, joined by a dashed connector, each node
 * carrying a small glyph. Content comes straight from `processSteps` — this
 * is the "at a glance" companion to the deep-dive `ProcessJourney` below it.
 */

const ICONS: Record<ProcessStep["id"], React.ReactNode> = {
  discover: (
    <>
      <circle cx="9" cy="9" r="5.5" />
      <path d="M13.2 13.2 18 18" />
    </>
  ),
  define: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="M14.4 7.6 9.6 9.6l-2 4.8 4.8-2z" />
    </>
  ),
  design: (
    <>
      <path d="M15.5 4.5a2 2 0 0 1 2.8 2.8L8 17.6l-4 1 1-4z" />
    </>
  ),
  build: (
    <>
      <path d="M14 4.6a4 4 0 0 1-5 5L4.6 14a2 2 0 0 0 2.8 2.8L12 12.4" />
      <path d="M13 11l4.4 4.4a2 2 0 1 1-2.8 2.8L10.2 13.8" />
    </>
  ),
  test: (
    <>
      <path d="M11 3.6 4.5 6v5c0 4.4 2.9 6.9 6.5 8 3.6-1.1 6.5-3.6 6.5-8V6z" />
      <path d="M7.8 11.2l2.2 2.2 4.2-4.6" />
    </>
  ),
  launch: (
    <>
      <path d="M11 3.5c3.2 1.4 5 4.4 5 8.2-1.7 0-3.4-.4-5-1.4-1.6 1-3.3 1.4-5 1.4 0-3.8 1.8-6.8 5-8.2z" />
      <path d="M8.5 14.5 6.5 17M13.5 14.5l2 2.5" />
      <circle cx="11" cy="9.5" r="1.6" />
    </>
  ),
  evolve: (
    <>
      <path d="M5 9a6 6 0 0 1 10.4-3.6M17 5v3.4h-3.4" />
      <path d="M17 13a6 6 0 0 1-10.4 3.6M5 17v-3.4h3.4" />
    </>
  ),
};

export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  const reduce = useReducedMotionSafe();

  return (
    <ol className="pzt" aria-label="Project timeline, stage by stage">
      <span className="pzt__spine" aria-hidden />
      {steps.map((step, i) => {
        const side = i % 2 === 0 ? "left" : "right";
        return (
          <motion.li
            className="pzt__row"
            key={step.id}
            data-side={side}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduce ? 0.2 : 0.55, delay: reduce ? 0 : i * 0.05, ease }}
          >
            <span className="pzt__node" aria-hidden>
              <svg className="pzt__glyph" viewBox="0 0 22 22" fill="none" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                {ICONS[step.id]}
              </svg>
            </span>

            <div className="pzt__card">
              <p className="pzt__k">
                <span className="pzt__num">{step.number}</span>
                <span className="pzt__label">{step.label}</span>
              </p>
              <h3 className="pzt__title">{step.title}</h3>
              <p className="pzt__desc">{step.purpose}</p>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
