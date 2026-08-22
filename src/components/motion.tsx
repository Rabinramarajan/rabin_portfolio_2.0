"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { duration, ease, stagger } from "@/lib/motion";
import { cn } from "@/lib/cn";

/* ============================================================
   CENTRAL MOTION SYSTEM
   One rhythm, one easing, one vocabulary across the site.
   Every primitive here respects prefers-reduced-motion and only
   animates transform / opacity / clip-path.
   ============================================================ */


/* ------------------------------------------------------------------
   TextReveal — line-by-line masked reveal for display type.
   Each line sits in an overflow-hidden mask; the inner span travels
   up 112% → 0%. Optional accent on a single line.
------------------------------------------------------------------ */
export function TextReveal({
  lines,
  className,
  accentIndex,
  delay = 0,
  lineDuration = duration.section,
  as = "h2",
}: {
  lines: string[];
  className?: string;
  accentIndex?: number;
  delay?: number;
  lineDuration?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  /*
   * The observer has to watch the heading, never the inner line. Each line
   * starts translated fully outside its overflow-hidden mask, so an observer
   * on the line itself reports an intersection ratio of ~0 and a viewport
   * `amount` above 0 can never be satisfied — the reveal would never fire.
   * Watching the unclipped wrapper and driving the lines through variants
   * keeps the stagger without that trap.
   */
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35, margin: "0px 0px -8% 0px" }}
    >
      {lines.map((line, i) => (
        <span key={line} className="tr__mask">
          <motion.span
            className={cn("tr__line", i === accentIndex && "tr__line--accent")}
            style={{ display: "block" }}
            variants={{
              hidden: reduce ? { opacity: 0 } : { y: "112%" },
              show: reduce
                ? { opacity: 1, transition: { duration: duration.micro } }
                : {
                    y: "0%",
                    transition: { duration: lineDuration, delay: delay + i * stagger, ease },
                  },
            }}
          >
            {/*
             * `*…*` marks an accented run inside a line, so a heading can tint
             * a phrase without the caller having to split it into its own line.
             */}
            {line.split("*").map((part, p) =>
              p % 2 === 1 ? (
                <span key={p} className="acc">
                  {part}
                </span>
              ) : (
                part
              ),
            )}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}


/* ------------------------------------------------------------------
   Magnetic — pointer-attracted wrapper for primary CTAs.
   Desktop / fine-pointer only; springs for a weighted feel.
------------------------------------------------------------------ */
export function Magnetic({
  children,
  className,
  strength = 8,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 160, damping: 16, mass: 0.35 });
  const y = useSpring(useMotionValue(0), { stiffness: 160, damping: 16, mass: 0.35 });

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      x.set(dx * strength);
      y.set(dy * strength);
    };
    const reset = () => {
      x.set(0);
      y.set(0);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
    };
  }, [reduce, strength, x, y]);

  return (
    <motion.div
      ref={ref}
      className={cn("magnetic", className)}
      style={{ x: reduce ? 0 : x, y: reduce ? 0 : y }}
    >
      {children}
    </motion.div>
  );
}
