"use client";

import { motion, useScroll, useTransform, useReducedMotion, useSpring } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { journeyMilestones } from "@/content/journey";
import { duration, ease } from "@/lib/motion";

/**
 * JOURNEY ROUTE — The cinematic horizontal career path.
 * A razor-thin line with a moving lime particle, coordinate marks, and year labels.
 * Progressively draws itself as the user scrolls.
 */

const MILESTONE_POSITIONS = [0.08, 0.28, 0.5, 0.72, 0.92];

export function JourneyRoute() {
  const reduce = !!useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Scroll progress for the route container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Line drawing progress
  const drawProgress = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  });

  // Particle position along the route, as a percentage string
  const particleProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Track visibility for triggering animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="jnr__route" aria-hidden>
      {/* Technical grid background */}
      <div className="jnr__grid" aria-hidden />

      {/* The main route line */}
      <div className="jnr__line-container">
        {/* Base line */}
        <div className="jnr__line-base" aria-hidden />

        {/* Progressive draw line */}
        <motion.div
          className="jnr__line-draw"
          style={{ scaleX: reduce ? 1 : drawProgress }}
          aria-hidden
        />

        {/* Moving particle */}
        {!reduce && (
          <motion.div
            className="jnr__particle"
            style={{ left: particleProgress }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            <div className="jnr__particle-core" />
            <div className="jnr__particle-glow" />
            <div className="jnr__particle-trail" />
          </motion.div>
        )}

        {/* Milestone markers along the route */}
        {journeyMilestones.map((milestone, index) => (
          <JourneyRouteMarker
            key={milestone.id}
            milestone={milestone}
            position={MILESTONE_POSITIONS[index]}
            isVisible={isVisible}
            index={index}
            reduce={reduce}
          />
        ))}
      </div>

      {/* Year labels below the route */}
      <div className="jnr__year-labels" aria-hidden>
        {journeyMilestones.map((milestone, index) => (
          <motion.span
            key={milestone.id}
            className="jnr__year-label"
            style={{ left: `calc(${MILESTONE_POSITIONS[index] * 100}% - 2rem)` }}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={isVisible && !reduce ? { opacity: 1, y: 0 } : { opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1, ease }}
          >
            {milestone.year}
          </motion.span>
        ))}
      </div>

      {/* Subtle coordinate data points */}
      <div className="jnr__data-points" aria-hidden>
        {journeyMilestones.map((milestone, index) => (
          <span
            key={`${milestone.id}-data`}
            className="jnr__data-point"
            style={{ left: `calc(${MILESTONE_POSITIONS[index] * 100}% - 1.5rem)` }}
          >
            {milestone.type === "current" ? "LIVE" : milestone.type === "now" ? "ACTIVE" : "DONE"}
          </span>
        ))}
      </div>
    </div>
  );
}

function JourneyRouteMarker({
  milestone,
  position,
  isVisible,
  index,
  reduce,
}: {
  milestone: typeof journeyMilestones[0];
  position: number;
  isVisible: boolean;
  index: number;
  reduce: boolean;
}) {
  const isCurrent = milestone.current;

  return (
    <motion.span
      className={`jnr__marker ${isCurrent ? "jnr__marker--current" : ""} ${milestone.type === "next" ? "jnr__marker--next" : ""}`}
      style={{ left: `calc(${position * 100}% - 6px)` }}
      initial={reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      animate={isVisible && !reduce ? { opacity: 1, scale: 1 } : { opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.15 + index * 0.12, ease: [0.34, 1.56, 0.64, 1] }}
      aria-hidden
    >
      <span className="jnr__marker-dot" />
      {isCurrent && <span className="jnr__marker-pulse" />}
      {milestone.type === "next" && <span className="jnr__marker-dash" />}
    </motion.span>
  );
}