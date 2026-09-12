"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useRef, type CSSProperties } from "react";
import { hero } from "@/content/profile";
import { duration, ease } from "@/lib/motion";
import { Btn } from "@/components/ui";
import { Magnetic } from "@/components/motion";
import { useHydrated } from "@/lib/useHydrated";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { gsap, useGSAP } from "@/lib/gsap";
import { ScrollVideoPlayer } from "@/components/ScrollVideoPlayer";
import { trackCtaClick } from "@/lib/analytics";

export function Hero() {
  const reduce = useReducedMotion();
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  /* The scrub is gated on prefers-reduced-motion alone.

     It used to also require the "full" motion tier, but that tier drops to
     "basic" on <=4 cores, <=2 GB, or a stored rr-motion-tier preference - so a
     stale localStorage value silently turned the hero into a static image with
     no way to tell why. A hero video is the point of the page; only an
     explicit reduced-motion request should switch it off.

     `reduce` is null during SSR and on the client's first render, so the
     initial render must assume the scrub and settle afterwards. */
  const hydrated = useHydrated();
  /* Phones do not scrub.

     The scrub buys its frames with scroll distance: a 240vh track that a
     100dvh hero sticks inside, so a phone reader spends ~1.4 screens of
     swiping on a pane that does not move on. And the frames they are paying
     that distance for largely never arrive — iOS Safari defers `currentTime`
     seeks on a multi-megabyte video until the touch scroll settles, so the
     reel lurches once at the end of each swipe. Both together read as the
     page being stuck. Below 768px the reel just plays: the hero is exactly
     one screen tall and the next section is one swipe away. */
  const phone = useMediaQuery("(max-width: 767px)");
  const scrub = hydrated ? !reduce && !phone : true;

  const t = (delay: number) => ({
    duration: reduce ? duration.micro : duration.section,
    delay: reduce ? 0 : delay,
    ease,
  });

  /* The reel itself is scrubbed by ScrollVideoPlayer. All that is left here
     is the hero-specific chrome: the SCROLL indicator fades out over the first
     stretch of the same track. */
  useGSAP(
    () => {
      if (!scrub) return;
      const tween = gsap.to(scrollIndicatorRef.current, {
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".chero-track",
          start: "top top",
          end: "12% top",
          scrub: true,
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { dependencies: [scrub], revertOnUpdate: true },
  );

  const lines =
    hero.displayLines ??
    hero.headlineLines.map((text) => ({ text, accent: false }));
  const disciplines = hero.disciplines ?? [];
  const quote = hero.quote;

  return (
    <ScrollVideoPlayer
      mode={scrub ? "scroll" : "autoplay"}
      src={hero.reel?.src ?? ""}
      poster={hero.reel?.poster}
      posterSrcSet={hero.reel?.posterSrcSet}
      posterSizes={hero.reel?.posterSizes}
      loop
      as="section"
      containerProps={{ id: "hero", "aria-labelledby": "hero-heading" }}
      trackClassName="chero-track"
      className={scrub ? "chero chero--scrub" : "chero"}
      mediaClassName="chero__stage"
      videoClassName="chero__reel"
      posterClassName="chero__reel"
      layers={
        <>
          <div className="chero__scrim" />
          <div className="chero__vignette" />
          <div className="chero__blend" />
        </>
      }
      overlay={
        <>
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
            {/* Plain spans on purpose. The headline is the LCP element, so its
                reveal is a CSS animation (see .chero__word) that runs on the
                server-rendered markup instead of waiting for hydration. */}
            {lines.map((line, i) => (
              <span className="chero__line" key={line.text}>
                <span
                  className={
                    line.accent
                      ? "chero__word chero__word--accent"
                      : "chero__word"
                  }
                  style={{ "--i": i } as CSSProperties}
                >
                  {line.text}
                </span>
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
              <Btn
                href={hero.primaryCta.href}
                data-cursor="button"
                data-cursor-label="LET'S GO →"
                onClick={() => trackCtaClick(hero.primaryCta.label, 'hero_primary')}
              >
                {hero.primaryCta.label}
              </Btn>
            </Magnetic>
            <Btn
              href={hero.secondaryCta.href}
              variant="line"
              data-cursor="link"
              data-cursor-label="VIEW WORK →"
              onClick={() => trackCtaClick(hero.secondaryCta.label, 'hero_secondary')}
            >
              {hero.secondaryCta.label}
            </Btn>
          </motion.div>

          {/* Recruiters and clients read the same hero. Everything above this
              line is written for the client funnel; this is the one-line exit
              to the résumé so a hiring manager does not have to work out
              which of five nav items is for them. */}
          {hero.recruiterCta ? (
            <motion.p
              className="chero__recruiter"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t(0.66)}
            >
              {hero.recruiterCta.label}{" "}
              <Link
                href={hero.recruiterCta.href}
                className="chero__recruiter-link"
                onClick={() => trackCtaClick(hero.recruiterCta!.linkLabel, "hero_recruiter")}
              >
                {hero.recruiterCta.linkLabel} →
              </Link>
            </motion.p>
          ) : null}
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
        </>
      }
    />
  );
}
