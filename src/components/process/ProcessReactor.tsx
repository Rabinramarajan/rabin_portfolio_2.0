"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import type { ProcessStep, ProcessVisualId } from "@/content/types";
import { ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { ProcessVisual } from "./ProcessVisual";

const DWELL_MS = 6200;
const SWAP = { duration: 0.5, ease } as const;

/**
 * The process seen as one live system rather than a list of steps: a conduit of
 * lit stage nodes feeding a single reactor viewport, with the detail for the
 * selected stage read out beside it. One stage is always energised — the
 * conduit cycles on its own until a pointer, focus or key takes over.
 *
 * The whole thing is a tablist: the nodes are the tabs, the readout is the
 * panel. Keyboard follows the WAI-ARIA tabs pattern (arrows, Home, End) with a
 * roving tabindex, so the process is explorable without a pointer.
 */
export function ProcessReactor({ steps }: { steps: ProcessStep[] }) {
  const reduce = useReducedMotionSafe();
  const rootRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "-20% 0px -20% 0px" });
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);

  /* Ambient cycling. Pauses off-screen, while the section is being explored,
     and entirely under reduced motion — an auto-advancing panel is exactly the
     kind of unrequested movement that setting asks us to stop. */
  useEffect(() => {
    if (reduce || held || !inView) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % steps.length);
    }, DWELL_MS);
    return () => window.clearInterval(id);
  }, [reduce, held, inView, steps.length]);

  const select = useCallback((index: number, focusNode = false) => {
    setActive(index);
    if (!focusNode) return;
    const node = railRef.current?.querySelectorAll<HTMLButtonElement>("[role='tab']")[index];
    node?.focus();
  }, []);

  /* Keep the selected node in view in the scrollable mobile conduit. */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || rail.scrollWidth <= rail.clientWidth) return;
    const node = rail.querySelectorAll<HTMLElement>("[role='tab']")[active];
    node?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", inline: "center", block: "nearest" });
  }, [active, reduce]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = steps.length - 1;
    const moves: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowDown: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      ArrowUp: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next, true);
  };

  const step = steps[active];

  return (
    <div
      className="rx"
      ref={rootRef}
      data-stage={step.id}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
      }}
    >
      <div className="rx__stage">
        {/* ---------- readout ---------- */}
        <div className="rx__readout">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step.id}
              id={`rx-panel-${step.id}`}
              role="tabpanel"
              aria-labelledby={`rx-tab-${step.id}`}
              tabIndex={-1}
              className="rxp"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={SWAP}
            >
              <p className="rxp__k">
                <span className="rxp__num">{step.number}</span>
                <span className="rxp__rule" aria-hidden />
                <span className="rxp__label">{step.label}</span>
              </p>
              <h3 className="rxp__title">{step.title}</h3>
              <p className="rxp__purpose">{step.purpose}</p>
              <p className="rxp__desc">{step.description}</p>

              <ul className="rxp__happens">
                {step.happens.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={reduce ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.34, ease, delay: 0.1 + i * 0.06 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>

              <div className="rxp__foot">
                <div className="rxp__block">
                  <p className="rxp__bk">What you get</p>
                  <ul className="rxp__chips">
                    {step.deliverables.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rxp__block">
                  <p className="rxp__bk">Outcome</p>
                  <p className="rxp__outcome">{step.outcome}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ---------- reactor viewport ---------- */}
        <div className="rx__core" aria-hidden>
          <div className="rx__frame">
            <span className="rx__halo" />
            <span className="rx__ring" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step.id}
                className="rx__scene"
                initial={{ opacity: 0, scale: reduce ? 1 : 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.36, ease }}
              >
                <ProcessVisual id={step.visual} reduce={reduce} />
              </motion.div>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={step.id}
              className="rx__out"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease }}
            >
              {step.output}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* ---------- conduit ---------- */}
      <div className="rx__conduit">
        <div className="rx__wire" aria-hidden>
          <span className="rx__pulse" />
        </div>
        <div
          className="rx__rail"
          ref={railRef}
          role="tablist"
          aria-label="Process stages"
          aria-orientation="horizontal"
          onKeyDown={onKeyDown}
        >
          {steps.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              id={`rx-tab-${s.id}`}
              aria-selected={i === active}
              aria-controls={`rx-panel-${s.id}`}
              tabIndex={i === active ? 0 : -1}
              className="rxn"
              data-state={i === active ? "on" : "off"}
              onClick={() => select(i)}
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") setActive(i);
              }}
            >
              <span className="rxn__dot" aria-hidden>
                <StageGlyph id={s.visual} />
              </span>
              <span className="rxn__num" aria-hidden>
                {s.number}
              </span>
              <span className="rxn__label">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Crawlable prose for the stages not currently rendered in the panel.
          aria-hidden so assistive tech hears the tabs once, not twice. */}
      <ol className="rx__seo" aria-hidden>
        {steps.map((s) => (
          <li key={s.id}>
            <span>{`${s.number} — ${s.label}: ${s.title}. ${s.description} ${s.outcome}`}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* --- one 24px line glyph per stage, drawn on the same 24-unit grid --- */
function StageGlyph({ id }: { id: ProcessVisualId }) {
  const paths: Record<ProcessVisualId, React.ReactNode> = {
    discover: (
      <>
        <circle cx="10.5" cy="10.5" r="6" />
        <path d="M15 15l5 5" />
        <path d="M10.5 7.5v6M7.5 10.5h6" />
      </>
    ),
    define: (
      <>
        <path d="M3.5 6.5h17v11h-17z" />
        <path d="M3.5 10.5h17M9.5 10.5v7" />
      </>
    ),
    design: (
      <>
        <path d="M12 3.5l8 4.5-8 4.5-8-4.5z" />
        <path d="M4 12.5l8 4.5 8-4.5" />
        <path d="M4 16.5l8 4 8-4" />
      </>
    ),
    build: (
      <>
        <path d="M8.5 7.5L4 12l4.5 4.5" />
        <path d="M15.5 7.5L20 12l-4.5 4.5" />
        <path d="M13.5 5l-3 14" />
      </>
    ),
    test: (
      <>
        <path d="M12 3.5l7 2.5v6c0 4-3 7-7 8.5-4-1.5-7-4.5-7-8.5V6z" />
        <path d="M9 12l2.2 2.2L15.5 10" />
      </>
    ),
    launch: (
      <>
        <path d="M12 3.5c3 2.5 4.5 5.8 4.5 9.5L12 17l-4.5-4c0-3.7 1.5-7 4.5-9.5z" />
        <circle cx="12" cy="10" r="1.8" />
        <path d="M9.5 18.5L8 21M14.5 18.5L16 21" />
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
  return (
    <svg viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden>
      <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        {paths[id]}
      </g>
    </svg>
  );
}
