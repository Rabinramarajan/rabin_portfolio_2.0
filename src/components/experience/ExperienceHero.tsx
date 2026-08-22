"use client";

import { motion } from "motion/react";
import { ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { SmartImage } from "@/components/SmartImage";
import { TextReveal } from "@/components/motion";
import { StatPills } from "./StatPills";
import { SectionKicker } from "@/components/ui";

/**
 * EXPERIENCE HERO.
 *
 * Two columns that collapse to one: the headline and the numbers on the left,
 * the ascent artwork on the right. The artwork is the LCP element on this
 * route, so it is `priority` and carries explicit dimensions — the hero is
 * sized by its content rather than by the viewport, because a short headline
 * on a full-height stage just reads as an empty screen.
 */
export function ExperienceHero() {
  const reduce = useReducedMotionSafe();

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.2 : 0.6, delay: reduce ? 0 : delay, ease },
  });

  return (
    <header className="xhero">
      <div className="shell xhero__grid">
        <div className="xhero__copy">
          <motion.div {...rise(0)}>
            <SectionKicker index="05" label="Experience" />
          </motion.div>

          <TextReveal
            lines={["My Journey.", "Real Impact."]}
            as="h1"
            className="xhero__title"
            delay={0.05}
            accentIndex={1}
          />

          <motion.p className="xhero__lede" {...rise(0.4)}>
            A timeline of growth, challenges and shipped work — the chapters that shaped how I
            build today.
          </motion.p>

          <motion.div {...rise(0.52)}>
            <StatPills />
          </motion.div>
        </div>

        <motion.div
          className="xhero__art"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduce ? 0.2 : 1, ease }}
        >
          <SmartImage
            src="/media/experience/banner_img.png"
            alt="A climber at the summit looking up a glowing path that switchbacks toward a flag on the next peak"
            width={1536}
            height={1024}
            priority
            sizes="(max-width: 900px) 100vw, 52vw"
            className="xhero__img"
          />
        </motion.div>
      </div>
    </header>
  );
}
