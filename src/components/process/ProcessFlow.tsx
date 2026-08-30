"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { ProcessStep } from "@/content/types";
import { ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/**
 * ProcessFlow — the "signal conduit".
 *
 * One continuous energised ribbon carries an idea from left to right, rising
 * as it goes. Each stage sits *on* the conduit, so the section reads as a
 * single connected system rather than a row of cards. The conduit behind the
 * active stage is lit; the conduit ahead of it stays dormant hairline.
 *
 * Desktop/laptop  — SVG ribbon with nodes overlaid as real buttons.
 * Tablet/mobile   — the same conduit rotated to a vertical spine.
 * Both layouts drive one shared readout console, so there is a single source
 * of truth for the active stage and no duplicated content.
 */

const VB_W = 1200;
const VB_H = 400;

/** Stage anchor points: a rising zig-zag so the flow visibly climbs. */
const POINTS = Array.from({ length: 7 }, (_, i) => ({
  x: 92 + i * ((VB_W - 184) / 6),
  y: 250 - i * 16 + (i % 2 === 0 ? 48 : -48),
}));

/** Catmull-Rom → cubic bézier, so the ribbon passes exactly through each node. */
function smoothPath(pts: Array<{ x: number; y: number }>) {
  if (pts.length < 2) return "";
  const d = [`M ${pts[0].x} ${pts[0].y}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d.push(`C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`);
  }
  return d.join(" ");
}

const PATH_D = smoothPath(POINTS);

const GLYPHS: Record<string, React.ReactNode> = {
  discover: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m15.5 15.5 4 4" />
      <path d="M11 8.5v5M8.5 11h5" opacity="0.55" />
    </>
  ),
  define: (
    <>
      <path d="M5 6h14M5 12h9M5 18h5" />
      <path d="m17 15 2.5 2.5L23 13" opacity="0.75" />
    </>
  ),
  design: (
    <>
      <path d="M16.5 4.5a2.1 2.1 0 0 1 3 3L9.5 17.5l-4.2 1.2 1.2-4.2z" />
      <path d="m14.5 6.5 3 3" opacity="0.55" />
    </>
  ),
  build: (
    <>
      <path d="m8 8-4.5 4L8 16" />
      <path d="m16 8 4.5 4L16 16" />
      <path d="m13.5 5-3 14" opacity="0.55" />
    </>
  ),
  test: (
    <>
      <path d="M12 3.2 5.2 6v5.3c0 4.4 2.9 7.2 6.8 8.5 3.9-1.3 6.8-4.1 6.8-8.5V6z" />
      <path d="m9 11.8 2.2 2.2 4-4.3" />
    </>
  ),
  launch: (
    <>
      <path d="M12 3c3.1 2.6 4.7 6 4.7 9.8L12 17.2 7.3 12.8C7.3 9 8.9 5.6 12 3z" />
      <circle cx="12" cy="10" r="1.6" />
      <path d="M9.3 18.6 7.6 21.4m7.1-2.8 1.7 2.8" opacity="0.6" />
    </>
  ),
  evolve: (
    <>
      <path d="M20 12a8 8 0 1 1-2.6-5.9" />
      <path d="M20 3.4V8h-4.6" />
      <circle cx="12" cy="12" r="2.4" opacity="0.6" />
    </>
  ),
};

const DWELL_MS = 5200;
const SWAP = { duration: 0.45, ease } as const;

export function ProcessFlow({
  steps,
  fit = false,
  pinned = false,
}: {
  steps: ProcessStep[];
  fit?: boolean;
  /** Pin the conduit to the viewport and drive the active stage from scroll. */
  pinned?: boolean;
}) {
  const reduce = useReducedMotionSafe();
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const uid = useId().replace(/[:]/g, "");
  const trackRef = useRef<HTMLDivElement>(null);

  const nodes = useMemo(() => steps.slice(0, POINTS.length), [steps]);
  const last = nodes.length - 1;

  /* Timed carousel — only when the stage is not scroll-driven. */
  useEffect(() => {
    if (pinned || reduce || held || nodes.length < 2) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % nodes.length), DWELL_MS);
    return () => window.clearInterval(id);
  }, [pinned, reduce, held, nodes.length]);

  /* Scroll-driven stage advance. The track is taller than the viewport; the
     inner shell sticks, and the distance scrolled through the track maps
     linearly onto the stage index. */
  useEffect(() => {
    if (!pinned || nodes.length < 2) return;
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const read = () => {
      frame = 0;
      const rect = track.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      if (span <= 0) return;
      const p = Math.min(Math.max(-rect.top / span, 0), 1);
      const next = Math.min(nodes.length - 1, Math.floor(p * nodes.length));
      setActive((i) => (i === next ? i : next));
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pinned, nodes.length]);

  /* In pinned mode a node is a scroll target, so the pointer never fights the
     scroll position; otherwise it selects directly and holds the carousel. */
  const select = useCallback(
    (index: number) => {
      if (pinned) {
        const track = trackRef.current;
        if (!track) return;
        const span = track.offsetHeight - window.innerHeight;
        if (span <= 0) return;
        const top = window.scrollY + track.getBoundingClientRect().top;
        window.scrollTo({
          top: top + (span * (index + 0.5)) / nodes.length,
          behavior: reduce ? "auto" : "smooth",
        });
        return;
      }
      setActive(index);
      setHeld(true);
    },
    [pinned, reduce, nodes.length],
  );

  const onKeyNav = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
      const next = (active + dir + nodes.length) % nodes.length;
      if (pinned) {
        select(next);
        return;
      }
      setHeld(true);
      setActive(next);
    },
    [active, nodes.length, pinned, select],
  );

  const step = nodes[active];
  const progress = last > 0 ? active / last : 1;

  const flow = (
    <div
      className="pf"
      data-fit={fit ? "on" : undefined}
      data-pinned={pinned ? "on" : undefined}
      onPointerLeave={() => setHeld(false)}
    >
      {/* ---------------- conduit: wide layout ---------------- */}
      <div className="pf__stage">
        <svg
          className="pf__svg"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          role="presentation"
          focusable="false"
          aria-hidden
        >
          <defs>
            <linearGradient id={`${uid}-live`} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-accent-dim)" />
              <stop offset="100%" stopColor="var(--color-accent)" />
            </linearGradient>
            <filter id={`${uid}-bloom`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="7" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id={`${uid}-halo`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
            </radialGradient>
            <path id={`${uid}-path`} d={PATH_D} />
          </defs>

          {/* substrate grid — depth without noise */}
          <g className="pf__grid" aria-hidden>
            {Array.from({ length: 13 }, (_, i) => (
              <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2={VB_H} />
            ))}
            {Array.from({ length: 5 }, (_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 100} x2={VB_W} y2={i * 100} />
            ))}
          </g>

          {/* origin + terminus markers */}
          <g className="pf__ends" aria-hidden>
            <line x1={POINTS[0].x - 84} y1={POINTS[0].y} x2={POINTS[0].x} y2={POINTS[0].y} />
            <line x1={POINTS[last].x} y1={POINTS[last].y} x2={POINTS[last].x + 84} y2={POINTS[last].y} />
            <circle cx={POINTS[0].x - 84} cy={POINTS[0].y} r="3.5" />
            <circle cx={POINTS[last].x + 84} cy={POINTS[last].y} r="3.5" />
            {/* Terminus captions ride above their stub so they never collide with
                the stage labels below, and never run past the viewBox edge. */}
            <text className="pf__end-label" x={POINTS[0].x - 84} y={POINTS[0].y - 58}>
              IDEA
            </text>
            <text className="pf__end-label" x={POINTS[last].x + 84} y={POINTS[last].y - 58} textAnchor="end">
              PRODUCTION
            </text>
          </g>

          {/* dormant conduit */}
          <path className="pf__conduit" d={PATH_D} />

          {/* energised conduit up to the active stage */}
          <motion.path
            className="pf__live"
            d={PATH_D}
            pathLength={1}
            stroke={`url(#${uid}-live)`}
            filter={`url(#${uid}-bloom)`}
            strokeDasharray="1 1"
            initial={false}
            animate={{ strokeDashoffset: 1 - progress }}
            transition={{ duration: reduce ? 0 : 0.9, ease }}
          />

          {/* travelling signal */}
          {!reduce && (
            <circle className="pf__pulse" r="3.4">
              <animateMotion dur="9s" repeatCount="indefinite" rotate="auto">
                <mpath href={`#${uid}-path`} />
              </animateMotion>
            </circle>
          )}

          {/* halo behind the active stage */}
          <motion.circle
            className="pf__halo"
            r="86"
            fill={`url(#${uid}-halo)`}
            initial={false}
            animate={{ cx: POINTS[active].x, cy: POINTS[active].y }}
            transition={{ duration: reduce ? 0 : 0.7, ease }}
          />

          {/* drop lines tying each stage to its ordinal on the baseline */}
          {nodes.map((s, i) => (
            <g key={s.id} className="pf__tie" data-state={i === active ? "on" : "off"}>
              <line x1={POINTS[i].x} y1={POINTS[i].y} x2={POINTS[i].x} y2={VB_H - 34} />
              <text className="pf__tie-num" x={POINTS[i].x} y={VB_H - 16} textAnchor="middle">
                {s.number}
              </text>
            </g>
          ))}
        </svg>

        {/* Telemetry panel — occupies the empty quadrant above the opening of
            the conduit and carries the stage's output signature, the one piece
            of stage content the readout console does not show. */}
        <div className="pf__telemetry" aria-hidden>
          <p className="pf__telemetry-k">
            <span className="pf__telemetry-dot" />
            Output signature
          </p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={step.id}
              className="pf__telemetry-list"
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: 6 }}
              transition={SWAP}
            >
              {step.output.split("·").map((part) => (
                <li key={part}>{part.trim()}</li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>

        {/* interactive nodes sit above the conduit as real buttons */}
        <div className="pf__nodes" role="tablist" aria-label="Process stages" onKeyDown={onKeyNav}>
          {nodes.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              id={`pf-tab-${s.id}`}
              aria-selected={i === active}
              aria-controls="pf-readout"
              tabIndex={i === active ? 0 : -1}
              className="pf__node"
              data-state={i === active ? "on" : i < active ? "done" : "off"}
              data-side={POINTS[i].y < 200 ? "up" : "down"}
              style={{
                left: `${(POINTS[i].x / VB_W) * 100}%`,
                top: `${(POINTS[i].y / VB_H) * 100}%`,
              }}
              onClick={() => select(i)}
              onPointerEnter={pinned ? undefined : () => select(i)}
              onFocus={pinned ? undefined : () => select(i)}
            >
              <span className="pf__node-disc" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  {GLYPHS[s.id]}
                </svg>
              </span>
              <span className="pf__node-label">
                <span className="pf__node-num" aria-hidden>
                  {s.number}
                </span>
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ---------------- conduit: compact vertical spine ---------------- */}
      <div className="pf__spine" role="tablist" aria-label="Process stages" onKeyDown={onKeyNav}>
        <span className="pf__spine-rail" aria-hidden />
        <span
          className="pf__spine-live"
          aria-hidden
          style={{ transform: `scaleY(${last > 0 ? Math.max(progress, 0.02) : 1})` }}
        />
        {nodes.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls="pf-readout"
            tabIndex={i === active ? 0 : -1}
            className="pf__spine-node"
            data-state={i === active ? "on" : i < active ? "done" : "off"}
            onClick={() => select(i)}
          >
            <span className="pf__spine-disc" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                {GLYPHS[s.id]}
              </svg>
            </span>
            <span className="pf__spine-copy">
              <span className="pf__spine-num" aria-hidden>
                {s.number}
              </span>
              <span className="pf__spine-label">{s.label}</span>
            </span>
          </button>
        ))}
      </div>

      {/* ---------------- shared readout console ---------------- */}
      <div
        className="pf__readout"
        id="pf-readout"
        role="tabpanel"
        aria-labelledby={`pf-tab-${step.id}`}
        aria-live="polite"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step.id}
            className="pf__panel"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={SWAP}
          >
            <div className="pf__panel-lead">
              <p className="pf__panel-k">
                <span className="pf__panel-num">{step.number}</span>
                <span aria-hidden>—</span>
                <span>{step.label}</span>
              </p>
              <h3 className="pf__panel-title">{step.title}</h3>
              <p className="pf__panel-purpose">{step.purpose}</p>
            </div>

            <div className="pf__panel-col">
              <p className="pf__col-k">What happens</p>
              <ul className="pf__list">
                {step.happens.slice(0, 5).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="pf__panel-col">
              <p className="pf__col-k">What you get</p>
              <ul className="pf__chips">
                {step.deliverables.slice(0, 5).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="pf__outcome">
                <span aria-hidden>↳</span> {step.outcome}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );

  if (!pinned) return flow;

  return (
    <div
      ref={trackRef}
      className="pf-track"
      style={{ ["--pf-stages" as string]: nodes.length }}
    >
      <div className="pf-track__pin">{flow}</div>
    </div>
  );
}
