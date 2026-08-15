"use client";

import { motion, useReducedMotion } from "motion/react";
import { coreStack, skillGroups } from "@/content/skills";
import { SectionKicker } from "@/components/ui";
import { duration, ease } from "@/lib/motion";
import { TextReveal } from "@/components/motion";

export function SkillsSection() {
  const reduce = useReducedMotion();

  return (
    <section id="skills" className="section">
      <div className="shell">
        <SectionKicker index="05" label="Engineering Stack" />

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{
            duration: reduce ? duration.micro : duration.section,
            ease,
          }}
        >
          <TextReveal
            lines={["Angular first.", "The rest is the", "system around it."]}
            className="sec-title"
            as="h2"
          />
          <p className="sec-lede">Core expertise is named, not scored. The architecture below represents how I structure knowledge and deliver solutions.</p>
        </motion.div>

        {/* Core Stack - Foundation */}
        <motion.div
          className="sk-core-section"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{
            duration: reduce ? duration.micro : duration.section,
            delay: reduce ? 0 : 0.1,
            ease,
          }}
        >
          <p className="sk-section-label">Core</p>
          <div className="sk-core-row">
            {coreStack.map((item, i) => (
              <motion.div
                key={item}
                className="sk-core-item"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                  duration: reduce ? duration.micro : duration.section,
                  delay: reduce ? 0 : 0.15 + i * 0.05,
                  ease,
                }}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skill Categories - Organized by domain */}
        <motion.div
          className="sk-categories"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-5%" }}
          transition={{ staggerChildren: 0.08, delayChildren: 0.2 }}
        >
          {skillGroups.map((group) => (
            <motion.div
              key={group.id}
              className="sk-cat"
              variants={
                !reduce
                  ? {
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0 },
                    }
                  : undefined
              }
              transition={{
                duration: reduce ? duration.micro : duration.section,
                ease,
              }}
            >
              <p className="sk-cat__label">
                {group.label}
                {group.note ? <span className="sk-cat__note">{group.note}</span> : null}
              </p>
              <div className="sk-cat__items">
                {group.items.map((item) => (
                  <span key={item} className="sk-item">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
