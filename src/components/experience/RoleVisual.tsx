"use client";

import { motion } from "motion/react";
import type { RoleVisualId } from "@/content/types";
import { ease } from "@/lib/motion";

/**
 * Five abstract scenes on one art direction: blueprint geometry that gets
 * progressively more structured as the career does. A single dot becomes a
 * grid, becomes parallel projects, becomes a layered enterprise system,
 * becomes a connected ecosystem. Nothing here is a rocket, a trophy or a
 * stock illustration — the structure itself is the meaning.
 *
 * Rendered decorative (role="presentation"); the surrounding text carries the
 * information, so a screen reader loses nothing by skipping these.
 */

const W = 300;
const H = 200;
const T = { duration: 0.62, ease } as const;
const T_SLOW = { duration: 0.9, ease } as const;

function Ground() {
  return (
    <g className="xv__ground" aria-hidden>
      {[50, 100, 150, 200, 250].map((x) => (
        <line key={`c${x}`} x1={x} y1={10} x2={x} y2={H - 10} />
      ))}
      {[50, 100, 150].map((y) => (
        <line key={`r${y}`} x1={10} y1={y} x2={W - 10} y2={y} />
      ))}
      <path className="xv__bracket" d="M12 26V12h14M274 12h14v14M288 174v14h-14M26 188H12v-14" />
    </g>
  );
}

function Scene({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <svg className="xv" viewBox={`0 0 ${W} ${H}`} role="presentation" focusable="false" data-scene={id}>
      <Ground />
      {children}
    </svg>
  );
}

/** Draws a path by its own length — the shared "line drawing" gesture. */
function Draw({
  d,
  accent,
  delay = 0,
  reduce,
  slow,
}: {
  d: string;
  accent?: boolean;
  delay?: number;
  reduce: boolean;
  slow?: boolean;
}) {
  return (
    <motion.path
      className={accent ? "xv__accent-stroke" : "xv__stroke"}
      d={d}
      fill="none"
      initial={reduce ? { opacity: 0 } : { pathLength: 0, opacity: 0 }}
      animate={reduce ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
      transition={{ ...(slow ? T_SLOW : T), delay: reduce ? 0 : delay }}
    />
  );
}

/* ── BEGIN — a single node and the first axes it can be placed against. ── */
function Foundation({ reduce }: { reduce: boolean }) {
  return (
    <Scene id="foundation">
      <Draw reduce={reduce} d="M60 150H240" delay={0.05} />
      <Draw reduce={reduce} d="M150 50V150" delay={0.14} />
      <motion.circle
        className="xv__accent-fill"
        cx={150}
        cy={150}
        r={5}
        initial={reduce ? { opacity: 0 } : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...T, delay: reduce ? 0 : 0.3 }}
        style={{ transformOrigin: "150px 150px" }}
      />
      <motion.circle
        className="xv__accent-stroke"
        cx={150}
        cy={150}
        r={16}
        initial={reduce ? { opacity: 0 } : { scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.55 }}
        transition={{ ...T_SLOW, delay: reduce ? 0 : 0.38 }}
        style={{ transformOrigin: "150px 150px" }}
      />
    </Scene>
  );
}

/* ── BUILD — a bare axis resolves into an interface grid. ── */
function Interface({ reduce }: { reduce: boolean }) {
  const cells = [
    { x: 62, y: 56, w: 78, h: 26 },
    { x: 152, y: 56, w: 86, h: 26 },
    { x: 62, y: 94, w: 36, h: 50 },
    { x: 110, y: 94, w: 128, h: 22 },
    { x: 110, y: 128, w: 82, h: 16 },
  ];
  return (
    <Scene id="interface">
      <motion.rect
        className="xv__stroke"
        x={50}
        y={40}
        width={200}
        height={120}
        initial={reduce ? { opacity: 0 } : { opacity: 0, scaleY: 0.86 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={T}
        style={{ transformOrigin: "150px 100px" }}
      />
      {cells.map((c, i) => (
        <motion.rect
          key={i}
          className={i === 1 ? "xv__accent-stroke" : "xv__dim-stroke"}
          x={c.x}
          y={c.y}
          width={c.w}
          height={c.h}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ ...T, delay: reduce ? 0 : 0.16 + i * 0.07 }}
          style={{ transformOrigin: `${c.x}px ${c.y}px` }}
        />
      ))}
    </Scene>
  );
}

/* ── CONSULT — one origin, several parallel client projects. ── */
function Projects({ reduce }: { reduce: boolean }) {
  const rows = [56, 88, 120, 152];
  return (
    <Scene id="projects">
      <Draw reduce={reduce} d="M56 56V152" accent delay={0.05} slow />
      {rows.map((y, i) => (
        <g key={y}>
          <Draw reduce={reduce} d={`M56 ${y}H${180 + i * 22}`} delay={0.2 + i * 0.09} />
          <motion.circle
            className={i === 0 ? "xv__accent-fill" : "xv__fill"}
            cx={180 + i * 22}
            cy={y}
            r={4}
            initial={reduce ? { opacity: 0 } : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ ...T, delay: reduce ? 0 : 0.46 + i * 0.09 }}
            style={{ transformOrigin: `${180 + i * 22}px ${y}px` }}
          />
        </g>
      ))}
      <motion.circle
        className="xv__accent-fill"
        cx={56}
        cy={104}
        r={5}
        initial={reduce ? { opacity: 0 } : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...T, delay: reduce ? 0 : 0.1 }}
        style={{ transformOrigin: "56px 104px" }}
      />
    </Scene>
  );
}

/* ── DEEPEN — a layered enterprise architecture, tiers wired together. ── */
function Enterprise({ reduce }: { reduce: boolean }) {
  const tiers = [
    { y: 46, boxes: [70, 130, 190] },
    { y: 96, boxes: [70, 130, 190] },
    { y: 146, boxes: [100, 160] },
  ];
  const links = ["M92 68V96", "M152 68V96", "M212 68V124H182", "M92 118V146H122", "M152 118V146"];
  return (
    <Scene id="enterprise">
      {links.map((d, i) => (
        <Draw key={d} reduce={reduce} d={d} accent={i === 1} delay={0.28 + i * 0.06} />
      ))}
      {tiers.map((tier, ti) =>
        tier.boxes.map((x, bi) => (
          <motion.rect
            key={`${ti}-${bi}`}
            className={ti === 1 && bi === 1 ? "xv__accent-stroke" : "xv__stroke"}
            x={x - 22}
            y={tier.y}
            width={44}
            height={22}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...T, delay: reduce ? 0 : ti * 0.1 + bi * 0.05 }}
          />
        )),
      )}
    </Scene>
  );
}

/* ── EXTEND — a connected product ecosystem, slowly breathing. ── */
function Ecosystem({ reduce }: { reduce: boolean }) {
  const nodes = [
    { x: 150, y: 100, r: 7, accent: true },
    { x: 78, y: 58, r: 4.5 },
    { x: 226, y: 62, r: 4.5 },
    { x: 66, y: 142, r: 4.5 },
    { x: 232, y: 146, r: 4.5 },
    { x: 150, y: 40, r: 3.5 },
    { x: 150, y: 164, r: 3.5 },
  ];
  const links = [
    "M150 100L78 58",
    "M150 100L226 62",
    "M150 100L66 142",
    "M150 100L232 146",
    "M150 100V40",
    "M150 100V164",
    "M78 58L150 40",
    "M226 62L232 146",
  ];
  return (
    <Scene id="ecosystem">
      <motion.g
        className="xv__breathe"
        animate={reduce ? undefined : { opacity: [0.72, 1, 0.72] }}
        transition={reduce ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        {links.map((d, i) => (
          <Draw key={d} reduce={reduce} d={d} accent={i < 2} delay={0.18 + i * 0.05} />
        ))}
      </motion.g>
      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          className={n.accent ? "xv__accent-fill" : "xv__fill"}
          cx={n.x}
          cy={n.y}
          r={n.r}
          initial={reduce ? { opacity: 0 } : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...T, delay: reduce ? 0 : 0.1 + i * 0.06 }}
          style={{ transformOrigin: `${n.x}px ${n.y}px` }}
        />
      ))}
    </Scene>
  );
}

const SCENES: Record<RoleVisualId, (p: { reduce: boolean }) => React.ReactElement> = {
  foundation: Foundation,
  interface: Interface,
  projects: Projects,
  enterprise: Enterprise,
  ecosystem: Ecosystem,
};

export function RoleVisual({ id, reduce }: { id: RoleVisualId; reduce: boolean }) {
  const Component = SCENES[id] ?? Foundation;
  return <Component reduce={reduce} />;
}
