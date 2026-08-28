"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { hero } from "@/content/profile";
import { duration, ease } from "@/lib/motion";
import { Btn } from "@/components/ui";
import { Magnetic } from "@/components/motion";

export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const t = (delay: number) => ({
    duration: reduce ? duration.micro : duration.section,
    delay: reduce ? 0 : delay,
    ease,
  });

  /* ── GSAP animations removed - all animations disabled via CSS ── */

  /* ── Mouse parallax removed - all animations disabled via CSS ── */

  const lines =
    hero.displayLines ??
    hero.headlineLines.map((text) => ({ text, accent: false }));
  const disciplines = hero.disciplines ?? [];
  const quote = hero.quote;

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="chero"
      aria-labelledby="hero-heading"
    >
      {/* ── full-bleed reel ── */}
      <div className="chero__stage" aria-hidden>
        {hero.reel ? (
          <video
            className="chero__reel"
            src={hero.reel.src}
            poster={hero.reel.poster}
            autoPlay={!reduce}
            loop
            muted
            playsInline
            preload="metadata"
            tabIndex={-1}
          />
        ) : null}
        <div className="chero__scrim" />
        <div className="chero__vignette" />
        <div className="chero__haze" />
        <div className="chero__blend" />
      </div>

      {/* ── editorial layer ── */}
      <div className="shell chero__shell">
        <div className="chero__copy">
          <motion.p
            className="chero__status"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(0.04)}
          >
            <span className="chero__pulse" aria-hidden />
            <span className="chero__status-label">{hero.availability}</span>
          </motion.p>

          <h1 id="hero-heading" className="chero__title">
            {lines.map((line, i) => (
              <span className="chero__line" key={line.text}>
                <motion.span
                  className={
                    line.accent
                      ? "chero__word chero__word--accent"
                      : "chero__word"
                  }
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: "0.5em" }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={t(0.08 + i * 0.09)}
                >
                  {line.text}
                </motion.span>
              </span>
            ))}
          </h1>

          {disciplines.length ? (
            <motion.p
              className="chero__disciplines"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t(0.42)}
            >
              {disciplines.map((item, i) => (
                <span key={item}>
                  {i > 0 ? <span className="chero__dot" aria-hidden /> : null}
                  {item}
                </span>
              ))}
            </motion.p>
          ) : null}

          <motion.p
            className="chero__lede"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(0.5)}
          >
            {hero.description}
          </motion.p>

          <motion.div
            className="chero__actions"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(0.58)}
          >
            <Magnetic strength={8}>
              <Btn href={hero.primaryCta.href} data-cursor="button" data-cursor-label="LET'S GO →">
                {hero.primaryCta.label}
              </Btn>
            </Magnetic>
            <Btn href={hero.secondaryCta.href} variant="line" data-cursor="link" data-cursor-label="VIEW WORK →">
              {hero.secondaryCta.label}
            </Btn>
          </motion.div>
        </div>

        {quote ? (
          <motion.figure
            className="chero__quote"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(0.7)}
          >
            <span className="chero__quote-mark" aria-hidden>
              &ldquo;
            </span>
            <blockquote>
              {quote.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </blockquote>
            <span className="chero__quote-rule" aria-hidden />
            <figcaption className="chero__signature">
              {quote.signature}
            </figcaption>
          </motion.figure>
        ) : null}
      </div>

      {/* ── scroll indicator ── */}
      <div className="chero__scroll" ref={scrollIndicatorRef} aria-hidden>
        <span className="chero__scroll-text">SCROLL</span>
        <span className="chero__scroll-line" />
      </div>
    </section>
  );
}
