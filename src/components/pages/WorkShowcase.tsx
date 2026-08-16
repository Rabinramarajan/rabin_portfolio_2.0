"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { projects } from "@/content/projects";
import { profile } from "@/content/profile";
import type { Project, ProjectFilter } from "@/content/types";
import { TechIcon } from "@/components/about/TechIcon";
import { SmartImage } from "@/components/SmartImage";
import { SectionKicker } from "@/components/ui";
import { cn } from "@/lib/cn";
import { duration, ease } from "@/lib/motion";
import { ArrowLink } from "./ArrowLink";

const STATS = [
  { value: `${Math.max(projects.length, 30)}+`, label: "Projects Completed", icon: "code" },
  { value: "20+", label: "Happy Clients", icon: "people" },
  { value: profile.yearsExperienceLabel, label: "Years Experience", icon: "rocket" },
  { value: "100%", label: "Commitment", icon: "badge" },
] as const;

const STAT_GLYPH: Record<string, string> = {
  code: "M8.5 8.5 5 12l3.5 3.5M15.5 8.5 19 12l-3.5 3.5M13.5 6l-3 12",
  people: "M9 11a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 9 11zM2.5 19.5c0-3.3 2.9-5.4 6.5-5.4s6.5 2.1 6.5 5.4M16 5.2a3 3 0 0 1 0 5.8M17.5 14.4c2.5.5 4 2.3 4 5.1",
  rocket: "M14 4c4 1.5 6 4.5 6 8-3.5 3.5-7 5-7 5l-4-4s1.5-3.5 5-7zM9 13l-4 1 1 4 3-2M9.5 9.5 5 8l-1 4",
  badge: "M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM8.3 12.1l2.6 2.6 4.8-4.8",
};

/** Technology label → Simple Icons id in `TechIcon`; unmapped names fall back to initials. */
const TECH_ICON: Record<string, string> = {
  Angular: "angular",
  "Angular Material": "angular",
  TypeScript: "typescript",
  JavaScript: "javascript",
  RxJS: "rxjs",
  "Tailwind CSS": "tailwind",
  "Node.js": "node",
  "Sails.js": "node",
  Express: "express",
  PostgreSQL: "postgres",
  MySQL: "mysql",
  MongoDB: "mongodb",
  Supabase: "supabase",
  Firebase: "firebase",
  Docker: "docker",
  Git: "git",
  React: "react",
  "Next.js": "nextjs",
  GraphQL: "graphql",
  Python: "python",
  PHP: "php",
  AWS: "aws",
  Figma: "figma",
};

const FILTER_LABEL: Record<ProjectFilter, string> = {
  web: "Web Applications",
  mobile: "Mobile Apps",
  enterprise: "Enterprise",
};

type FilterId = ProjectFilter | "all";
type SortId = "latest" | "oldest";

/**
 * `headingLevel` drops to h2 when the block sits below another hero (home page),
 * so the document keeps exactly one h1. `kicker` adds the numbered section label
 * the home page uses to sequence its sections.
 */
export function WorkHero({
  headingLevel = "h1",
  kicker,
}: { headingLevel?: "h1" | "h2"; kicker?: { index: string; label: string } } = {}) {
  const Heading = headingLevel;
  const isPageHero = headingLevel === "h1";

  return (
    <header className={isPageHero ? "wx-hero" : "wx-hero wx-hero--inline"}>
      <div className="shell wx-hero__grid">
        <div className="wx-hero__copy">
          {kicker ? <SectionKicker index={kicker.index} label={kicker.label} /> : null}

          <p className="sx-eyebrow">
            <span className="sx-eyebrow__dot" aria-hidden />
            My work
          </p>

          <Heading className="wx-hero__title">
            Solutions that solve
            <br />
            <span className="sx-accent">real problems.</span>
          </Heading>

          <p className="wx-hero__lede">
            A selection of projects where I turned complex ideas into fast, scalable, and user-focused digital products.
          </p>

          <dl className="wx-stats">
            {STATS.map((s) => (
              // The icon lives inside <dt> — a <dl> group may only contain
              // dt/dd, so a sibling <span> here would be invalid markup.
              <div className="wx-stat" key={s.label}>
                <dt className="wx-stat__value">
                  <span className="wx-stat__icon" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
                      <path d={STAT_GLYPH[s.icon]} />
                    </svg>
                  </span>
                  {s.value}
                </dt>
                <dd className="wx-stat__label">{s.label}</dd>
              </div>
            ))}
          </dl>

          <div className="wx-hero__actions">
            <Link className="btn btn--solid" href="/work">
              <svg className="btn__lead" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden>
                <path d={STAT_GLYPH.rocket} />
              </svg>
              <span className="btn__label">View All Projects</span>
            </Link>
            <Link className="btn btn--line" href="/contact">
              <span className="btn__label">Start a Project</span>
              <Arrow />
            </Link>
          </div>
        </div>

        <FeaturedProject priority={isPageHero} />
      </div>
    </header>
  );
}

/** Rotating spotlight over the featured projects; dots double as manual controls. */
function FeaturedProject({ priority }: { priority: boolean }) {
  const reduce = useReducedMotion();
  const featured = useMemo(() => projects.filter((p) => p.featured), []);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce || featured.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % featured.length), 6000);
    return () => window.clearInterval(id);
  }, [reduce, featured.length]);

  const p = featured[index];
  if (!p) return null;

  return (
    <div className="wx-feature">
      <p className="wx-feature__badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="m12 3 2.6 5.6 6 .8-4.4 4.2 1.1 6.1-5.3-3-5.3 3 1.1-6.1L3.4 9.4l6-.8z" />
        </svg>
        Featured Project
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={p.slug}
          className="wx-feature__body"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: reduce ? duration.micro : duration.section, ease }}
        >
          <p className="wx-feature__meta">
            {p.category} <span aria-hidden>·</span> {p.year}
          </p>
          <h3 className="wx-feature__title">{p.title}</h3>
          <p className="wx-feature__overview">{p.overview}</p>
          <TechStrip technologies={p.technologies} max={4} />
          <ArrowLink className="wx-feature__cta" href={`/work/${p.slug}`} label={`View case study — ${p.title}`}>
            View Case Study
          </ArrowLink>

          <div className="wx-feature__media">
            <SmartImage
              src={p.cover.src}
              alt={p.cover.alt}
              width={p.cover.width}
              height={p.cover.height}
              sizes="(min-width: 960px) 45vw, 100vw"
              priority={priority && index === 0}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="wx-feature__dots" role="tablist" aria-label="Featured projects">
        {featured.map((f, i) => (
          <button
            key={f.slug}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={f.title}
            className={cn("wx-dot", i === index && "is-on")}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

function TechStrip({ technologies, max }: { technologies: string[]; max: number }) {
  const shown = technologies.slice(0, max);
  const rest = technologies.length - shown.length;

  return (
    <ul className="wx-tech" aria-label="Technologies used">
      {shown.map((t) => (
        <li className="wx-tech__chip" key={t} title={t}>
          <TechIcon id={TECH_ICON[t] ?? t} label={t} className="wx-tech__icon" />
        </li>
      ))}
      {rest > 0 ? (
        <li className="wx-tech__chip wx-tech__chip--more" title={technologies.slice(max).join(", ")}>
          +{rest}
        </li>
      ) : null}
    </ul>
  );
}

/**
 * Project grid with category filters. `limit` trims the list for the home page,
 * where the filters give way to a single "View All Projects" action.
 */
export function WorkGrid({ id, limit }: { id?: string; limit?: number } = {}) {
  const reduce = useReducedMotion();
  const railRef = useRef<HTMLUListElement>(null);
  const [filter, setFilter] = useState<FilterId>("all");
  const [sort, setSort] = useState<SortId>("latest");
  const [filtersOpen, setFiltersOpen] = useState(true);

  const filters = useMemo(() => {
    const present = Array.from(new Set(projects.map((p) => p.filter))).filter(Boolean) as ProjectFilter[];
    return [{ id: "all" as FilterId, label: "All Projects" }, ...present.map((f) => ({ id: f as FilterId, label: FILTER_LABEL[f] }))];
  }, []);

  const list = useMemo(() => {
    const matched = filter === "all" ? projects : projects.filter((p) => p.filter === filter);
    const sorted = [...matched].sort((a, b) =>
      sort === "latest" ? Number(b.year) - Number(a.year) : Number(a.year) - Number(b.year),
    );
    return limit ? sorted.slice(0, limit) : sorted;
  }, [filter, sort, limit]);

  /** The rail scrolls by one card width, so the arrow steps rather than jumps. */
  const scrollNext = () => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>(".wx-card");
    const step = card ? card.offsetWidth + 16 : rail.clientWidth * 0.8;
    const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8;
    rail.scrollBy({ left: atEnd ? -rail.scrollLeft : step, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section id={id} className="pf-section wx-grid-section">
      <div className="shell">
        <div className="wx-panel">
          <div className="wx-toolbar">
            <nav className={cn("wx-filter", !filtersOpen && "wx-filter--collapsed")} aria-label="Filter projects">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={cn("wx-filter__btn", filter === f.id && "is-on")}
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </nav>

            <div className="wx-toolbar__controls">
              <button
                type="button"
                className="wx-control"
                aria-expanded={filtersOpen}
                onClick={() => setFiltersOpen((v) => !v)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M4 7h16M7 12h10M10 17h4" />
                </svg>
                Filter
              </button>

              <label className="wx-control wx-control--select">
                <span className="wx-control__label">Sort by:</span>
                <select value={sort} onChange={(e) => setSort(e.target.value as SortId)} aria-label="Sort projects">
                  <option value="latest">Latest</option>
                  <option value="oldest">Oldest</option>
                </select>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </label>
            </div>
          </div>

          <div className="wx-rail__wrap">
            <ul className="wx-cards" ref={railRef}>
              {list.map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i} reduce={reduce} />
              ))}
            </ul>
            <button type="button" className="wx-rail__next" onClick={scrollNext} aria-label="Show more projects">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M2 8h11M9 4l4 4-4 4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project: p, index, reduce }: { project: Project; index: number; reduce: boolean | null }) {
  return (
    <motion.li
      className="wx-card"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: reduce ? duration.micro : duration.section, delay: (index % 4) * 0.06, ease }}
    >
      <div className="wx-card__media">
        <SmartImage
          src={p.cover.src}
          alt={p.cover.alt}
          width={p.cover.width}
          height={p.cover.height}
          sizes="(min-width: 1240px) 24vw, (min-width: 640px) 45vw, 100vw"
        />
        <span className="wx-card__tag">{p.category}</span>
      </div>
      <div className="wx-card__body">
        <h3 className="wx-card__title">{p.title}</h3>
        <p className="wx-card__overview">{p.overview}</p>
        <TechStrip technologies={p.technologies} max={4} />
        <ArrowLink className="wx-card__cta" href={`/work/${p.slug}`} label={`View case study — ${p.title}`}>
          View Case Study
        </ArrowLink>
      </div>
    </motion.li>
  );
}

function Arrow() {
  return (
    <svg className="btn__arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  );
}
