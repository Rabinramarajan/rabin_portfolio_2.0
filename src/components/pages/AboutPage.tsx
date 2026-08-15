"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { about } from "@/content/about";
import { profile } from "@/content/profile";
import { duration, ease } from "@/lib/motion";
import { ImageReveal, Reveal, TextReveal } from "@/components/motion";
import { PageHero } from "./PageHero";
import { PageCta } from "./PageCta";
import { PageSectionHead } from "./PageSectionHead";
import { ArrowLink } from "./ArrowLink";

export function AboutPage() {
  const reduce = useReducedMotion();

  return (
    <>
      <PageHero
        index="01"
        label="About"
        title={about.hero.headline}
        lede={about.hero.statement}
        visual={<AboutPortrait />}
        meta={[
          { label: "Role", value: profile.headlineRole },
          { label: "Location", value: profile.locationShort },
          { label: "Experience", value: profile.yearsExperienceLabel + " years" },
          { label: "Focus", value: profile.focus },
        ]}
      />

      <AboutPath reduce={reduce} />
      <AboutPhilosophy />
      <AboutCapabilities />
      <AboutQuote reduce={reduce} />

      <PageCta
        kicker="01 / ABOUT"
        headline={about.cta.headline}
        lede="Every project starts as a conversation about what the product has to be."
        actions={[{ label: about.cta.label, href: about.cta.href }]}
      />
    </>
  );
}

function AboutPortrait() {
  return (
    <div className="abt-hero__portrait-wrap">
      <ImageReveal parallax={12}>
        <Image
          src={about.portrait.src}
          alt={about.portrait.alt}
          width={about.portrait.width}
          height={about.portrait.height}
          sizes="(max-width: 959px) 92vw, 40vw"
          priority
        />
      </ImageReveal>
      <p className="abt-hero__portrait-cap">
        <span className="acc">/_ Rabin R</span>
        <span>Chennai · India</span>
      </p>
    </div>
  );
}

function AboutPath({ reduce }: { reduce: boolean | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.5"] });
  const fill = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), { stiffness: 80, damping: 26 });

  return (
    <section className="pf-section abt-path">
      <div className="shell">
        <PageSectionHead index="01" label="The path" title="The engineer behind the interface." />
      </div>

      <div className="shell" ref={ref}>
        {/* Desktop — horizontal editorial timeline */}
        <div className="abt-path__desktop">
          <div className="abt-path__rail" aria-hidden>
            <motion.span className="abt-path__fill" style={{ scaleX: reduce ? 1 : fill }} />
          </div>
          <div className="abt-path__stops">
            {about.milestones.map((m, i) => (
              <motion.div
                className="abt-path__stop"
                key={m.year}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: reduce ? duration.micro : duration.section, delay: reduce ? 0 : i * 0.08, ease }}
              >
                <p className="abt-path__year">{m.year}</p>
                <h3 className="abt-path__title">{m.title}</h3>
                <p className="abt-path__body">{m.body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile — vertical timeline */}
        <div className="abt-path__mobile">
          {about.milestones.map((m, i) => (
            <motion.div
              className="abt-path__m-row"
              key={m.year}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: reduce ? duration.micro : duration.section, delay: reduce ? 0 : i * 0.05, ease }}
            >
              <div className="abt-path__m-rail" aria-hidden>
                <span className="abt-path__m-marker" />
                <motion.span
                  className="abt-path__m-fill"
                  initial={reduce ? { opacity: 1 } : { scaleY: 0 }}
                  whileInView={reduce ? { opacity: 1 } : { scaleY: 1 }}
                  viewport={{ once: true, margin: "-20% 0px -40% 0px" }}
                  transition={{ duration: reduce ? duration.micro : 0.9, ease }}
                />
              </div>
              <div className="abt-path__m-body">
                <p className="abt-path__m-year">{m.year}</p>
                <h3 className="abt-path__m-title">{m.title}</h3>
                <p className="abt-path__m-body-copy">{m.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutPhilosophy() {
  return (
    <section className="pf-section">
      <div className="shell">
        <PageSectionHead index="02" label="How I think" lede="Four principles that decide most of the calls I make on a product." />
        <div className="abt-ph">
          {about.principles.map((p, i) => (
            <Reveal key={p.id} y={16} className="abt-ph__row">
              <p className="abt-ph__num">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="abt-ph__title">{p.title}</h3>
              <p className="abt-ph__body">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutCapabilities() {
  return (
    <section className="pf-section">
      <div className="shell">
        <PageSectionHead index="03" label="What I build" lede="The kinds of work I take on, end to end." />
        <div className="abt-cap">
          <div className="abt-cap__rows">
            {about.capabilities.map((c, i) => (
              <Reveal key={c.number} y={14} delay={i * 0.04} className="abt-cap__row">
                <p className="abt-cap__num">{c.number}</p>
                <h3 className="abt-cap__title">{c.title}</h3>
                <p className="abt-cap__desc">{c.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutQuote({ reduce }: { reduce: boolean | null }) {
  return (
    <section className="abt-quote">
      <div className="shell">
        <TextReveal lines={about.quote} as="p" className="abt-quote__text" lineDuration={reduce ? duration.micro : duration.cinematic} />
        <p className="abt-quote__cap">A principle, not a tagline</p>
      </div>
      <div className="shell abt-quote__links">
        <ArrowLink href="/work" label="View selected work">
          View Selected Work
        </ArrowLink>
      </div>
    </section>
  );
}