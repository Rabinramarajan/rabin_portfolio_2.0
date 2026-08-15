import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function ArrowLink({
  href,
  children,
  className,
  label,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <Link href={href} className={cn("arrow-link", className)} aria-label={label}>
      {children}
      <svg viewBox="0 0 16 16" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M2 8h11M9 4l4 4-4 4" />
      </svg>
    </Link>
  );
}