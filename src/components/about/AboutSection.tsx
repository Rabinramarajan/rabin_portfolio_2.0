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

type Glyph = ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;

/** Icons are presentation, not content — they live with the view, not the data. */
const HIGHLIGHT_GLYPHS: Glyph[] = [Rocket, Code2, Lightbulb];
const METRIC_GLYPHS: Record<MetricIcon, Glyph> = {
  experience: Trophy,
  projects: UsersRound,
  commitment: Star,
  clients: Users,
};

/** The three cards that sit in the middle column of the band. */
const STAT_COUNT = 3;

/** Stat value that counts up ("30+") once its card enters the viewport. */
function StatValue({ value }: { value: string }) {
  const { ref, display } = useCountUp(value);
  return (
    <span ref={ref} className="abt-stat__value">
      {display}
    </span>
  );
}

/** Square glyph tile — the accented chip used by highlights and stat cards. */
function Tile({ icon: Icon, className }: { icon: Glyph; className: string }) {
  return (
    <span className={className} aria-hidden>
      <Icon size={18} strokeWidth={1.8} />
    </span>
  );
}

function Kicker() {
  return (
    <p className="abt-kicker">
      <span className="abt-kicker__index">{"// 01"}</span>
      <span className="abt-kicker__label">About Me</span>
    </p>
  );
}

function Copy() {
  return (
    <>
      <Kicker />

      <TextReveal
        lines={about.headingLines ?? [about.heading]}
        className="abt__title"
        as="h2"
        delay={0.08}
      />

      <span className="abt__rule" aria-hidden />

      {/* The stored opener names Rabin in full; the page has already introduced him. */}
      <p className="abt__lead">
        I&rsquo;m <strong>{profile.name}</strong>
        {about.paragraphs[0].replace(/^I am Rabin R,/, ",")}
      </p>

      <ul className="abt-highlights">
        {about.highlights.map((line, i) => (
          <li className="abt-highlight" key={line}>
            <Tile icon={HIGHLIGHT_GLYPHS[i % HIGHLIGHT_GLYPHS.length]} className="abt-highlight__icon" />
            <p className="abt-highlight__text">{line}</p>
            <span className="abt-highlight__trail" aria-hidden />
          </li>
        ))}
      </ul>

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
    </>
  );
}

function Stats() {
  return (
    <>
      {about.metrics.slice(0, STAT_COUNT).map((metric) => {
        const Icon = metric.icon ? METRIC_GLYPHS[metric.icon] : Star;
        return (
          <li className="abt-stat" key={metric.label}>
            <Tile icon={Icon} className="abt-stat__icon" />
            <StatValue value={metric.value} />
            <p className="abt-stat__label">{metric.label}</p>
            {metric.note ? <p className="abt-stat__note">{metric.note}</p> : null}
          </li>
        );
      })}
    </>
  );
}

function Portrait() {
  return (
    <div className="abt-figure">
      <span className="abt-figure__glow" aria-hidden />

      <SmartImage
        src={about.portrait.src}
        alt={about.portrait.alt}
        width={about.portrait.width}
        height={about.portrait.height}
        sizes="(max-width: 959px) 88vw, 40vw"
        className="abt-figure__shot"
      />

      {/*
       * The name and role are painted into the artwork, so they are invisible
       * to screen readers and to search. Repeat them as real text.
       */}
      <figcaption className="visually-hidden">
        {profile.name} — {profile.headlineRole}
      </figcaption>
    </div>
  );
}

export function AboutSection() {
  const reduce = useReducedMotion();

  /** Staggered scroll-in; collapses to a plain fade when motion is reduced. */
  const rise = (delay = 0, y = 24) => ({
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

      <div className="shell">
        <div className="abt__band">
          <motion.div className="abt__copy" {...rise(0)}>
            <Copy />
          </motion.div>

          <motion.ul className="abt__stats" {...rise(0.1)}>
            <Stats />
          </motion.ul>

          <motion.figure className="abt__portrait" {...rise(0.16, 32)}>
            <Portrait />
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
