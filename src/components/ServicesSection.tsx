"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { services } from "@/content/services";
import { SectionKicker } from "@/components/ui";
import { duration, ease } from "@/lib/motion";
import { Parallax, TimelineProgress } from "@/components/motion";

export function ServicesSection() {
  const reduce = useReducedMotion();

  const view = (delay = 0) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: reduce ? duration.micro : duration.section, delay: reduce ? 0 : delay, ease },
  });

  return (
    <section id="services" className="section">
      <div className="shell">
        <motion.div {...view(0)}>
          <SectionKicker index="02" label="Services" />
          <h2 className="sec-title">How I can help.</h2>
          <p className="sec-lede">
            Each service is part of a journey from problem to production.
          </p>
        </motion.div>

        <motion.div
          className="services__timeline"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <TimelineProgress className="services__timeline-rail" />
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              className="services__timeline-item"
              variants={
                !reduce
                  ? {
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }
                  : undefined
              }
              transition={{
                duration: reduce ? duration.micro : duration.section,
                delay: reduce ? 0 : idx * 0.04,
                ease,
              }}
            >
              <motion.span
                className="services__timeline-marker"
                aria-hidden
                initial={reduce ? false : { scale: 1, backgroundColor: "#0a0a0c" }}
                whileInView={{ scale: 1.25, backgroundColor: "#c9f24d" }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: duration.interaction, ease }}
              />
              <span className="services__timeline-num">{service.number}</span>
              <motion.h3
                className="services__timeline-title"
                initial={reduce ? false : { color: "var(--color-text-muted)" }}
                whileInView={{ color: "var(--color-text)" }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: duration.section, ease }}
              >
                {service.title}
              </motion.h3>
              <Parallax speed={0.06} range={44} className="services__timeline-body">
                <p className="services__timeline-desc">{service.proposition}</p>
                <div className="services__timeline-meta">
                  <span>{service.deliverables.join(" · ")}</span>
                  <span>{service.technologies.join(" · ")}</span>
                </div>
                <Link
                  href={`/contact?intent=${service.id}`}
                  className="services__timeline-cta"
                  aria-label={`Discuss ${service.title}`}
                >
                  Discuss {service.title}
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M2 8h11M9 4l4 4-4 4" />
                  </svg>
                </Link>
              </Parallax>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}