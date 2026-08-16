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

export function Btn({
  href,
  children,
  variant = "solid",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "line";
  className?: string;
}) {
  return (
    <Link href={href} className={cn("btn", variant === "solid" ? "btn--solid" : "btn--line", className)}>
      <span className="btn__label">
        {children}
        <Arrow />
      </span>
    </Link>
  );
}

/** "h1" when the section is the whole route; "h2" inside the homepage stack. */
export type SectionHeadingLevel = "h1" | "h2";

export function SectionKicker({ index, label }: { index: string; label: string }) {
  return (
    <p className="sec-kicker">
      <span>{index}</span>
      <span className="kicker-slash">/</span>
      <span>{label}</span>
    </p>
  );
}