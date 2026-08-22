"use client";

import { motion } from "motion/react";
import { ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { SmartImage } from "@/components/SmartImage";
import { TextReveal } from "@/components/motion";
import { StatPills } from "./StatPills";
import { SectionKicker } from "@/components/ui";
import { accentIndex, journeyArt, sections, titleLines } from "@/content/sections";

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
  // Same copy as the homepage journey block — this route is its long form.
  const intro = sections.journey;

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
            <SectionKicker index={intro.index} label={intro.label} />
          </motion.div>

          <TextReveal
            lines={titleLines(intro)}
            as="h1"
            className="xhero__title"
            delay={0.05}
            accentIndex={accentIndex(intro)}
          />

          <motion.p className="xhero__lede" {...rise(0.4)}>
            {intro.lede}
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
            {...journeyArt}
            priority
            sizes="(max-width: 900px) 100vw, 52vw"
            className="xhero__img"
          />
        </motion.div>
      </div>
    </header>
  );
}
