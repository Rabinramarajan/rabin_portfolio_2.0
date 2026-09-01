import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="btn__arrow">
      <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

type BtnProps = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "line";
  className?: string;
  "data-cursor"?: string;
  "data-cursor-label"?: string;
  onClick?: () => void;
};

export function Btn({ href, children, variant = "solid", className, ...rest }: BtnProps) {
  return (
    <Link
      href={href}
      className={cn("btn", variant === "solid" ? "btn--solid" : "btn--line", className)}
      {...rest}
    >
      <span className="btn__label">
        {children}
        <Arrow />
      </span>
    </Link>
  );
}

/** "h1" when the section is the whole route; "h2" inside the homepage stack. */
export type SectionHeadingLevel = "h1" | "h2";

/**
 * The heading level for the items listed inside a section.
 *
 * A section title is an h1 when the section is the whole route and an h2 in
 * the homepage stack. Item titles were hardcoded to h3, so on the standalone
 * routes the h2 tier vanished and the document jumped h1 -> h3. Deriving the
 * level keeps the outline contiguous in both placements.
 */
export function itemHeadingLevel(level: SectionHeadingLevel): "h2" | "h3" {
  return level === "h1" ? "h2" : "h3";
}

/**
 * The single section eyebrow used across every section and page hero:
 * an accent `// NN` index followed by a muted label. Sections pass their own
 * layout class through `className`; the typography always comes from here.
 */
export function SectionKicker({
  index,
  label,
  className,
}: {
  index: string;
  label: string;
  className?: string;
}) {
  return (
    <p className={cn("sec-kicker", className)}>
      <span className="sec-kicker__index">{`// ${index}`}</span>
      <span className="sec-kicker__label">{label}</span>
    </p>
  );
}