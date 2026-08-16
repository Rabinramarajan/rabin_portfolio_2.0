"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { SectionKicker } from "@/components/ui";
import { TextReveal } from "@/components/motion";
import { duration, ease } from "@/lib/motion";
import { CareerTimeline } from "@/components/experience/CareerTimeline";
import { JourneySummary } from "@/components/experience/JourneySummary";
import { StatPills } from "@/components/experience/StatPills";

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

  return (
    <section id="journey" className="section jsec" aria-labelledby="journey-heading">
      <div className="shell">
        <SectionKicker index="04" label="Experience" />

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduce ? duration.micro : duration.section, ease }}
        >
          <div id="journey-heading">
            <TextReveal
              lines={["My Journey.", "Real Impact."]}
              as="h2"
              className="sec-title"
              accentIndex={1}
            />
          </div>
          <p className="sec-lede">
            A timeline of growth, challenges and shipped work — the chapters that shaped how I
            build today.
          </p>

          <StatPills className="xhero__stats--section" />
        </motion.div>

        <CareerTimeline limit={4} />

        <JourneySummary />

        <motion.p
          className="jsec__more"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? duration.micro : duration.ui, ease }}
        >
          <Link href="/experience" className="jsec__link">
            The full timeline
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
              <path d="M2 8h11M9 4l4 4-4 4" />
            </svg>
          </Link>
        </motion.p>
      </div>
    </section>
  );
}
