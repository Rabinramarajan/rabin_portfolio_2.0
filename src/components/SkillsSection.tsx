"use client";

import type { ComponentType } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Accessibility,
  Boxes,
  Brain,
  Bug,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Cloud,
  Code2,
  Database,
  Gauge,
  Lightbulb,
  Link2,
  MessageSquare,
  PenTool,
  Rocket,
  Search,
  Settings,
  Smartphone,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  approachSteps,
  coreCompetencies,
  everydayTech,
  skillHero,
  skillStats,
  skillTimeline,
  softSkills,
} from "@/content/skills";
import { StackTechIcon } from "@/components/StackTechIcon";
import { Monogram } from "@/components/Logo";
import { duration, ease, stagger } from "@/lib/motion";
import { SectionKicker, type SectionHeadingLevel } from "@/components/ui";
import type { SkillTimelineNode } from "@/content/skills";

type Glyph = ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;

const GLYPH: Record<string, Glyph> = {
  // timeline nodes
  frontend: Code2,
  mobile: Smartphone,
  state: Database,
  backend: Cloud,
  devops: Settings,
  design: PenTool,
  // stats
  star: Star,
  rocket: Rocket,
  people: Users,
  target: Target,
  // competencies + soft skills + approach
  architecture: Boxes,
  code: Code2,
  gauge: Gauge,
  bug: Bug,
  link: Link2,
  accessibility: Accessibility,
  bulb: Lightbulb,
  brain: Brain,
  chat: MessageSquare,
  search: Search,
  plan: ClipboardList,
  trend: TrendingUp,
};

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const Glyph = GLYPH[name] ?? Code2;
  return <Glyph size={size} strokeWidth={1.75} />;
}

/**
 * Skills — a numbered section header, a statement column carrying the
 * credibility stats, and a snaking six-node "core skill
 * timeline" that reads 01→03 left to right and 04→06 back the other way. The
 * closing panel splits into tech marks, competencies, soft skills and the
 * four-step approach dial.
 *
 * The connector rails (chevrons, the U-turn on the right, the tail on the
 * left) are decorative and collapse away below the timeline's two-row
 * breakpoint, where the nodes stack into a plain list.
 */
export function SkillsSection({
  headingLevel = "h2",
  index = skillHero.index,
}: { headingLevel?: SectionHeadingLevel; index?: string } = {}) {
  const reduce = useReducedMotion();
  const Heading = headingLevel;
  const fade = reduce ? { opacity: 0 } : { opacity: 0, y: 18 };
  const inView = { opacity: 1, y: 0 };
  const viewport = { once: true, margin: "-10%" } as const;
  const sectionTransition = { duration: reduce ? duration.micro : duration.section, ease };

  const topRow = skillTimeline.slice(0, 3);
  // The lower rail runs right to left, so 06 renders first and 04 last.
  const bottomRow = skillTimeline.slice(3).reverse();

  return (
    <section id="skills" className="section skx">
      <div className="shell">
        <header className="skx__top">
          <SectionKicker index={index} label={skillHero.kicker} />
        </header>

        <div className="skx__main">
          <motion.div
            className="skx__intro"
            initial={fade}
            whileInView={inView}
            viewport={viewport}
            transition={sectionTransition}
          >
            <Heading className="skx__title">
              {skillHero.headline[0]} <br />
              {skillHero.headline[1]} <em>{skillHero.headline[2]}</em> <br />
              {skillHero.headline[3]} <br />
              {skillHero.headline[4]} <em>{skillHero.headline[5]}</em>
            </Heading>
            <span className="skx__title-rule" aria-hidden />
            <p className="skx__lede">{skillHero.lede}</p>

            <dl className="skx__stats">
              {skillStats.map((stat) => (
                <div className="skx__stat" key={stat.id}>
                  <dt className="skx__stat-icon" aria-hidden>
                    <Icon name={stat.icon} size={20} />
                  </dt>
                  <dd className="skx__stat-body">
                    <strong>{stat.value}</strong>
                    <span>
                      {stat.label[0]}
                      <br />
                      {stat.label[1]}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div
            className="skx__timeline"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-8%" }}
            transition={{ staggerChildren: reduce ? 0 : stagger, delayChildren: reduce ? 0 : 0.1 }}
          >
            <p className="skx__timeline-label">
              <span className="skx__timeline-arrow" aria-hidden>
                →
              </span>
              {skillHero.timelineLabel}
              <span className="skx__timeline-arrow" aria-hidden>
                ←
              </span>
            </p>

            <div className="skx__rail skx__rail--fwd">
              {topRow.map((node, i) => (
                <TimelineNode key={node.id} node={node} reduce={Boolean(reduce)} connector={i < 2 ? "next" : null} />
              ))}
            </div>

            <span className="skx__uturn" aria-hidden />
            <span className="skx__tail" aria-hidden />

            <div className="skx__rail skx__rail--rev">
              {bottomRow.map((node, i) => (
                <TimelineNode
                  key={node.id}
                  node={node}
                  reduce={Boolean(reduce)}
                  flipped
                  connector={i < 2 ? "prev" : null}
                />
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="skx__panel"
          initial={fade}
          whileInView={inView}
          viewport={viewport}
          transition={{ ...sectionTransition, delay: reduce ? 0 : 0.08 }}
        >
          <section className="skx__col">
            <h3 className="skx__col-title">Technologies I work with</h3>
            <ul className="skx__tech">
              {everydayTech.map((item) => (
                <li key={item}>
                  <span className="skx__tech-tile" aria-hidden>
                    <StackTechIcon label={item} className="skx__tech-icon" />
                  </span>
                  <span className="skx__tech-name">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="skx__col skx__col--bordered">
            <h3 className="skx__col-title skx__col-title--center">Core Competencies</h3>
            <ul className="skx__chips skx__chips--two">
              {coreCompetencies.map((item) => (
                <li key={item.id}>
                  <span className="skx__chip-icon" aria-hidden>
                    <Icon name={item.icon} size={16} />
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>
          </section>

          <section className="skx__col skx__col--bordered">
            <h3 className="skx__col-title">Soft Skills</h3>
            <ul className="skx__chips">
              {softSkills.map((item) => (
                <li key={item.id}>
                  <span className="skx__chip-icon" aria-hidden>
                    <Icon name={item.icon} size={16} />
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>
          </section>

          <section className="skx__col skx__col--bordered">
            <h3 className="skx__col-title skx__col-title--center">My Approach</h3>
            <div className="skx__dial">
              <span className="skx__dial-core" aria-hidden>
                <Monogram className="skx__dial-mark" />
              </span>
              {approachSteps.map((step) => (
                <div className={`skx__step skx__step--${step.id}`} key={step.id}>
                  <span className="skx__step-icon" aria-hidden>
                    <Icon name={step.icon} size={16} />
                  </span>
                  <strong>{step.title}</strong>
                  <span>
                    {step.body[0]}
                    <br />
                    {step.body[1]}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </motion.div>
      </div>
    </section>
  );
}

function TimelineNode({
  node,
  reduce,
  flipped = false,
  connector,
}: {
  node: SkillTimelineNode;
  reduce: boolean;
  flipped?: boolean;
  connector: "next" | "prev" | null;
}) {
  return (
    <motion.article
      className={flipped ? "skx__node skx__node--flipped" : "skx__node"}
      variants={reduce ? undefined : { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: reduce ? duration.micro : duration.section, ease }}
    >
      <div className="skx__node-head">
        <span className="skx__node-disc" aria-hidden>
          <Icon name={node.id} size={22} />
        </span>
        {connector ? (
          <span className="skx__node-link" aria-hidden>
            {connector === "next" ? <ChevronRight size={14} strokeWidth={2.5} /> : <ChevronLeft size={14} strokeWidth={2.5} />}
          </span>
        ) : null}
      </div>

      <p className="skx__node-index" aria-hidden>
        {node.index}
      </p>
      <h3 className="skx__node-title">
        {node.title[0]}
        <br />
        {node.title[1]}
      </h3>
      <p className="skx__node-desc">{node.description}</p>
      <ul className="skx__node-items">
        {node.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </motion.article>
  );
}
