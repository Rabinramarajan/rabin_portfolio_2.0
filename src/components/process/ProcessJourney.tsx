"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import type { ProcessStep } from "@/content/types";
import { ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { ProcessSpine } from "./ProcessSpine";
import { ProcessVisual } from "./ProcessVisual";
import { ProcessNav } from "./ProcessNav";
import { LineReveal } from "./LineReveal";

const DESKTOP_QUERY = "(min-width: 960px)";
const STEP_MS = 0.52;

/**
 * The journey coordinates everything from a single scroll subscription plus a
 * single IntersectionObserver — there is no rAF loop and no window scroll
 * handler. Desktop derives the active stage from scroll progress across the
 * sticky range; the mobile column derives it from the observer instead. Only
 * one of the two layouts is ever displayed, so only one is ever driving.
 */
export function ProcessJourney({ steps }: { steps: ProcessStep[] }) {
  const reduce = useReducedMotionSafe();
  const pinRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const desktopRef = useRef(false);

  const { scrollYProgress } = useScroll({ target: pinRef, offset: ["start start", "end end"] });
  const draw = useSpring(scrollYProgress, { stiffness: 78, damping: 24, restDelta: 0.0008 });

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const sync = () => {
      desktopRef.current = mq.matches && !reduce;
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reduce]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!desktopRef.current) return;
    const next = Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length)));
    setActive((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    const nodes = pinRef.current?.querySelectorAll<HTMLElement>("[data-pjitem]");
    if (!nodes?.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (desktopRef.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const i = Number((visible.target as HTMLElement).dataset.pjitem);
        if (!Number.isNaN(i)) setActive((prev) => (prev === i ? prev : i));
      },
      { threshold: [0.25, 0.6], rootMargin: "-15% 0px -35% 0px" },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [steps.length]);

  const goTo = useCallback(
    (index: number) => {
      const candidates = pinRef.current?.querySelectorAll<HTMLElement>(`[data-pjanchor="${index}"]`);
      if (!candidates?.length) return;
      const el = Array.from(candidates).find((node) => node.offsetParent !== null);
      if (!el) return;
      const offset = el.dataset.pjoffset === "0" ? 0 : 88;
      window.scrollTo({
        top: window.scrollY + el.getBoundingClientRect().top - offset,
        behavior: reduce ? "auto" : "smooth",
      });
    },
    [reduce],
  );

  const step = steps[active];

  return (
    <div className="pj" ref={pinRef}>
      {/* ---------- desktop: sticky journey ---------- */}
      <div className="pj__sticky">
        <div className="pj__info">
          <ProcessNav steps={steps} active={active} onSelect={goTo} orientation="vertical" />
          <div className="pj__head">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={`n-${step.id}`}
                className="pj__num"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: STEP_MS, ease }}
              >
                {step.number}
              </motion.p>
            </AnimatePresence>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={`c-${step.id}`} className="pj__copy">
                <motion.h3
                  className="pj__title"
                  initial={{ clipPath: "inset(0 0 100% 0)", y: "0.12em" }}
                  animate={{ clipPath: "inset(0 0 0% 0)", y: 0 }}
                  exit={{ opacity: 0, y: "-0.24em" }}
                  transition={{ duration: 0.62, ease }}
                >
                  {step.title}
                </motion.h3>
                <motion.p
                  className="pj__purpose"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: STEP_MS, ease, delay: 0.06 }}
                >
                  {step.purpose}
                </motion.p>
                <motion.p
                  className="pj__desc"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: STEP_MS, ease, delay: 0.1 }}
                >
                  {step.description}
                </motion.p>
                <motion.ul
                  className="pj__happens"
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.14 } } }}
                >
                  {step.happens.map((item) => (
                    <motion.li
                      key={item}
                      variants={{
                        hidden: { opacity: 0, y: 8 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.34, ease } },
                      }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="pj__path" aria-hidden>
          <ProcessSpine draw={draw} active={active} reduce={reduce} />
        </div>

        <div className="pj__aside">
          <div className="pj__stage">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`v-${step.id}`}
                className="pj__visual"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.34, ease }}
              >
                <ProcessVisual id={step.visual} reduce={reduce} />
              </motion.div>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`m-${step.id}`}
              className="pj__meta"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: STEP_MS, ease, delay: 0.08 }}
            >
              <Deliverables items={step.deliverables} output={step.output} />
              <Outcome text={step.outcome} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* scroll range that drives the sticky journey, with per-stage anchors */}
      <div className="pj__spacer" aria-hidden>
        <div className="pj__anchors">
          {steps.map((s, i) => (
            <span
              key={s.id}
              className="pj__anchor"
              data-pjanchor={i}
              data-pjoffset="0"
              style={{ top: `${((i + 0.5) / steps.length) * 100}%` }}
            />
          ))}
        </div>
      </div>

      {/* ---------- mobile: dedicated vertical journey ---------- */}
      <div className="pj__mobile">
        <ProcessNav steps={steps} active={active} onSelect={goTo} orientation="horizontal" />
        <ol className="pjm">
          {steps.map((s, i) => (
            <li className="pjm__item" key={s.id} data-pjitem={i} data-pjanchor={i} data-state={i <= active ? "on" : "off"}>
              <div className="pjm__rail" aria-hidden>
                <span className="pjm__marker" />
                <motion.span
                  className="pjm__fill"
                  initial={reduce ? { opacity: 0 } : { scaleY: 0 }}
                  whileInView={reduce ? { opacity: 1 } : { scaleY: 1 }}
                  viewport={{ once: true, margin: "-20% 0px -40% 0px" }}
                  transition={{ duration: reduce ? 0.2 : 0.9, ease }}
                />
              </div>
              <div className="pjm__body">
                <p className="pjm__k">
                  <span>{s.number}</span>
                  <span aria-hidden>/</span>
                  <span>{s.label}</span>
                </p>
                <h3 className="pjm__title">
                  <LineReveal lines={[s.title]} />
                </h3>
                <p className="pjm__purpose">{s.purpose}</p>
                <p className="pjm__desc">{s.description}</p>
                <div className="pjm__visual">
                  <MobileVisual id={s.visual} reduce={reduce} />
                </div>
                <Deliverables items={s.deliverables} output={s.output} />
                <Outcome text={s.outcome} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function MobileVisual({ id, reduce }: { id: ProcessStep["visual"]; reduce: boolean }) {
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <div ref={ref}>
      {shown || reduce ? <ProcessVisual id={id} reduce={reduce} /> : <div className="pv pv--idle" />}
    </div>
  );
}

function Deliverables({ items, output }: { items: string[]; output: string }) {
  return (
    <div className="pdel">
      <p className="pdel__k">What you get</p>
      <ul className="pdel__list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="pdel__out">{output}</p>
    </div>
  );
}

function Outcome({ text }: { text: string }) {
  return (
    <div className="pout">
      <p className="pout__k">Outcome</p>
      <p className="pout__text">{text}</p>
    </div>
  );
}
