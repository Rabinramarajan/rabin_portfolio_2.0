"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { hero, profile } from "@/content/profile";
import { duration, ease } from "@/lib/motion";
import { Btn } from "@/components/ui";
import { Magnetic, useMouseParallax } from "@/components/motion";
import { useMotionTier } from "@/lib/motion-tier";
import { SmartImage } from "@/components/SmartImage";

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

  /* Scroll-linked depth — the visual recedes as the hero leaves the viewport */
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const k = isDesktop ? 1 : 0.4;
  const portraitScroll = useTransform(scrollYProgress, [0, 1], quiet ? [0, 0] : [0, -34 * k]);
  const gridScroll = useTransform(scrollYProgress, [0, 1], quiet ? [0, 0] : [0, -14 * k]);
  const uiScroll = useTransform(scrollYProgress, [0, 1], quiet ? [0, 0] : [0, -20 * k]);

  /* Desktop-only mouse parallax across the visual's layers */
  const { sx, sy, handlers } = useMouseParallax({ strength: 6 });
  const portraitX = useTransform(sx, (v) => v * 2);
  const portraitY = useTransform([portraitScroll, sy], (latest) => Number(latest[0]) + Number(latest[1]) * 2);
  const gridX = useTransform(sx, (v) => v * 4);
  const gridY = useTransform([gridScroll, sy], (latest) => Number(latest[0]) + Number(latest[1]) * 4);
  const uiX = useTransform(sx, (v) => v * 6);
  const uiY = useTransform([uiScroll, sy], (latest) => Number(latest[0]) + Number(latest[1]) * 6);
  const metaX = useTransform(sx, (v) => v * 8);
  const metaY = useTransform([uiScroll, sy], (latest) => Number(latest[0]) + Number(latest[1]) * 5);

  const t = (delay: number) => ({
    duration: reduce ? duration.micro : duration.section,
    delay: reduce ? 0 : delay,
    ease,
  });

  const headline = hero.headlineLines;

  return (
    <section id="hero" ref={sectionRef} className="hero" aria-labelledby="hero-heading">
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
                  <span className={i === headline.length - 1 ? "hl hl--accent" : "hl"} style={{ display: "block" }}>
                    {line}
                  </span>
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
              <Magnetic strength={8}>
                <Btn href={hero.primaryCta.href}>{hero.primaryCta.label}</Btn>
              </Magnetic>
              <Btn href={hero.secondaryCta.href} variant="line">
                {hero.secondaryCta.label}
              </Btn>
            </motion.div>
          </div>

          {/* RIGHT — premium visual with layered parallax */}
          <motion.div className="hero-visual" {...handlers}>
            <div className="hero-visual__frame">
              <div className="hero-visual__media">
                <motion.div className="hero-visual__portrait" style={{ x: portraitX, y: portraitY }}>
                  <SmartImage
                    src={hero.portrait.src}
                    alt={hero.portrait.alt}
                    width={hero.portrait.width}
                    height={hero.portrait.height}
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 1024px) min(82vw, 380px), 30vw"
                  />
                </motion.div>
                <motion.div className="hero-visual__grid-overlay" style={{ x: gridX, y: gridY }} />
                <motion.span className="hero-visual__tag" style={{ x: uiX, y: uiY }}>
                  {hero.role.split(" ")[0].toUpperCase()}
                </motion.span>
                <motion.div className="hero-visual__meta" style={{ x: metaX, y: metaY }}>
                  <span className="muted">{hero.role}</span>
                  <span className="hero-visual__line" />
                  <span>{profile.focus}</span>
                </motion.div>
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