"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { particleConfig } from "@/content/journey";

/**
 * JOURNEY PARTICLES — Subtle floating particles in the background.
 * Respects prefers-reduced-motion.
 * Creates atmospheric depth without visual noise.
 */

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  delay: number;
  duration: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: particleConfig.minSize + Math.random() * (particleConfig.maxSize - particleConfig.minSize),
    opacity: particleConfig.opacityRange[0] + Math.random() * (particleConfig.opacityRange[1] - particleConfig.opacityRange[0]),
    speed: particleConfig.speedRange[0] + Math.random() * (particleConfig.speedRange[1] - particleConfig.speedRange[0]),
    delay: Math.random() * 3,
    duration: 15 + Math.random() * 25,
  }));
}

export function JourneyParticles() {
  const reduce = useReducedMotion();
  const [particles, setParticles] = useState<Particle[]>([]);
  const generatedRef = useRef(false);

  useEffect(() => {
    if (!generatedRef.current) {
      setParticles(generateParticles(particleConfig.count));
      generatedRef.current = true;
    }
  }, []);

  if (reduce) return null;

  return (
    <div className="jnr__particles" aria-hidden>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="jnr__particle-bg"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
          animate={{
            y: [-30, 30, -30],
            x: [-15, 15, -15],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}