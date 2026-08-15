"use client";

import { motion } from "motion/react";
import { engineeringMap } from "@/content/experience";
import { ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/**
 * THE ENGINEERING MAP — a drawn diagram, not an interactive graph.
 *
 * It is deliberately a fixed layout with static geometry: no force simulation,
 * no per-frame layout work, nothing that keeps running once it has drawn. The
 * whole thing is a handful of paths and circles that draw once on entry.
 *
 * The SVG is decorative; the same structure is rendered as a real nested list
 * for screen readers and for anyone browsing with images off.
 */

const W = 620;
const H = 470;
const CX = 60;
const CY = H / 2;
const BRANCH_X = 232;
const LEAF_X = 340;
const LEAF_GAP = 34;

export function EngineeringMap() {
  const reduce = useReducedMotionSafe();

  /* branch trunk positions, evenly distributed down the canvas */
  const branches = engineeringMap.map((branch, i) => {
    const y = 78 + (i * (H - 156)) / Math.max(1, engineeringMap.length - 1);
    const leafSpan = (branch.items.length - 1) * LEAF_GAP;
    const leaves = branch.items.map((item, j) => ({
      item,
      y: y - leafSpan / 2 + j * LEAF_GAP,
    }));
    return { ...branch, y, leaves };
  });

  return (
    <div className="xmap">
      <svg className="xmap__svg" viewBox={`0 0 ${W} ${H}`} role="presentation" focusable="false" aria-hidden>
        {/* central spine */}
        <motion.path
          className="xmap__spine"
          d={`M${CX} ${branches[0].y}V${branches[branches.length - 1].y}`}
          fill="none"
          initial={reduce ? { opacity: 0 } : { pathLength: 0, opacity: 0 }}
          whileInView={reduce ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: reduce ? 0.2 : 0.8, ease }}
        />
        <motion.circle
          className="xmap__core"
          cx={CX}
          cy={CY}
          r={9}
          initial={reduce ? { opacity: 0 } : { scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: reduce ? 0.2 : 0.5, ease }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        />

        {branches.map((branch, i) => {
          const base = 0.3 + i * 0.14;
          return (
            <g key={branch.id}>
              <motion.path
                className="xmap__branch"
                d={`M${CX} ${branch.y}H${BRANCH_X}`}
                fill="none"
                initial={reduce ? { opacity: 0 } : { pathLength: 0, opacity: 0 }}
                whileInView={reduce ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: reduce ? 0.2 : 0.6, delay: reduce ? 0 : base, ease }}
              />
              <motion.text
                className="xmap__branch-label"
                x={BRANCH_X - 8}
                y={branch.y - 12}
                textAnchor="end"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 4 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: reduce ? 0.2 : 0.4, delay: reduce ? 0 : base + 0.12, ease }}
              >
                {branch.label.toUpperCase()}
              </motion.text>

              {branch.leaves.map((leaf, j) => (
                <g key={leaf.item}>
                  <motion.path
                    className="xmap__twig"
                    d={`M${BRANCH_X} ${branch.y}V${leaf.y}H${LEAF_X}`}
                    fill="none"
                    initial={reduce ? { opacity: 0 } : { pathLength: 0, opacity: 0 }}
                    whileInView={reduce ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: reduce ? 0.2 : 0.5, delay: reduce ? 0 : base + 0.2 + j * 0.06, ease }}
                  />
                  <motion.circle
                    className="xmap__leaf"
                    cx={LEAF_X}
                    cy={leaf.y}
                    r={3.5}
                    initial={reduce ? { opacity: 0 } : { scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: reduce ? 0.2 : 0.34, delay: reduce ? 0 : base + 0.34 + j * 0.06, ease }}
                    style={{ transformOrigin: `${LEAF_X}px ${leaf.y}px` }}
                  />
                  <motion.text
                    className="xmap__leaf-label"
                    x={LEAF_X + 14}
                    y={leaf.y + 4}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, x: -6 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: reduce ? 0.2 : 0.4, delay: reduce ? 0 : base + 0.4 + j * 0.06, ease }}
                  >
                    {leaf.item}
                  </motion.text>
                </g>
              ))}
            </g>
          );
        })}
      </svg>

      {/* the same map as real structure — the accessible and small-screen form */}
      <ul className="xmap__text">
        {engineeringMap.map((branch) => (
          <li key={branch.id}>
            <p className="xmap__text-label">{branch.label}</p>
            <ul className="xmap__text-items">
              {branch.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
