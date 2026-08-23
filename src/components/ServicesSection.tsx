"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { serviceOfferings } from "@/content/serviceOfferings";
import { Monogram } from "@/components/Logo";
import { ServiceIcon } from "@/components/pages/ServiceIcons";
import { duration, ease } from "@/lib/motion";
import { SectionKicker, itemHeadingLevel } from "@/components/ui";
import { sections } from "@/content/sections";

/**
 * Services — emblem + statement header and an eight-card offer grid. Cards are
 * driven by `serviceOfferings`; the long-form `services` data still backs the
 * /services journey and the JSON-LD graph.
 *
 * `headingLevel` drops to h2 when the block sits below another hero (home
 * page) so the document keeps exactly one h1.
 */
export function ServicesSection({
  id = "services",
  headingLevel = "h2",
  index,
}: {
  id?: string;
  headingLevel?: "h1" | "h2";
  index?: string;
} = {}) {
  const Heading = headingLevel;
  const ItemHeading = itemHeadingLevel(headingLevel);
  const isPageHero = headingLevel === "h1";
  const intro = sections.services;

  return (
    <section id={id} className={isPageHero ? "svx svx--page" : "svx"}>
      <div className="shell">
        <header className="svx__head">
          <div className="svx__emblem" aria-hidden>
            <span className="svx__emblem-ring svx__emblem-ring--outer" />
            <span className="svx__emblem-ring svx__emblem-ring--mid" />
            <span className="svx__emblem-core">
              <Monogram className="svx__emblem-mark" />
            </span>
          </div>

          <div className="svx__intro">
            <SectionKicker index={index ?? intro.index} label={intro.label} />
            <Heading className="svx__title">
              {intro.title.map((line, i) => (
                <span key={line.text}>
                  {line.newline ? <br /> : i > 0 ? " " : null}
                  {line.accent ? <span className="svx__title-accent">{line.text}</span> : line.text}
                </span>
              ))}
            </Heading>
            <span className="svx__title-rule" aria-hidden />
          </div>

          <div className="svx__aside">
            <span className="svx__aside-rule" aria-hidden />
            <div>
              <p className="svx__lede">{intro.lede}</p>
              <Link className="svx__cta" href="/#contact">
                <span>Let&rsquo;s Build Something Great</span>
                <span className="svx__cta-arrow" aria-hidden>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          <div className="svx__art" aria-hidden>
            <HeaderArt />
          </div>
        </header>

        <ul className="svx__cards">
          {serviceOfferings.map((s, i) => (
            <motion.li
              className="svx__card"
              key={s.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: duration.section, delay: (i % 4) * 0.06, ease }}
            >
              <span className="svx__card-edge" aria-hidden />
              <span className="svx__card-num">{s.number}</span>

              <div className="svx__card-head">
                <span className="svx__card-icon" aria-hidden>
                  <span className="svx__card-icon-ring" />
                  <ServiceIcon name={s.icon} />
                </span>
                <div className="svx__card-copy">
                  <ItemHeading className="svx__card-title">{s.title}</ItemHeading>
                  <p className="svx__card-body">{s.description}</p>
                </div>
              </div>

              <ul className="svx__chips">
                {s.stack.map((t) => (
                  <li className="svx__chip" key={t}>
                    {t}
                  </li>
                ))}
              </ul>

              <Link className="svx__card-link" href={s.href} aria-label={`Explore ${s.title}`}>
                <span>Explore Service</span>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M2 8h11M9 4l4 4-4 4" />
                </svg>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Orbiting code-window mark that closes the header row on wide screens. */
function HeaderArt() {
  return (
    <svg viewBox="0 0 320 220" fill="none" className="svx__art-svg">
      <g stroke="currentColor" opacity="0.35">
        <ellipse cx="160" cy="110" rx="150" ry="62" transform="rotate(-18 160 110)" strokeWidth="1" />
        <ellipse cx="160" cy="110" rx="128" ry="46" transform="rotate(-18 160 110)" strokeWidth="0.7" opacity="0.6" />
      </g>
      <rect x="120" y="42" width="150" height="96" rx="12" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <rect x="104" y="60" width="150" height="96" rx="12" stroke="currentColor" strokeWidth="1" opacity="0.7" />
      <rect x="104" y="60" width="150" height="96" rx="12" fill="currentColor" opacity="0.05" />
      <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5">
        <path d="M118 78h16M118 88h28M118 98h20M118 108h24" />
      </g>
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M196 96l-8 8 8 8M218 96l8 8-8 8M210 92l-6 24" />
      </g>
      <g fill="currentColor">
        <circle cx="20" cy="150" r="2.5" />
        <circle cx="298" cy="66" r="2.5" />
        <circle cx="286" cy="176" r="2" opacity="0.6" />
      </g>
    </svg>
  );
}
