"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef, type CSSProperties } from "react";
import { TextReveal } from "@/components/motion";
import { Parallax } from "@/components/motion";
import { journeyMilestones, backgroundCoordinates } from "@/content/journey";
import { JourneyRoute } from "./JourneyRoute";
import { JourneyMilestones } from "./JourneyMilestones";
import { JourneyParticles } from "./JourneyParticles";
import { duration, ease } from "@/lib/motion";
import { SectionKicker } from "@/components/ui";

/**
 * JOURNEY SECTION — Main orchestrator for the cinematic career navigation experience.
 * 
 * Structure:
 * 1. Hero: "Experience the Journey" headline
 * 2. Route: Horizontal career path with moving particle
 * 3. Milestones: Five career chapters as cards
 * 4. Particles: Subtle atmospheric background
 * 5. End: Cinematic transition to next section
 * 
 * All animations respect prefers-reduced-motion.
 */

export function JourneySection() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} id="journey" className="jnr" aria-labelledby="journey-heading">
      {/* Background layers */}
      <JourneyParticles />
      <JourneyBackgroundCoordinates />

      <div className="jnr__container">
        {/* Section Kicker */}
        <SectionKicker index="05" label="Experience" />

        {/* Hero Headline */}
        <motion.div
          className="jnr__hero"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3, margin: "-10%" }}
          transition={{ duration: reduce ? duration.micro : duration.section, ease }}
        >
          <h1 id="journey-heading" className="jnr__heading">
            <TextReveal
              lines={["Experience the", "Journey."]}
              as="h1"
              className="jnr__heading-lines"
              accentIndex={1}
              lineDuration={0.7}
              delay={0.1}
            />
          </h1>

          <p className="jnr__lede">
            From writing my first production components to engineering scalable frontend systems —
            every chapter shaped how I build today.
          </p>

          <div className="jnr__hero-meta" aria-hidden>
            <span className="jnr__year-range">2021 — 2026</span>
            <span className="jnr__pulse" aria-hidden />
          </div>
        </motion.div>

        {/* Main Visual: Route + Milestones */}
        <div className="jnr__main-visual">
          {/* Route draws as user scrolls through this section */}
          <Parallax speed={0.02} range={30} className="jnr__route-wrapper">
            <JourneyRoute />
          </Parallax>

          {/* Milestones positioned along the route */}
          <Parallax speed={0.05} range={50} className="jnr__milestones-wrapper">
            <JourneyMilestones />
          </Parallax>
        </div>

        {/* Cinematic End Transition */}
        <motion.div
          className="jnr__end"
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5, margin: "0px 0px -20% 0px" }}
          transition={{ duration: reduce ? duration.micro : duration.cinematic, delay: reduce ? 0 : 0.3, ease }}
        >
          <JourneyEndTransition />
        </motion.div>
      </div>
    </section>
  );
}

/** Subtle technical coordinate labels in the background */
function JourneyBackgroundCoordinates() {
  const reduce = useReducedMotion();

  if (reduce) return null;

  return (
    <div className="jnr__bg-coordinates" aria-hidden>
      {backgroundCoordinates.map((coord, i) => (
        <motion.span
          key={coord}
          className="jnr__bg-coord"
          style={
            {
              "--coord-x": `${5 + Math.random() * 90}%`,
              "--coord-y": `${10 + Math.random() * 80}%`,
            } as CSSProperties
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.02, 0.06, 0.02] }}
          transition={{ duration: 12 + Math.random() * 8, delay: Math.random() * 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {coord}
        </motion.span>
      ))}
    </div>
  );
}

/** Cinematic end transition: "THE STORY IS STILL BEING WRITTEN." */
function JourneyEndTransition() {
  const reduce = useReducedMotion();

  return (
    <div className="jnr__transition">
      <p className="jnr__transition-text">
        <TextReveal
          lines={["THE STORY IS", "STILL BEING", "WRITTEN."]}
          as="p"
          className="jnr__transition-lines"
          lineDuration={0.8}
          delay={0.1}
        />
      </p>

      <div className="jnr__transition-line" aria-hidden>
        <motion.span
          className="jnr__transition-line-fill"
          initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: reduce ? 0.3 : 1.5, delay: reduce ? 0 : 0.5, ease }}
          style={{ transformOrigin: "left center" }}
        />
        <motion.span
          className="jnr__transition-arrow"
          initial={reduce ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: reduce ? 0 : 1.2, ease }}
          whileHover={reduce ? undefined : { x: 8, transition: { duration: 0.3, ease } }}
        >
          → NEXT CHAPTER
        </motion.span>
      </div>
    </div>
  );
}