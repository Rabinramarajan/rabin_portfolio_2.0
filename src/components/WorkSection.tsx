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

const STATS = [
  { value: `${projects.length}+`, label: "Projects", icon: "code" },
  { value: "15+", label: "Clients", icon: "people" },
  { value: profile.yearsExperienceLabel, label: "Years Experience", icon: "award" },
] as const;

const FILTER_LABEL: Record<ProjectFilter, string> = {
  web: "Web Applications",
  mobile: "Mobile Apps",
  enterprise: "Dashboards",
};

/** The glyph in the disc that straddles the bottom edge of each card's media. */
const CATEGORY_ICON: Record<ProjectFilter, IconName> = {
  web: "monitor",
  mobile: "phone",
  enterprise: "chart",
};

const DELIVERY_STEPS = [
  { id: "discovery", icon: "search", title: "Discovery", body: "Understanding goals and requirements" },
  { id: "design", icon: "pen", title: "Design", body: "Creating intuitive and engaging UI/UX" },
  { id: "development", icon: "code", title: "Development", body: "Building scalable and clean solutions" },
  { id: "deployment", icon: "rocket", title: "Deployment", body: "Testing, launching & ongoing support" },
] as const;

type FilterId = ProjectFilter | "all";

/**
 * Work — emblem + statement header with filter pills and a stats bar, a
 * four-up project grid, and a closing row that pairs the project CTA with the
 * four-step delivery flow.
 *
 * `headingLevel` drops to h2 when the block sits below another hero (home
 * page) so the document keeps exactly one h1. `limit` trims the grid for the
 * home page, where the CTA carries readers on to /work.
 */
export function WorkSection({
  id = "work",
  headingLevel = "h2",
  index = "04",
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

  const filters = useMemo(() => {
    const present = Array.from(new Set(projects.map((p) => p.filter))).filter(Boolean) as ProjectFilter[];
    return [
      { id: "all" as FilterId, label: "All Works" },
      ...present.map((f) => ({ id: f as FilterId, label: FILTER_LABEL[f] })),
    ];
  }, []);

  const list = useMemo(() => {
    const matched = filter === "all" ? projects : projects.filter((p) => p.filter === filter);
    return limit ? matched.slice(0, limit) : matched;
  }, [filter, limit]);

  return (
    <section id={id} className={isPageHero ? "wkx wkx--page" : "wkx wkx--home"}>
      <div className="shell">
        <header className="wkx__head">
          <div className="wkx__emblem" aria-hidden>
            <span className="wkx__emblem-ring wkx__emblem-ring--outer" />
            <span className="wkx__emblem-ring wkx__emblem-ring--mid" />
            <span className="wkx__emblem-core">
              <Monogram className="wkx__emblem-mark" />
            </span>
          </div>

          <div className="wkx__intro">
            <p className="wkx__kicker">
              <span className="wkx__kicker-slash">{"//"}</span>
              <span>{index}</span>
              <span className="wkx__kicker-label">My Work</span>
            </p>
            <Heading className="wkx__title">
              Digital Products
              <br />
              Built with <span className="wkx__title-accent">Purpose.</span>
            </Heading>
            <span className="wkx__title-rule" aria-hidden />
            <p className="wkx__lede">
              A selection of projects where I transformed ideas into high-performance, scalable, and user-focused
              solutions.
            </p>
          </div>

          <div className="wkx__aside">
            <nav className="wkx__filters" aria-label="Filter projects">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={cn("wkx__filter", filter === f.id && "is-on")}
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </nav>

            <dl className="wkx__stats">
              {STATS.map((s) => (
                // The icon lives inside <dt> — a <dl> group may only contain
                // dt/dd, so a sibling <span> would be invalid here.
                <div className="wkx__stat" key={s.label}>
                  <dt className="wkx__stat-value">
                    <span className="wkx__stat-icon" aria-hidden>
                      <WorkIcon name={s.icon} />
                    </span>
                    {s.value}
                  </dt>
                  <dd className="wkx__stat-label">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        <ul className="wkx__cards">
          {list.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} priority={isPageHero && i === 0} />
          ))}
        </ul>

        <div className="wkx__foot">
          <div className="wkx__cta">
            <span className="wkx__cta-icon" aria-hidden>
              <span className="wkx__cta-icon-ring" />
              <WorkIcon name="folder" />
            </span>
            <div className="wkx__cta-copy">
              <h3 className="wkx__cta-title">Have a project in mind?</h3>
              <p className="wkx__cta-body">Let&rsquo;s collaborate and build something exceptional together.</p>
            </div>
            <Link className="wkx__cta-btn" href="/#contact">
              <span>Let&rsquo;s Talk</span>
              <span className="wkx__cta-btn-arrow" aria-hidden>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M2.5 8h9M8 4.5 11.5 8 8 11.5" />
                </svg>
              </span>
            </Link>
          </div>

          <ol className="wkx__flow">
            {DELIVERY_STEPS.map((s) => (
              <li className="wkx__step" key={s.id}>
                <span className="wkx__step-icon" aria-hidden>
                  <WorkIcon name={s.icon} />
                </span>
                <p className="wkx__step-title">{s.title}</p>
                <p className="wkx__step-body">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project: p, index, priority }: { project: Project; index: number; priority: boolean }) {
  return (
    <motion.li
      className="wkx__card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: duration.section, delay: (index % 4) * 0.06, ease }}
    >
      <div className="wkx__card-media">
        <span className="wkx__card-num">{p.number}</span>
        {p.featured ? (
          <span className="wkx__card-flag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="m12 3.6 2.5 5.2 5.6.8-4.1 4 1 5.6-5-2.7-5 2.7 1-5.6-4.1-4 5.6-.8z" />
            </svg>
            Featured
          </span>
        ) : null}

        <SmartImage
          src={p.cover.src}
          alt={p.cover.alt}
          width={p.cover.width}
          height={p.cover.height}
          sizes="(min-width: 1240px) 24vw, (min-width: 640px) 45vw, 100vw"
          priority={priority}
        />

        <span className="wkx__card-badge" aria-hidden>
          <WorkIcon name={CATEGORY_ICON[p.filter] ?? "monitor"} />
        </span>
      </div>

      <div className="wkx__card-body">
        <p className="wkx__card-kicker">{p.category}</p>
        <h3 className="wkx__card-title">{p.title}</h3>
        <p className="wkx__card-overview">{p.overview}</p>

        <ul className="wkx__chips">
          {p.technologies.slice(0, 4).map((t) => (
            <li className="wkx__chip" key={t}>
              {t}
            </li>
          ))}
        </ul>

        <Link className="wkx__card-link" href={`/work/${p.slug}`} aria-label={`View case study — ${p.title}`}>
          <span>View Case Study</span>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M2 8h11M9 4l4 4-4 4" />
          </svg>
        </Link>
      </div>
    </motion.li>
  );
}

/**
 * Line-art glyphs for the work block, drawn on a 24-unit grid with
 * `currentColor` strokes so the lime accent flows in from CSS. Each entry is a
 * list of sub-paths — a single `d` can't express glyphs with a detached detail.
 */
const ICON_PATHS = {
  monitor: ["M3.5 4.5h17v11h-17z", "M9 19.5h6", "M12 15.5v4"],
  phone: [
    "M7.5 2.5h9a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20V4a1.5 1.5 0 0 1 1.5-1.5z",
    "M10.5 18.5h3",
  ],
  chart: ["M12 3.5a8.5 8.5 0 1 0 8.5 8.5H12z", "M14.5 2.8A8.5 8.5 0 0 1 21.2 9.5h-6.7z"],
  code: ["M9.5 8 5.5 12l4 4", "M14.5 8l4 4-4 4"],
  people: [
    "M9 11.2a3.3 3.3 0 1 0 0-6.6 3.3 3.3 0 0 0 0 6.6z",
    "M2.5 19.8c0-3.4 2.9-5.6 6.5-5.6s6.5 2.2 6.5 5.6",
    "M16 5.3a3.1 3.1 0 0 1 0 5.9",
    "M17.6 14.5c2.5.5 3.9 2.3 3.9 5.1",
  ],
  award: ["M12 14.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z", "M8.6 13.4 7.5 21l4.5-2.4 4.5 2.4-1.1-7.6"],
  search: ["M11 18.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z", "M16.5 16.5 21 21"],
  pen: ["M4 20l1-4L16.4 4.6a2 2 0 0 1 2.8 2.8L8 18.8z", "M14.5 6.5l3 3"],
  rocket: ["M13.5 3.2c3 1 5.5 3.8 6.4 6.9l-7 7-4-1.4-1.9-4z", "M7.6 15.2 4.4 19.7l4.4-3.2", "M15.4 8.6h.01"],
  folder: ["M3.5 6.5A1.5 1.5 0 0 1 5 5h4l2 2.5h6.5A1.5 1.5 0 0 1 19 9v8.5A1.5 1.5 0 0 1 17.5 19H5a1.5 1.5 0 0 1-1.5-1.5z"],
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
