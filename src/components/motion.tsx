"use client";

import { motion, useReducedMotion } from "motion/react";
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
   Desktop / fine-pointer only; GSAP quickTo for 60fps tracking.
   Adds subtle scale on hover and arrow rotation for premium feel.
------------------------------------------------------------------ */
export function Magnetic({
  children,
  className,
  strength = 8,
  scale = 1.04,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  scale?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let raf: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let hovering = false;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      currentX = lerp(currentX, targetX, 0.15);
      currentY = lerp(currentY, targetY, 0.15);

      if (Math.abs(currentX) < 0.01 && Math.abs(currentY) < 0.01) {
        currentX = 0;
        currentY = 0;
      }

      el.style.transform = `translate(${currentX}px, ${currentY}px)${hovering ? ` scale(${scale})` : ""}`;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      targetX = dx * strength;
      targetY = dy * strength;
    };

    const onEnter = () => {
      hovering = true;
    };

    const onLeave = () => {
      hovering = false;
      targetX = 0;
      targetY = 0;
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.style.transform = "";
    };
  }, [reduce, strength, scale]);

  if (reduce) {
    return <div className={cn("magnetic", className)}>{children}</div>;
  }

  return (
    <div ref={ref} className={cn("magnetic", className)}>
      {children}
    </div>
  );
}
