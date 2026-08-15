"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { projects } from "@/content/projects";
import { SectionKicker } from "@/components/ui";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { ImageReveal, TextReveal } from "@/components/motion";

export function WorkSection({ limit }: { limit?: number }) {
  const reduce = useReducedMotion();
  const list = limit ? projects.slice(0, limit) : projects;

  return (
    <section id="work" className="section">
      <div className="shell">
        <SectionKicker index="03" label="Selected Work" />

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduce ? duration.micro : duration.section, ease }}
        >
          <TextReveal lines={["Proof lives in", "the product."]} className="sec-title" as="h2" />
          <p className="sec-lede">
            Government platforms, member portals, and insurance consoles — the work that has to be right.
          </p>
        </motion.div>

        <div className="work-list">
          {list.map((p, i) => {
            const full = p.layout === "full";
            const flip = !full && i % 2 === 1;
            return (
              <motion.article
                key={p.slug}
                className={cn("work-item", flip && "work-item--flip", full && "work-item--full")}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: reduce ? duration.micro : duration.section, ease }}
              >
                <div className="work-item__media">
                  <ImageReveal parallax={20}>
                    <Image
                      src={p.cover.src}
                      alt={p.cover.alt}
                      width={p.cover.width}
                      height={p.cover.height}
                      sizes="(max-width: 900px) 100vw, 55vw"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  </ImageReveal>
                </div>
                <div>
                  <p className="work-item__num">{p.number}</p>
                  <h3 className="work-item__title">{p.title}</h3>
                  <div className="work-item__facts">
                    <span>{p.category}</span>
                    <span>{p.role}</span>
                    <span>{p.year}</span>
                  </div>
                  <p className="work-item__overview">{p.overview}</p>
                  <p className="work-item__tech">{p.technologies.slice(0, 5).join(" · ")}</p>
                  <Link
                    className="work-item__cta"
                    href={"/work/" + p.slug}
                    aria-label={"View case study: " + p.title}
                  >
                    Case study
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <path d="M2 8h11M9 4l4 4-4 4" />
                    </svg>
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

        {limit ? (
          <motion.div
            className="work-item__more"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduce ? duration.micro : duration.section, ease }}
          >
            <Link href="/work" className="btn btn--line">
              <span className="btn__label">
                View all work
                <svg viewBox="0 0 16 16" aria-hidden className="btn__arrow">
                  <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </span>
            </Link>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}