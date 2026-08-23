"use client";

import { useCallback, useRef, useState, type CSSProperties, type ComponentType, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Accessibility,
  ArrowUpRight,
  Boxes,
  Bug,
  Cloud,
  Code2,
  Database,
  Gauge,
  Lightbulb,
  MessageSquare,
  PenTool,
  Rocket,
  Settings,
  Smartphone,
  Star,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";
import { everydayTech, skillDomains, skillHero, skillStats, skillStrengths } from "@/content/skills";
import type { SkillDomain } from "@/content/skills";
import { StackTechIcon } from "@/components/StackTechIcon";
import { Monogram } from "@/components/Logo";
import { duration, ease, stagger } from "@/lib/motion";
import { SectionKicker, itemHeadingLevel, type SectionHeadingLevel } from "@/components/ui";

type Glyph = ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;

const GLYPH: Record<string, Glyph> = {
  // domains
  frontend: Code2,
  state: Database,
  mobile: Smartphone,
  backend: Cloud,
  devops: Settings,
  design: PenTool,
  // stats
  star: Star,
  rocket: Rocket,
  people: Users,
  target: Target,
  // strengths
  architecture: Boxes,
  gauge: Gauge,
  bug: Bug,
  accessibility: Accessibility,
  bulb: Lightbulb,
  chat: MessageSquare,
};

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const Glyph = GLYPH[name] ?? Code2;
  return <Glyph size={size} strokeWidth={1.6} />;
}

/**
 * Skills — a three-part cinematic deck that holds one viewport height on a
 * desktop monitor and reflows to a single column on smaller screens.
 *
 *   statement column  ·  orbit stage  ·  detail panel
 *
 * The orbit is the interactive control: six domain nodes sit on a ring around
 * the monogram nucleus and drive the detail panel beside them. The nodes are a
 * real tablist (roving tabindex, arrow-key navigation), so the whole section
 * is operable from the keyboard and reads correctly to a screen reader — the
 * ring geometry is presentation only.
 *
 * Everything that moves is transform / opacity, the ring spin is pure CSS, and
 * all of it collapses under `prefers-reduced-motion`.
 */
export function SkillsSection({
  headingLevel = "h2",
  index = skillHero.index,
}: { headingLevel?: SectionHeadingLevel; index?: string } = {}) {
  const reduce = useReducedMotion();
  const Heading = headingLevel;
  const itemHeading = itemHeadingLevel(headingLevel);
  const [activeId, setActiveId] = useState(skillDomains[0].id);
  const active = skillDomains.find((d) => d.id === activeId) ?? skillDomains[0];

  const fade = reduce ? { opacity: 0 } : { opacity: 0, y: 20 };
  const inView = { opacity: 1, y: 0 };
  const viewport = { once: true, margin: "-10%" } as const;
  const enter = { duration: reduce ? duration.micro : duration.section, ease };

  return (
    <section id="skills" className="section skd">
      <span className="skd__aura" aria-hidden />

      <div className="shell skd__shell">
        <motion.header className="skd__top" initial={fade} whileInView={inView} viewport={viewport} transition={enter}>
          <SectionKicker index={index} label={skillHero.kicker} />
        </motion.header>

        <div className="skd__grid">
          {/* ---------- statement ---------- */}
          <motion.div className="skd__intro" initial={fade} whileInView={inView} viewport={viewport} transition={enter}>
            <Heading className="skd__title">
              Skills that build
              <br />
              digital <em>experiences.</em>
            </Heading>
            <p className="skd__lede">{skillHero.lede}</p>

            <dl className="skd__stats">
              {skillStats.map((stat) => (
                <div className="skd__stat" key={stat.id}>
                  <dt className="skd__stat-icon" aria-hidden>
                    <Icon name={stat.icon} size={17} />
                  </dt>
                  <dd className="skd__stat-body">
                    <strong>{stat.value}</strong>
                    <span>
                      {stat.label[0]} {stat.label[1]}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <Link className="skd__cta" href="/work">
              View skills in action
              <span className="skd__cta-arrow" aria-hidden>
                <ArrowUpRight size={16} strokeWidth={2} />
              </span>
            </Link>
          </motion.div>

          {/* ---------- orbit ---------- */}
          <motion.div
            className="skd__stage"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewport}
            transition={{ duration: reduce ? duration.micro : duration.cinematic, ease }}
          >
            <SkillOrbit active={activeId} onSelect={setActiveId} reduce={Boolean(reduce)} />
          </motion.div>

          {/* ---------- detail ---------- */}
          <motion.div
            className="skd__detail"
            initial={fade}
            whileInView={inView}
            viewport={viewport}
            transition={{ ...enter, delay: reduce ? 0 : 0.08 }}
          >
            <SkillDetail domain={active} reduce={Boolean(reduce)} itemHeading={itemHeading} />

            <ul className="skd__strengths">
              {skillStrengths.map((item) => (
                <li key={item.id}>
                  <span className="skd__strength-icon" aria-hidden>
                    <Icon name={item.icon} size={15} />
                  </span>
                  <span className="skd__strength-body">
                    <strong>{item.label}</strong>
                    <span>{item.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* ---------- tech rail ---------- */}
        <motion.div className="skd__rail" initial={fade} whileInView={inView} viewport={viewport} transition={{ ...enter, delay: reduce ? 0 : 0.12 }}>
          <p className="skd__rail-label">Technologies I work with</p>
          <ul className="skd__rail-list">
            {everydayTech.map((item) => (
              <li key={item}>
                <span className="skd__rail-icon" aria-hidden>
                  <StackTechIcon label={item} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   Orbit — the six domain nodes as a tablist.
   Node placement is inline custom properties rather than classes so the ring
   stays data-driven: add a seventh domain and the geometry redistributes.
------------------------------------------------------------------ */

function SkillOrbit({
  active,
  onSelect,
  reduce,
}: {
  active: string;
  onSelect: (id: string) => void;
  reduce: boolean;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      const current = skillDomains.findIndex((d) => d.id === active);
      const last = skillDomains.length - 1;
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? last
            : event.key === "ArrowRight" || event.key === "ArrowDown"
              ? (current + 1) % skillDomains.length
              : (current - 1 + skillDomains.length) % skillDomains.length;
      onSelect(skillDomains[next].id);
      refs.current[next]?.focus();
    },
    [active, onSelect],
  );

  return (
    <div className="skd__orbit">
      {/* Decorative rings. The dashed one spins; the rest are static. */}
      <span className="skd__ring skd__ring--outer" aria-hidden />
      <span className="skd__ring skd__ring--spin" aria-hidden />
      <span className="skd__ring skd__ring--inner" aria-hidden />
      <span className="skd__sweep" aria-hidden />

      <span className="skd__core" aria-hidden>
        <Monogram className="skd__core-mark" />
      </span>

      <div className="skd__nodes" role="tablist" aria-label="Skill domains" aria-orientation="horizontal" onKeyDown={onKeyDown}>
        {skillDomains.map((domain, i) => {
          // Nodes start at 12 o'clock and run clockwise around the ring.
          const angle = (360 / skillDomains.length) * i - 90;
          const selected = domain.id === active;
          return (
            <button
              key={domain.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`skd-tab-${domain.id}`}
              aria-selected={selected}
              aria-controls="skd-panel"
              tabIndex={selected ? 0 : -1}
              className="skd__node"
              data-selected={selected || undefined}
              style={{ "--angle": `${angle}deg` } as CSSProperties}
              onClick={() => onSelect(domain.id)}
              onMouseEnter={reduce ? undefined : () => onSelect(domain.id)}
            >
              <span className="skd__node-disc">
                <Icon name={domain.id} size={20} />
              </span>
              <span className="skd__node-label">
                <span className="skd__node-index" aria-hidden>
                  {domain.index}
                </span>
                {domain.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Detail panel — swaps content for the selected domain.
------------------------------------------------------------------ */

function SkillDetail({
  domain,
  reduce,
  itemHeading: ItemHeading,
}: {
  domain: SkillDomain;
  reduce: boolean;
  itemHeading: "h2" | "h3";
}) {

  return (
    <div className="skd__panel" id="skd-panel" role="tabpanel" aria-labelledby={`skd-tab-${domain.id}`} tabIndex={0}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={domain.id}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: reduce ? duration.micro : duration.ui, ease }}
        >
          <p className="skd__panel-index" aria-hidden>
            {domain.index} <span>/ {domain.tagline}</span>
          </p>
          <ItemHeading className="skd__panel-title">{domain.title}</ItemHeading>
          <p className="skd__panel-desc">{domain.description}</p>

          <ul className="skd__focus">
            {domain.focus.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <motion.ul
            className="skd__chips"
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: reduce ? 0 : stagger / 2 }}
          >
            {domain.tech.map((item) => (
              <motion.li
                key={item}
                variants={
                  reduce
                    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
                    : { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }
                }
                transition={{ duration: duration.ui, ease }}
              >
                <StackTechIcon label={item} className="skd__chip-icon" />
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
