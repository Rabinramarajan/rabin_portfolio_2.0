"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { about } from "@/content/about";
import { profile } from "@/content/profile";
import { SectionKicker } from "@/components/ui";
import { duration, ease } from "@/lib/motion";
import { ImageReveal, TextReveal } from "@/components/motion";

export function AboutSection() {
  const reduce = useReducedMotion();

  const view = (delay = 0) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: reduce ? duration.micro : duration.section, delay: reduce ? 0 : delay, ease },
  });

  return (
    <section id="about" className="section">
      <div className="shell about__container">
        {/* Left: editorial copy */}
        <motion.article {...view(0)}>
          <SectionKicker index="01" label="About" />

          <TextReveal
            lines={about.headingLines ?? [about.heading]}
            className="sec-title about__heading"
            as="h2"
            delay={0.05}
          />

          <div className="about__paragraphs">
            {about.paragraphs.map((p, i) => (
              <p key={i}>
                {i === 0 ? (
                  <>
                    I am <strong>{profile.shortName} R</strong>. {p.replace("I am Rabin R, ", "")}
                  </>
                ) : (
                  p
                )}
              </p>
            ))}
          </div>

          <blockquote className="about__philosophy">{about.philosophy}</blockquote>

          <div className="about__cta">
            <p className="muted" style={{ maxWidth: "36rem", lineHeight: 1.6 }}>
              {about.workingStyle}
            </p>
          </div>

          <div className="about__milestones">
            {about.milestones.map((m, i) => (
              <motion.div
                className="about__milestone"
                key={m.year}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: reduce ? duration.micro : duration.section, delay: reduce ? 0 : i * 0.06, ease }}
              >
                <span className="about__milestone-year">{m.year}</span>
                <h3>{m.title}</h3>
                <p>{m.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.article>

        {/* Right: portrait */}
        <motion.div className="about__visual" {...view(0.12)}>
          <ImageReveal parallax={18}>
            <Image
              src={about.portrait.src}
              alt={about.portrait.alt}
              width={about.portrait.width}
              height={about.portrait.height}
              sizes="(max-width: 959px) 90vw, 40vw"
              priority
            />
          </ImageReveal>
          <p className="about__caption">
            <span className="acc">/_ RABIN R</span>
            <span>Chennai · India</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}