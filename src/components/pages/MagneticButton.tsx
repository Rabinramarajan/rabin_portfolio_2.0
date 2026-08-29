"use client";

import type { ReactNode } from "react";
import { Magnetic } from "@/components/motion";
import { Btn } from "@/components/ui";

/**
 * `Btn` wrapped in the magnetic hover shell used by the standalone page CTAs.
 * The link markup itself lives in `Btn` so both call sites stay identical.
 */
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
      <Btn
        href={href}
        variant={variant}
        className={className}
        {...(dataCursor ? { "data-cursor": dataCursor } : {})}
        {...(dataCursorLabel ? { "data-cursor-label": dataCursorLabel } : {})}
      >
        {children}
      </Btn>
    </Magnetic>
  );
}
