"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { duration, ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { cn } from "@/lib/cn";
import { media } from "@/lib/media";

/**
 * Decorative orbital artwork beside the FAQ list — the brand mark inside a
 * glass sphere, ringed by orbits and satellite chips.
 *
 * The artwork is a raster, so the frame does the compositing: a radial mask
 * dissolves the square edges into the page background and an accent bloom sits
 * underneath. Purely presentational — `aria-hidden`, empty alt, and the only
 * motion is a slow transform float that stops under prefers-reduced-motion.
 */
export function FaqOrbit({ className }: { className?: string }) {
  const reduce = useReducedMotionSafe();

  return (
    <motion.div
      className={cn("faqx-orbit", reduce && "faqx-orbit--still", className)}
      aria-hidden
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: reduce ? duration.ui : duration.cinematic, ease }}
    >
      <span className="faqx-orbit__bloom" />
      <Image
        src={media("other/faq/orbit.png")}
        alt=""
        width={1536}
        height={1024}
        sizes="(min-width: 1024px) 34vw, 90vw"
        className="faqx-orbit__art"
      />
    </motion.div>
  );
}
