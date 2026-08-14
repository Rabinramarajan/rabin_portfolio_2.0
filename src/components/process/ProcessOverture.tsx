"use client";

import { motion } from "motion/react";
import { ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

const NODES: Array<[number, number]> = [
  [46, 210],
  [104, 176],
  [150, 208],
  [214, 150],
  [268, 176],
  [326, 108],
  [392, 46],
];

const TRACK =
  "M46 210C74 210 84 176 104 176 128 176 130 208 150 208 182 208 190 150 214 150 244 150 246 176 268 176 300 176 302 108 326 108 362 108 366 74 392 46";

/**
 * The section's opening statement: the whole journey seen at once, drawn as a
 * single altitude line. It establishes the path language the journey below then
 * travels through stage by stage.
 */
export function ProcessOverture() {
  const reduce = useReducedMotionSafe();
  return (
    <div className="pov">
      <svg className="pov__svg" viewBox="0 0 420 260" role="presentation" focusable="false">
        <g className="pov__grid" aria-hidden>
          {[52, 104, 156, 208].map((y) => (
            <line key={y} x1={0} y1={y} x2={420} y2={y} />
          ))}
          {[84, 168, 252, 336].map((x) => (
            <line key={x} x1={x} y1={0} x2={x} y2={260} />
          ))}
        </g>
        <path className="pov__track" d={TRACK} fill="none" />
        <motion.path
          className="pov__drawn"
          d={TRACK}
          fill="none"
          initial={reduce ? { opacity: 1, pathLength: 1 } : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: reduce ? 0 : 1.1, ease }}
        />
        {NODES.map(([x, y], i) => (
          <motion.g
            key={i}
            initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.4, ease, delay: reduce ? 0 : 0.24 + i * 0.11 }}
            style={{ transformOrigin: `${x}px ${y}px` }}
          >
            <circle className="pov__node" cx={x} cy={y} r={4} />
            <line className="pov__stem" x1={x} y1={y} x2={x} y2={248} />
          </motion.g>
        ))}
        <line className="pov__base" x1={0} y1={248} x2={420} y2={248} />
      </svg>
    </div>
  );
}
