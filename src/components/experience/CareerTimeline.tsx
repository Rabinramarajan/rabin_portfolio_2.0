"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { careerHorizon } from "@/content/experience";
import type { HorizonChapter } from "@/content/types";
import { StackTechIcon } from "@/components/StackTechIcon";
import { duration, ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { useSideRevealSafe } from "@/lib/useSideRevealSafe";

/**
 * THE CAREER TIMELINE.
 *
 * A centre rail with chapters alternating either side of it: the year sits on
 * the empty side, the card on the other, and the marker bridges them. The rail
 * fills to roughly where the reader is — never ahead of them — and one
 * IntersectionObserver decides which chapter is active. Everything else is CSS
 * driven off `data-state` / `data-tone`.
 *
 * Below ~900px the alternation collapses: every card moves to the right of a
 * left-hand rail, which is the only layout that survives a phone width.
 */
export function CareerTimeline({ limit }: { limit?: number } = {}) {
  const reduce = useReducedMotionSafe();
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  /* The home page shows the most recent real chapters — the open-ended "next"
     chapter belongs on /experience, where the page closes on it. */
  const chapters = limit
    ? careerHorizon.filter((c) => c.tone !== "next").slice(-limit)
    : careerHorizon;

  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.8", "end 0.65"] });
  const fill = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), {
    stiffness: 78,
    damping: 24,
    restDelta: 0.0008,
  });

  /**
   * Chapters differ a lot in height, so raw `intersectionRatio` is not
   * comparable between them — it is a fraction of the chapter, and a tall one
   * physically cannot score as high as a short one. Coverage is normalised
   * against the smaller of the reading band and the chapter, and every
   * chapter's latest value is kept, because one that has finished crossing its
   * thresholds stops sending entries.
   */
  useEffect(() => {
    const nodes = listRef.current?.querySelectorAll<HTMLElement>("[data-chapter]");
    if (!nodes?.length) return;

    const coverage = new Map<number, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const i = Number((entry.target as HTMLElement).dataset.chapter);
          if (Number.isNaN(i)) continue;
          const band = entry.rootBounds?.height ?? window.innerHeight;
          const reference = Math.min(band, entry.boundingClientRect.height || 1) || 1;
          coverage.set(i, entry.isIntersecting ? entry.intersectionRect.height / reference : 0);
        }
        let best = -1;
        let bestScore = 0;
        for (const [i, score] of coverage) {
          if (score > bestScore) {
            bestScore = score;
            best = i;
          }
        }
        if (best >= 0) setActive((prev) => (prev === best ? prev : best));
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: "-15% 0px -35% 0px",
      },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [chapters.length]);

  const total = chapters.length;
  const activeChapter = chapters[active];

  return (
    <div className="ctl">
      {/* Progress counter — desktop only */}
      <div className="ctl__progress" aria-hidden>
        <span className="ctl__progress-current">
          {String(active + 1).padStart(2, "0")}
        </span>
        <span className="ctl__progress-sep">/</span>
        <span className="ctl__progress-total">
          {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* Active chapter label — shows what's currently in view */}
      {activeChapter ? (
        <div className="ctl__active-label" aria-live="polite" aria-atomic="true">
          <span className="ctl__active-dot" aria-hidden />
          <span className="ctl__active-text">
            {activeChapter.phase}
            {activeChapter.role ? ` · ${activeChapter.role}` : ""}
          </span>
        </div>
      ) : null}

      <ol className="ctl__list" ref={listRef}>
        <span className="ctl__rail" aria-hidden>
          <motion.span className="ctl__rail-fill" style={{ scaleY: reduce ? 1 : fill }} />
        </span>

        {chapters.map((chapter, i) => (
          <Chapter
            key={chapter.id}
            chapter={chapter}
            index={i}
            state={i === active ? "now" : i < active ? "past" : "next"}
            reduce={reduce}
          />
        ))}
      </ol>
    </div>
  );
}

function Chapter({
  chapter,
  index,
  state,
  reduce,
}: {
  chapter: HorizonChapter;
  index: number;
  state: "past" | "now" | "next";
  reduce: boolean;
}) {
  /* Odd chapters place their card on the left, so the rail reads as a stitch. */
  const side = index % 2 === 0 ? "right" : "left";
  // Only the two-column desktop timeline has room to enter from the side;
  // the mobile single column reveals upward instead. See useSideRevealSafe.
  const sideOk = useSideRevealSafe();
  const from = sideOk ? (side === "right" ? 26 : -26) : 0;

  return (
    /*
     * `key` remounts the reveal when either media query resolves.
     * useReducedMotionSafe and useSideRevealSafe both report their SSR
     * snapshot on the hydrating render, so the variants motion captures at
     * mount are the desktop / full-motion ones. Motion reads `variants` when
     * it applies an animation state, and these rows sit below the fold in the
     * "hidden" state the whole time — so the corrected values that arrive on
     * the next render were never applied, and reduced motion was silently
     * ignored here. Remounting re-runs `initial` with the resolved values.
     */
    <motion.li
      key={`${reduce}-${sideOk}`}
      className="ctl__item"
      data-chapter={index}
      data-side={side}
      data-tone={chapter.tone}
      data-state={state}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
      variants={reduce ? undefined : { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
    >
      {/* the year, on the side the card is not */}
      <motion.div className="ctl__yearcol" variants={step(reduce, 10)}>
        <p className="ctl__year">
          {chapter.year}
          {chapter.tone === "live" ? <span className="ctl__year-sub">— Present</span> : null}
        </p>
        <p className="ctl__phase">{chapter.phase}</p>
      </motion.div>

      <span className="ctl__marker" aria-hidden />

      <motion.article
        className="ctl__card"
        variants={
          reduce
            ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: duration.micro } } }
            : {
                hidden: { opacity: 0, x: from, y: from ? 10 : 22 },
                show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.62, ease } },
              }
        }
      >
        {chapter.tone === "live" ? <span className="ctl__badge">Current</span> : null}

        <div className="ctl__head">
          <span className="ctl__logo" aria-hidden>
            {chapter.logo ? (
              <img className="ctl__logo-img" src={chapter.logo} alt="" width={20} height={20} loading="lazy" />
            ) : (
              chapter.monogram ?? initials(chapter.org ?? chapter.phase)
            )}
          </span>
          <div className="ctl__ident">
            <h3 className="ctl__role">{chapter.role ?? chapter.headline}</h3>
            {chapter.org ? <p className="ctl__org">{chapter.org}</p> : null}
            {chapter.location ? (
              <p className="ctl__place">
                <PinIcon />
                {chapter.location}
              </p>
            ) : null}
          </div>
        </div>

        <p className="ctl__copy">{chapter.body}</p>

        {chapter.achievements?.length ? (
          <ul className="ctl__wins">
            {chapter.achievements.map((line) => (
              <li key={line}>
                <CheckIcon />
                {line}
              </li>
            ))}
          </ul>
        ) : null}

        <ul className="ctl__tags">
          {chapter.tags.map((tag) => (
            <li key={tag} className="ctl__tag">
              <StackTechIcon label={tag} className="ctl__tag-icon" />
              <span>{tag}</span>
            </li>
          ))}
        </ul>

        {chapter.footer ? <p className="ctl__footer">{chapter.footer}</p> : null}
      </motion.article>
    </motion.li>
  );
}

/** The shared reveal step for the year column. */
function step(reduce: boolean, y: number) {
  if (reduce) {
    return { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: duration.micro } } };
  }
  return { hidden: { opacity: 0, y }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } } };
}

/** Two-letter fallback mark when a chapter declares no monogram. */
function initials(label: string) {
  const words = label.split(/[\s·.]+/).filter(Boolean);
  return ((words[0]?.[0] ?? "") + (words[1]?.[0] ?? words[0]?.[1] ?? "")).toUpperCase();
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden focusable="false">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.45" />
      <path
        d="m8 12.3 2.6 2.5L16 9.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden focusable="false">
      <path
        d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
