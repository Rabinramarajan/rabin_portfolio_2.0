"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Magnetic } from "@/components/motion";
import { cn } from "@/lib/cn";

export function MagneticButton({
  href,
  children,
  variant = "solid",
  className,
  strength = 8,
  "data-cursor": dataCursor,
  "data-cursor-label": dataCursorLabel,
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "line";
  className?: string;
  strength?: number;
  "data-cursor"?: string;
  "data-cursor-label"?: string;
}) {
  return (
    <Magnetic strength={strength}>
      <Link
        href={href}
        className={cn("btn", variant === "solid" ? "btn--solid" : "btn--line", className)}
        {...(dataCursor ? { "data-cursor": dataCursor } : {})}
        {...(dataCursorLabel ? { "data-cursor-label": dataCursorLabel } : {})}
      >
        <span className="btn__label">
          {children}
          <svg viewBox="0 0 16 16" aria-hidden className="btn__arrow">
            <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </span>
      </Link>
    </Magnetic>
  );
}