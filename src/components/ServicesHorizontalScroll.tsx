"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { serviceOfferings } from "@/content/serviceOfferings";
import { ServiceIcon } from "@/components/pages/ServiceIcons";
import { useMotionTier } from "@/lib/motion-tier";
import { gsap, useGSAP } from "@/lib/gsap";
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
          const distance = () =>
            Math.max(0, track.scrollWidth - viewport.clientWidth);

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

          return () => {
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
      <div className={styles.eyebrow}>
        <span className={styles.eyebrowRule} aria-hidden />
        <Heading className={styles.eyebrowText} id={`${id}-rail-label`}>
          Services
        </Heading>
      </div>

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

      <div className={styles.progressRail} aria-hidden>
        <div ref={progressRef} className={styles.progressBar} />
      </div>

      <p className={styles.counter} aria-hidden>
        <span className={styles.counterCurrent}>{pad(activeIndex + 1)}</span>
        <span>/</span>
        <span>{pad(total)}</span>
      </p>
    </section>
  );
}

export default ServicesHorizontalScroll;
