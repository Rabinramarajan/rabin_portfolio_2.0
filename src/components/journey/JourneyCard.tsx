"use client";

import { motion, useReducedMotion } from "motion/react";
import { JourneyMilestone } from "@/content/journey";
import { duration, ease } from "@/lib/motion";

/**
 * JOURNEY CARD — Individual milestone card content.
 * Different visual treatments per milestone type.
 * Current chapter gets elevated treatment with glow.
 * Next chapter has dashed border for "unwritten" feel.
 */

interface JourneyCardProps {
  milestone: JourneyMilestone;
  isActive: boolean;
  isPast: boolean;
  hovered: boolean;
}

export function JourneyCard({ milestone, isActive, isPast, hovered }: JourneyCardProps) {
  const reduce = useReducedMotion();
  const isCurrent = milestone.current;
  const isNext = milestone.type === "next";

  return (
    <article className={`jnr__card ${milestone.type} ${isCurrent ? "jnr__card--current" : ""} ${isNext ? "jnr__card--next" : ""} ${isPast ? "jnr__card--past" : ""}`}>
      {/* Badge for current/now */}
      {(isCurrent || milestone.type === "now") && (
        <span className="jnr__card-badge" aria-label="Current chapter">
          {milestone.type === "now" ? "LIVE" : "CURRENT"}
        </span>
      )}

      {/* Year & Label */}
      <div className="jnr__card-header">
        <span className="jnr__card-year" aria-hidden>{milestone.year}</span>
        <span className="jnr__card-label">{milestone.label}</span>
      </div>

      {/* Role & Title */}
      <div className="jnr__card-content">
        <h3 className="jnr__card-role">{milestone.role}</h3>
        <p className="jnr__card-title">{milestone.title}</p>
        <p className="jnr__card-description">{milestone.description}</p>
      </div>

      {/* Technology tags */}
      <ul className="jnr__card-tech" role="list" aria-label="Technologies">
        {milestone.technologies.map((tech, i) => (
          <motion.li
            key={tech}
            className="jnr__tech-tag"
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8, scale: 0.9 }}
            animate={!reduce ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 + i * 0.06, ease }}
            whileHover={reduce ? undefined : { scale: 1.04, y: -2, transition: { duration: 0.15 } }}
          >
            {tech}
          </motion.li>
        ))}
      </ul>

      {/* Current chapter: animated status indicator */}
      {isCurrent && (
        <div className="jnr__card-status" aria-live="polite" aria-label="Current chapter status">
          <span className="jnr__status-indicator" aria-hidden />
          <span className="jnr__status-text">Engineering with intent</span>
        </div>
      )}

      {/* Now chapter: live system status */}
      {milestone.type === "now" && (
        <div className="jnr__card-live" aria-live="polite" aria-label="Currently building">
          <div className="jnr__live-indicator">
            <span className="jnr__live-dot" aria-hidden />
            <span className="jnr__live-pulse" aria-hidden />
          </div>
          <span className="jnr__live-text">Active system</span>
        </div>
      )}

      {/* Next chapter: "still being written" indicator */}
      {isNext && (
        <div className="jnr__card-unwritten" aria-label="Future chapter">
          <span className="jnr__unwritten-text">Still being written…</span>
          <motion.span
            className="jnr__unwritten-dots"
            animate={reduce ? {} : { opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          >
            ...
          </motion.span>
        </div>
      )}
    </article>
  );
}