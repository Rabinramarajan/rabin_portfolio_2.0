"use client";

import { motion, useReducedMotion } from "motion/react";
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

  const sectionRef = useRef<HTMLElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const t = (delay: number) => ({
    duration: reduce ? duration.micro : duration.section,
    delay: reduce ? 0 : delay,
    ease,
  });

  /* ── GSAP animations: entrance + scroll parallax + mouse parallax ── */
  useEffect(() => {
    if (typeof window === "undefined" || quiet) return;
    const hero = sectionRef.current;
    if (!hero) return;

    const { gsap } = require("gsap/dist/gsap");
    const { ScrollTrigger } = require("gsap/dist/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      /* ── Entrance timeline ── */
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // Phase 1: stage (background reel)
      tl.from(".chero__stage", {
        opacity: 0,
        duration: 1.0,
        ease: "power1.out",
      }, 0);

      // Phase 2: status badge
      tl.from(".chero__status", {
        opacity: 0,
        y: 10,
        duration: 0.5,
      }, 0.15);

      // Phase 3: title lines (mask reveal)
      const titleLines = hero.querySelectorAll(".chero__line");
      if (titleLines.length) {
        tl.from(titleLines, {
          y: "110%",
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
        }, 0.25);
      }

      // Phase 4: disciplines strip
      tl.from(".chero__disciplines", {
        opacity: 0,
        y: 12,
        duration: 0.55,
      }, 0.7);

      // Phase 5: lede / description
      tl.from(".chero__lede", {
        opacity: 0,
        y: 14,
        duration: 0.6,
      }, 0.82);

      // Phase 6: CTAs
      tl.from(".chero__actions", {
        opacity: 0,
        y: 14,
        duration: 0.55,
      }, 0.95);

      // Phase 7: pull-quote
      tl.from(".chero__quote", {
        opacity: 0,
        y: 18,
        duration: 0.6,
      }, 0.9);

      // Phase 8: scroll indicator
      if (scrollIndicatorRef.current) {
        tl.from(scrollIndicatorRef.current, {
          opacity: 0,
          y: -8,
          duration: 0.5,
        }, 1.25);
      }

      /* ── Scroll parallax depth planes ── */
      // Background (slowest drift + subtle scale)
      gsap.to(".chero__stage", {
        y: 80,
        scale: 1.06,
        opacity: 0.7,
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      // Content shell (counter-motion — drifts up slightly)
      gsap.to(".chero__shell", {
        y: -35,
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      // Haze layer (medium depth)
      gsap.to(".chero__haze", {
        y: 50,
        opacity: 0.3,
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      // Scroll indicator fade-out on scroll
      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          opacity: 0,
          y: 20,
          scrollTrigger: {
            trigger: hero,
            start: "5% top",
            end: "18% top",
            scrub: true,
          },
        });
      }
    }, hero);

    return () => ctx.revert();
  }, [quiet]);

  /* ── Mouse parallax (desktop fine-pointer only) ── */
  useEffect(() => {
    if (reduce || !isDesktop) return;
    const hero = sectionRef.current;
    if (!hero) return;

    const { gsap } = require("gsap/dist/gsap");

    let rafId: number;
    let mouseX = 0;
    let mouseY = 0;

    const onMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const tick = () => {
      // Background haze follows pointer (subtle)
      gsap.to(".chero__haze", {
        x: mouseX * 18,
        y: mouseY * 14,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto",
      });

      // Vignette gradient follows pointer (very subtle)
      const vg = hero.querySelector(".chero__vignette");
      if (vg) {
        const cx = 50 + mouseX * 12;
        const cy = 50 + mouseY * 12;
        (vg as HTMLElement).style.background =
          `radial-gradient(ellipse at ${cx}% ${cy}%, transparent 28%, rgb(10 10 12 / 55%) 100%)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, [reduce, isDesktop]);

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
