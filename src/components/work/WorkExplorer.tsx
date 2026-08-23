"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ProjectCard } from "@/components/work/ProjectCard";
import { projectFilters, projects } from "@/content/projects";
import type { ProjectFilter } from "@/content/types";
import { cn } from "@/lib/cn";
import { duration, ease } from "@/lib/motion";

type FilterId = ProjectFilter | "all";

/**
 * The complete project catalogue with its category filter.
 *
 * Filtering re-keys the grid rather than the page: cards animate out and in
 * inside a container whose minimum height is held by the grid itself, so the
 * footer never jumps as the count changes. The filter row is a real
 * `role="tablist"` with roving focus — arrow keys move between buckets the way
 * a tablist is expected to, and every bucket carries its own count so the
 * number can never contradict the catalogue.
 */
export function WorkExplorer({ exclude }: { exclude?: string[] }) {
  const reduce = !!useReducedMotion();
  const [filter, setFilter] = useState<FilterId>("all");

  const source = useMemo(
    () => (exclude?.length ? projects.filter((p) => !exclude.includes(p.slug)) : projects),
    [exclude],
  );
  const filters = useMemo(() => projectFilters(source), [source]);
  const list = useMemo(
    () => (filter === "all" ? source : source.filter((p) => p.filter === filter)),
    [filter, source],
  );

  const onKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const at = filters.findIndex((f) => f.id === filter);
    const next = filters[(at + step + filters.length) % filters.length];
    setFilter(next.id);
    const node = event.currentTarget.querySelector<HTMLButtonElement>(
      `[data-filter="${next.id}"]`,
    );
    node?.focus();
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
            onClick={() => setFilter(f.id)}
          >
            <span>{f.label}</span>
            <span className="wex__filter-count">{f.count}</span>
          </button>
        ))}
      </div>

      <p className="wex__count" role="status">
        {list.length === 1 ? "1 project" : `${list.length} projects`}
      </p>

      {list.length ? (
        <ul className="wex__grid">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p, i) => (
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
              >
                <ProjectCard project={p} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      ) : (
        <div className="wex__empty">
          <p className="wex__empty-title">No projects found.</p>
          <p className="wex__empty-body">
            Nothing is filed under this category yet.
          </p>
          <button type="button" className="wex__empty-btn" onClick={() => setFilter("all")}>
            View all work
          </button>
        </div>
      )}

      <p className="wex__foot">
        <Link href="/contact" className="wex__foot-link">
          Have a project like one of these? Start a conversation →
        </Link>
      </p>
    </div>
  );
}
