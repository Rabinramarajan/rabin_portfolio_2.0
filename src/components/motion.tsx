"use client";

/**
 * Motion primitives — currently render-only.
 *
 * `TextReveal` and `Magnetic` keep the markup and prop shape their call sites
 * rely on, but the animations are disabled; the extra timing props are
 * accepted and ignored so the sites can be re-animated without churn.
 */

import type { ReactNode } from "react";

type TextRevealProps = {
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
};

export function TextReveal({ lines, className, accentIndex }: TextRevealProps) {
  const isAccent = (i: number) =>
    accentIndex === i || (Array.isArray(accentIndex) && accentIndex.includes(i));

  return (
    <div className={className}>
      {lines.map((line, i) => (
        <div key={i} className="tr__line">
          <span className={isAccent(i) ? "acc" : ""}>{line}</span>
        </div>
      ))}
    </div>
  );
}

type MagneticProps = {
  children: ReactNode;
  strength?: number;
  className?: string;
};

export function Magnetic({ children, className }: MagneticProps) {
  return <div className={className}>{children}</div>;
}
