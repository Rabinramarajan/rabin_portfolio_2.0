"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { projects } from "@/content/projects";
import { profile } from "@/content/profile";
import type { Project, ProjectFilter } from "@/content/types";
import { Monogram } from "@/components/Logo";
import { ProjectCover } from "@/components/ProjectCover";
import { cn } from "@/lib/cn";
import { duration, ease } from "@/lib/motion";
import { SectionKicker, itemHeadingLevel } from "@/components/ui";
import { sections } from "@/content/sections";

const FILTER_LABEL: Record<ProjectFilter, string> = {
  web: "Web Apps",
  mobile: "Mobile",
  enterprise: "Enterprise",
  architecture: "Architecture",
};

/** Category tint, carried by the chapter dot and the stage's rim light. */
const FILTER_TINT: Record<ProjectFilter, string> = {
  web: "#c9f24d",
  mobile: "#4d9bf2",
  enterprise: "#7c6bf5",
  architecture: "#f2a54d",
};

const STATS = [
  { icon: "code", value: `${projects.length}+`, label: ["Projects", "Completed"] },
  { icon: "people", value: "15+", label: ["Happy", "Clients"] },
  { icon: "rocket", value: profile.yearsExperienceLabel, label: ["Years of", "Experience"] },
  { icon: "trophy", value: "100%", label: ["Commitment to", "Quality"] },
] as const;

type FilterId = ProjectFilter | "all";

/**
 * Work — a cinematic stage. The active project plays as one large frame with
 * a title card riding its bottom edge, its detail column reads alongside, and
 * a numbered chapter index below indexes every project in the current filter.
 *
 * A single `active` index drives the stage, the detail column, the counter and
 * the index at once, so those four can never disagree. `dir` records which way
 * the last move travelled so the cut animates with it.
 *
 * `headingLevel` drops to h2 when the block sits below another hero (home
 * page) so the document keeps exactly one h1. `limit` caps how many chapters
 * the index lists; prev/next and the counter still reach every project.
 */
export function WorkSection({
  id = "work",
  headingLevel = "h2",
  index,
  limit,
}: {
  id?: string;
  headingLevel?: "h1" | "h2";
  index?: string;
  limit?: number;
} = {}) {
  const Heading = headingLevel;
  const ItemHeading = itemHeadingLevel(headingLevel);
  const isPageHero = headingLevel === "h1";
  const intro = sections.work;
  const reduce = !!useReducedMotion();
  const [filter, setFilter] = useState<FilterId>("all");
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const chapterRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // The first paint must not animate — the stage would dissolve in on load
  // and cost an LCP frame. Only user-driven cuts are choreographed, so the
  // flag flips on the first interaction and stays on.
  const [engaged, setEngaged] = useState(false);

  const filters = useMemo(() => {
    const present = Array.from(new Set(projects.map((p) => p.filter))).filter(Boolean) as ProjectFilter[];
    return [
      { id: "all" as FilterId, label: "All Work" },
      ...present.map((f) => ({ id: f as FilterId, label: FILTER_LABEL[f] })),
    ];
  }, []);

  const list = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.filter === filter)),
    [filter],
  );

  // A narrowed filter can leave the previous selection out of range, so the
  // stage index is clamped rather than trusted.
  const current = Math.min(active, list.length - 1);
  const featured = list[current];
  const chapters = list.slice(0, limit ?? list.length);

  const go = useCallback(
    (next: number) => {
      const wrapped = (next + list.length) % list.length;
      // Wrapping at either end still reads as travel in the pressed direction.
      setDir(next > current ? 1 : -1);
      setEngaged(true);
      setActive(wrapped);
    },
    [current, list.length],
  );

  /** Roving focus across the chapter index, the way a tablist behaves. */
  const onChapterKey = (event: KeyboardEvent, i: number) => {
    const step =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? 1
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? -1
          : 0;
    if (!step) return;
    event.preventDefault();
    const next = (i + step + chapters.length) % chapters.length;
    go(next);
    chapterRefs.current[next]?.focus();
  };

  // Prev/next can walk past the edge of the scrolling index, so the selected
  // chapter is pulled back into view — never the page, only the rail.
  useEffect(() => {
    if (!engaged) return;
    chapterRefs.current[current]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [current, engaged]);

  if (!featured) return null;

  const counter = `${String(current + 1).padStart(2, "0")} / ${String(list.length).padStart(2, "0")}`;

  return (
    <section
      id={id}
      className={cn("wx", isPageHero && "wx--page")}
      style={{ "--wx-tint": FILTER_TINT[featured.filter] } as CSSProperties}
    >
      <span className="wx__aura" aria-hidden />
      <span className="wx__rules" aria-hidden />

      <div className="shell wx__shell">
        <header className="wx__top">
          <SectionKicker index={index ?? intro.index} label={intro.label} className="wx__kicker" />
          {!isPageHero ? (
            <Link className="wx__all" href="/work">
              <span>View All Projects</span>
              <ArrowUpRight />
            </Link>
          ) : null}
        </header>

        <div className="wx__intro">
          <div className="wx__intro-copy">
            <Heading className="wx__title">
              {intro.title.map((line, i) => (
                <span key={line.text}>
                  {line.newline ? <br /> : i > 0 ? " " : null}
                  {line.accent ? <span className="wx__title-accent">{line.text}</span> : line.text}
                </span>
              ))}
            </Heading>
            <p className="wx__lede">{intro.lede}</p>
          </div>

          <div className="wx__controls">
            <nav className="wx__filters" aria-label="Filter projects">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={cn("wx__filter", filter === f.id && "is-on")}
                  aria-pressed={filter === f.id}
                  onClick={() => {
                    setEngaged(true);
                    setFilter(f.id);
                    setActive(0);
                    setDir(1);
                  }}
                >
                  {f.label}
                </button>
              ))}
            </nav>

            {list.length > 1 ? (
              <div className="wx__nav">
                <span className="wx__counter">{counter}</span>
                <button
                  type="button"
                  className="wx__nav-btn"
                  onClick={() => go(current - 1)}
                  aria-label="Previous project"
                >
                  <Chevron dir="left" />
                </button>
                <button
                  type="button"
                  className="wx__nav-btn"
                  onClick={() => go(current + 1)}
                  aria-label="Next project"
                >
                  <Chevron dir="right" />
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="wx__body">
          <Stage
            project={featured}
            dir={dir}
            reduce={reduce}
            animate={engaged}
            priority={isPageHero}
          />
          <Detail project={featured} reduce={reduce} itemHeading={ItemHeading} />
        </div>

        <div className="wx__index">
          <p className="wx__index-label">
            <span>Project Index</span>
            <span className="wx__index-rule" aria-hidden />
          </p>

          <ol className="wx__chapters" role="tablist" aria-label="Projects">
            {chapters.map((p, i) => (
              <li className="wx__chapter-cell" key={p.slug}>
                <button
                  ref={(node) => {
                    chapterRefs.current[i] = node;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={i === current}
                  tabIndex={i === current ? 0 : -1}
                  className={cn("wx__chapter", i === current && "is-on")}
                  style={{ "--wx-chapter-tint": FILTER_TINT[p.filter] } as CSSProperties}
                  onClick={() => go(i)}
                  onKeyDown={(event) => onChapterKey(event, i)}
                >
                  <span className="wx__chapter-thumb" aria-hidden>
                    <ProjectCover project={p} sizes="120px" decorative />
                  </span>
                  <span className="wx__chapter-copy">
                    <span className="wx__chapter-no">{p.number}</span>
                    <span className="wx__chapter-title">{p.title}</span>
                    <span className="wx__chapter-meta">
                      <span className="wx__chapter-dot" aria-hidden />
                      {p.category}
                    </span>
                  </span>
                  <span className="wx__chapter-bar" aria-hidden />
                </button>
              </li>
            ))}
          </ol>

          {!isPageHero && list.length > chapters.length ? (
            <Link className="wx__index-more" href="/work">
              {`+${list.length - chapters.length} more projects`}
              <ArrowUpRight />
            </Link>
          ) : null}
        </div>

        <div className="wx__stats">
          <span className="wx__emblem" aria-hidden>
            <span className="wx__emblem-orbit wx__emblem-orbit--outer" />
            <span className="wx__emblem-orbit wx__emblem-orbit--inner" />
            <span className="wx__emblem-core">
              <Monogram className="wx__emblem-mark" />
            </span>
          </span>

          <dl className="wx__stat-grid">
            {STATS.map((s) => (
              <div className="wx__stat" key={s.value + s.label[0]}>
                <span className="wx__stat-icon" aria-hidden>
                  <WorkIcon name={s.icon} />
                </span>
                <div className="wx__stat-copy">
                  <dt className="wx__stat-value">{s.value}</dt>
                  <dd className="wx__stat-label">
                    {s.label[0]}
                    <br />
                    {s.label[1]}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/**
 * The stage — one project frame at a time. The outgoing frame stays absolutely
 * positioned under the incoming one, so the cut dissolves in place instead of
 * collapsing the box's height mid-transition.
 */
function Stage({
  project: p,
  dir,
  reduce,
  animate,
  priority,
}: {
  project: Project;
  dir: number;
  reduce: boolean;
  animate: boolean;
  priority: boolean;
}) {
  const still = reduce || !animate;

  return (
    <div className="wx__stage">
      <span className="wx__stage-rim" aria-hidden />

      <div className="wx__stage-frame">
        <AnimatePresence initial={false}>
          <motion.div
            className="wx__stage-shot"
            key={p.slug}
            initial={still ? false : { opacity: 0, scale: 1.05, x: dir * 32 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 1.02 }}
            transition={{ duration: reduce ? duration.micro : duration.section, ease }}
          >
            <ProjectCover
              project={p}
              sizes="(min-width: 1180px) 60vw, 100vw"
              priority={priority}
            />
          </motion.div>
        </AnimatePresence>

        <span className="wx__stage-scrim" aria-hidden />

        {/* Title card riding the bottom edge of the frame. */}
        <div className="wx__card">
          <p className="wx__card-meta">
            <span className="wx__card-no">{p.number}</span>
            <span className="wx__card-sep" aria-hidden />
            <span>{p.year}</span>
            <span className="wx__card-sep" aria-hidden />
            <span className="wx__card-role">{p.role}</span>
          </p>
          <p className="wx__card-tagline">{p.tagline}</p>
        </div>

      </div>
    </div>
  );
}

/** The reading column beside the stage — what the project is, and where to go. */
function Detail({
  project: p,
  reduce,
  itemHeading: ItemHeading,
}: {
  project: Project;
  reduce: boolean;
  itemHeading: "h2" | "h3";
}) {
  return (
    <motion.article
      className="wx__detail"
      key={p.slug}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? duration.micro : duration.interaction, ease }}
    >
      <p className="wx__detail-kicker">
        <span className="wx__detail-pulse" aria-hidden />
        <span>{p.category}</span>
        <span className="wx__detail-rule" aria-hidden />
      </p>

      <ItemHeading className="wx__detail-title">{p.title}</ItemHeading>
      <p className="wx__detail-body">{p.overview}</p>

      <ul className="wx__chips">
        {p.technologies.slice(0, 5).map((t) => (
          <li className="wx__chip" key={t}>
            {t}
          </li>
        ))}
      </ul>

      <ul className="wx__highlights">
        {p.features.slice(0, 3).map((f) => (
          <li className="wx__highlight" key={f}>
            <Tick />
            {f}
          </li>
        ))}
      </ul>

      <div className="wx__detail-actions">
        <Link className="wx__btn wx__btn--solid" href={`/work/${p.slug}`}>
          <span>View Case Study</span>
          <ArrowUpRight />
        </Link>
        {p.liveUrl ? (
          <a className="wx__btn wx__btn--ghost" href={p.liveUrl} target="_blank" rel="noreferrer noopener">
            <span>Live Preview</span>
            <ExternalIcon />
          </a>
        ) : null}
      </div>
    </motion.article>
  );
}

function Tick() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
      <path d="m3.5 8.4 3 3 6-6.8" />
    </svg>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
      {dir === "left" ? <path d="M10 3.5 5.5 8l4.5 4.5" /> : <path d="M6 3.5 10.5 8 6 12.5" />}
    </svg>
  );
}

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M5 11 11 5M5.5 5H11v5.5" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M9.5 2.5H13.5V6.5" />
      <path d="M13.5 2.5 8 8" />
      <path d="M12 9.5v3a1 1 0 0 1-1 1H3.5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3" />
    </svg>
  );
}

/**
 * Line-art glyphs for the stats bar, drawn on a 24-unit grid with
 * `currentColor` strokes so the lime accent flows in from CSS. Each entry is a
 * list of sub-paths — a single `d` can't express glyphs with a detached detail.
 */
const ICON_PATHS = {
  code: ["M9.5 8 5.5 12l4 4", "M14.5 8l4 4-4 4"],
  people: [
    "M9 11.2a3.3 3.3 0 1 0 0-6.6 3.3 3.3 0 0 0 0 6.6z",
    "M2.5 19.8c0-3.4 2.9-5.6 6.5-5.6s6.5 2.2 6.5 5.6",
    "M16 5.3a3.1 3.1 0 0 1 0 5.9",
    "M17.6 14.5c2.5.5 3.9 2.3 3.9 5.1",
  ],
  rocket: ["M13.5 3.2c3 1 5.5 3.8 6.4 6.9l-7 7-4-1.4-1.9-4z", "M7.6 15.2 4.4 19.7l4.4-3.2", "M15.4 8.6h.01"],
  trophy: [
    "M7.5 3.5h9v5a4.5 4.5 0 0 1-9 0z",
    "M7.5 5H5v1.5A3 3 0 0 0 7.8 9.5",
    "M16.5 5H19v1.5a3 3 0 0 1-2.8 3",
    "M12 13v3.5",
    "M8.5 20.5h7",
    "M9.8 20.5c0-2 .9-4 2.2-4s2.2 2 2.2 4",
  ],
} as const;

type IconName = keyof typeof ICON_PATHS;

function WorkIcon({ name }: { name: IconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {ICON_PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
