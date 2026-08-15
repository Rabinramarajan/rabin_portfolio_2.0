"use client";

import { motion, useTransform } from "motion/react";
import { ease } from "@/lib/motion";
import { useMouseParallax } from "@/components/motion";

/**
 * THE CAREER SIGNAL — the whole career read as one unbroken trace.
 *
 * A single flowing line carries every waypoint from 2021 to 2026. It draws in
 * once on load, each year node pops in on its own position, and the last node
 * keeps breathing — the signal is still live. Past the final node the line
 * dashes off-canvas: the trace continues past what the page shows.
 *
 * Three depth layers drift 2–6px with the pointer (fine pointers only, never
 * under reduced motion — gated inside useMouseParallax).
 */

const W = 460;
const H = 340;
const T_SLOW = { duration: 1.05, ease } as const;

/** Waypoints the trace passes through, oldest → newest. */
const NODES = [
  { x: 60, y: 252, year: "2021" },
  { x: 150, y: 206, year: "2022" },
  { x: 214, y: 142, year: "2023" },
  { x: 292, y: 168, year: "2024" },
  { x: 396, y: 104, year: "2026" },
];

/** A smooth flowing path that passes exactly through every node. */
const TRACE = [
  "M60 252",
  "C96 252 118 224 150 206",
  "C182 188 196 152 214 142",
  "C236 130 260 168 292 168",
  "C324 168 356 126 396 104",
].join(" ");

export function CareerTraceHero({ reduce }: { reduce: boolean }) {
  const { sx, sy, handlers } = useMouseParallax();
  const gridX = useTransform(sx, [-1, 1], [-2, 2]);
  const gridY = useTransform(sy, [-1, 1], [-2, 2]);
  const traceX = useTransform(sx, [-1, 1], [-4, 4]);
  const traceY = useTransform(sy, [-1, 1], [-4, 4]);
  const nodeX = useTransform(sx, [-1, 1], [-6, 6]);
  const nodeY = useTransform(sy, [-1, 1], [-6, 6]);

  return (
    <motion.div
      className="xth"
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduce ? 0.25 : 1.0, delay: reduce ? 0 : 0.32, ease }}
      {...handlers}
    >
      <svg className="xth__svg" viewBox={`0 0 ${W} ${H}`} role="presentation" focusable="false">
        {/* layer 1 — ground grid */}
        <motion.g className="xth__ground" style={reduce ? undefined : { x: gridX, y: gridY }} aria-hidden>
          {[40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440].map((x) => (
            <line key={`c${x}`} x1={x} y1={16} x2={x} y2={H - 16} />
          ))}
          {[52, 104, 156, 208, 260, 312].map((y) => (
            <line key={`r${y}`} x1={16} y1={y} x2={W - 16} y2={y} />
          ))}
          <path className="xth__bracket" d="M12 26V12h14M448 12h-14v14M448 312h-14v-14M26 326H12v-14" />
        </motion.g>

        {/* layer 2 — the trace itself */}
        <motion.g style={reduce ? undefined : { x: traceX, y: traceY }}>
          {/* the unbroken career line */}
          <motion.path
            className="xth__trace"
            d={TRACE}
            fill="none"
            initial={reduce ? { opacity: 0 } : { pathLength: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
            transition={{ ...T_SLOW, delay: reduce ? 0 : 0.12 }}
          />
          {/* a bright sweep travels the trace once the line has drawn */}
          {!reduce ? (
            <motion.path
              className="xth__sweep"
              d={TRACE}
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.9, 0] }}
              transition={{ duration: 0.9, delay: 0.5, ease }}
            />
          ) : null}
          {/* the trace continues past the page */}
          <motion.path
            className="xth__trace xth__trace--dash"
            d="M396 104C430 88 452 72 480 58"
            fill="none"
            initial={reduce ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: reduce ? 0.6 : 0.8 }}
            transition={{ duration: 0.6, delay: reduce ? 0 : 1.05 }}
          />
        </motion.g>

        {/* layer 3 — the waypoints + year rail */}
        <motion.g style={reduce ? undefined : { x: nodeX, y: nodeY }}>
          {NODES.map((n, i) => {
            const last = i === NODES.length - 1;
            return (
              <g key={n.year}>
                {last ? (
                  <>
                    <motion.circle
                      className="xth__ring"
                      cx={n.x}
                      cy={n.y}
                      r={9}
                      initial={reduce ? { opacity: 0 } : { scale: 0.5, opacity: 0 }}
                      animate={reduce ? { opacity: 0.5 } : { scale: 1, opacity: [0.55, 0, 0.55] }}
                      transition={
                        reduce
                          ? { duration: 0.3 }
                          : { duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }
                      }
                      style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                    />
                    <motion.circle
                      className="xth__ring xth__ring--2"
                      cx={n.x}
                      cy={n.y}
                      r={9}
                      initial={reduce ? { opacity: 0 } : { scale: 0.5, opacity: 0 }}
                      animate={reduce ? { opacity: 0.25 } : { scale: 1.6, opacity: [0.4, 0, 0.4] }}
                      transition={
                        reduce
                          ? { duration: 0.3 }
                          : { duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 1.6 }
                      }
                      style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                    />
                  </>
                ) : null}
                <motion.circle
                  className={last ? "xth__node xth__node--live" : "xth__node"}
                  cx={n.x}
                  cy={n.y}
                  r={last ? 5 : 4}
                  initial={reduce ? { opacity: 0 } : { scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: reduce ? 0.2 : 0.5, delay: reduce ? 0 : 0.24 + i * 0.16, ease }}
                  style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                />
                <motion.text
                  className="xth__year"
                  x={n.x}
                  y={n.y + (last ? 34 : 30)}
                  textAnchor="middle"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: reduce ? 0 : 0.34 + i * 0.16, ease }}
                >
                  {n.year}
                </motion.text>
              </g>
            );
          })}
        </motion.g>
      </svg>
    </motion.div>
  );
}