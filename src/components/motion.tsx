"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

/* ============================================================
   CENTRAL MOTION SYSTEM
   One rhythm, one easing, one vocabulary across the site.
   Every primitive here respects prefers-reduced-motion and only
   animates transform / opacity / clip-path.
   ============================================================ */

/* ------------------------------------------------------------------
   Parallax — scroll-linked vertical drift. speed is the fraction of
   range (in px) that an element travels; 0.05 bg → 0.30 foreground.
------------------------------------------------------------------ */
export function Parallax({
  children,
  className,
  speed = 0.15,
  range = 60,
  style,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
  range?: number;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [range * speed, -range * speed]);
  return (
    <motion.div ref={ref} className={className} style={{ y, ...style }}>
      {children}
    </motion.div>
  );
}

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
                    transition: { duration: lineDuration, delay: delay + i * 0.08, ease },
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
   ImageReveal — a masked clip-path reveal with an inner image that
   drifts on scroll and settles from a subtle scale.
------------------------------------------------------------------ */
export function ImageReveal({
  children,
  className,
  parallax = 16,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  parallax?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-parallax, parallax]);

  const reveal = {
    duration: reduce ? duration.micro : duration.cinematic,
    delay: reduce ? 0 : delay,
    ease,
  };

  return (
    <motion.figure
      ref={ref}
      className={cn("shot image-reveal", className)}
      initial={reduce ? false : { clipPath: "inset(12% 4% 12% 4%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, amount: 0.35, margin: "-8%" }}
      transition={reveal}
    >
      <motion.div
        className="image-reveal__inner"
        style={{ y }}
        initial={reduce ? false : { scale: 1.06 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.35, margin: "-8%" }}
        transition={reveal}
      >
        {children}
      </motion.div>
    </motion.figure>
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

/* ------------------------------------------------------------------
   useMouseParallax — springs fed by pointer position over a surface.
   Returns sx/sy (springs in a -1..1 range) plus pointer handlers.
   Derive per-layer transforms in the consumer with useTransform.
------------------------------------------------------------------ */
export function useMouseParallax({ strength = 8 } = {}) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 90, damping: 18, mass: 0.6 });
  const active = useRef(false);

  useEffect(() => {
    if (reduce) return;
    const mq = window.matchMedia("(pointer: fine)");
    const sync = () => {
      active.current = mq.matches;
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reduce]);

  const handlers = reduce
    ? {}
    : {
        onPointerMove: (e: ReactPointerEvent<HTMLElement>) => {
          if (!active.current) return;
          const r = e.currentTarget.getBoundingClientRect();
          mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
          my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
        },
        onPointerLeave: () => {
          mx.set(0);
          my.set(0);
        },
      };

  return { sx, sy, handlers, strength };
}

/* ------------------------------------------------------------------
   ScrollProgress — a thin accent bar that tracks page scroll.
   Fixed, non-interactive, hidden under reduced motion.
------------------------------------------------------------------ */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  if (reduce) return null;
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden />;
}