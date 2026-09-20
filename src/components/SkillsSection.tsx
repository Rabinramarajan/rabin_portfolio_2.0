"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "@/content/projects";
import {
  ECO_CATEGORIES,
  ECO_TECHS,
  ORBIT_CENTER,
  ORBIT_VIEWBOX,
  featuredIn,
  orbitPoint,
  techsIn,
  type EcoCategory,
  type EcoTech,
} from "@/content/ecosystem";
import { StackTechIcon } from "@/components/StackTechIcon";
import { Monogram } from "@/components/Logo";
import { SectionKicker, type SectionHeadingLevel } from "@/components/ui";
import { cn } from "@/lib/cn";

/**
 * Skills — the technology ecosystem.
 *
 * One orbit: the monogram at the centre, seven category clusters around it,
 * and a detail panel that answers the only question a stack list ever raises —
 * how deeply, and on what. Selecting a technology drives the panel; selecting
 * a category dims the rest of the orbit rather than removing it, so the shape
 * of the whole stack stays readable while one arm is being read.
 *
 * Cluster positions come from `orbitPoint()` in the same viewBox units the
 * connector SVG uses, so the lines meet the cards at every width instead of
 * two layout systems drifting apart.
 */

const YEARS_EXPERIENCE = "4+";

function DepthMeter({ depth }: { depth: number }) {
  return (
    <span className="tec__depth" aria-hidden>
      {[1, 2, 3, 4].map((step) => (
        <span
          key={step}
          className={cn("tec__depth-dot", step <= depth && "tec__depth-dot--on")}
        />
      ))}
    </span>
  );
}

function OrbitCluster({
  category,
  selectedId,
  activeCategory,
  onSelectCategory,
  onSelectTech,
}: {
  category: EcoCategory;
  selectedId: string;
  activeCategory: string | null;
  onSelectCategory: (id: string) => void;
  onSelectTech: (id: string) => void;
}) {
  const point = orbitPoint(category.angle);
  const featured = featuredIn(category.id);
  const dimmed = activeCategory !== null && activeCategory !== category.id;
  /* Clusters on the left half open to the right and vice versa, so a cluster
     never has to spill over the centre to fit its label. */
  const side = point.x < ORBIT_CENTER.x ? "start" : "end";

  return (
    <div
      className="tec__cluster"
      data-side={side}
      data-dimmed={dimmed || undefined}
      data-active={activeCategory === category.id || undefined}
      style={
        {
          left: `${(point.x / ORBIT_VIEWBOX.w) * 100}%`,
          top: `${(point.y / ORBIT_VIEWBOX.h) * 100}%`,
          "--tec-c": category.accent,
        } as React.CSSProperties
      }
    >
      <button
        type="button"
        className="tec__cluster-head"
        onClick={() => onSelectCategory(category.id)}
        aria-pressed={activeCategory === category.id}
        data-cursor="explore"
      >
        <span className="tec__cluster-dot" aria-hidden />
        <span className="tec__cluster-text">
          <span className="tec__cluster-name">{category.label}</span>
          <span className="tec__cluster-sub">{category.subtitle}</span>
        </span>
      </button>

      <ul className="tec__cluster-nodes">
        {featured.map((tech) => {
          const isSelected = tech.id === selectedId;
          return (
            <li key={tech.id}>
              <button
                type="button"
                className={cn("tec__node", isSelected && "tec__node--selected")}
                onClick={() => onSelectTech(tech.id)}
                aria-pressed={isSelected}
                data-cursor="explore"
              >
                <span className="tec__node-disc">
                  <StackTechIcon label={tech.label} className="tec__node-icon" />
                </span>
                <span className="tec__node-label">{tech.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DetailPanel({
  tech,
  category,
  related,
  ctaHref,
  ctaLabel,
  reduce,
}: {
  tech: EcoTech;
  category: EcoCategory;
  related: { slug: string; title: string; tagline: string }[];
  ctaHref: string;
  ctaLabel: string;
  reduce: boolean;
}) {
  return (
    <div className="tec__panel-inner" style={{ "--tec-c": category.accent } as React.CSSProperties}>
      <p className="tec__panel-kicker">
        <span className="tec__panel-kicker-dot" aria-hidden />
        Selected technology
      </p>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tech.id}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: reduce ? 0.12 : 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="tec__panel-head">
            <span className="tec__panel-disc">
              <StackTechIcon label={tech.label} className="tec__panel-icon" />
            </span>
            <span className="tec__panel-identity">
              <span className="tec__panel-name">{tech.label}</span>
              <span className="tec__panel-tier">{tech.tier}</span>
            </span>
            <Link
              href={ctaHref}
              className="tec__panel-jump"
              aria-label={`${ctaLabel} — ${tech.label}`}
              data-cursor="explore"
            >
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>

          <p className="tec__panel-summary">{tech.summary}</p>

          <ul className="tec__traits">
            {tech.traits.map((trait) => (
              <li key={trait} className="tec__trait">
                {trait}
              </li>
            ))}
          </ul>

          <dl className="tec__facts">
            <div className="tec__fact">
              <dt>My depth</dt>
              <dd>
                <span className="tec__fact-value">
                  {tech.depth === 4
                    ? "Primary expertise"
                    : tech.depth === 3
                      ? "Production confident"
                      : "Working knowledge"}
                </span>
                <DepthMeter depth={tech.depth} />
              </dd>
            </div>
            <div className="tec__fact">
              <dt>Used in</dt>
              <dd>
                <span className="tec__fact-value">{tech.usedIn}</span>
              </dd>
            </div>
          </dl>

          {related.length > 0 ? (
            <div className="tec__related">
              <p className="tec__related-label">Related projects</p>
              <ul className="tec__related-list">
                {related.map((project) => (
                  <li key={project.slug}>
                    <Link
                      href={`/work/${project.slug}`}
                      className="tec__related-link"
                      data-cursor="explore"
                    >
                      <span className="tec__related-text">
                        <span className="tec__related-title">{project.title}</span>
                        {/* The tagline is what makes this a decision rather than a
                            guess — two project titles alone do not say which one is
                            worth the click. */}
                        <span className="tec__related-tag">{project.tagline}</span>
                      </span>
                      <ArrowUpRight size={14} aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>

      <Link href={ctaHref} className="tec__panel-cta" data-cursor="explore">
        <span>{ctaLabel}</span>
        <ArrowRight size={15} aria-hidden />
      </Link>
    </div>
  );
}

export function SkillsSection({
  headingLevel = "h2",
  index = "05",
}: { headingLevel?: SectionHeadingLevel; index?: string } = {}) {
  const reduce = Boolean(useReducedMotion());
  const Heading = headingLevel;

  const [selectedId, setSelectedId] = useState("angular");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const selected = useMemo(
    () => ECO_TECHS.find((t) => t.id === selectedId) ?? ECO_TECHS[0],
    [selectedId],
  );
  const selectedCategory = useMemo(
    () => ECO_CATEGORIES.find((c) => c.id === selected.categoryId) ?? ECO_CATEGORIES[0],
    [selected],
  );

  /* Case studies that actually list this technology. No match is a normal
     outcome for tooling, so the panel simply drops the block. */
  const related = useMemo(() => {
    const term = selected.label.toLowerCase();
    return projects
      .filter((p) => p.technologies?.some((t) => t.toLowerCase().includes(term)))
      .slice(0, 2)
      .map((p) => ({ slug: p.slug, title: p.title, tagline: p.tagline }));
  }, [selected]);

  const handleSelectTech = useCallback((id: string) => {
    setSelectedId(id);
    const tech = ECO_TECHS.find((t) => t.id === id);
    if (tech) setActiveCategory(tech.categoryId);
  }, []);

  const handleSelectCategory = useCallback((id: string | null) => {
    setActiveCategory(id);
    if (id) {
      const first = featuredIn(id)[0];
      if (first) setSelectedId(first.id);
    }
  }, []);

  /* There is no standalone /skills route: the ecosystem lives in the homepage
     stack, so the panel's exit is the work the stack was used on. */
  const ctaHref = "/work";
  const ctaLabel = "See the work behind the stack";

  const enter = {
    duration: reduce ? 0.15 : 0.6,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  };
  const fade = reduce ? { opacity: 0 } : { opacity: 0, y: 18 };
  const inView = { opacity: 1, y: 0 };
  const viewport = { once: true, amount: 0.15 } as const;

  return (
    <section id="skills" className="section tec" aria-labelledby="tec-title">
      <span className="tec__aura" aria-hidden />

      <div className="shell tec__shell">
        <motion.header
          className="tec__intro"
          initial={fade}
          whileInView={inView}
          viewport={viewport}
          transition={enter}
        >
          <SectionKicker index={index} label="Technology ecosystem" />
          <Heading className="tec__title" id="tec-title">
            Explore the <em>ecosystem.</em>
          </Heading>
          <p className="tec__lede">
            A modern stack for real-world products. From web to mobile, these are the tools
            I use to build scalable, accessible, high-performance experiences.
          </p>

          <figure className="tec__quote">
            <blockquote>Right tools. Real impact.</blockquote>
            <figcaption>Rabin R</figcaption>
          </figure>

          <dl className="tec__stats">
            <div>
              <dt>{ECO_CATEGORIES.length}</dt>
              <dd>Categories</dd>
            </div>
            <div>
              <dt>{ECO_TECHS.length}+</dt>
              <dd>Technologies</dd>
            </div>
            <div>
              <dt>{YEARS_EXPERIENCE}</dt>
              <dd>Years experience</dd>
            </div>
          </dl>
        </motion.header>

        <motion.div
          className="tec__filters"
          initial={fade}
          whileInView={inView}
          viewport={viewport}
          transition={{ ...enter, delay: 0.08 }}
        >
          <div className="tec__filter-row" role="group" aria-label="Technology categories">
            <button
              type="button"
              className={cn("tec__filter", activeCategory === null && "tec__filter--active")}
              onClick={() => handleSelectCategory(null)}
              aria-pressed={activeCategory === null}
              data-cursor="explore"
            >
              All
            </button>
            {ECO_CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                className={cn(
                  "tec__filter",
                  activeCategory === category.id && "tec__filter--active",
                )}
                style={{ "--tec-c": category.accent } as React.CSSProperties}
                onClick={() =>
                  handleSelectCategory(activeCategory === category.id ? null : category.id)
                }
                aria-pressed={activeCategory === category.id}
                data-cursor="explore"
              >
                {category.label}
              </button>
            ))}
          </div>

          <p className="tec__filters-note" aria-hidden>
            Technology
            <br />
            drives
            <br />
            possibilities
          </p>
        </motion.div>

        <motion.div
          className="tec__stage"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewport}
          transition={{ ...enter, duration: reduce ? 0.15 : 0.8 }}
        >
          <div className="tec__orbit">
            <svg
              className="tec__web"
              viewBox={`0 0 ${ORBIT_VIEWBOX.w} ${ORBIT_VIEWBOX.h}`}
              aria-hidden
              focusable="false"
            >
              <defs>
                <radialGradient id="tecCoreGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.28" />
                  <stop offset="60%" stopColor="var(--color-accent)" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
                </radialGradient>
              </defs>

              <circle cx={ORBIT_CENTER.x} cy={ORBIT_CENTER.y} r="34" fill="url(#tecCoreGlow)" />

              <g className="tec__rings">
                <ellipse
                  cx={ORBIT_CENTER.x}
                  cy={ORBIT_CENTER.y}
                  rx="44"
                  ry="37"
                  className="tec__ring"
                />
                <ellipse
                  cx={ORBIT_CENTER.x}
                  cy={ORBIT_CENTER.y}
                  rx="26"
                  ry="22"
                  className="tec__ring tec__ring--inner"
                />
              </g>

              {ECO_CATEGORIES.map((category) => {
                const point = orbitPoint(category.angle);
                const dimmed = activeCategory !== null && activeCategory !== category.id;
                return (
                  <g
                    key={category.id}
                    className="tec__spoke"
                    data-dimmed={dimmed || undefined}
                    style={{ "--tec-c": category.accent } as React.CSSProperties}
                  >
                    <line
                      x1={ORBIT_CENTER.x}
                      y1={ORBIT_CENTER.y}
                      x2={point.x}
                      y2={point.y}
                      className="tec__spoke-line"
                    />
                    <circle
                      cx={ORBIT_CENTER.x + (point.x - ORBIT_CENTER.x) * 0.55}
                      cy={ORBIT_CENTER.y + (point.y - ORBIT_CENTER.y) * 0.55}
                      r="0.7"
                      className="tec__spoke-bead"
                    />
                    <circle cx={point.x} cy={point.y} r="1" className="tec__spoke-cap" />
                  </g>
                );
              })}
            </svg>

            <div className="tec__core">
              <span className="tec__core-ring" aria-hidden />
              <Monogram className="tec__core-mark" />
            </div>

            <p className="tec__core-motto" aria-hidden>
              Build · Learn
              <br />
              Ship · Repeat
            </p>

            {ECO_CATEGORIES.map((category) => (
              <OrbitCluster
                key={category.id}
                category={category}
                selectedId={selectedId}
                activeCategory={activeCategory}
                onSelectCategory={(id) =>
                  handleSelectCategory(activeCategory === id ? null : id)
                }
                onSelectTech={handleSelectTech}
              />
            ))}
          </div>

          {/* The orbit shows three technologies per category; this lists the
              rest of the active arm so nothing is reachable only by hover. */}
          <div className="tec__more">
            <p className="tec__more-label">
              {activeCategory ? `${selectedCategory.label} — full list` : "Also in the stack"}
            </p>
            <ul className="tec__more-list">
              {(activeCategory ? techsIn(activeCategory) : ECO_TECHS.filter((t) => !t.featured)).map(
                (tech) => (
                  <li key={tech.id}>
                    <button
                      type="button"
                      className={cn(
                        "tec__more-chip",
                        tech.id === selectedId && "tec__more-chip--active",
                      )}
                      onClick={() => handleSelectTech(tech.id)}
                      aria-pressed={tech.id === selectedId}
                      data-cursor="explore"
                    >
                      <StackTechIcon label={tech.label} className="tec__more-icon" />
                      {tech.label}
                    </button>
                  </li>
                ),
              )}
            </ul>
          </div>
        </motion.div>

        <motion.aside
          className="tec__panel"
          aria-label="Selected technology"
          initial={fade}
          whileInView={inView}
          viewport={viewport}
          transition={{ ...enter, delay: 0.12 }}
        >
          <DetailPanel
            tech={selected}
            category={selectedCategory}
            related={related}
            ctaHref={ctaHref}
            ctaLabel={ctaLabel}
            reduce={reduce}
          />
        </motion.aside>

        <p className="tec__footnote" aria-hidden>
          {"// "}Continuously exploring a better tomorrow
        </p>
      </div>
    </section>
  );
}
