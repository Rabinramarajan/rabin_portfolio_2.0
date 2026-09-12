"use client";

/**
 * Motion primitives — currently render-only.
 *
 * `TextReveal` and `Magnetic` keep the markup and prop shape their call sites
 * rely on, but the animations are disabled; the extra timing props are
 * accepted and ignored so the sites can be re-animated without churn.
 *
 * `as` is NOT one of those ignored props — it sets the heading level, so call
 * sites passing `as="h1"` depend on it reaching the DOM. Dropping it silently
 * left /about, /experience, /insights and every /services/* route with no h1.
 */

import type { ReactNode } from "react";

type TextRevealTag = "h1" | "h2" | "h3" | "h4" | "p" | "div";

type TextRevealProps = {
  lines: string[];
  className?: string;
  accentIndex?: number | number[];
  delay?: number;
  lineDuration?: number;
  as?: TextRevealTag;
  staggerLines?: number;
  staggerWords?: number;
  staggerChars?: number;
  mode?: "line" | "word" | "character" | "fade";
};

/**
 * Splits a line on `*…*` accent runs.
 *
 * Content files mark accented phrases inline (`'that are *fast, scalable* and'`)
 * as an alternative to `accentIndex`, which can only accent a whole line. Until
 * this existed the markers were rendered literally, so the /about headline read
 * "that are *fast, scalable* and" on the page and in its `<h1>`.
 */
function splitAccents(line: string): { text: string; accent: boolean }[] {
  return line
    .split(/(\*[^*]+\*)/g)
    .filter((part) => part !== "")
    .map((part) =>
      part.startsWith("*") && part.endsWith("*") && part.length > 2
        ? { text: part.slice(1, -1), accent: true }
        : { text: part, accent: false },
    );
}

export function TextReveal({ lines, className, accentIndex, as: Tag = "div" }: TextRevealProps) {
  const isAccent = (i: number) =>
    accentIndex === i || (Array.isArray(accentIndex) && accentIndex.includes(i));

  return (
    <Tag className={className}>
      {lines.map((line, i) => {
        const parts = splitAccents(line);
        // A whole-line accent still wins; inline markers apply otherwise.
        const lineAccent = isAccent(i);
        return (
          <span key={i} className="tr__line">
            {parts.map((part, j) => (
              <span key={j} className={lineAccent || part.accent ? "acc" : ""}>
                {part.text}
              </span>
            ))}
          </span>
        );
      })}
    </Tag>
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
