"use client";

import { motion, useTransform } from "motion/react";
import { ease } from "@/lib/motion";
import { useMouseParallax } from "@/components/motion";

/**
 * The hero's career architecture — one structure that becomes more
 * sophisticated from left to right: a single node, a pair, a system, a
 * layered architecture, an ecosystem. It reads as a technical drawing of a
 * career rather than an illustration of one.
 *
 * Three depth layers drift 2–6px with the pointer (fine pointers only, and
 * never under reduced motion — both gated inside useMouseParallax).
 */

const W = 460;
const H = 340;
const T = { duration: 0.8, ease } as const;

/** Column x-positions: five stages of structural complexity. */
const STAGES = [58, 148, 238, 328, 412];

export function CareerArchitectureVisual({ reduce }: { reduce: boolean }) {
  const { sx, sy, handlers } = useMouseParallax();
  const gridX = useTransform(sx, [-1, 1], [-2, 2]);
  const gridY = useTransform(sy, [-1, 1], [-2, 2]);
  const structX = useTransform(sx, [-1, 1], [-4, 4]);
  const structY = useTransform(sy, [-1, 1], [-4, 4]);
  const nodeX = useTransform(sx, [-1, 1], [-6, 6]);
  const nodeY = useTransform(sy, [-1, 1], [-6, 6]);

  const draw = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { pathLength: 0, opacity: 0 },
    animate: reduce ? { opacity: 1 } : { pathLength: 1, opacity: 1 },
    transition: { ...T, delay: reduce ? 0 : delay },
  });

  const pop = (delay: number, origin: string) => ({
    initial: reduce ? { opacity: 0 } : { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: reduce ? 0.2 : 0.5, delay: reduce ? 0 : delay, ease },
    style: { transformOrigin: origin },
  });

  return (
    <motion.div
      className="xca"
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduce ? 0.25 : 1.0, delay: reduce ? 0 : 0.32, ease }}
      {...handlers}
    >
      <svg className="xca__svg" viewBox={`0 0 ${W} ${H}`} role="presentation" focusable="false">
        {/* layer 1 — ground grid */}
        <motion.g className="xca__ground" style={reduce ? undefined : { x: gridX, y: gridY }} aria-hidden>
          {[40, 80, 120, 160, 200, 240, 280, 320, 360, 400].map((x) => (
            <line key={`c${x}`} x1={x} y1={16} x2={x} y2={H - 16} />
          ))}
          {[60, 110, 160, 210, 260].map((y) => (
            <line key={`r${y}`} x1={16} y1={y} x2={W - 16} y2={y} />
          ))}
        </motion.g>

        {/* layer 2 — the progressive structure */}
        <motion.g style={reduce ? undefined : { x: structX, y: structY }}>
          {/* the spine that runs the whole career */}
          <motion.path className="xca__spine" d={`M${STAGES[0]} 210H${STAGES[4]}`} fill="none" {...draw(0.1)} />

          {/* stage 1 — a single node */}
          <motion.circle className="xca__node xca__node--accent" cx={STAGES[0]} cy={210} r={6} {...pop(0.34, `${STAGES[0]}px 210px`)} />

          {/* stage 2 — a connected pair */}
          <motion.path className="xca__link" d={`M${STAGES[1]} 210V160H${STAGES[1] + 44}`} fill="none" {...draw(0.42)} />
          <motion.circle className="xca__node" cx={STAGES[1]} cy={210} r={5} {...pop(0.5, `${STAGES[1]}px 210px`)} />
          <motion.circle className="xca__node" cx={STAGES[1] + 44} cy={160} r={4} {...pop(0.56, `${STAGES[1] + 44}px 160px`)} />

          {/* stage 3 — a system: three tiers wired together */}
          <motion.path
            className="xca__link"
            d={`M${STAGES[2]} 210V110M${STAGES[2]} 160H${STAGES[2] + 46}M${STAGES[2]} 110H${STAGES[2] - 40}`}
            fill="none"
            {...draw(0.6)}
          />
          <motion.rect className="xca__frame" x={STAGES[2] - 34} y={98} width={68} height={24} {...pop(0.68, `${STAGES[2]}px 110px`)} />
          <motion.circle className="xca__node" cx={STAGES[2]} cy={210} r={5} {...pop(0.66, `${STAGES[2]}px 210px`)} />
          <motion.circle className="xca__node" cx={STAGES[2] + 46} cy={160} r={4} {...pop(0.72, `${STAGES[2] + 46}px 160px`)} />

          {/* stage 4 — a layered architecture */}
          <motion.path
            className="xca__link"
            d={`M${STAGES[3]} 210V70M${STAGES[3]} 168H${STAGES[3] - 44}M${STAGES[3]} 120H${STAGES[3] + 40}`}
            fill="none"
            {...draw(0.76)}
          />
          {[62, 110, 158].map((y, i) => (
            <motion.rect
              key={y}
              className={i === 1 ? "xca__frame xca__frame--accent" : "xca__frame"}
              x={STAGES[3] - 30}
              y={y}
              width={60}
              height={20}
              {...pop(0.84 + i * 0.06, `${STAGES[3]}px ${y}px`)}
            />
          ))}
          <motion.circle className="xca__node" cx={STAGES[3]} cy={210} r={5} {...pop(0.82, `${STAGES[3]}px 210px`)} />

          {/* stage 5 — the ecosystem it opens into */}
          <motion.path
            className="xca__link xca__link--accent"
            d={`M${STAGES[4]} 210V150M${STAGES[4]} 176H${STAGES[4] - 36}M${STAGES[4]} 150L${STAGES[4] - 28} 104`}
            fill="none"
            {...draw(1.0)}
          />
        </motion.g>

        {/* layer 3 — foreground nodes */}
        <motion.g style={reduce ? undefined : { x: nodeX, y: nodeY }}>
          <motion.circle
            className="xca__node xca__node--accent"
            cx={STAGES[4]}
            cy={210}
            r={7}
            {...pop(1.08, `${STAGES[4]}px 210px`)}
          />
          <motion.circle className="xca__node" cx={STAGES[4] - 36} cy={176} r={4} {...pop(1.14, `${STAGES[4] - 36}px 176px`)} />
          <motion.circle className="xca__node" cx={STAGES[4] - 28} cy={104} r={4} {...pop(1.2, `${STAGES[4] - 28}px 104px`)} />
        </motion.g>

        {/* year rail — the only literal element */}
        <motion.g
          className="xca__rail"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: reduce ? 0 : 1.1, ease }}
          aria-hidden
        >
          <text x={STAGES[0]} y={252} textAnchor="middle">
            2021
          </text>
          <text x={STAGES[2]} y={252} textAnchor="middle">
            2022
          </text>
          <text x={STAGES[4]} y={252} textAnchor="middle">
            2026
          </text>
        </motion.g>
      </svg>
    </motion.div>
  );
}
