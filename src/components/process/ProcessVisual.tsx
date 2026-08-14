"use client";

import { motion, type Variants } from "motion/react";
import type { ProcessVisualId } from "@/content/types";
import { ease } from "@/lib/motion";

/**
 * Seven abstract scenes sharing one art direction: technical blueprint geometry
 * on a dark ground. Each scene animates in a way that means something for its
 * stage — blur to sharp, scattered to structured, wireframe to interface, and
 * so on — rather than a shared fade-up.
 */

const W = 320;
const H = 220;

const T = { duration: 0.62, ease } as const;
const T_SLOW = { duration: 0.86, ease } as const;

function Ground() {
  const cols = [40, 80, 120, 160, 200, 240, 280];
  const rows = [40, 80, 120, 160];
  return (
    <g className="pv__ground" aria-hidden>
      {cols.map((x) => (
        <line key={`c${x}`} x1={x} y1={8} x2={x} y2={H - 8} />
      ))}
      {rows.map((y) => (
        <line key={`r${y}`} x1={8} y1={y} x2={W - 8} y2={y} />
      ))}
      <path className="pv__bracket" d="M10 26V10h16M294 10h16v16M310 194v16h-16M26 210H10v-16" />
    </g>
  );
}

function Scene({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <svg className="pv" viewBox={`0 0 ${W} ${H}`} role="presentation" focusable="false" data-scene={id}>
      <Ground />
      {children}
    </svg>
  );
}

/* 01 — blur becomes sharp. Signal resolving out of noise. */
function Discover({ reduce }: { reduce: boolean }) {
  const specks = [
    [78, 62],
    [126, 44],
    [212, 58],
    [248, 96],
    [92, 152],
    [148, 176],
    [238, 164],
    [56, 108],
  ];
  return (
    <Scene id="discover">
      <motion.g
        initial={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(9px)" }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, filter: "blur(0px)" }}
        transition={T_SLOW}
      >
        <g className="pv__dim">
          {specks.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={2.5} />
          ))}
        </g>
        <circle className="pv__stroke" cx={160} cy={110} r={46} />
        <motion.circle
          className="pv__accent-stroke"
          cx={160}
          cy={110}
          r={46}
          initial={reduce ? undefined : { scale: 1.18, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...T_SLOW, delay: 0.08 }}
          style={{ transformOrigin: "160px 110px" }}
        />
        <line className="pv__accent-stroke" x1={160} y1={78} x2={160} y2={94} />
        <line className="pv__accent-stroke" x1={160} y1={126} x2={160} y2={142} />
        <line className="pv__accent-stroke" x1={128} y1={110} x2={144} y2={110} />
        <line className="pv__accent-stroke" x1={176} y1={110} x2={192} y2={110} />
        <circle className="pv__accent-fill" cx={160} cy={110} r={3} />
        <line className="pv__stroke" x1={193} y1={143} x2={236} y2={186} />
      </motion.g>
    </Scene>
  );
}

/* 02 — scattered fragments settle into a structured system. */
function Define({ reduce }: { reduce: boolean }) {
  const nodes: Array<{ x: number; y: number; w: number; h: number; dx: number; dy: number }> = [
    { x: 40, y: 44, w: 58, h: 30, dx: -26, dy: -18 },
    { x: 131, y: 44, w: 58, h: 30, dx: 14, dy: -30 },
    { x: 222, y: 44, w: 58, h: 30, dx: 30, dy: -12 },
    { x: 86, y: 146, w: 58, h: 30, dx: -22, dy: 26 },
    { x: 176, y: 146, w: 58, h: 30, dx: 24, dy: 30 },
  ];
  const links = ["M69 74V110H205V146", "M160 74V110", "M251 74V110H115V146"];
  return (
    <Scene id="define">
      <g>
        {links.map((d, i) => (
          <motion.path
            key={d}
            className={i === 1 ? "pv__accent-stroke" : "pv__stroke"}
            d={d}
            fill="none"
            initial={reduce ? { opacity: 0 } : { pathLength: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
            transition={{ ...T, delay: 0.26 + i * 0.07 }}
          />
        ))}
        {nodes.map((n, i) => (
          <motion.g
            key={i}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: n.dx, y: n.dy }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0, y: 0 }}
            transition={{ ...T, delay: i * 0.06 }}
          >
            <rect className={i === 2 ? "pv__accent-stroke" : "pv__stroke"} x={n.x} y={n.y} width={n.w} height={n.h} />
            <line className="pv__dim-stroke" x1={n.x + 10} y1={n.y + 11} x2={n.x + n.w - 18} y2={n.y + 11} />
            <line className="pv__dim-stroke" x1={n.x + 10} y1={n.y + 20} x2={n.x + n.w - 28} y2={n.y + 20} />
          </motion.g>
        ))}
      </g>
    </Scene>
  );
}

/* 03 — wireframe resolves into a composed interface. */
function Design({ reduce }: { reduce: boolean }) {
  const bars = [
    { x: 128, y: 56, w: 96, accent: true },
    { x: 128, y: 72, w: 64, accent: false },
    { x: 128, y: 118, w: 120, accent: false },
    { x: 128, y: 134, w: 82, accent: false },
    { x: 40, y: 168, w: 56, accent: false },
  ];
  return (
    <Scene id="design">
      <motion.g
        initial={reduce ? { opacity: 0 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={T}
      >
        <rect className="pv__stroke" x={28} y={32} width={264} height={156} />
        <line className="pv__dim-stroke" x1={28} y1={52} x2={292} y2={52} />
        <line className="pv__dim-stroke" x1={116} y1={52} x2={116} y2={188} />
        <rect className="pv__dim-stroke" x={40} y={64} width={56} height={40} />
        <rect className="pv__dim-stroke" x={40} y={112} width={56} height={40} />
      </motion.g>
      {bars.map((b, i) => (
        <motion.rect
          key={i}
          className={b.accent ? "pv__accent-fill" : "pv__fill"}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.accent ? 8 : 6}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scaleX: 0 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scaleX: 1 }}
          transition={{ ...T, delay: 0.2 + i * 0.07 }}
          style={{ transformOrigin: `${b.x}px ${b.y}px` }}
        />
      ))}
      <motion.rect
        className="pv__accent-stroke"
        x={128}
        y={110}
        width={140}
        height={40}
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...T, delay: 0.44 }}
        style={{ transformOrigin: "198px 130px" }}
      />
    </Scene>
  );
}

/* 04 — layers assemble into one build. */
function Build({ reduce }: { reduce: boolean }) {
  const layers = [
    { y: 132, from: 46, accent: false },
    { y: 104, from: 34, accent: false },
    { y: 76, from: 22, accent: true },
    { y: 48, from: 12, accent: false },
  ];
  return (
    <Scene id="build">
      {layers.map((l, i) => (
        <motion.g
          key={l.y}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: l.from }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ ...T, delay: i * 0.09 }}
        >
          <path
            className={l.accent ? "pv__accent-stroke" : "pv__stroke"}
            d={`M92 ${l.y} L160 ${l.y - 18} L228 ${l.y} L160 ${l.y + 18} Z`}
            fill="none"
          />
          <line className="pv__dim-stroke" x1={112} y1={l.y} x2={144} y2={l.y - 8} />
        </motion.g>
      ))}
      <motion.g
        className="pv__dim-stroke"
        initial={reduce ? { opacity: 0 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...T, delay: 0.42 }}
      >
        <line x1={92} y1={48} x2={92} y2={132} />
        <line x1={228} y1={48} x2={228} y2={132} />
      </motion.g>
      <motion.g
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...T, delay: 0.5 }}
      >
        <line className="pv__accent-stroke" x1={160} y1={160} x2={160} y2={182} />
        <circle className="pv__accent-fill" cx={160} cy={186} r={3} />
      </motion.g>
    </Scene>
  );
}

/* 05 — signals rise and validate. */
function Test({ reduce }: { reduce: boolean }) {
  const bars = [
    { x: 56, h: 34 },
    { x: 88, h: 58 },
    { x: 120, h: 44 },
    { x: 152, h: 74 },
    { x: 184, h: 62 },
  ];
  return (
    <Scene id="test">
      <line className="pv__dim-stroke" x1={44} y1={160} x2={276} y2={160} />
      {bars.map((b, i) => (
        <motion.rect
          key={b.x}
          className={i === 3 ? "pv__accent-fill" : "pv__fill"}
          x={b.x}
          y={160 - b.h}
          width={14}
          height={b.h}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scaleY: 0 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scaleY: 1 }}
          transition={{ ...T, delay: i * 0.06 }}
          style={{ transformOrigin: `${b.x}px 160px` }}
        />
      ))}
      <motion.path
        className="pv__accent-stroke pv__thick"
        d="M226 106l14 15 26-38"
        fill="none"
        initial={reduce ? { opacity: 0 } : { pathLength: 0, opacity: 0 }}
        animate={reduce ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
        transition={{ ...T, delay: 0.36 }}
      />
      <motion.circle
        className="pv__stroke"
        cx={244}
        cy={110}
        r={34}
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...T, delay: 0.3 }}
        style={{ transformOrigin: "244px 110px" }}
      />
      <motion.g
        className="pv__dim-stroke"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...T, delay: 0.5 }}
      >
        <line x1={44} y1={64} x2={196} y2={64} />
        <line x1={44} y1={96} x2={196} y2={96} />
      </motion.g>
    </Scene>
  );
}

/* 06 — the pipeline lights up and the system goes live. */
function Launch({ reduce }: { reduce: boolean }) {
  const segments = [56, 106, 156, 206];
  return (
    <Scene id="launch">
      <line className="pv__dim-stroke" x1={56} y1={150} x2={264} y2={150} />
      {segments.map((x, i) => (
        <motion.rect
          key={x}
          className={i === segments.length - 1 ? "pv__accent-fill" : "pv__fill"}
          x={x}
          y={140}
          width={42}
          height={10}
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: -10 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
          transition={{ ...T, delay: i * 0.1 }}
        />
      ))}
      {!reduce &&
        [0, 1].map((i) => (
          <motion.circle
            key={i}
            className="pv__accent-stroke"
            cx={160}
            cy={84}
            r={26}
            initial={{ scale: 0.5, opacity: 0.55 }}
            animate={{ scale: 1.9, opacity: 0 }}
            transition={{ duration: 1.05, ease, delay: 0.42 + i * 0.22 }}
            style={{ transformOrigin: "160px 84px" }}
          />
        ))}
      <motion.g
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...T, delay: 0.4 }}
      >
        <circle className="pv__stroke" cx={160} cy={84} r={26} />
        <path className="pv__accent-stroke pv__thick" d="M160 98V70m0 0l-9 10m9-10l9 10" fill="none" />
      </motion.g>
      <motion.g
        className="pv__dim-stroke"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...T, delay: 0.58 }}
      >
        <line x1={56} y1={176} x2={132} y2={176} />
        <line x1={188} y1={176} x2={264} y2={176} />
      </motion.g>
    </Scene>
  );
}

/* 07 — the system expands outward and keeps climbing. */
function Evolve({ reduce }: { reduce: boolean }) {
  const dots: Array<[number, number, number]> = [
    [160, 118, 0],
    [124, 96, 1],
    [196, 96, 1],
    [124, 142, 1],
    [196, 142, 1],
    [88, 74, 2],
    [232, 74, 2],
    [88, 164, 2],
    [232, 164, 2],
    [52, 118, 2],
    [268, 118, 2],
  ];
  const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
  const dot: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, scale: 0.3 },
    show: { opacity: 1, scale: 1, transition: T },
  };
  return (
    <Scene id="evolve">
      <motion.g variants={container} initial="hidden" animate="show">
        {dots.map(([x, y, ring], i) => (
          <motion.circle
            key={i}
            className={ring === 0 ? "pv__accent-fill" : "pv__fill"}
            cx={x}
            cy={y}
            r={ring === 0 ? 4.5 : 3}
            variants={dot}
            style={{ transformOrigin: `${x}px ${y}px` }}
          />
        ))}
      </motion.g>
      <motion.g
        className="pv__dim-stroke"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...T, delay: 0.3 }}
      >
        <line x1={124} y1={96} x2={196} y2={142} />
        <line x1={196} y1={96} x2={124} y2={142} />
        <line x1={52} y1={118} x2={268} y2={118} />
      </motion.g>
      <motion.path
        className="pv__accent-stroke pv__thick"
        d="M44 190C104 190 130 160 168 128 196 104 224 60 276 40"
        fill="none"
        initial={reduce ? { opacity: 0 } : { pathLength: 0, opacity: 0 }}
        animate={reduce ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
        transition={{ ...T_SLOW, delay: 0.34 }}
      />
      <motion.path
        className="pv__accent-stroke"
        d="M262 44l14-4-4 14"
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...T, delay: 0.92 }}
      />
    </Scene>
  );
}

const SCENES: Record<ProcessVisualId, (p: { reduce: boolean }) => React.ReactElement> = {
  discover: Discover,
  define: Define,
  design: Design,
  build: Build,
  test: Test,
  launch: Launch,
  evolve: Evolve,
};

export function ProcessVisual({ id, reduce = false }: { id: ProcessVisualId; reduce?: boolean }) {
  const Component = SCENES[id];
  return <Component reduce={reduce} />;
}
