"use client";

import { motion, useReducedMotion } from "motion/react";
import { SectionKicker } from "@/components/ui";
import { TextReveal } from "@/components/motion";
import { duration, ease } from "@/lib/motion";
import { SmartImage } from "@/components/SmartImage";
import { CareerTimeline } from "@/components/experience/CareerTimeline";
import { JourneySummary } from "@/components/experience/JourneySummary";
import { StatPills } from "@/components/experience/StatPills";
import { accentIndex, journeyArt, sections, titleLines } from "@/content/sections";

/**
 * JOURNEY — the career timeline, on the home page.
 *
 * The same components /experience uses, cut to the four most recent chapters
 * so the home page states the shape of the career without becoming the
 * experience page. Everything reads from `careerHorizon` and `about.metrics`,
 * so the two surfaces cannot drift apart.
 */
export function JourneySection() {
  const reduce = useReducedMotion();
  const intro = sections.journey;

  return (
    <section id="journey" className="section jsec" aria-labelledby="journey-heading">
      <div className="shell">
        <div className="jsec__intro xhero__grid">
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduce ? duration.micro : duration.section, ease }}
          >
            <SectionKicker index={intro.index} label={intro.label} />
            <div id="journey-heading">
              <TextReveal
                lines={titleLines(intro)}
                as="h2"
                className="sec-title"
                accentIndex={accentIndex(intro)}
              />
            </div>
            <p className="sec-lede">{intro.lede}</p>

            <StatPills className="xhero__stats--section" />
          </motion.div>

          <motion.div
            className="xhero__art jsec__art"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: reduce ? duration.micro : duration.cinematic, ease }}
          >
            <SmartImage
              {...journeyArt}
              sizes="(max-width: 899px) 100vw, 48vw"
              className="xhero__img"
            />
          </motion.div>
        </div>

        <CareerTimeline limit={4} />

        <JourneySummary />
      </div>
    </section>
  );
}
