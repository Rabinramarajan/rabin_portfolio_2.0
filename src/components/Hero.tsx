"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { hero, profile } from "@/content/profile";
import { duration, ease } from "@/lib/motion";
import { Btn } from "@/components/ui";

export function Hero() {
  const reduce = useReducedMotion();

  const t = (delay: number) => ({
    duration: reduce ? duration.micro : duration.section,
    delay: reduce ? 0 : delay,
    ease,
  });

  const headline = hero.headlineLines;

  return (
    <section id="hero" className="hero" aria-labelledby="hero-heading">
      <div className="shell">
        <div className="hero__grid">
          {/* LEFT — editorial column */}
          <div>
            <motion.p
              className="hero__status"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t(0.05)}
            >
              <span className="hero__pulse" aria-hidden /> {hero.availability}
            </motion.p>

            <motion.p
              className="hero__brand"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t(0.14)}
            >
              {hero.name} — {hero.role}
            </motion.p>

            <h1 id="hero-heading" className="hero__heading">
              {headline.map((line, i) => (
                <span className="hero__line" key={line}>
                  <motion.span
                    className={i === headline.length - 1 ? "hl hl--accent" : "hl"}
                    style={{ display: "block" }}
                    initial={reduce ? { opacity: 0 } : { y: "112%", opacity: 0.4 }}
                    animate={{ y: "0%", opacity: 1 }}
                    transition={{
                      duration: reduce ? duration.micro : duration.cinematic,
                      delay: reduce ? 0 : 0.2 + i * 0.09,
                      ease,
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              className="hero__lede"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t(0.52)}
            >
              {hero.description}
            </motion.p>

            <motion.div
              className="hero__actions"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t(0.62)}
            >
              <Btn href={hero.primaryCta.href}>{hero.primaryCta.label}</Btn>
              <Btn href={hero.secondaryCta.href} variant="line">
                {hero.secondaryCta.label}
              </Btn>
            </motion.div>
          </div>

          {/* RIGHT — premium visual */}
          <motion.div
            className="hero-visual"
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(12% 6% 12% 6% round 16px)", opacity: 0 }}
            animate={{ clipPath: "inset(0% 0% 0% 0% round 16px)", opacity: 1 }}
            transition={{
              duration: reduce ? duration.micro : duration.cinematic,
              delay: reduce ? 0 : 0.34,
              ease,
            }}
          >
            <div className="hero-visual__frame">
              <div className="hero-visual__media">
                <Image
                  src={hero.portrait.src}
                  alt={hero.portrait.alt}
                  width={960}
                  height={1200}
                  priority
                  sizes="(max-width: 1024px) min(82vw, 380px), 30vw"
                />
                <div className="hero-visual__grid-overlay" aria-hidden />
                <span className="hero-visual__tag" aria-hidden>
                  {hero.role.split(" ")[0].toUpperCase()}
                </span>
                <div className="hero-visual__meta" aria-hidden>
                  <span className="muted">{hero.role}</span>
                  <span className="hero-visual__line" />
                  <span>{profile.focus}</span>
                </div>
              </div>
            </div>
            <div className="hero-visual__caption" aria-hidden>
              <span>{profile.focus}</span>
              <span>EST. 2021</span>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM — technical metadata */}
        <motion.dl
          className="hero__meta"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(0.8)}
        >
          {hero.metadata.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}