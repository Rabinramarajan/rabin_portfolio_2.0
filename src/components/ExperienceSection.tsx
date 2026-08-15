"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { experience } from "@/content/experience";
import { duration, ease } from "@/lib/motion";
import { SectionKicker } from "@/components/ui";
import { Parallax, TextReveal } from "@/components/motion";

export function ExperienceSection() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.65"] });
  const fill = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), { stiffness: 80, damping: 24 });

  return (
    <section id="experience" className="section xp">
      <div className="shell">
        <SectionKicker index="04" label="Experience" />
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{
            duration: reduce ? duration.micro : duration.section,
            ease,
          }}
        >
          <TextReveal lines={["A career, read", "as a timeline."]} className="sec-title" as="h2" />
          <p className="sec-lede">Experience structured chronologically. Technical depth and scope visible at a glance.</p>
        </motion.div>
        <ol className="xp__list" ref={ref}>
          <div className="xp__rail" aria-hidden>
            <motion.span className="xp__fill" style={{ scaleY: reduce ? 1 : fill }} />
          </div>
          {experience.map((role, i) => (
            <motion.li
              className="xp__item"
              key={role.id}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: reduce ? duration.micro : duration.section, delay: reduce ? 0 : i * 0.04, ease }}
            >
              <Parallax speed={i % 2 === 0 ? 0.08 : -0.08} range={40} className="xp__year-wrap">
                <p className="xp__year">{role.start}</p>
              </Parallax>
              <motion.span
                className="xp__marker"
                aria-hidden
                initial={reduce ? false : { scale: 0.7 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: duration.ui, ease }}
              />
              <div>
                <h3 className="xp__role">
                  {role.role}
                  {role.end === null ? <span className="xp__now">Current</span> : null}
                </h3>
                <p className="xp__company">
                  {role.company} · {role.type}
                  <span className="loc"> · {role.location}</span>
                </p>
                <p className="xp__desc">{role.description}</p>
                <ul className="xp__tech">
                  {role.technologies.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}