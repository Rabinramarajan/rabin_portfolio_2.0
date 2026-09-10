"use client";

import { motion, useReducedMotion } from "motion/react";
import { SectionKicker } from "@/components/ui";
import { TextReveal } from "@/components/motion";
import { duration, ease } from "@/lib/motion";
import { SmartImage } from "@/components/SmartImage";
import { CareerTimeline } from "@/components/experience/CareerTimeline";
import { StatPills } from "@/components/experience/StatPills";
import { accentIndex, journeyArt, sections, titleLines } from "@/content/sections";
import { profile } from "@/content/profile";
import { trackCtaClick } from "@/lib/analytics";

/**
 * JOURNEY — the career timeline, on the home page.
 *
 * The same components /experience uses, cut to the four most recent chapters
 * so the home page states the shape of the career without becoming the
 * experience page. Everything reads from `careerHorizon` and `about.metrics`,
 * so the two surfaces cannot drift apart.
 */
export function JourneySection() {
  const reduce = useReducedMotion();
  const intro = sections.journey;

  return (
    <section id="journey" className="section jsec" aria-labelledby="journey-heading">
      <div className="shell">
        <div className="jsec__intro xhero__grid">
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduce ? duration.micro : duration.section, ease }}
          >
            <SectionKicker index={intro.index} label={intro.label} />
            <div id="journey-heading">
              <TextReveal
                lines={titleLines(intro)}
                as="h2"
                className="sec-title"
                accentIndex={accentIndex(intro)}
              />
            </div>
            <p className="sec-lede">{intro.lede}</p>

            <StatPills className="xhero__stats--section" />
          </motion.div>

          <motion.div
            className="xhero__art jsec__art"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: reduce ? duration.micro : duration.cinematic, ease }}
          >
            <SmartImage
              {...journeyArt}
              sizes="(max-width: 899px) 100vw, 48vw"
              className="xhero__img"
            />
          </motion.div>
        </div>

        <CareerTimeline limit={4} />

        <motion.aside
          className="jsec__cta"
          aria-labelledby="journey-cta-heading"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduce ? duration.micro : duration.section, ease }}
        >
          <div className="jsec__cta-copy">
            <p className="jsec__cta-status">
              <span className="jsec__cta-dot" aria-hidden />
              {profile.availability.label}
            </p>
            <p className="jsec__cta-text" id="journey-cta-heading">
              Looking for someone who can{" "}
              <span className="jsec__cta-accent">ship production software</span>?
            </p>
            <dl className="jsec__cta-meta">
              <div className="jsec__cta-meta-item">
                <dt>Based in</dt>
                <dd>{profile.locationShort}</dd>
              </div>
              <div className="jsec__cta-meta-item">
                <dt>Reply time</dt>
                <dd>{profile.availability.responseTime.replace('Usually responds ', '')}</dd>
              </div>
              <div className="jsec__cta-meta-item">
                <dt>Focus</dt>
                <dd>{profile.focus}</dd>
              </div>
            </dl>
          </div>

          <div className="jsec__cta-actions">
            <a
              href="/contact"
              className="jsec__cta-link"
              onClick={() => trackCtaClick("Let's Talk", 'experience_section')}
            >
              Let&apos;s Talk
              <svg viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
                <path d="M0 6h17M12.5 1.5 17 6l-4.5 4.5" />
              </svg>
            </a>
            <a
              href={profile.resumePath}
              className="jsec__cta-alt"
              onClick={() => trackCtaClick('View Resume', 'experience_section')}
            >
              View résumé
            </a>
            <a href={`mailto:${profile.email}`} className="jsec__cta-mail">
              {profile.email}
            </a>
          </div>
        </motion.aside>

      </div>
    </section>
  );
}
