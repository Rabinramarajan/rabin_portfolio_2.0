"use client";

import { motion, type MotionValue } from "motion/react";
import { ease } from "@/lib/motion";

/**
 * One continuous path through all seven stages. The geometry itself carries the
 * meaning: it wanders while the work is uncertain, snaps orthogonal as the
 * system is defined, steps through a grid as it is designed, runs dead straight
 * through build and test, tightens into launch and then fans open at evolve.
 *
 * Nothing here re-animates on a loop — the drawn length is bound to a single
 * spring fed by the journey's one scroll subscription.
 */

export const SPINE_VIEWBOX = { w: 96, h: 620 };
export const NODE_Y = [45, 130, 215, 300, 385, 470, 555] as const;

const SPINE_D = [
  "M48 16 L48 45",
  // 01 → 02  uncertainty: the line wanders before it commits
  "C62 62 32 84 40 104 C44 116 48 120 48 130",
  // 02 → 03  definition: right-angle structure
  "L48 148 L66 148 L66 178 L48 178 L48 215",
  // 03 → 04  design: a measured step across the grid
  "L48 232 L30 232 L30 268 L48 268 L48 300",
  // 04 → 05  build: dead straight
  "L48 385",
  // 05 → 06  test: still straight, marked by verification ticks
  "L48 470",
  // 06 → 07  launch: tightens and accelerates
  "C48 500 48 528 48 555",
  "L48 588",
].join(" ");

export function ProcessSpine({
  draw,
  active,
  reduce,
}: {
  draw: MotionValue<number>;
  active: number;
  reduce: boolean;
}) {
  return (
    <svg
      className="ps"
      viewBox={`0 0 ${SPINE_VIEWBOX.w} ${SPINE_VIEWBOX.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="presentation"
      focusable="false"
    >
      {/* uncertainty — a dashed shadow of the opening segment, fading once defined */}
      <path
        className="ps__ghost"
        d="M48 45 C70 64 26 88 36 108 C42 120 48 124 48 130"
        fill="none"
        data-state={active >= 1 ? "past" : "now"}
      />

      {/* verification ticks around 05 */}
      <g className="ps__ticks" data-state={active >= 4 ? "on" : "off"}>
        {[402, 420, 438, 456].map((y) => (
          <line key={y} x1={39} y1={y} x2={57} y2={y} />
        ))}
      </g>

      {/* expansion fan at 07 */}
      <g className="ps__fan" data-state={active >= 6 ? "on" : "off"}>
        <path d="M48 555 L22 596" fill="none" />
        <path d="M48 555 L74 596" fill="none" />
        <path d="M48 555 L48 600" fill="none" />
      </g>

      {/* the resting path */}
      <path className="ps__track" d={SPINE_D} fill="none" />

      {/* the travelled path */}
      <motion.path
        className="ps__drawn"
        d={SPINE_D}
        fill="none"
        style={reduce ? { pathLength: 1 } : { pathLength: draw }}
      />

      {NODE_Y.map((y, i) => {
        const state = i < active ? "past" : i === active ? "now" : "next";
        return (
          <g key={y} className="ps__node" data-state={state}>
            <line className="ps__node-rule" x1={48} y1={y} x2={i % 2 === 0 ? 92 : 4} y2={y} />
            <circle className="ps__node-halo" cx={48} cy={y} r={11} />
            <circle className="ps__node-dot" cx={48} cy={y} r={4} />
            {!reduce && state === "now" && (
              <motion.circle
                className="ps__node-pulse"
                cx={48}
                cy={y}
                r={4}
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 3.4, opacity: 0 }}
                transition={{ duration: 0.9, ease }}
                style={{ transformOrigin: `48px ${y}px` }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
