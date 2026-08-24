"use client";

import { motion } from "motion/react";
import { processPrinciples } from "@/content/process";
import { ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/**
 * Operating principles — a hairline instrument band rather than a card grid.
 *
 * Five cells divided by rules, in the same HUD typography as the conduit above.
 * The column count is chosen so the last row is never left with an orphan:
 * five across on wide screens, two across with the fifth spanning the full
 * width at mid widths, and a single stacked column on phones.
 */

const ICONS: React.ReactNode[] = [
  /* Clear communication — signal target */
  <g key="0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" />
  </g>,
  /* Small, reviewable iterations — link */
  <g key="1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none">
    <path d="M8 12h8M15 8l5 4-5 4M9 8L4 12l5 4" />
  </g>,
  /* Engineering with context — shield-check */
  <g key="2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none">
    <path d="M12 3.5 5 6.5v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9v-5z" />
    <path d="m9 12.5 2.2 2.2L15 10.5" />
  </g>,
  /* Quality throughout — eye */
  <g key="3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none">
    <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </g>,
  /* Build for the next release — trending up */
  <g key="4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none">
    <path d="m4 17 5-5 3 3 7-8" />
    <path d="M15 7h4v4" />
  </g>,
];

export function ProcessPrinciples() {
  const reduce = useReducedMotionSafe();

  return (
    <section className="pprin" aria-labelledby="pprin-title">
      <header className="pprin__head">
        <h3 className="pprin__kicker" id="pprin-title">
          <span aria-hidden>{"//"}</span> Operating principles
        </h3>
        <p className="pprin__intro">
          The habits that hold across every stage of the conduit — regardless of the product or the stack.
        </p>
      </header>

      <motion.ol
        className="pprin__band"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-12%" }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduce ? 0 : 0.07 } },
        }}
      >
        {processPrinciples.map((p, i) => (
          <motion.li
            key={p.title}
            className="pprin__cell"
            variants={{
              hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 14 },
              show: { opacity: 1, y: 0, transition: { duration: 0.52, ease } },
            }}
          >
            <span className="pprin__scan" aria-hidden />
            <p className="pprin__ord" aria-hidden>
              P{i + 1}
            </p>
            <span className="pprin__icon" aria-hidden>
              <svg viewBox="0 0 24 24" width={22} height={22} focusable="false">
                {ICONS[i]}
              </svg>
            </span>
            <p className="pprin__title">{p.title}</p>
            <p className="pprin__body">{p.body}</p>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}
