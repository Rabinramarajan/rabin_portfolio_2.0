"use client";

/**
 * SectionTransitions — Premium scroll-linked transitions between sections.
 *
 * Non-rendering component (like the existing *MotionEnhancer pattern).
 * Creates GSAP ScrollTrigger animations that produce visual handoffs:
 *   Hero ↘ Services ↘ Work ↘ Journey ↘ Skills ↘ Process ↘ FAQ ↘ Footer
 *
 * Each transition uses a clip-path reveal + opacity lift on the incoming
 * section while the outgoing section fades subtly. Sections with their
 * own dedicated enhancers (Work, Process) get a lighter touch to avoid
 * double-controlling the same properties.
 */

import { useEffect } from "react";
import { prefersReducedMotion } from "@/motion/gsap-context";

/* ── Transition descriptors ────────────────────────────────────────── */

interface Transition {
  /** CSS selector for the section that is *entering* */
  selector: string;
  /** Sections with their own GSAP enhancer get a lighter touch */
  hasOwnAnimation?: boolean;
}

const TRANSITIONS: Transition[] = [
  { selector: "#services" },
  { selector: "#work" },
  { selector: "#journey", hasOwnAnimation: true },
  { selector: "#skills" },
  { selector: "#process", hasOwnAnimation: true },
  { selector: "#faq" },
];

/* ── Accent-line colour injected between sections ──────────────────── */

const ACCENT_LINE_CSS = /* css */ `
  .st-line {
    position: absolute;
    left: 50%;
    top: 0;
    width: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
    transform: translateX(-50%);
    z-index: 1;
    pointer-events: none;
  }
`;

/* ── Component ─────────────────────────────────────────────────────── */

export function SectionTransitions() {
  const reduce = prefersReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined" || reduce) return;

    const { gsap } = require("gsap/dist/gsap");
    const { ScrollTrigger } = require("gsap/dist/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);

    // Inject accent-line CSS once
    if (!document.getElementById("st-accent-css")) {
      const style = document.createElement("style");
      style.id = "st-accent-css";
      style.textContent = ACCENT_LINE_CSS;
      document.head.appendChild(style);
    }

    const ctx = gsap.context(() => {
      /* ── Hero outgoing: fades + lifts as the hero scrolls away ── */
      const hero = document.querySelector("#hero");
      if (hero) {
        gsap.fromTo(
          hero,
          { opacity: 1, y: 0 },
          {
            opacity: 0.15,
            y: -40,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "85% top",
              scrub: 0.4,
            },
          },
        );
      }

      /* ── Per-section transitions ── */
      for (const { selector, hasOwnAnimation } of TRANSITIONS) {
        const el = document.querySelector(selector);
        if (!el) continue;

        // Accent divider line
        const line = document.createElement("div");
        line.className = "st-line";
        (el as HTMLElement).style.position = "relative";
        el.prepend(line);

        gsap.fromTo(
          line,
          { width: 0 },
          {
            width: "38%",
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              end: "top 60%",
              scrub: 0.3,
            },
          },
        );

        if (hasOwnAnimation) {
          // Lighter touch — section already animates internally
          gsap.fromTo(
            el,
            { opacity: 0.4, y: 30 },
            {
              opacity: 1,
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top 95%",
                end: "top 35%",
                scrub: 0.35,
              },
            },
          );
        } else {
          // Clip-path reveal for sections without their own enhancer
          gsap.fromTo(
            el,
            { clipPath: "inset(8% 0% 0% 0%)", opacity: 0, y: 40 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              opacity: 1,
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top 95%",
                end: "top 30%",
                scrub: 0.35,
              },
            },
          );
        }
      }

      /* ── Footer incoming ── */
      const footer = document.querySelector(".ft");
      if (footer) {
        gsap.fromTo(
          footer,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: footer,
              start: "top 95%",
              end: "top 70%",
              scrub: true,
            },
          },
        );
      }
    });

    return () => ctx.revert();
  }, [reduce]);

  return null;
}
