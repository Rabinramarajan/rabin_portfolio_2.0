"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Code2, Database, Infinity as InfinityIcon, PenTool, Rocket, Server, Users, Wrench } from "lucide-react";
import { everydayTech, skillHero, skillShowcase, skillTraits } from "@/content/skills";
import { profile } from "@/content/profile";
import { TechIcon } from "@/components/about/TechIcon";
import { StackTechIcon } from "@/components/StackTechIcon";
import { SmartImage } from "@/components/SmartImage";
import { duration, ease, stagger } from "@/lib/motion";
import type { SectionHeadingLevel } from "@/components/ui";
import type { SkillShowcase, SkillTrait } from "@/content/types";

type Glyph = ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;

const TRAIT_GLYPHS: Record<SkillTrait["id"], Glyph> = {
  solver: Code2,
  learning: Rocket,
  team: Users,
};

const CARD_GLYPHS: Record<string, Glyph> = {
  frontend: Code2,
  backend: Server,
  database: Database,
  devops: InfinityIcon,
  tools: Wrench,
  design: PenTool,
};

export function SkillsSection({ headingLevel = "h2" }: { headingLevel?: SectionHeadingLevel } = {}) {
  const reduce = useReducedMotion();
  const Heading = headingLevel;
  const fade = reduce ? { opacity: 0 } : { opacity: 0, y: 18 };

  return (
    <section id="skills" className="section sk2">
      <div className="shell">
        <div className="sk2-hero">
          <motion.div
            className="sk2-hero__copy"
            initial={fade}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: reduce ? duration.micro : duration.section, ease }}
          >
            <p className="sk2-kicker">
              <span className="sk2-kicker__dot" aria-hidden />
              {skillHero.kicker}
            </p>
            <Heading className="sk2-title">
              {skillHero.headline[0]}{" "}
              <em>{skillHero.headline[1]}</em>
            </Heading>
            <p className="sk2-lede">{skillHero.lede}</p>
            <ul className="sk2-traits">
              {skillTraits.map((trait) => {
                const Icon = TRAIT_GLYPHS[trait.id];
                return (
                  <li key={trait.id} className="sk2-trait">
                    <span className="sk2-trait__icon" aria-hidden>
                      <Icon size={16} strokeWidth={2} />
                    </span>
                    <span>
                      <strong>{trait.title}</strong>
                      <span>{trait.body}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          <motion.figure
            className="sk2-hero__visual"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: reduce ? duration.micro : duration.cinematic, ease, delay: reduce ? 0 : 0.08 }}
          >
            <SmartImage
              src={skillHero.visual.src}
              alt={skillHero.visual.alt}
              width={skillHero.visual.width}
              height={skillHero.visual.height}
              priority={headingLevel === "h1"}
              sizes="(max-width: 900px) 92vw, 560px"
              className="sk2-hero__img"
            />
          </motion.figure>
        </div>

        <motion.div
          className="sk2-expertise"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-8%" }}
          transition={{ staggerChildren: reduce ? 0 : stagger, delayChildren: reduce ? 0 : 0.12 }}
        >
          <p className="sk2-kicker">
            <span className="sk2-kicker__dot" aria-hidden />
            Skills &amp; Expertise
          </p>
          <div className="sk2-grid">
            {skillShowcase.map((group) => (
              <SkillCard key={group.id} group={group} reduce={Boolean(reduce)} />
            ))}
          </div>
        </motion.div>

        <div className="sk2-bottom">
          <motion.div
            className="sk2-cloud"
            initial={fade}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: reduce ? duration.micro : duration.section, ease }}
          >
            <p className="sk2-cloud__label">Technologies I work with everyday</p>
            <ul className="sk2-cloud__list">
              {everydayTech.map((item) => (
                <li key={item} className="sk2-cloud__pill">
                  <StackTechIcon label={item} className="sk2-cloud__icon" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.blockquote
            className="sk2-quote"
            initial={fade}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: reduce ? duration.micro : duration.section, ease, delay: reduce ? 0 : 0.08 }}
          >
            <span className="sk2-quote__mark" aria-hidden>
              &ldquo;
            </span>
            <p>
              {skillHero.quote.before}
              <em>{skillHero.quote.accent}</em>
              {skillHero.quote.after}
            </p>
            <footer>
              <cite className="sk2-quote__name">{profile.name}</cite>
              <span className="sk2-quote__role">{skillHero.quoteRole}</span>
            </footer>
          </motion.blockquote>
        </div>
      </div>
    </section>
  );
}

function SkillCard({ group, reduce }: { group: SkillShowcase; reduce: boolean }) {
  const Icon = CARD_GLYPHS[group.id] ?? Code2;

  return (
    <motion.article
      className="sk2-card"
      variants={
        reduce
          ? undefined
          : {
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }
      }
      transition={{ duration: reduce ? duration.micro : duration.section, ease }}
    >
      <header className="sk2-card__head">
        <span className="sk2-card__icon" aria-hidden>
          <Icon size={18} strokeWidth={2} />
        </span>
        <h3>{group.label}</h3>
      </header>
      <p className="sk2-card__desc">{group.description}</p>
      <ul className="sk2-card__tools">
        {group.tools.map((tool) => (
          <li key={`${group.id}-${tool.id}-${tool.label}`} title={tool.label}>
            <TechIcon id={tool.id} label={tool.label} />
          </li>
        ))}
      </ul>
      <Link href="/work" className="sk2-card__explore" aria-label={`Explore ${group.label} work`}>
        Explore <span aria-hidden>→</span>
      </Link>
    </motion.article>
  );
}
