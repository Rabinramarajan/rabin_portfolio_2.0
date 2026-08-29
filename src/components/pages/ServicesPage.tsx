"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Monogram } from "@/components/Logo";
import { ServiceIcon } from "@/components/pages/ServiceIcons";
import { serviceHighlights, serviceStats, orbitLabels } from "@/content/service-highlights";
import { duration, ease, stagger } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import styles from "./services-page.module.css";

const RAIL_SECTIONS = [
  { id: "services", label: "Services" },
  { id: "approach", label: "Approach" },
  { id: "process", label: "Process" },
] as const;

/**
 * /services — a single, self-contained page: an orbit hero, the full offer
 * grid, and the credibility strip. Layout collapses from the three-up
 * desktop grid to wide rows on laptops and a stacked column on phones.
 */
export function ServicesPage() {
  const reduce = useReducedMotionSafe();
  const active = useActiveSection();

  return (
    <div className={styles.page}>
      <section className={styles.hero} id="services">
        <div className="shell">
          <div className={styles.heroGrid}>
            <div>
              <p className={styles.kicker}>
                <span>01</span>
                <span className={styles.kickerSlash}>/</span>
                <span className={styles.kickerLabel}>Services</span>
              </p>
              <motion.h1
                className={styles.title}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: duration.cinematic, ease }}
              >
                Digital solutions.
                <br />
                Engineered to <span className={styles.titleAccent}>perform.</span>
              </motion.h1>
              <p className={styles.lede}>
                I help businesses build fast, scalable and user-focused digital products that drive real impact.
              </p>
              <Link className={styles.cta} href="/contact">
                <span className={styles.ctaDot} aria-hidden />
                <span>Let&rsquo;s Work Together</span>
                <ArrowIcon className={styles.ctaArrow} />
              </Link>
            </div>

            <OrbitVisual />
          </div>
        </div>

        <nav className={styles.rail} aria-label="Sections">
          {RAIL_SECTIONS.map((s) => (
            <a
              key={s.id}
              className={styles.railItem}
              href={`#${s.id}`}
              data-active={active === s.id ? "true" : "false"}
            >
              {s.label}
            </a>
          ))}
        </nav>
      </section>

      <section className="pf-section" id="approach">
        <div className="shell">
          <p className={styles.sectionLabel}>
            <span>What I do</span>
            <span className={styles.sectionLabelDot} aria-hidden />
          </p>

          <ul className={styles.cards}>
            {serviceHighlights.map((s, i) => (
              <motion.li
                key={s.id}
                className={styles.card}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: duration.section, delay: i * stagger, ease }}
              >
                <p className={styles.cardNum}>{s.number}</p>
                <span className={styles.cardIcon} aria-hidden>
                  <HexFrame />
                  <ServiceIcon name={s.icon} className={styles.cardIconGlyph} />
                </span>
                <h2 className={styles.cardTitle}>{s.title}</h2>
                <p className={styles.cardDesc}>{s.description}</p>
                <ul className={styles.cardList}>
                  {s.capabilities.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <Link className={styles.cardLink} href={s.href}>
                  <span>Explore Service</span>
                  <ArrowIcon />
                </Link>
              </motion.li>
            ))}
          </ul>

          <ul className={styles.stats} id="process">
            {serviceStats.map((s) => (
              <li className={styles.stat} key={s.id}>
                <span className={styles.statIcon} aria-hidden>
                  <HexFrame />
                  <ServiceIcon name={s.icon} className={styles.cardIconGlyph} />
                </span>
                <span>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

/** Concentric radar rings with the brand mark at the centre. */
function OrbitVisual() {
  return (
    <div className={styles.orbit}>
      <svg className={styles.orbitRings} viewBox="0 0 200 200" aria-hidden focusable="false">
        <g className={styles.rotor}>
          <circle className={styles.ring} cx="100" cy="100" r="96" />
          <circle className={`${styles.ring} ${styles.ringDim}`} cx="100" cy="100" r="82" />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <circle
                key={i}
                className={styles.node}
                cx={100 + Math.cos(a) * 89}
                cy={100 + Math.sin(a) * 89}
                r={i % 3 === 0 ? 1.6 : 1}
              />
            );
          })}
        </g>
        <g className={styles.rotorReverse}>
          <circle className={styles.ring} cx="100" cy="100" r="66" />
          <circle className={`${styles.ring} ${styles.ringDim}`} cx="100" cy="100" r="52" />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2 + 0.3;
            return (
              <circle
                key={i}
                className={styles.node}
                cx={100 + Math.cos(a) * 59}
                cy={100 + Math.sin(a) * 59}
                r="1.3"
              />
            );
          })}
        </g>
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <line
              key={i}
              className={styles.spoke}
              x1={100 + Math.cos(a) * 34}
              y1={100 + Math.sin(a) * 34}
              x2={100 + Math.cos(a) * 96}
              y2={100 + Math.sin(a) * 96}
            />
          );
        })}
      </svg>

      <span className={styles.orbitCore} aria-hidden>
        <Monogram className={styles.orbitMark} />
      </span>

      {orbitLabels.map((label) => (
        <span className={styles.orbitLabel} key={label}>
          {label}
        </span>
      ))}
    </div>
  );
}

function HexFrame() {
  return (
    <svg className={styles.cardIconHex} viewBox="0 0 100 116" aria-hidden focusable="false">
      <path d="M50 2 96 29v58L50 114 4 87V29Z" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
      focusable="false"
    >
      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Highlights the rail entry for whichever section is nearest the viewport top. */
function useActiveSection() {
  const [active, setActive] = useState<string>(RAIL_SECTIONS[0].id);
  const ids = useRef(RAIL_SECTIONS.map((s) => s.id));

  useEffect(() => {
    const nodes = ids.current
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { threshold: [0.2, 0.5], rootMargin: "-20% 0px -50% 0px" },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return active;
}
