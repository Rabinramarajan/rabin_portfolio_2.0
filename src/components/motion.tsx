"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useMemo, type ReactNode } from "react";
import { duration, ease, stagger } from "@/lib/motion";
import { cn } from "@/lib/cn";

/* ============================================================
   CENTRAL MOTION SYSTEM
   One rhythm, one easing, one vocabulary across the site.
   Every primitive here respects prefers-reduced-motion and only
   animates transform / opacity / clip-path / filter.
   ============================================================ */


/* ------------------------------------------------------------------
   TextReveal — multi-mode text animation for display type.

   Modes:
     line     — line-by-line mask reveal (default, existing behaviour)
     word     — word-by-word staggered reveal
     character — character-by-character stagger (short text only)
     fade     — simple fade + lift

   Each mode uses overflow-hidden masks so text emerges cleanly.
   The `*…*` accent syntax is supported in all modes.
------------------------------------------------------------------ */

type RevealMode = "line" | "word" | "character" | "fade";

/** Split `*accented*` runs into plain / accent spans. */
function accentSegments(text: string): React.ReactNode[] {
  const parts = text.split("*");
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="acc">{part}</span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

/** Split a line into words, preserving accent syntax. */
function splitWords(line: string): string[] {
  return line.split(/(\s+)/).filter(Boolean);
}

/** Split a line into characters (ignoring spaces). */
function splitChars(line: string): { char: string; isSpace: boolean }[] {
  return [...line].map((char) => ({ char, isSpace: char === " " }));
}

/* ── Variants by mode ─────────────────────────────────────────── */

const lineVariants = (reduce: boolean, delay: number, dur: number, i: number, stag: number) => ({
  hidden: reduce ? { opacity: 0 } : { y: "112%" },
  show: reduce
    ? { opacity: 1, transition: { duration: duration.micro } }
    : { y: "0%", transition: { duration: dur, delay: delay + i * stag, ease } },
});

const wordVariants = (reduce: boolean, delay: number, dur: number, i: number, stag: number) => ({
  hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 14, filter: "blur(4px)" },
  show: reduce
    ? { opacity: 1, transition: { duration: duration.micro } }
    : {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: dur, delay: delay + i * stag, ease },
      },
});

const charVariants = (reduce: boolean, delay: number, dur: number, i: number, stag: number) => ({
  hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 10 },
  show: reduce
    ? { opacity: 1, transition: { duration: duration.micro } }
    : {
        opacity: 1,
        y: 0,
        transition: { duration: dur, delay: delay + i * stag, ease },
      },
});

const fadeVariants = (reduce: boolean, delay: number, dur: number) => ({
  hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
  show: reduce
    ? { opacity: 1, transition: { duration: duration.micro } }
    : { opacity: 1, y: 0, transition: { duration: dur, delay, ease } },
});

/* ── Component ────────────────────────────────────────────────── */

export function TextReveal({
  lines,
  className,
  accentIndex,
  delay = 0,
  lineDuration = duration.section,
  as = "h2",
  mode = "line",
  stagger: stag,
}: {
  lines: string[];
  className?: string;
  accentIndex?: number;
  delay?: number;
  lineDuration?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  mode?: RevealMode;
  stagger?: number;
}) {
  const reduce = !!useReducedMotion();
  const Tag = motion[as];
  const dur = reduce ? duration.micro : lineDuration;
  const s = stag ?? (mode === "character" ? 0.02 : mode === "word" ? 0.04 : stagger);

  /* ── LINE MODE (existing behaviour, unchanged) ── */
  if (mode === "line") {
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
              variants={lineVariants(reduce, delay, dur, i, s)}
            >
              {accentSegments(line)}
            </motion.span>
          </span>
        ))}
      </Tag>
    );
  }

  /* ── WORD MODE ── */
  if (mode === "word") {
    let wordIdx = 0;
    return (
      <Tag
        className={cn("tr__words", className)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3, margin: "0px 0px -6% 0px" }}
      >
        {lines.map((line, lineIdx) => (
          <span key={lineIdx} className="tr__word-row">
            {splitWords(line).map((token) => {
              if (/^\s+$/.test(token)) {
                return <span key={wordIdx++} className="tr__word-space"> </span>;
              }
              const idx = wordIdx++;
              return (
                <span key={idx} className="tr__word-mask">
                  <motion.span
                    className={cn("tr__word", lineIdx === accentIndex && "tr__word--accent")}
                    variants={wordVariants(reduce, delay, dur, idx, s)}
                  >
                    {accentSegments(token)}
                  </motion.span>
                </span>
              );
            })}
          </span>
        ))}
      </Tag>
    );
  }

  /* ── CHARACTER MODE (short text only) ── */
  if (mode === "character") {
    let charIdx = 0;
    return (
      <Tag
        className={cn("tr__chars", className)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3, margin: "0px 0px -6% 0px" }}
      >
        {lines.map((line, lineIdx) => (
          <span key={lineIdx} className="tr__char-row">
            {splitChars(line).map(({ char, isSpace }) => {
              if (isSpace) {
                return <span key={charIdx++} className="tr__char-space"> </span>;
              }
              const idx = charIdx++;
              return (
                <span key={idx} className="tr__char-mask">
                  <motion.span
                    className={cn("tr__char", lineIdx === accentIndex && "tr__char--accent")}
                    variants={charVariants(reduce, delay, dur, idx, s)}
                  >
                    {char}
                  </motion.span>
                </span>
              );
            })}
          </span>
        ))}
      </Tag>
    );
  }

  /* ── FADE MODE (simple fade + lift) ── */
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3, margin: "0px 0px -6% 0px" }}
    >
      {lines.map((line, i) => (
        <motion.span
          key={i}
          className={cn("tr__fade-line", i === accentIndex && "tr__fade-line--accent")}
          style={{ display: "block" }}
          variants={fadeVariants(reduce, delay + i * s, dur)}
        >
          {accentSegments(line)}
        </motion.span>
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
