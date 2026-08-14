"use client";

import { motion, type Variants } from "motion/react";
import { ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { cn } from "@/lib/cn";

/**
 * Headline lines revealed through a clip-path wipe rather than a fade-up.
 *
 * The viewport observer sits on the unclipped wrapper on purpose: an element
 * whose own initial state is `inset(0 0 100% 0)` has a zero-height intersection
 * rect, so observing it directly would mean whileInView never fires.
 */
export function LineReveal({ lines, className }: { lines: readonly string[]; className?: string }) {
  const reduce = useReducedMotionSafe();

  const line: Variants = {
    hidden: reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)", y: "0.14em" },
    show: reduce
      ? { opacity: 1, transition: { duration: 0.15 } }
      : { clipPath: "inset(0 0 0% 0)", y: 0, transition: { duration: 0.78, ease } },
  };

  return (
    <motion.span
      className={cn("lrev", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12%" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.1 } } }}
    >
      {lines.map((text) => (
        <span className="lrev__line" key={text}>
          <motion.span className="lrev__inner" variants={line}>
            {text}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
