"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ProjectCard } from "@/components/work/ProjectCard";
import { projectFilters, projects } from "@/content/projects";
import type { ProjectFilter } from "@/content/types";
import { cn } from "@/lib/cn";
import { duration, ease } from "@/lib/motion";

type FilterId = ProjectFilter | "all";

/** How many cards the grid opens with before "View More Projects". */
const PAGE = 6;

/**
 * The catalogue with its category filter.
 *
 * The filter row is a real `role="tablist"` with roving focus — arrow keys
 * move between buckets the way a tablist is expected to — and every bucket
 * carries its own count, generated from the records, so the row can never
 * advertise results it cannot show. Below ~720px the same buckets render as a
 * native `<select>`: six pills do not survive a phone width, and a select is
 * the control the platform already knows how to present.
 *
 * The grid opens with six and reveals the rest in place rather than paging to
 * a second screen; changing bucket collapses it back so the reveal always
 * means the same thing.
 */
export function WorkExplorer({ exclude }: { exclude?: string[] }) {
  const reduce = !!useReducedMotion();
  const [filter, setFilter] = useState<FilterId>("all");
  const [expanded, setExpanded] = useState(false);

  const source = useMemo(
    () => (exclude?.length ? projects.filter((p) => !exclude.includes(p.slug)) : projects),
    [exclude],
  );
  const filters = useMemo(() => projectFilters(source), [source]);
  const list = useMemo(
    () => (filter === "all" ? source : source.filter((p) => p.filter === filter)),
    [filter, source],
  );

  const visible = expanded ? list : list.slice(0, PAGE);
  const hidden = list.length - visible.length;

  const select = (next: FilterId) => {
    setFilter(next);
    setExpanded(false);
  };

  const onKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const at = filters.findIndex((f) => f.id === filter);
    const next = filters[(at + step + filters.length) % filters.length];
    select(next.id);
    event.currentTarget
      .querySelector<HTMLButtonElement>(`[data-filter="${next.id}"]`)
      ?.focus();
  };

  return (
    <div className="wex">
      <div
        className="wex__filters"
        role="tablist"
        aria-label="Filter projects by category"
        onKeyDown={onKey}
      >
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            data-filter={f.id}
            aria-selected={filter === f.id}
            tabIndex={filter === f.id ? 0 : -1}
            className={cn("wex__filter", filter === f.id && "is-on")}
            onClick={() => select(f.id)}
          >
            <span>{f.label}</span>
            {/* The count is what makes the row honest, but the design carries
                no numerals; keep it for assistive tech and for tests. */}
            <span className="sr-only"> {f.count}</span>
          </button>
        ))}
      </div>

      <div className="wex__picker">
        <label className="sr-only" htmlFor="wex-filter">
          Filter projects by category
        </label>
        <select
          id="wex-filter"
          className="wex__select"
          value={filter}
          onChange={(e) => select(e.target.value as FilterId)}
        >
          {filters.map((f) => (
            <option key={f.id} value={f.id}>
              {f.id === "all" ? "All Projects" : f.label} ({f.count})
            </option>
          ))}
        </select>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
          <path d="m4 6 4 4 4-4" />
        </svg>
      </div>

      <p className="sr-only" role="status">
        {list.length === 1 ? "1 project" : `${list.length} projects`}
      </p>

      {list.length ? (
        <ul className="wex__grid">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p, i) => (
              <motion.li
                key={p.slug}
                layout={!reduce}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{
                  duration: reduce ? duration.micro : duration.interaction,
                  ease,
                  delay: reduce ? 0 : Math.min(i, 5) * 0.04,
                }}
                data-motion="work-card"
              >
                <ProjectCard project={p} priority={i < 3} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      ) : (
        <div className="wex__empty">
          <p className="wex__empty-title">No projects found.</p>
          <p className="wex__empty-body">Nothing is filed under this category yet.</p>
          <button type="button" className="wex__more" onClick={() => select("all")}>
            View all work
          </button>
        </div>
      )}

      {hidden > 0 ? (
        <div className="wex__foot">
          <button type="button" className="wex__more" onClick={() => setExpanded(true)}>
            View More Projects
            <svg viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
              <path d="M0 6h17M12.5 1.5 17 6l-4.5 4.5" />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}
