"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

export function ClipReveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn("shot", className)}
      initial={reduce ? false : { clipPath: "inset(12% 0 0 0)", scale: 1.04 }}
      whileInView={{ clipPath: "inset(0% 0 0 0)", scale: 1 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: reduce ? duration.micro : duration.cinematic, ease }}
    >
      {children}
    </motion.div>
  );
}

export function InView({ children, className, y = 24 }: { children: ReactNode; className?: string; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: reduce ? duration.micro : duration.section, ease }}
    >
      {children}
    </motion.div>
  );
}

export function ParallaxFrame({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [14, -14]);
  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}
