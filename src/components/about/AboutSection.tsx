"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Code2, Download, Lightbulb, Rocket, Star, Trophy, Users, UsersRound } from "lucide-react";
import { about } from "@/content/about";
import { profile } from "@/content/profile";
import { TextReveal } from "@/components/motion";
import { SmartImage } from "@/components/SmartImage";
import type { MetricIcon } from "@/content/types";
import { duration, ease } from "@/lib/motion";
import { useCountUp } from "@/hooks/use-parallel";
import { SectionKicker } from "@/components/ui";

type Glyph = ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;

const HIGHLIGHT_GLYPHS: Glyph[] = [Rocket, Code2, Lightbulb];
const METRIC_GLYPHS: Record<MetricIcon, Glyph> = {
  experience: Trophy,
  projects: UsersRound,
  commitment: Star,
  clients: Users,
};

const STAT_COUNT = 3;

function StatValue({ value }: { value: string }) {
  const { ref, display } = useCountUp(value);
  return (
    <span ref={ref} className="abt-stat__value">
      {display}
    </span>
  );
}

function Tile({ icon: Icon, className }: { icon: Glyph; className: string }) {
  return (
    <span className={className} aria-hidden>
      <Icon size={18} strokeWidth={1.8} />
    </span>
  );
}

export function AboutSection() {
  const reduce = useReducedMotion();

  const rise = (delay = 0, y = 22) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: {
      duration: reduce ? duration.micro : duration.section,
      delay: reduce ? 0 : delay,
      ease,
    },
  });

  return (
    <section id="about" className="section abt">
      <span className="abt__aura" aria-hidden />
      <span className="abt__blend" aria-hidden />

      <div className="shell abt__shell">
        <div className="abt__band">
          <div className="abt__main">
            <motion.div className="abt__copy" {...rise(0)}>
              <SectionKicker index="01" label="About Me" />

              <TextReveal
                lines={about.headingLines ?? [about.heading]}
                className="abt__title"
                as="h2"
                delay={0.08}
              />

              <span className="abt__rule" aria-hidden />

              <p className="abt__lead">
                I&rsquo;m <strong>{profile.name}</strong>
                {about.paragraphs[0].replace(/^I am Rabin R,/, ",")}
              </p>

              <ul className="abt-highlights">
                {about.highlights.map((line, i) => (
                  <li className="abt-highlight" key={line}>
                    <Tile icon={HIGHLIGHT_GLYPHS[i % HIGHLIGHT_GLYPHS.length]} className="abt-highlight__icon" />
                    <p className="abt-highlight__text">{line}</p>
                  </li>
                ))}
              </ul>
            </motion.div>

            <div className="abt__actions">
              <Link href={profile.resumePath} className="abt-btn abt-btn--solid">
                Download Resume
                <Download size={17} strokeWidth={2} aria-hidden />
              </Link>
              <Link href="/work" className="abt-btn abt-btn--line">
                View My Work
                <ArrowRight size={17} strokeWidth={2} aria-hidden className="abt-btn__arrow" />
              </Link>
            </div>

            <ul className="abt__stats">
              {about.metrics.slice(0, STAT_COUNT).map((metric) => {
                const Icon = metric.icon ? METRIC_GLYPHS[metric.icon] : Star;
                return (
                  <li className="abt-stat" key={metric.label}>
                    <Tile icon={Icon} className="abt-stat__icon" />
                    <div className="abt-stat__body">
                      <StatValue value={metric.value} />
                      <p className="abt-stat__label">{metric.label}</p>
                      {metric.note ? <p className="abt-stat__note">{metric.note}</p> : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <motion.figure className="abt__portrait" {...rise(0.16, 28)}>
            <div className="abt-figure">
              <span className="abt-figure__glow" aria-hidden />
              <SmartImage
                src={about.portrait.src}
                alt={about.portrait.alt}
                width={about.portrait.width}
                height={about.portrait.height}
                sizes="(max-width: 959px) 88vw, 46vw"
                className="abt-figure__shot"
              />
              <figcaption className="visually-hidden">
                {profile.name} — {profile.headlineRole}
              </figcaption>
            </div>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
