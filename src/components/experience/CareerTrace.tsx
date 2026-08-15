"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { careerLead, formatRoleDates } from "@/content/experience";
import type { ExperienceRole } from "@/content/types";
import { duration, ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { RoleVisual } from "./RoleVisual";

/**
 * THE CAREER TRACE — the journey as one continuous signal.
 *
 * Panels alternate side of a single drawn line, so reading the page is
 * following a signal that swings left and right through the years. A single
 * scroll subscription drives the line fill and a single IntersectionObserver
 * drives which stage is active; there is no rAF loop.
 *
 * Each stage arrives with a directional wipe (from its own side, so the
 * zigzag reads as motion), content staggers up inside, and the role visual
 * draws in as the stage reaches the viewport.
 */

export function TraceFill({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start 0.75", "end 0.6"] });
  const scaleY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), {
    stiffness: 76,
    damping: 24,
    restDelta: 0.0008,
  });
  return (
    <div className="xtr__rail" aria-hidden>
      <motion.span className="xtr__fill" style={{ scaleY: reduce ? 1 : scaleY }} />
    </div>
  );
}

export function CareerTrace({ roles }: { roles: ExperienceRole[] }) {
  const reduce = useReducedMotionSafe();
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  /** One observer for every stage; the most-visible stage wins. */
  useEffect(() => {
    const nodes = listRef.current?.querySelectorAll<HTMLElement>("[data-stage]");
    if (!nodes?.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const i = Number((visible.target as HTMLElement).dataset.stage);
        if (!Number.isNaN(i)) setActive((prev) => (prev === i ? prev : i));
      },
      { threshold: [0.2, 0.55], rootMargin: "-12% 0px -30% 0px" },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [roles.length]);

  return (
    <ol className="xtr" ref={listRef}>
      <TraceFill targetRef={listRef} />

      {/* the foundation, before the first professional role */}
      <TraceNode
        index={0}
        activeIndex={active}
        reduce={reduce}
        year={careerLead.year}
        chapter={careerLead.chapter}
        visual={careerLead.visual}
      >
        <motion.p className="xtr__milestone" variants={line(reduce)}>{careerLead.label}</motion.p>
        <motion.h3 className="xtr__role" variants={line(reduce, 0)}>
          <span className="xtr__role-mask">
            <motion.span
              variants={{
                hidden: reduce ? { opacity: 0 } : { y: "108%" },
                show: reduce
                  ? { opacity: 1, transition: { duration: duration.micro } }
                  : { y: "0%", transition: { duration: 0.66, ease } },
              }}
            >
              {careerLead.label}
            </motion.span>
          </span>
        </motion.h3>
        <motion.p className="xtr__note" variants={line(reduce)}>{careerLead.note}</motion.p>
      </TraceNode>

      {roles.map((role, i) => {
        const index = i + 1;
        const isCurrent = role.end === null;
        return (
          <TraceNode
            key={role.id}
            index={index}
            activeIndex={active}
            reduce={reduce}
            year={role.start}
            chapter={role.chapter}
            visual={role.visual}
            current={isCurrent}
          >
            {role.milestone ? <motion.p className="xtr__milestone" variants={line(reduce)}>{role.milestone}</motion.p> : null}
            {/* the observer watches the heading — the line itself is clipped */}
            <motion.h3
              className="xtr__role"
              variants={line(reduce, 0)}
            >
              <span className="xtr__role-mask">
                <motion.span
                  variants={{
                    hidden: reduce ? { opacity: 0 } : { y: "108%" },
                    show: reduce
                      ? { opacity: 1, transition: { duration: duration.micro } }
                      : { y: "0%", transition: { duration: 0.66, ease } },
                  }}
                >
                  {role.role}
                </motion.span>
              </span>
              {isCurrent ? <span className="xtr__now">Current</span> : null}
            </motion.h3>
            <motion.p className="xtr__company" variants={line(reduce)}>
              {role.company} · {role.type}
              <span className="xtr__loc"> · {role.location}</span>
            </motion.p>
            <motion.p className="xtr__period" variants={line(reduce)}>{formatRoleDates(role)}</motion.p>
            <motion.p className="xtr__desc" variants={line(reduce)}>{role.description}</motion.p>

            {role.impact.length ? (
              <motion.div className="xtr__block" variants={line(reduce)}>
                <p className="xtr__k">Impact</p>
                <ul className="xtr__list">
                  {role.impact.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </motion.div>
            ) : null}

            {role.responsibilities.length ? (
              <motion.div className="xtr__block" variants={line(reduce)}>
                <p className="xtr__k">Key contributions</p>
                <ul className="xtr__list">
                  {role.responsibilities.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </motion.div>
            ) : null}

            {/* the information layer: role → technologies */}
            <motion.ul className="xtr__tech" variants={line(reduce)}>
              {role.technologies.map((t, j) => (
                <motion.li
                  key={t}
                  variants={chip(reduce)}
                  transition={{
                    duration: reduce ? duration.micro : 0.36,
                    delay: reduce ? 0 : 0.05 + j * 0.05,
                    ease,
                  }}
                >
                  {t}
                </motion.li>
              ))}
            </motion.ul>
          </TraceNode>
        );
      })}
    </ol>
  );
}

/** Shared stagger step — the "in" of every line inside a panel. */
function line(reduce: boolean, y = 12) {
  if (reduce) {
    return {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { duration: duration.micro } },
    };
  }
  return {
    hidden: { opacity: 0, y },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
  };
}

/** Tech chips slide in sideways so they read as tags being placed. */
function chip(reduce: boolean) {
  if (reduce) {
    return {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { duration: duration.micro } },
    };
  }
  return {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { duration: 0.36, ease } },
  };
}

export function TraceNode({
  index,
  activeIndex,
  reduce,
  year,
  chapter,
  visual,
  current,
  children,
}: {
  index: number;
  activeIndex: number;
  reduce: boolean;
  year: string;
  chapter?: string;
  visual?: ExperienceRole["visual"];
  current?: boolean;
  children: React.ReactNode;
}) {
  const state = index === activeIndex ? "now" : index < activeIndex ? "past" : "next";
  const side = index % 2 === 0 ? "left" : "right";
  const panelRef = useRef<HTMLDivElement>(null);

  const onGlareMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = panelRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };
  const onGlareLeave = () => {
    const el = panelRef.current;
    if (el) {
      el.style.setProperty("--mx", "30%");
      el.style.setProperty("--my", "-20%");
    }
  };

  /*
   * The observer sits on the item, never on the panel. Chromium clips a
   * target's intersection rect by its own clip-path, so an element that
   * starts clipped reports a ratio of 0 and would never satisfy a viewport
   * `amount` — it would stay invisible forever. The item is unclipped, so it
   * observes reliably and drives the panel through variants.
   */
  const wipe =
    side === "left" ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";
  const wipeEnd = "inset(0 0 0 0)";

  return (
    <motion.li
      className="xtr__item"
      data-side={side}
      data-stage={index}
      data-state={state}
      data-current={current ? "true" : undefined}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -8% 0px" }}
    >
      <div className="xtr__meta">
        {chapter ? <p className="xtr__chapter">{chapter}</p> : null}
        <p className="xtr__year">{year}</p>
      </div>

      <span className="xtr__marker" aria-hidden />

      {/* directional wipe — arrives from the side it lives on */}
      <motion.div
        className="xtr__panel"
        onMouseMove={reduce ? undefined : onGlareMove}
        onMouseLeave={reduce ? undefined : onGlareLeave}
        ref={panelRef}
        variants={
          reduce
            ? {
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { duration: duration.micro } },
              }
            : {
                hidden: { clipPath: wipe, opacity: 0 },
                show: {
                  clipPath: wipeEnd,
                  opacity: 1,
                  transition: { duration: 0.75, ease },
                },
              }
        }
      >
        {/* the stage number — blueprint plate, sits above the reveal */}
        <span className="xtr__panel-idx" aria-hidden>
          {String(index).padStart(2, "0")}
        </span>
        <span className="xtr__panel-corners" aria-hidden>
          <span className="xtr__panel-corner xtr__panel-corner--tl" />
          <span className="xtr__panel-corner xtr__panel-corner--br" />
        </span>

        <div className="xtr__panel-body">
          <motion.div className="xtr__content" variants={staggerPanel(reduce)}>
            {children}
          </motion.div>

          {visual ? (
            <motion.div
              className="xtr__visual"
              aria-hidden
              variants={
                reduce
                  ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: duration.micro } } }
                  : {
                      hidden: { opacity: 0, y: 16 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.6, ease, delay: 0.4 },
                      },
                    }
              }
            >
              <LazyRoleVisual id={visual} reduce={reduce} />
            </motion.div>
          ) : null}
        </div>
      </motion.div>
    </motion.li>
  );
}

/** Choreography: each line inside the panel steps up in sequence. */
function staggerPanel(reduce: boolean) {
  if (reduce) {
    return {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { duration: duration.micro } },
    };
  }
  return {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
  };
}

/**
 * The scene only mounts once its slot reaches the viewport, so its draw-in
 * plays as the stage arrives rather than finishing invisibly at page load.
 * The observer watches the unclipped stage item — the slot itself sits inside
 * the clip-wiped panel, and Chromium clips an observed rect by clip-path, so
 * a clipped target would report ratio 0 and never mount.
 */
function LazyRoleVisual({ id, reduce }: { id: NonNullable<ExperienceRole["visual"]>; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = el.closest<HTMLElement>(".xtr__item") ?? el;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return <div ref={ref} className="xtr__visual-slot">{shown ? <RoleVisual id={id} reduce={reduce} /> : null}</div>;
}