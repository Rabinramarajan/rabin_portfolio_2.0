"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { hero } from "@/content/profile";
import { duration, ease } from "@/lib/motion";
import { Btn } from "@/components/ui";
import { Magnetic } from "@/components/motion";
import { useMotionTier } from "@/lib/motion-tier";

export function Hero() {
  const reduce = useReducedMotion();
  const { tier } = useMotionTier();
  const quiet = reduce || tier === "basic";
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* Scroll-linked depth — the reel drifts and dims as the hero leaves the viewport */
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const k = isDesktop ? 1 : 0.45;
  const reelY = useTransform(scrollYProgress, [0, 1], quiet ? [0, 0] : [0, 70 * k]);
  const reelScale = useTransform(scrollYProgress, [0, 1], quiet ? [1, 1] : [1, 1.08]);
  const copyY = useTransform(scrollYProgress, [0, 1], quiet ? [0, 0] : [0, -40 * k]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.8], quiet ? [1, 1] : [1, 0]);

  const t = (delay: number) => ({
    duration: reduce ? duration.micro : duration.section,
    delay: reduce ? 0 : delay,
    ease,
  });

  const lines = hero.displayLines ?? hero.headlineLines.map((text) => ({ text, accent: false }));
  const disciplines = hero.disciplines ?? [];
  const quote = hero.quote;

  return (
    <section id="hero" ref={sectionRef} className="chero" aria-labelledby="hero-heading">
      {/* --- full-bleed reel --- */}
      <div className="chero__stage" aria-hidden>
        {hero.reel ? (
          <motion.video
            className="chero__reel"
            style={{ y: reelY, scale: reelScale }}
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

      {/* --- editorial layer --- */}
      <motion.div className="shell chero__shell" style={{ y: copyY, opacity: copyOpacity }}>
        <div className="chero__copy">
          <h1 id="hero-heading" className="chero__title">
            {lines.map((line, i) => (
              <span className="chero__line" key={line.text}>
                <motion.span
                  className={line.accent ? "chero__word chero__word--accent" : "chero__word"}
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
              <Btn href={hero.primaryCta.href}>{hero.primaryCta.label}</Btn>
            </Magnetic>
            <Btn href={hero.secondaryCta.href} variant="line">
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
            <figcaption className="chero__signature">{quote.signature}</figcaption>
          </motion.figure>
        ) : null}
      </motion.div>

      <div className="chero__status" aria-hidden={false}>
        <span className="chero__pulse" aria-hidden /> {hero.availability}
      </div>
    </section>
  );
}
