"use client";

import type { ComponentType } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Code,
  Layers,
  Zap,
  Mail,
  UsersRound,
  Trophy,
  Rocket,
  UserRound,
  Sparkles,
  TrendingUp,
  Users,
  ShieldCheck,
  Quote,
} from "lucide-react";
import { about } from "@/content/about";
import { profile } from "@/content/profile";
import { SectionKicker } from "@/components/ui";
import { ImageReveal, TextReveal } from "@/components/motion";
import { SmartImage } from "@/components/SmartImage";
import { TechIcon } from "@/components/about/TechIcon";
import { DottedWave, PortraitOrbits } from "@/components/about/AboutDecor";
import type { MetricIcon } from "@/content/types";
import { duration, ease } from "@/lib/motion";
import { useCountUp } from "@/hooks/use-parallel";

type Glyph = ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;

/** Icons are presentation, not content — they live with the view, not the data. */
const DOING_GLYPHS: Glyph[] = [Code, Layers, Zap];
const VALUE_GLYPHS: Glyph[] = [UserRound, Sparkles, TrendingUp, Users, ShieldCheck];
const METRIC_GLYPHS: Record<MetricIcon, Glyph> = {
  projects: Mail,
  clients: UsersRound,
  experience: Trophy,
  commitment: Rocket,
};

/** A live-status pill — used for both availability and the role badge. */
function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={className ? `about-pill ${className}` : "about-pill"}>
      <span className="about-pill__dot" aria-hidden />
      {children}
    </p>
  );
}

/** Circular glyph badge shared by the "What I Do", values and CTA rows. */
function Badge({ icon: Icon, className }: { icon: Glyph; className: string }) {
  return (
    <span className={className}>
      <Icon size={18} strokeWidth={2} />
    </span>
  );
}

/** Stat value that counts up ("30+") once its card enters the viewport. */
function StatValue({ value }: { value: string }) {
  const { ref, display } = useCountUp(value);
  return (
    <span ref={ref} className="about-stat__value">
      {display}
    </span>
  );
}

function PortraitCard() {
  return (
    <div className="about-card">
      <div className="about-card__figure">
        <PortraitOrbits />

        <Pill className="about-card__status">
          Available for
          <br />
          new opportunities
        </Pill>

        <ImageReveal parallax={18}>
          <SmartImage
            src={about.portrait.src}
            alt={about.portrait.alt}
            width={about.portrait.width}
            height={about.portrait.height}
            sizes="(max-width: 959px) 90vw, 34vw"
            priority
          />
        </ImageReveal>

        <span className="about-card__signature" aria-hidden>
          {profile.shortName} R
        </span>
      </div>

      <div className="about-card__footer">
        <p className="about-card__years">
          <span className="about-card__years-value">{profile.yearsExperienceLabel}</span>
          <span className="about-card__years-label">
            Years of
            <br />
            Experience
          </span>
        </p>

        <Pill className="about-card__role">{profile.headlineRole}</Pill>
      </div>
    </div>
  );
}

function Lead() {
  const [opener, ...rest] = about.paragraphs.slice(0, 2);

  return (
    <>
      <p className="about__eyebrow">About Me</p>

      <TextReveal
        lines={about.headingLines ?? [about.heading]}
        className="about__heading"
        as="h2"
        delay={0.1}
      />

      <div className="about__prose">
        {/* The stored opener names Rabin in full; the page has already introduced him. */}
        <p>
          I&rsquo;m <strong>{profile.shortName}</strong>
          {opener.replace(/^I am Rabin R,/, ",")}
        </p>
        {rest.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <ul className="about__stats">
        {about.metrics.map((metric) => {
          const Icon = metric.icon ? METRIC_GLYPHS[metric.icon] : null;
          return (
            <li className="about-stat" key={metric.label}>
              {Icon ? <Icon className="about-stat__icon" size={18} strokeWidth={1.7} /> : null}
              <StatValue value={metric.value} />
              <span className="about-stat__label">{metric.label}</span>
            </li>
          );
        })}
      </ul>

      <blockquote className="about-quote">
        <DottedWave />
        <Quote className="about-quote__mark" fill="currentColor" aria-hidden />
        <p className="about-quote__text">
          {about.philosophy}
          {about.philosophyLines?.map((line, i, all) => (
            <span key={line} className={i === all.length - 1 ? "acc" : undefined}>
              {i === 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </p>
      </blockquote>
    </>
  );
}

function Panels() {
  return (
    <>
      <div className="about-panel">
        <p className="about-panel__label">What I Do</p>

        <ul className="about-panel__list">
          {about.whatIDo.map((item, i) => (
            <li className="about-doing" key={item.title}>
              <Badge icon={DOING_GLYPHS[i % DOING_GLYPHS.length]} className="about-doing__icon" />
              <div>
                <h3 className="about-doing__title">{item.title}</h3>
                <p className="about-doing__body">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="about-panel__footer">
          Let&rsquo;s build something <span className="acc">extraordinary</span> together.
        </p>
      </div>

      <div className="about-panel">
        <p className="about-panel__label">Tools &amp; Technologies</p>

        <ul className="about-tools">
          {about.tools.map((tool) => (
            <li className="about-tools__tile" key={tool.id} title={tool.label}>
              <TechIcon id={tool.id} label={tool.label} />
            </li>
          ))}
          <li className="about-tools__tile about-tools__tile--more" aria-hidden>
            &hellip;
          </li>
        </ul>

        <p className="about-panel__note">and many more&hellip;</p>
      </div>
    </>
  );
}

export function AboutSection() {
  const reduce = useReducedMotion();

  /** Staggered scroll-in; collapses to a plain fade when motion is reduced. */
  const rise = (delay = 0) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: {
      duration: reduce ? duration.micro : duration.section,
      delay: reduce ? 0 : delay,
      ease,
    },
  });

  return (
    <section id="about" className="section section--viewport">
      <div className="shell">
        <SectionKicker index="01" label="About" />

        <div className="about">
          <motion.div className="about__rail" {...rise(0)}>
            <PortraitCard />
            <p className="about__spine" aria-hidden>
              Clean Code &middot; Scalable &middot; Impact
            </p>
          </motion.div>

          <motion.article className="about__lead" {...rise(0.08)}>
            <Lead />
          </motion.article>

          <motion.aside className="about__panels" {...rise(0.16)}>
            <Panels />
          </motion.aside>
        </div>

        <motion.div className="about__values" {...rise(0.1)}>
          <SectionKicker index="—" label="The Values I Follow" />
          <ul className="about-values">
            {about.values.map((value, i) => (
              <li className="about-value" key={value.title}>
                <Badge icon={VALUE_GLYPHS[i % VALUE_GLYPHS.length]} className="about-value__icon" />
                <div>
                  <h3 className="about-value__title">{value.title}</h3>
                  <p className="about-value__body">{value.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
