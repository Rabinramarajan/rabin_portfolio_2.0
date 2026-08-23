"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { ProcessStep } from "@/content/types";
import { ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/**
 * Premium, cinematic HUD Orbital diagram.
 * Features a starfield, rotating coordinate axes, glowing concentric orbits,
 * HUD bracket lines, planetary aura, and glassmorphic interactive buttons.
 */

const CX = 300;
const CY = 200;

const ORBITS = [
  { rx: 110, ry: 68, speed: 20 },
  { rx: 175, ry: 108, speed: 28 },
  { rx: 245, ry: 152, speed: 36 },
] as const;

// Seven stages positioned strategically on the orbits
const NODE_SLOTS: Array<{ orbit: number; angle: number }> = [
  { orbit: 2, angle: 145 },   // 01 Discover    - Outer Left
  { orbit: 1, angle: 95 },    // 02 Define      - Mid Top
  { orbit: 2, angle: 45 },    // 03 Design      - Outer Right-Top
  { orbit: 2, angle: 325 },   // 04 Engineer    - Outer Right-Bottom
  { orbit: 1, angle: 265 },   // 05 Validate    - Mid Bottom
  { orbit: 0, angle: 0 },     // 06 Launch      - Inner Right
  { orbit: 0, angle: 180 },   // 07 Evolve      - Inner Left
];

function nodeXY(slot: { orbit: number; angle: number }) {
  const o = ORBITS[slot.orbit];
  const rad = (slot.angle * Math.PI) / 180;
  return {
    x: CX + o.rx * Math.cos(rad),
    y: CY + o.ry * Math.sin(rad),
  };
}

// Inline SVG icons for the stages
const GLYPHS: Record<string, React.ReactNode> = {
  discover: (
    <>
      <circle cx="12" cy="10" r="5" />
      <path d="m15.5 13.5 4.5 4.5" />
      <path d="M12 7v6M9 10h6" opacity="0.6" />
    </>
  ),
  define: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="m15 9-6 3 3 3 3-6z" />
    </>
  ),
  design: <path d="M16 5a2 2 0 0 1 2.8 2.8L9 17.6l-4 1 1-4z" />,
  build: (
    <>
      <path d="m8 8-4 4 4 4" />
      <path d="m16 8 4 4-4 4" />
      <path d="m13.5 5.5-3 13" opacity="0.6" />
    </>
  ),
  test: (
    <>
      <path d="M12 3.5 5.5 6v5c0 4.4 2.9 6.9 6.5 8 3.6-1.1 6.5-3.6 6.5-8V6z" />
      <path d="m9 11.5 2 2 4.5-4.5" />
    </>
  ),
  launch: (
    <>
      <path d="M12 3.5c3 2.5 4.5 5.8 4.5 9.5L12 17l-4.5-4c0-3.7 1.5-7 4.5-9.5z" />
      <circle cx="12" cy="10" r="1.5" />
      <path d="M9.5 18.5 8 21m8-2.5 1.5 2.5" opacity="0.7" />
    </>
  ),
  evolve: (
    <>
      <circle cx="12" cy="12" r="3" />
      <ellipse cx="12" cy="12" rx="9" ry="4.5" transform="rotate(-28 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="4.5" transform="rotate(28 12 12)" />
    </>
  ),
};

const LABELS = [
  { text: "STRATEGY", x: CX, y: CY - ORBITS[1].ry - 22, anchor: "middle" as const, lx: CX, ly: CY - ORBITS[1].ry - 4 },
  { text: "BUILD", x: CX + ORBITS[2].rx + 24, y: CY + 4, anchor: "start" as const, lx: CX + ORBITS[2].rx + 4, ly: CY },
  { text: "DELIVER", x: CX, y: CY + ORBITS[2].ry + 32, anchor: "middle" as const, lx: CX, ly: CY + ORBITS[2].ry + 6 },
];

const DWELL_MS = 5000;
const SWAP = { duration: 0.5, ease } as const;

const STATIC_STARS = (() => {
  const stars = [];
  let seed = 42;
  const rnd = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  for (let i = 0; i < 24; i++) {
    stars.push({
      x: 100 + rnd() * 400,
      y: 50 + rnd() * 300,
      r: 0.6 + rnd() * 0.9,
      o: 0.15 + rnd() * 0.5,
    });
  }
  return stars;
})();

export function ProcessOrbital({ steps }: { steps: ProcessStep[] }) {
  const reduce = useReducedMotionSafe();
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Decorative Starfield coords
  const starsRef = useRef(STATIC_STARS);

  useEffect(() => {
    if (reduce || held) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % steps.length);
    }, DWELL_MS);
    return () => window.clearInterval(id);
  }, [reduce, held, steps.length]);

  const select = useCallback((index: number) => {
    setActive(index);
    setHeld(true);
  }, []);

  const step = steps[active];

  return (
    <div
      className="porb"
      ref={rootRef}
      onPointerLeave={() => setHeld(false)}
    >
      <svg
        className="porb__svg"
        viewBox={`0 0 ${CX * 2} ${CY * 2}`}
        role="presentation"
        focusable="false"
      >
        <defs>
          <radialGradient id="monogram-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.25" />
            <stop offset="60%" stopColor="var(--color-accent)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </radialGradient>
          <filter id="hud-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient starfield */}
        <g className="porb__stars" aria-hidden>
          {starsRef.current.map((star, i) => (
            <circle
              key={i}
              cx={star.x}
              cy={star.y}
              r={star.r}
              fill="var(--color-accent)"
              opacity={star.o}
            />
          ))}
        </g>

        {/* HUD grid ticks */}
        <g className="porb__hud-grid" stroke="var(--color-line)" strokeWidth="0.5" fill="none" opacity="0.3" aria-hidden>
          <line x1={CX} y1={20} x2={CX} y2={CY * 2 - 20} strokeDasharray="3 6" />
          <line x1={40} y1={CY} x2={CX * 2 - 40} strokeDasharray="3 6" />
          <circle cx={CX} cy={CY} r={48} strokeDasharray="2 4" />
          <circle cx={CX} cy={CY} r={ORBITS[2].rx + 20} strokeDasharray="4 8" opacity="0.5" />
        </g>

        {/* Orbit Ellipses */}
        {ORBITS.map((o, i) => (
          <g key={i}>
            {/* Background orbit path */}
            <ellipse
              className="porb__orbit"
              cx={CX}
              cy={CY}
              rx={o.rx}
              ry={o.ry}
              stroke="var(--color-line-strong)"
              strokeWidth="0.8"
              fill="none"
              strokeDasharray={i === 0 ? "5 5" : i === 1 ? "8 6" : "12 8"}
            />
            {/* Active orbit highlighting */}
            {NODE_SLOTS[active]?.orbit === i && (
              <motion.ellipse
                className="porb__orbit-active"
                cx={CX}
                cy={CY}
                rx={o.rx}
                ry={o.ry}
                stroke="var(--color-accent)"
                strokeWidth="1.2"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                transition={SWAP}
                filter="url(#hud-glow)"
              />
            )}
          </g>
        ))}

        {/* Orbit moons / traveling particles */}
        {!reduce &&
          ORBITS.map((o, i) => (
            <circle key={`particle-${i}`} r={2} fill="var(--color-accent)" opacity="0.6">
              <animateMotion
                dur={`${o.speed}s`}
                repeatCount="indefinite"
                path={`M${CX + o.rx},${CY} A${o.rx},${o.ry} 0 1,1 ${CX - o.rx},${CY} A${o.rx},${o.ry} 0 1,1 ${CX + o.rx},${CY}`}
              />
            </circle>
          ))}

        {/* Concentric planetary aura core */}
        <circle cx={CX} cy={CY} r={65} fill="url(#monogram-glow)" />
        <circle cx={CX} cy={CY} r={32} fill="var(--color-bg)" stroke="var(--color-line-strong)" strokeWidth="1" />
        <circle cx={CX} cy={CY} r={36} fill="none" stroke="var(--color-accent)" strokeWidth="0.5" opacity="0.4" strokeDasharray="2 3" />

        {/* Core Monogram */}
        <text
          className="porb__mono"
          x={CX}
          y={CY}
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--color-accent)"
          filter="url(#hud-glow)"
          style={{ textShadow: "0 0 12px var(--color-accent)" }}
        >
          R
        </text>

        {/* Coordinate label guidelines and ticks */}
        <g stroke="var(--color-line-strong)" strokeWidth="0.8" fill="none" aria-hidden>
          {LABELS.map((lbl, i) => (
            <path key={i} d={`M${lbl.x},${lbl.y + (lbl.y > CY ? -8 : 10)} L${lbl.lx},${lbl.ly}`} opacity="0.6" />
          ))}
        </g>

        {/* Keyword labels */}
        {LABELS.map((lbl) => (
          <text
            key={lbl.text}
            className="porb__label"
            x={lbl.x}
            y={lbl.y}
            textAnchor={lbl.anchor}
          >
            {lbl.text}
          </text>
        ))}

        {/* Process Stage Nodes */}
        {steps.map((s, i) => {
          const pos = nodeXY(NODE_SLOTS[i]);
          const isActive = i === active;
          return (
            <g
              key={s.id}
              className="porb__node"
              data-state={isActive ? "on" : "off"}
              onClick={() => select(i)}
              onPointerEnter={() => select(i)}
              role="button"
              tabIndex={0}
              aria-label={`${s.number} — ${s.label}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  select(i);
                }
              }}
            >
              {/* Outer pulsing glass rings */}
              {isActive && !reduce && (
                <>
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r={26}
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="0.5"
                    initial={{ scale: 0.8, opacity: 0.6 }}
                    animate={{ scale: 1.25, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  />
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={21}
                    fill="var(--color-accent)"
                    opacity="0.08"
                    filter="url(#hud-glow)"
                  />
                </>
              )}

              {/* Glass node border */}
              <circle
                className="porb__ring"
                cx={pos.x}
                cy={pos.y}
                r={16}
                fill="none"
                stroke={isActive ? "var(--color-accent)" : "var(--color-line-strong)"}
                strokeWidth={isActive ? 1.5 : 1}
              />

              {/* Glass node core */}
              <circle
                className="porb__dot"
                cx={pos.x}
                cy={pos.y}
                r={15.5}
                fill={isActive ? "var(--color-accent)" : "var(--color-bg-elevated)"}
                fillOpacity={isActive ? 0.15 : 0.8}
              />

              {/* Glyph icon */}
              <svg
                x={pos.x - 10}
                y={pos.y - 10}
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                className="porb__glyph"
                stroke={isActive ? "var(--color-accent)" : "var(--color-text-faint)"}
              >
                {GLYPHS[s.id]}
              </svg>

              {/* Stage number */}
              <text
                className="porb__num"
                x={pos.x}
                y={pos.y + 26}
                textAnchor="middle"
                fill={isActive ? "var(--color-accent)" : "var(--color-text-faint)"}
              >
                {s.number}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Active stage details below the orbital visual */}
      <div className="porb__readout" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={step.id}
            className="porb__stage-label"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={SWAP}
          >
            <span className="porb__stage-num">{step.number}</span>
            <span className="porb__stage-sep" aria-hidden>/</span>
            <span className="porb__stage-name">{step.label}</span>
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
