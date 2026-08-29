"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { serviceOfferings } from "@/content/serviceOfferings";
import { ServiceIcon } from "@/components/pages/ServiceIcons";
import { useMotionTier } from "@/lib/motion-tier";
import { SectionKicker } from "@/components/ui";
import { sections } from "@/content/sections";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import styles from "./services-horizontal-scroll.module.css";

const total = serviceOfferings.length;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Services as a pinned horizontal rail — the eight `serviceOfferings` cards
 * translated on X while the section holds the viewport.
 *
 * The pin only exists on the "full" motion tier at ≥768px. On the "basic"
 * tier (reduced-motion, low-memory or low-core devices, or a manual toggle)
 * and on phones no ScrollTrigger is created at all: CSS falls back to a
 * native swipe rail, and reduced-motion to a plain wrapped grid.
 */
export function ServicesHorizontalScroll({
  id = "services",
  headingLevel = "h2",
}: {
  id?: string;
  headingLevel?: "h1" | "h2";
} = {}) {
  const Heading = headingLevel;
  const intro = sections.services;
  const pinWrapperRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLUListElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { tier } = useMotionTier();

  useGSAP(
    () => {
      const track = trackRef.current;
      const wrapper = pinWrapperRef.current;
      const viewport = viewportRef.current;
      if (!track || !wrapper || !viewport || tier !== "full") return;

      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          /* Measured against the clipping viewport, not window.innerWidth:
             above 1400px the viewport is inset to clear the fixed sidebar, so
             innerWidth would overshoot and park the last card off-screen.

             Read as a function, not a captured const — `invalidateOnRefresh`
             re-evaluates x and end on every refresh, so a resize or a late
             font load recomputes the travel instead of leaving the rail
             short. */
          /* scrollWidth is unreliable here: several engines drop a flex
             container's trailing `padding-inline` from it, which parks the
             last card flush against the clip edge (and, above 1400px, under
             the fixed sidebar) instead of resting on the same `--edge` gutter
             card 01 starts from. Measuring the last card's own right edge and
             adding the gutter back makes the end state symmetric with the
             start by construction. */
          const distance = () => {
            const last = track.lastElementChild as HTMLElement | null;
            if (!last) return 0;
            const gutter = parseFloat(
              getComputedStyle(track).paddingInlineEnd || "0",
            );
            const railEnd = last.offsetLeft + last.offsetWidth + gutter;
            return Math.max(0, railEnd - viewport.clientWidth);
          };

          const tween = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: wrapper,
              pin: true,
              scrub: 1,
              start: "top top",
              end: () => `+=${distance()}`,
              invalidateOnRefresh: true,
              anticipatePin: 1,
              onUpdate: (self) => {
                setActiveIndex(Math.round(self.progress * (total - 1)));
                /* The bar is written directly rather than through state — it
                   moves every frame and would otherwise re-render the tree. */
                if (progressRef.current) {
                  gsap.set(progressRef.current, { scaleX: self.progress });
                }
              },
            },
          });

          /* The pin's start position depends on the height of everything
             above it, and its travel on the track's laid-out width. Both
             settle *after* this effect runs: web fonts swap in, the scroll
             video's poster resolves, and ScrollVideoPlayer builds its own
             trigger on `loadedmetadata`. Without a refresh the rail keeps
             stale measurements and unpins mid-section — the intermittent
             failure. `invalidateOnRefresh` above makes each refresh recompute
             x and end, so all this has to do is ask for one.

             rAF-coalesced: a font swap plus a resize in the same frame is one
             refresh, not two. */
          let queued = 0;
          const refresh = () => {
            if (queued) return;
            queued = requestAnimationFrame(() => {
              queued = 0;
              ScrollTrigger.refresh();
            });
          };

          /* Fires when the track is re-laid-out (font swap, card reflow) and
             when the viewport resizes, which also covers the mobile URL-bar
             height change that ScrollTrigger's own resize handler ignores. */
          const observer = new ResizeObserver(refresh);
          observer.observe(track);
          observer.observe(viewport);

          document.fonts?.ready.then(refresh).catch(() => {});
          window.addEventListener("load", refresh);

          return () => {
            observer.disconnect();
            window.removeEventListener("load", refresh);
            if (queued) cancelAnimationFrame(queued);
            tween.scrollTrigger?.kill();
            tween.kill();
          };
        },
      );

      return () => mm.revert();
    },
    { scope: pinWrapperRef, dependencies: [tier] },
  );

  return (
    <section
      ref={pinWrapperRef}
      id={id}
      className={styles.pin}
      aria-labelledby={`${id}-rail-label`}
    >
      <header className={styles.head}>
        <SectionKicker index={intro.index} label={intro.label} className={styles.kicker} />

        {/* Same run-based title as the work block: each run is a span, an
            `accent` run takes the accent colour and a `newline` run starts a
            visual line, so the break lives in the copy rather than here. */}
        <Heading className={styles.title} id={`${id}-rail-label`}>
          {intro.title.map((line, i) => (
            <span key={line.text}>
              {line.newline ? <br /> : i > 0 ? " " : null}
              {line.accent ? (
                <span className={styles.titleAccent}>{line.text}</span>
              ) : (
                line.text
              )}
            </span>
          ))}
        </Heading>

        <p className={styles.lede}>{intro.lede}</p>
      </header>

      <div ref={viewportRef} className={styles.viewport}>
        <ul ref={trackRef} className={styles.track}>
          {serviceOfferings.map((service) => (
            <li key={service.id} className={styles.cardItem}>
              <Link href={service.href} className={styles.card}>
                <span className={styles.cardIndex} aria-hidden>
                  {service.number}
                </span>
                <span className={styles.cardIcon} aria-hidden>
                  <ServiceIcon name={service.icon} />
                </span>
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.cardDescription}>{service.description}</p>
                <span className={styles.cardStack}>
                  {service.stack.map((item) => (
                    <span key={item} className={styles.cardChip}>
                      {item}
                    </span>
                  ))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.foot}>
        <div className={styles.progressRail} aria-hidden>
          <div ref={progressRef} className={styles.progressBar} />
        </div>

        <p className={styles.counter} aria-hidden>
          <span className={styles.counterCurrent}>{pad(activeIndex + 1)}</span>
          <span>/</span>
          <span>{pad(total)}</span>
        </p>
      </div>
    </section>
  );
}

export default ServicesHorizontalScroll;
