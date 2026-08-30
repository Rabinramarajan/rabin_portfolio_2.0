"use client";

import Image from "next/image";
import { useReducedMotion, motion } from "motion/react";
import { duration, ease } from "@/lib/motion";
import { media } from "@/lib/media";

export interface PremiumContactCenterVisualProps {
  children?: React.ReactNode;
}

export function PremiumContactCenterVisual({ children }: PremiumContactCenterVisualProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="premium-contact-center-visual"
      aria-label="Global presence orbital visualization showing worldwide connections"
      role="img"
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: reduce ? duration.micro : duration.section,
        ease,
        delay: reduce ? 0 : 0.2,
      }}
    >
      {/* Custom content or default globe image */}
      {children ? (
        children
      ) : (
        <Image
          src={media("other/contact/globe.png")}
          alt="Global orbital network visualization representing Rabin R's worldwide presence and connectivity"
          fill
          priority
          className="premium-contact-center-visual__image"
          sizes="(max-width: 560px) 24rem, (max-width: 1023px) 34rem, 46vw"
        />
      )}
    </motion.div>
  );
}
