"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { careerLead, formatRoleDates, getCareerTimeline } from "@/content/experience";
import type { ExperienceRole } from "@/content/types";
import { profile } from "@/content/profile";
import { duration, ease } from "@/lib/motion";
import { Parallax } from "@/components/motion";
import { PageHero } from "./PageHero";
import { PageCta } from "./PageCta";
import { PageSectionHead } from "./PageSectionHead";

export function ExperiencePage() {
  const roles = getCareerTimeline();

  return (
    <>
      <PageHero
        index="04"
        label="Experience"
        title={["YEARS OF BUILDING,", "LEARNING AND", "SHIPPING."]}
        lede="A career in production frontend — from first builds in 2021 to consulting on AI-driven analytics products in 2026."
        meta={[
          { label: "Years", value: profile.yearsExperienceLabel + "+" },
          { label: "Countries", value: "3" },
          { label: "Users served", value: "10,000+" },
          { label: "Status", value: "Open to select projects" },
        ]}
      />

      <CareerTimeline roles={roles} />

      <PageCta
        kicker="04 / EXPERIENCE"
        headline={["THE NEXT CHAPTER", "IS STILL BEING", "BUILT."]}
        lede="The work is the argument. Let's make the next one count."
        actions={[
          { label: "View Selected Work", href: "/work", variant: "line" },
          { label: "Let's Work Together", href: "/contact" },
        ]}
      />
    </>
  );
}

function CareerTimeline({ roles }: { roles: ExperienceRole[] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.55"] });
  const fill = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), { stiffness: 80, damping: 24 });
  const current = roles.length - 1;

  return (
    <section className="pf-section xpp">
      <div className="shell">
        <PageSectionHead
          index="04"
          label="Career timeline"
          title="A career read as a timeline."
          lede="Chronological, from the first build to the current engagement. Each stage is real — no invented roles."
        />

        <ol className="xpp__timeline" ref={ref}>
          <div className="xpp__rail" aria-hidden>
            <motion.span className="xpp__fill" style={{ scaleY: reduce ? 1 : fill }} />
          </div>

          {/* foundation node before the first role */}
          <li className="xpp__lead">
            <Parallax speed={0.1} range={36} className="xpp__year-wrap">
              <p className="xpp__year">{careerLead.year}</p>
            </Parallax>
            <motion.span
              className="xpp__marker"
              aria-hidden
              initial={reduce ? false : { scale: 0.7 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: duration.ui, ease }}
            />
            <div className="xpp__cell">
              <p className="xpp__milestone">{careerLead.label}</p>
              <p className="xpp__note">{careerLead.note}</p>
            </div>
          </li>

          {roles.map((role, i) => {
            const isCurrent = i === current;
            return (
              <motion.li
                className="xpp__item"
                data-current={isCurrent ? "true" : undefined}
                key={role.id}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: reduce ? duration.micro : duration.section, delay: reduce ? 0 : i * 0.06, ease }}
              >
                <Parallax speed={0.1} range={36} className="xpp__year-wrap">
                  <p className="xpp__year">{role.start}</p>
                </Parallax>
                <motion.span
                  className="xpp__marker"
                  aria-hidden
                  initial={reduce ? false : { scale: 0.7 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: duration.ui, ease }}
                />
                <div className="xpp__cell">
                  {role.milestone ? <p className="xpp__milestone">{role.milestone}</p> : null}
                  <h3 className="xpp__role">
                    {role.role}
                    {isCurrent ? <span className="xpp__now">Current</span> : null}
                  </h3>
                  <p className="xpp__company">
                    {role.company} · {role.type}
                    <span className="xpp__loc"> · {role.location}</span>
                  </p>
                  <p className="xpp__period">{formatRoleDates(role)}</p>
                  <p className="xpp__desc">{role.description}</p>

                  {role.impact.length ? (
                    <div>
                      <p className="xpp__k">Impact</p>
                      <ul className="xpp__contribs">
                        {role.impact.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {role.responsibilities.length ? (
                    <div>
                      <p className="xpp__k">Key contributions</p>
                      <ul className="xpp__contribs">
                        {role.responsibilities.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <Parallax speed={0.16} range={30} className="xpp__tech-wrap">
                    <ul className="xpp__tech">
                      {role.technologies.map((t, j) => (
                        <motion.li
                          key={t}
                          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={{
                            duration: reduce ? duration.micro : 0.38,
                            delay: reduce ? 0 : 0.12 + j * 0.05,
                            ease,
                          }}
                        >
                          {t}
                        </motion.li>
                      ))}
                    </ul>
                  </Parallax>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}