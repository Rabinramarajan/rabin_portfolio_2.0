import { cn } from "@/lib/cn";

/**
 * RR monogram — two geometric "R" glyphs interlocked on a shared spine.
 * Drawn as strokes so it renders crisply at 16px and reads as a single mark.
 */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 48"
      fill="none"
      aria-hidden
      className={cn("monogram", className)}
    >
      {/* R1 — stem + bowl + leg */}
      <g>
        <path d="M10 6 V38" stroke="currentColor" strokeWidth="4.4" strokeLinecap="round" />
        <path
          d="M10 6 H26 L32 12 V20 L26 26 H10"
          stroke="currentColor"
          strokeWidth="4.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M10 26 L30 42" stroke="currentColor" strokeWidth="4.4" strokeLinecap="round" />
      </g>
      {/* R2 — offset right, shares the baseline and bowl rhythm */}
      <g>
        <path d="M34 6 V38" stroke="var(--color-accent)" strokeWidth="4.4" strokeLinecap="round" />
        <path
          d="M34 6 H50 L56 12 V20 L50 26 H34"
          stroke="var(--color-accent)"
          strokeWidth="4.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M34 26 L54 42" stroke="var(--color-accent)" strokeWidth="4.4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/**
 * Logo lockup — mark + wordmark. `tag` renders a small technical line beneath
 * the name (used in the footer). Color of the mark follows currentColor.
 */
export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("logo", className)}>
      <span className="logo__mark">
        <Monogram />
      </span>
      {showWordmark ? (
        <span className="logo__name">
          RABIN <em>R</em>
        </span>
      ) : null}
    </span>
  );
}