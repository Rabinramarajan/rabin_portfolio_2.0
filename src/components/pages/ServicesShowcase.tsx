"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { services } from "@/content/services";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { TechIcon } from "@/components/about/TechIcon";
import { SectionKicker } from "@/components/ui";
import { ease, duration } from "@/lib/motion";
import { ArrowLink } from "./ArrowLink";
import { ServiceIcon, serviceIconMap } from "./ServiceIcons";

const STATS = [
  { value: profile.yearsExperienceLabel, label: "Years Experience", icon: "bolt" },
  { value: `${Math.max(projects.length, 30)}+`, label: "Projects Delivered", icon: "badge" },
  { value: "20+", label: "Happy Clients", icon: "people" },
] as const;

const TECH = [
  { id: "angular", label: "Angular" },
  { id: "typescript", label: "TypeScript" },
  { id: "rxjs", label: "RxJS" },
  { id: "node", label: "Node.js" },
  { id: "express", label: "Express.js" },
  { id: "postgres", label: "PostgreSQL" },
  { id: "tailwind", label: "Tailwind CSS" },
  { id: "supabase", label: "Supabase" },
  { id: "docker", label: "Docker" },
  { id: "git", label: "Git" },
] as const;

const STAT_GLYPH: Record<string, string> = {
  bolt: "M13 2L4.5 13.5H11L10 22l8.5-11.5H12z",
  badge: "M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM8.3 12.1l2.6 2.6 4.8-4.8",
  people: "M9 11a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 9 11zM2.5 19.5c0-3.3 2.9-5.4 6.5-5.4s6.5 2.1 6.5 5.4M16 5.2a3 3 0 0 1 0 5.8M17.5 14.4c2.5.5 4 2.3 4 5.1",
};

/**
 * `headingLevel` drops to h2 when the block sits below another hero (home page),
 * so the document keeps exactly one h1. `kicker` adds the numbered section label
 * the home page uses to sequence its sections.
 */
export function ServicesHero({
  headingLevel = "h1",
  kicker,
}: { headingLevel?: "h1" | "h2"; kicker?: { index: string; label: string } } = {}) {
  const Heading = headingLevel;
  const isPageHero = headingLevel === "h1";

  return (
    <header className={isPageHero ? "sx-hero" : "sx-hero sx-hero--inline"}>
      <div className="shell sx-hero__grid">
        <div className="sx-hero__copy">
          {kicker ? <SectionKicker index={kicker.index} label={kicker.label} /> : null}

          <p className="sx-eyebrow">
            <span className="sx-eyebrow__dot" aria-hidden />
            What I do
          </p>

          <Heading className="sx-hero__title">
            Full-Stack Solutions.
            <br />
            <span className="sx-accent">Built to Scale.</span>
          </Heading>

          <p className="sx-hero__lede">
            From idea to production, I build fast, scalable, and high-performance digital products with clean code and
            modern architecture.
          </p>

          <dl className="sx-stats">
            {STATS.map((s) => (
              // The icon lives inside <dt> — a <dl> group may only contain
              // dt/dd, so a sibling <span> or nested <div> would be invalid.
              <div className="sx-stat" key={s.label}>
                <dt className="sx-stat__value">
                  <span className="sx-stat__icon" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
                      <path d={STAT_GLYPH[s.icon]} />
                    </svg>
                  </span>
                  {s.value}
                </dt>
                <dd className="sx-stat__label">{s.label}</dd>
              </div>
            ))}
          </dl>

          <div className="sx-hero__actions">
            <Link className="btn btn--solid" href="/contact">
              <span className="btn__label">Start a Project</span>
              <Arrow />
            </Link>
            <Link className="btn btn--line" href="/work">
              <span className="btn__label">View My Work</span>
              <Arrow />
            </Link>
          </div>
        </div>

        <div className="sx-hero__visual">
          <Image
            src="/media/service/banner.png"
            alt="End-to-end delivery pipeline — strategy, design, frontend, backend, database, deployment and support"
            width={1997}
            height={790}
            priority={isPageHero}
            loading={isPageHero ? undefined : "lazy"}
            sizes="(min-width: 960px) 50vw, 100vw"
          />
        </div>
      </div>
    </header>
  );
}

export function ServicesGrid({ id }: { id?: string } = {}) {
  return (
    <section id={id} className="pf-section sx-offer">
      <div className="shell">
        <div className="sx-offer__head">
          <div>
            <p className="sx-eyebrow">
              <span className="sx-eyebrow__dot" aria-hidden />
              What I offer
            </p>
            <h2 className="sx-offer__title">
              Services That <span className="sx-accent">Drive Results</span>
            </h2>
          </div>
          <div className="sx-offer__aside">
            <p>Need something custom?</p>
            <Link className="btn btn--line" href="/contact">
              <span className="btn__label">Let&rsquo;s Discuss</span>
              <Arrow />
            </Link>
          </div>
        </div>

        <ul className="sx-cards">
          {services.map((s, i) => (
            <motion.li
              className="sx-card"
              key={s.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: duration.section, delay: (i % 4) * 0.06, ease }}
            >
              <div className="sx-card__top">
                <span className="sx-card__icon">
                  <ServiceIcon name={serviceIconMap[s.id]} />
                </span>
                <span className="sx-card__num">{s.number}</span>
              </div>
              <h3 className="sx-card__title">{s.title}</h3>
              <p className="sx-card__body">{s.summary}</p>
              <ArrowLink
                className="sx-card__link"
                href={`/contact?intent=${s.id}`}
                label={`Learn more about ${s.title}`}
              >
                Learn more
              </ArrowLink>
            </motion.li>
          ))}
        </ul>

        <div className="sx-tech">
          <p className="sx-tech__label">Technologies I work with</p>
          <ul className="sx-tech__list">
            {TECH.map((t) => (
              <li className="sx-tech__item" key={t.id}>
                <TechIcon id={t.id} label={t.label} className="sx-tech__icon" />
                <span>{t.label}</span>
              </li>
            ))}
            <li className="sx-tech__item sx-tech__item--more">
              <svg viewBox="0 0 24 24" className="sx-tech__icon" fill="currentColor" aria-hidden>
                {[6, 12, 18].flatMap((y) => [6, 12, 18].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.4" />))}
              </svg>
              <span>&amp; More</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg className="btn__arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  );
}
