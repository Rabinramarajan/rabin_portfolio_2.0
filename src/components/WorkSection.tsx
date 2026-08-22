"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { projects } from "@/content/projects";
import { profile } from "@/content/profile";
import type { Project, ProjectFilter } from "@/content/types";
import { Monogram } from "@/components/Logo";
import { SmartImage } from "@/components/SmartImage";
import { cn } from "@/lib/cn";
import { duration, ease } from "@/lib/motion";
import { SectionKicker } from "@/components/ui";

const FILTER_LABEL: Record<ProjectFilter, string> = {
  web: "Web Applications",
  mobile: "Mobile Apps",
  enterprise: "Dashboards",
};

/** Category dot beside each entry in the "other projects" rail. */
const FILTER_DOT: Record<ProjectFilter, string> = {
  web: "#c9f24d",
  mobile: "#4d9bf2",
  enterprise: "#7c6bf5",
};

const STATS = [
  { icon: "code", value: `${projects.length}+`, label: ["Projects", "Completed"] },
  { icon: "people", value: "15+", label: ["Happy", "Clients"] },
  { icon: "rocket", value: profile.yearsExperienceLabel, label: ["Years of", "Experience"] },
  { icon: "trophy", value: "100%", label: ["Commitment to", "Quality"] },
] as const;

type FilterId = ProjectFilter | "all";

/**
 * Work — a spotlight layout: one large featured project beside a rail of the
 * remaining projects, under a statement header with category filters, closed
 * by a stats bar with the monogram straddling its top edge.
 *
 * Selecting an entry in the rail promotes it into the feature slot; the dot
 * row under the rail indexes that selection.
 *
 * `headingLevel` drops to h2 when the block sits below another hero (home
 * page) so the document keeps exactly one h1. `limit` sets how many entries the
 * rail carries; the dot row still reaches every project beyond that.
 */
export function WorkSection({
  id = "work",
  headingLevel = "h2",
  index = "03",
  limit,
}: {
  id?: string;
  headingLevel?: "h1" | "h2";
  index?: string;
  limit?: number;
} = {}) {
  const Heading = headingLevel;
  const isPageHero = headingLevel === "h1";
  const [filter, setFilter] = useState<FilterId>("all");
  const [active, setActive] = useState(0);

  const filters = useMemo(() => {
    const present = Array.from(new Set(projects.map((p) => p.filter))).filter(Boolean) as ProjectFilter[];
    return [
      { id: "all" as FilterId, label: "All" },
      ...present.map((f) => ({ id: f as FilterId, label: FILTER_LABEL[f] })),
    ];
  }, []);

  const list = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.filter === filter)),
    [filter],
  );

  // A narrowed filter can leave the previous selection out of range, so the
  // feature index is clamped rather than trusted.
  const current = Math.min(active, list.length - 1);
  const featured = list[current];
  const others = list.filter((_, i) => i !== current);
  const rail = others.slice(0, limit ?? 4);

  if (!featured) return null;

  return (
    <section id={id} className={cn("wx", isPageHero && "wx--page")}>
      <div className="shell">
        <div className="wx__top">
          <SectionKicker index={index} label="Work" className="wx__kicker" />
          {!isPageHero ? (
            <Link className="wx__all" href="/work">
              <span>View All Projects</span>
              <ArrowUpRight />
            </Link>
          ) : null}
        </div>

        <div className="wx__intro">
          <div className="wx__intro-copy">
            <Heading className="wx__title">
              Work that solves
              <br />
              <span className="wx__title-accent">real problems.</span>
            </Heading>
            <p className="wx__lede">
              I build digital experiences that are fast, scalable, accessible and create real impact.
            </p>
          </div>

          <nav className="wx__filters" aria-label="Filter projects">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                className={cn("wx__filter", filter === f.id && "is-on")}
                aria-pressed={filter === f.id}
                onClick={() => {
                  setFilter(f.id);
                  setActive(0);
                }}
              >
                {f.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="wx__body">
          <FeatureCard project={featured} priority={isPageHero} />

          <div className="wx__rail">
            <p className="wx__rail-label">
              <span>Other Projects</span>
              <span className="wx__rail-rule" aria-hidden />
            </p>

            <ul className="wx__list">
              {rail.map((p) => (
                <RailCard key={p.slug} project={p} onSelect={() => setActive(list.indexOf(p))} />
              ))}
            </ul>

            {list.length > 1 ? (
              <div className="wx__dots" role="tablist" aria-label="Featured project">
                {list.map((p, i) => (
                  <button
                    key={p.slug}
                    type="button"
                    role="tab"
                    aria-selected={i === current}
                    aria-label={p.title}
                    className={cn("wx__dot", i === current && "is-on")}
                    onClick={() => setActive(i)}
                  />
                ))}
              </div>
            ) : null}
          </div>
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

/** The spotlight slot — copy on the left, glowing device shot on the right. */
function FeatureCard({ project: p, priority }: { project: Project; priority: boolean }) {
  return (
    <motion.article
      className="wx__feature"
      key={p.slug}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.section, ease }}
    >
      <div className="wx__feature-copy">
        <p className="wx__feature-kicker">
          <span>Featured Project</span>
          <span className="wx__feature-rule" aria-hidden />
        </p>

        <h3 className="wx__feature-title">
          {p.title}
          <span className="wx__feature-subtitle">{p.category}</span>
        </h3>

        <p className="wx__feature-body">{p.overview}</p>

        <ul className="wx__chips">
          {p.technologies.slice(0, 5).map((t) => (
            <li className="wx__chip" key={t}>
              {t}
            </li>
          ))}
        </ul>

        <div className="wx__feature-actions">
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
      </div>

      <div className="wx__feature-media">
        <span className="wx__feature-glow" aria-hidden />
        <SmartImage
          src={p.cover.src}
          alt={p.cover.alt}
          width={p.cover.width}
          height={p.cover.height}
          sizes="(min-width: 1100px) 46vw, 100vw"
          priority={priority}
        />
      </div>
    </motion.article>
  );
}

/** One entry in the right-hand rail — thumbnail, category dot, title, blurb. */
function RailCard({ project: p, onSelect }: { project: Project; onSelect: () => void }) {
  return (
    <li className="wx__item">
      <span className="wx__item-thumb" aria-hidden>
        <SmartImage src={p.cover.src} alt="" width={p.cover.width} height={p.cover.height} sizes="140px" />
      </span>

      <div className="wx__item-copy">
        <p className="wx__item-kicker">
          <span className="wx__item-dot" style={{ background: FILTER_DOT[p.filter] }} aria-hidden />
          {p.category}
        </p>
        <h4 className="wx__item-title">
          <Link href={`/work/${p.slug}`}>{p.title}</Link>
        </h4>
        <p className="wx__item-body">{p.tagline}</p>
      </div>

      <button type="button" className="wx__item-btn" onClick={onSelect} aria-label={`Feature ${p.title}`}>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M2.5 8h9M8 4.5 11.5 8 8 11.5" />
        </svg>
      </button>
    </li>
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
