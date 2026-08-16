"use client";

import { motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { projects } from "@/content/projects";
import type { Project, ProjectFilter } from "@/content/types";
import { duration, ease } from "@/lib/motion";
import { ImageReveal } from "@/components/motion";
import { HoverParallel } from "@/components/parallel";
import { SmartImage } from "@/components/SmartImage";
import { cn } from "@/lib/cn";
import { PageHero } from "./PageHero";
import { PageCta } from "./PageCta";
import { ArrowLink } from "./ArrowLink";

const FILTERS: { id: ProjectFilter | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "mobile", label: "Mobile" },
  { id: "enterprise", label: "Enterprise" },
];

type FilterId = ProjectFilter | "all";

export function WorkPage() {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<FilterId>("all");

  const list = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.filter === filter)),
    [filter],
  );

  return (
    <>
      <PageHero
        index="03"
        label="Selected Work"
        title={["SELECTED WORK", "BUILT FOR", "REAL PRODUCTS."]}
        lede="Government platforms, member portals and insurance consoles — work that had to be right, not just look right."
        meta={[
          { label: "Projects", value: String(projects.length) },
          { label: "Industries", value: "Government · Finance · Mobile" },
          { label: "Users", value: "10,000+ served" },
          { label: "Scale", value: "3 countries" },
        ]}
      />

      <section className="pf-section">
        <div className="shell">
          <nav className="wrk-filter" aria-label="Filter projects">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={cn("wrk-filter__btn", filter === f.id && "is-on")}
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </nav>

          <div className="wrk-list" key={filter}>
            {list.map((p) => (
              <WorkItem key={p.slug} project={p} list={list} reduce={reduce} />
            ))}
          </div>
        </div>
      </section>

      <PageCta
        kicker="03 / SELECTED WORK"
        headline={["BUILDING SOMETHING", "WORTH SHOWING?"]}
        lede="If the goal is a product that holds up in production, the engineering belongs in the conversation from the start."
        actions={[
          { label: "View Services", href: "/services", variant: "line" },
          { label: "Start a Conversation", href: "/contact" },
        ]}
      />
    </>
  );
}

function WorkItem({ project: p, list, reduce }: { project: Project; list: Project[]; reduce: boolean | null }) {
  const full = p.layout === "full";
  const nonFull = list.filter((x) => x.layout !== "full");
  const idx = nonFull.indexOf(p);
  const featured = idx === 0;
  const flip = !full && !featured && idx % 2 === 1;

  const item = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: reduce ? duration.micro : duration.section, delay: reduce ? 0 : delay, ease },
  });

  return (
    <HoverParallel
      as="article"
      className={cn("wrk-item hpar", featured && "wrk-item--featured", full && "wrk-item--full", flip && "wrk-item--flip")}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduce ? duration.micro : duration.section, ease }}
    >
      <div className="wrk-item__media">
        <ImageReveal parallax={20}>
          <SmartImage
            src={p.cover.src}
            alt={p.cover.alt}
            width={p.cover.width}
            height={p.cover.height}
            sizes={full ? "(max-width: 900px) 100vw, 100vw" : "(max-width: 900px) 100vw, 55vw"}
            priority={featured}
          />
        </ImageReveal>
      </div>

      <div className="wrk-item__body">
        <motion.p className="wrk-item__num" {...item(0)}>
          {p.number}
        </motion.p>
        <motion.h3 className="wrk-item__title" {...item(0.08)}>
          {p.title}
        </motion.h3>
        <motion.dl className="wrk-item__facts" {...item(0.16)}>
          <div>
            <dt>Role</dt>
            <dd>{p.role}</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd>{p.year}</dd>
          </div>
          <div>
            <dt>Category</dt>
            <dd>{p.category}</dd>
          </div>
        </motion.dl>
        <motion.p className="wrk-item__overview" {...item(0.24)}>
          {p.overview}
        </motion.p>
        <motion.p className="wrk-item__tech" {...item(0.32)}>
          {p.technologies.join(" · ")}
        </motion.p>
        <motion.div {...item(0.4)}>
          <ArrowLink className="wrk-item__cta" href={`/work/${p.slug}`} label={`View case study — ${p.title}`}>
            View Case Study
          </ArrowLink>
        </motion.div>
      </div>
    </HoverParallel>
  );
}