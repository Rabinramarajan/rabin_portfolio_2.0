"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { journeyMilestones, type JourneyMilestone } from "@/content/journey";
import { JourneyCard } from "./JourneyCard";
import { duration, ease } from "@/lib/motion";

/**
 * JOURNEY MILESTONES — The five major career chapters.
 * Cards rise from blur as the route activates them.
 * The current chapter is the visual centerpiece.
 */

const MILESTONE_POSITIONS = [0.08, 0.28, 0.5, 0.72, 0.92];

export function JourneyMilestones() {
  const reduce = !!useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  // Track which milestone is currently centered/active based on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const index = Number((visible.target as HTMLElement).dataset.index);
          if (!Number.isNaN(index)) {
            setActiveIndex(index);
            setVisibleIndices((prev) => {
              const next = new Set(prev);
              next.add(index);
              // Also add previous indices for fade effect
              for (let i = 0; i < index; i++) next.add(i);
              return next;
            });
          }
        }
      },
      { threshold: [0.1, 0.3, 0.5, 0.7], rootMargin: "0px 0px -20% 0px" }
    );

    const container = containerRef.current;
    if (container) {
      container.querySelectorAll("[data-index]").forEach((el) => observer.observe(el));
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="jnr__milestones" role="list" aria-label="Career journey milestones">
      {journeyMilestones.map((milestone, index) => (
        <JourneyMilestoneItem
          key={milestone.id}
          milestone={milestone}
          position={MILESTONE_POSITIONS[index]}
          index={index}
          isActive={index === activeIndex}
          isVisible={visibleIndices.has(index)}
          isPast={index < activeIndex}
          reduce={reduce}
        />
      ))}
    </div>
  );
}

function JourneyMilestoneItem({
  milestone,
  position,
  index,
  isActive,
  isVisible,
  isPast,
  reduce,
}: {
  milestone: JourneyMilestone;
  position: number;
  index: number;
  isActive: boolean;
  isVisible: boolean;
  isPast: boolean;
  reduce: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Connect card hover to route marker glow
  useEffect(() => {
    const routeContainer = document.querySelector(".jnr__route");
    const card = cardRef.current;
    if (!routeContainer || !card) return;

    const handleMouseEnter = () => {
      const marker = routeContainer.querySelectorAll(".jnr__marker")[index];
      if (marker) marker.classList.add("jnr__marker--route-hover");
    };
    const handleMouseLeave = () => {
      const marker = routeContainer.querySelectorAll(".jnr__marker")[index];
      if (marker) marker.classList.remove("jnr__marker--route-hover");
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [index]);

  return (
    <motion.div
      ref={cardRef}
      className={`jnr__milestone-item ${milestone.type} ${isActive ? "jnr__milestone--active" : ""} ${isPast ? "jnr__milestone--past" : ""}`}
      style={{ left: `${position * 100}%` }}
      data-index={index}
      initial={reduce ? { opacity: 1, y: 0, filter: "none" } : { opacity: 0, y: 40, filter: "blur(12px)" }}
      animate={isVisible && !reduce ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 1, y: 0, filter: "none" }}
      transition={{
        duration: reduce ? duration.micro : 0.7,
        delay: reduce ? 0 : 0.15 + index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={reduce ? undefined : { y: -6, transition: { duration: 0.3, ease } }}
    >
      <JourneyCard milestone={milestone} isPast={isPast} />
    </motion.div>
  );
}