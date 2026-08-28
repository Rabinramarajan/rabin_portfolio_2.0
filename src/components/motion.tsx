"use client";

/**
 * Motion Components — ALL MOTION EFFECTS DISABLED
 * These are passthrough components with no animations
 */

import type { ReactNode } from "react";

/* TextReveal — Passthrough component with no animation */
export function TextReveal({
  lines,
  className,
  accentIndex,
  delay = 0,
  lineDuration = 0.6,
  as = "h2",
  staggerLines = 0.08,
  staggerWords = 0.03,
  staggerChars = 0.02,
  mode = "line",
}: {
  lines: string[];
  className?: string;
  accentIndex?: number | number[];
  delay?: number;
  lineDuration?: number;
  as?: string;
  staggerLines?: number;
  staggerWords?: number;
  staggerChars?: number;
  mode?: "line" | "word" | "character" | "fade";
}) {
  const Component = as || "h2";
  return (
    <div className={className}>
      {lines.map((line, i) => (
        <div key={i} className="tr__line">
          <span className={accentIndex === i || (Array.isArray(accentIndex) && accentIndex.includes(i)) ? "acc" : ""}>{line}</span>
        </div>
      ))}
    </div>
  );
}

/* Magnetic — Passthrough component with no animation */
export function Magnetic({
  children,
  strength = 0,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
