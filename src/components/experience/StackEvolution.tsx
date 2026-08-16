"use client";

import { motion } from "motion/react";
import { stackEvolution, stackSourceLabel, stackYears } from "@/content/experience";
import { StackTechIcon } from "@/components/StackTechIcon";
import { ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/**
 * THE STACK EVOLVED — a horizontal technical stream, not a skill chart.
 *
 * Line length encodes *when a technology entered the toolkit*, never how good
 * anyone is at it. There are no percentages, bars or radars here on purpose:
 * a technology that arrived in 2026 has a short line because it is new, and
 * that is the only thing the length means.
 */

const COLUMN_AT: Record<string, number> = { "2021": 0, "2022": 1, "2026": 2 };

export function TechnologyEvolution() {
  const reduce = useReducedMotionSafe();
  const columns = stackYears.length;

  return (
    <div className="xstk">
      <div className="xstk__years" aria-hidden>
        {stackYears.map((y) => (
          <span key={y}>{y}</span>
        ))}
      </div>

      <ul className="xstk__list">
        {stackEvolution.map((track, i) => {
          /* the stream starts at the column the technology entered at */
          const start = (COLUMN_AT[track.enteredAt] ?? 0) / columns;
          const width = (1 - start) * 100;

          return (
            <li
              className="xstk__row"
              key={track.id}
              data-active={track.active ? "true" : "false"}
              style={{ ["--start" as string]: `${start * 100}%`, ["--width" as string]: `${width}%` }}
            >
              <motion.span
                className="xstk__label"
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: reduce ? 0.2 : 0.42, delay: reduce ? 0 : i * 0.045, ease }}
              >
                <StackTechIcon label={track.label} className="xstk__icon" />
                {track.label}
              </motion.span>

              <span className="xstk__track" aria-hidden>
                <motion.span
                  className="xstk__stream"
                  initial={reduce ? { opacity: 0 } : { scaleX: 0 }}
                  whileInView={reduce ? { opacity: 1 } : { scaleX: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: reduce ? 0.2 : 0.72, delay: reduce ? 0 : 0.08 + i * 0.045, ease }}
                />
                <motion.span
                  className="xstk__node"
                  initial={reduce ? { opacity: 0 } : { scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: reduce ? 0.2 : 0.4, delay: reduce ? 0 : 0.6 + i * 0.045, ease }}
                />
              </span>

              <span className="xstk__meta">
                <span className="xstk__entered">{track.enteredAt}</span>
                <span className="xstk__source">{stackSourceLabel[track.source] ?? track.source}</span>
              </span>
            </li>
          );
        })}
      </ul>

      <p className="xstk__foot">
        Line length shows when a technology entered the toolkit — not proficiency. Each entry is anchored to the
        engagement or study that evidences it.
      </p>
    </div>
  );
}
