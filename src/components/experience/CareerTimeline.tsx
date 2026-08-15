"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { careerLead, formatRoleDates } from "@/content/experience";
import type { ExperienceRole } from "@/content/types";
import { duration, ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { RoleVisual } from "./RoleVisual";

/**
 * The career architecture — one continuous vertical structure rather than a
 * stack of job cards. A single scroll subscription drives the rail fill and a
 * single IntersectionObserver drives which stage is active; there is no rAF
 * loop and no window scroll listener.
 *
 * Each stage reveals through a clip wipe rather than a shared fade-up, and
 * stages that are behind you dim instead of disappearing — the whole journey
 * stays on screen at once, which is the point of the section.
 */

export function CareerProgress({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start 0.75", "end 0.6"] });
  const scaleY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), {
    stiffness: 76,
    damping: 24,
    restDelta: 0.0008,
  });
  return (
    <div className="xtl__rail" aria-hidden>
      <motion.span className="xtl__fill" style={{ scaleY: reduce ? 1 : scaleY }} />
    </div>
  );
}

export function CareerTimeline({ roles }: { roles: ExperienceRole[] }) {
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
    <ol className="xtl" ref={listRef}>
      <CareerProgress targetRef={listRef} />

      {/* the foundation, before the first professional role */}
      <CareerNode
        index={0}
        activeIndex={active}
        reduce={reduce}
        year={careerLead.year}
        chapter={careerLead.chapter}
        visual={careerLead.visual}
      >
        <p className="xtl__milestone">{careerLead.label}</p>
        <p className="xtl__note">{careerLead.note}</p>
      </CareerNode>

      {roles.map((role, i) => {
        const index = i + 1;
        const isCurrent = role.end === null;
        return (
          <CareerNode
            key={role.id}
            index={index}
            activeIndex={active}
            reduce={reduce}
            year={role.start}
            chapter={role.chapter}
            visual={role.visual}
            current={isCurrent}
          >
            {role.milestone ? <p className="xtl__milestone">{role.milestone}</p> : null}
            {/* the observer watches the heading — the line itself is clipped */}
            <motion.h3
              className="xtl__role"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
            >
              <span className="xtl__role-mask">
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
              {isCurrent ? <span className="xtl__now">Current</span> : null}
            </motion.h3>
            <p className="xtl__company">
              {role.company} · {role.type}
              <span className="xtl__loc"> · {role.location}</span>
            </p>
            <p className="xtl__period">{formatRoleDates(role)}</p>
            <p className="xtl__desc">{role.description}</p>

            {role.impact.length ? (
              <div className="xtl__block">
                <p className="xtl__k">Impact</p>
                <ul className="xtl__list">
                  {role.impact.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {role.responsibilities.length ? (
              <div className="xtl__block">
                <p className="xtl__k">Key contributions</p>
                <ul className="xtl__list">
                  {role.responsibilities.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* the information layer: role → technologies */}
            <ul className="xtl__tech">
              {role.technologies.map((t, j) => (
                <motion.li
                  key={t}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    duration: reduce ? duration.micro : 0.36,
                    delay: reduce ? 0 : 0.1 + j * 0.05,
                    ease,
                  }}
                >
                  {t}
                </motion.li>
              ))}
            </ul>
          </CareerNode>
        );
      })}
    </ol>
  );
}

export function CareerNode({
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

  /*
   * The observer sits on the item, never on the cell. Chromium clips a
   * target's intersection rect by its own clip-path, so an element that
   * starts at inset(0 0 100% 0) reports a ratio of 0 and would never satisfy
   * a viewport `amount` — it would stay invisible forever. The item is
   * unclipped, so it observes reliably and drives the cell through variants.
   */
  return (
    <motion.li
      className="xtl__item"
      data-stage={index}
      data-state={state}
      data-current={current ? "true" : undefined}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -8% 0px" }}
    >
      <div className="xtl__year-col">
        {chapter ? <p className="xtl__chapter">{chapter}</p> : null}
        <p className="xtl__year">{year}</p>
      </div>

      <span className="xtl__marker" aria-hidden />

      {/* clip wipe — this stage arrives, it does not fade up */}
      <motion.div
        className="xtl__cell"
        variants={{
          hidden: reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)", opacity: 0 },
          show: reduce
            ? { opacity: 1, transition: { duration: duration.micro } }
            : { clipPath: "inset(0 0 0% 0)", opacity: 1, transition: { duration: 0.75, ease } },
        }}
      >
        {children}
      </motion.div>

      {visual ? (
        <div className="xtl__visual" aria-hidden>
          <LazyRoleVisual id={visual} reduce={reduce} />
        </div>
      ) : null}
    </motion.li>
  );
}

/**
 * The scene only mounts once its slot reaches the viewport, so its draw-in
 * plays as the stage arrives rather than finishing invisibly at page load.
 */
function LazyRoleVisual({ id, reduce }: { id: NonNullable<ExperienceRole["visual"]>; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref} className="xtl__visual-slot">{shown ? <RoleVisual id={id} reduce={reduce} /> : null}</div>;
}
