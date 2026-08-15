"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { serviceChapters } from "@/content/serviceChapters";
import { SectionKicker } from "@/components/ui";
import { TextReveal } from "@/components/motion";
import { duration, ease } from "@/lib/motion";
import type { ServiceChapterVisual } from "@/content/types";

const STAGES = ["PROBLEM", "EXPERIENCE", "APPLICATION", "API", "DATA", "SYSTEM", "PRODUCTION"];

export function ServicesSection() {
  const reduce = !!useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const routeProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 22, restDelta: 0.001 });

  useEffect(() => {
    const observers = chapterRefs.current.map((el, idx) => {
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(idx);
        },
        { threshold: 0.5, rootMargin: "-15% 0px -35% 0px" }
      );
      observer.observe(el);
      return observer;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <section id="services" className="section svc2" ref={containerRef}>
      <div className="shell">
        {/* --- opening --- */}
        <div className="svc2__head">
          <div>
            <SectionKicker index="02" label="Services" />
            <h2 className="sec-title">How I can help.</h2>
            <p className="sec-lede">
              From interface to infrastructure — I build digital products from problem to production.
            </p>
            <p className="svc2__tags mono">FRONTEND · BACKEND · FULL-STACK · ARCHITECTURE</p>
          </div>
          <div className="svc2__status mono" aria-live="off">
            <span className="svc2__status-label">Build status</span>
            <span className="svc2__status-row">
              <span className="svc2__status-dot" aria-hidden />
              Available for select projects
            </span>
          </div>
        </div>

        {/* --- pixel to protocol stages --- */}
        <div className="svc2__stages mono" aria-hidden>
          {STAGES.map((stage, i) => (
            <span key={stage} className={i === 0 || i === STAGES.length - 1 ? "svc2__stage svc2__stage--edge" : "svc2__stage"}>
              {stage}
            </span>
          ))}
        </div>
      </div>

      <div className="shell svc2__body">
        {/* --- sticky chapter nav --- */}
        <nav className="svc2__nav" aria-label="Services chapters">
          {serviceChapters.map((chapter, idx) => (
            <a
              key={chapter.id}
              href={`#svc-${chapter.id}`}
              className={idx === activeIndex ? "svc2__nav-item svc2__nav-item--active" : "svc2__nav-item"}
            >
              <span className="svc2__nav-num mono">{chapter.number}</span>
              <span className="svc2__nav-label">{chapter.label}</span>
            </a>
          ))}
        </nav>

        <div className="svc2__nav-mobile mono" aria-hidden>
          {String(activeIndex + 1).padStart(2, "0")} / {String(serviceChapters.length).padStart(2, "0")}
          <span className="svc2__nav-mobile-title">{serviceChapters[activeIndex]?.label}</span>
        </div>

        {/* --- route rail --- */}
        <div className="svc2__rail" aria-hidden>
          <div className="svc2__rail-base" />
          <motion.div className="svc2__rail-fill" style={{ scaleY: reduce ? 1 : routeProgress }} />
          {!reduce && (
            <motion.span className="svc2__rail-particle" style={{ top: useTransform(routeProgress, (v) => `${v * 100}%`) }} />
          )}
        </div>

        {/* --- chapters --- */}
        <div className="svc2__chapters">
          {serviceChapters.map((chapter, idx) => (
            <div key={chapter.id}>
              <ServiceChapterBlock
                chapter={chapter}
                index={idx}
                reduce={reduce}
                setRef={(el) => {
                  chapterRefs.current[idx] = el;
                }}
              />
              {idx === 2 && <SignatureMoment reduce={reduce} />}
            </div>
          ))}
        </div>
      </div>

      {/* --- closing transition --- */}
      <div className="shell">
        <div className="svc2__close">
          <TextReveal
            as="h3"
            className="svc2__close-title"
            lines={["One product.", "Every layer connected."]}
            accentIndex={1}
          />
          <p className="svc2__close-flow mono">FRONTEND → API → DATA → PRODUCTION</p>
          <Link href="#work" className="svc2__close-link">
            03 / SELECTED WORK
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
              <path d="M2 8h11M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function SignatureMoment({ reduce }: { reduce: boolean }) {
  return (
    <div className="svc2__signature">
      <TextReveal
        as="h3"
        className="svc2__signature-title"
        lines={["I don't just build the interface.", "I build what makes it work."]}
        accentIndex={1}
      />
      <motion.p
        className="svc2__signature-line mono"
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: duration.section, delay: 0.3, ease }}
      >
        FRONTEND + BACKEND + DATA + ARCHITECTURE
      </motion.p>
    </div>
  );
}

function ServiceChapterBlock({
  chapter,
  index,
  reduce,
  setRef,
}: {
  chapter: (typeof serviceChapters)[number];
  index: number;
  reduce: boolean;
  setRef: (el: HTMLDivElement | null) => void;
}) {
  const view = {
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3, margin: "0px 0px -10% 0px" },
    transition: { duration: reduce ? duration.micro : duration.section, ease },
  };

  const isHero = chapter.visual === "fullstack";

  return (
    <motion.article
      id={`svc-${chapter.id}`}
      ref={setRef}
      className={isHero ? "svc2__chapter svc2__chapter--hero" : "svc2__chapter"}
      {...view}
    >
      <span className="svc2__chapter-meta mono" aria-hidden>
        {chapter.visual === "fullstack" ? "SYS_02 · STACK_CONNECTED" : chapter.visual === "backend" ? "NODE_ACTIVE · API_READY" : chapter.visual === "ship" ? "BUILD_2026 · PRODUCTION_READY" : "RUNTIME_OK"}
      </span>

      <div className="svc2__chapter-grid">
        <div className="svc2__chapter-copy">
          <p className="svc2__chapter-label mono">
            {chapter.number} / {chapter.label}
          </p>
          <h3 className="svc2__chapter-title">{chapter.title}</h3>
          <p className="svc2__chapter-headline">{chapter.headline}</p>
          <p className="svc2__chapter-desc">{chapter.description}</p>

          <ul className="svc2__chapter-caps">
            {chapter.capabilities.map((cap) => (
              <li key={cap}>{cap}</li>
            ))}
          </ul>

          <p className="svc2__chapter-tech mono">{chapter.technologies.join(" · ")}</p>
        </div>

        <div className="svc2__chapter-visual" aria-hidden>
          <ChapterVisual type={chapter.visual} index={index} reduce={reduce} />
        </div>
      </div>
    </motion.article>
  );
}

function ChapterVisual({ type, reduce }: { type: ServiceChapterVisual; index: number; reduce: boolean }) {
  const reveal = (delay: number) => ({
    initial: reduce ? { opacity: 1 } : { opacity: 0, y: 10 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.6 },
    transition: { duration: duration.ui, delay: reduce ? 0 : delay, ease },
  });

  if (type === "frontend") {
    return (
      <div className="svc2__viz svc2__viz--stack">
        {["LAYOUT", "COMPONENT", "STATE", "INTERACTION"].map((label, i) => (
          <motion.div key={label} className="svc2__viz-block" {...reveal(i * 0.08)}>
            {label}
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "backend") {
    return (
      <div className="svc2__viz svc2__viz--flow">
        {["CLIENT", "API", "SERVICE", "DATABASE"].map((label, i) => (
          <motion.div key={label} className="svc2__viz-node" {...reveal(i * 0.08)}>
            {label}
          </motion.div>
        ))}
        {!reduce && <span className="svc2__viz-pulse" aria-hidden />}
      </div>
    );
  }

  if (type === "fullstack") {
    const layers = [
      { label: "EXPERIENCE", sub: "Angular · React · Next.js" },
      { label: "APPLICATION", sub: "State · Logic · Services" },
      { label: "API", sub: "Node · NestJS · REST" },
      { label: "DATA", sub: "PostgreSQL · Prisma" },
      { label: "PRODUCTION", sub: "CI/CD · Docker · Cloud" },
    ];
    return (
      <div className="svc2__viz svc2__viz--layers">
        {layers.map((layer, i) => (
          <motion.div key={layer.label} className="svc2__viz-layer" {...reveal(i * 0.09)}>
            <span className="svc2__viz-layer-label mono">{layer.label}</span>
            <span className="svc2__viz-layer-sub mono">{layer.sub}</span>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "foundation") {
    return (
      <div className="svc2__viz svc2__viz--tokens">
        {["BUTTON", "INPUT", "CARD", "TABLE", "MODAL"].map((label, i) => (
          <motion.span key={label} className="svc2__viz-token mono" {...reveal(i * 0.06)}>
            {label}
          </motion.span>
        ))}
        <motion.span className="svc2__viz-token svc2__viz-token--system mono" {...reveal(0.4)}>
          DESIGN SYSTEM
        </motion.span>
      </div>
    );
  }

  return (
    <div className="svc2__viz svc2__viz--pipeline">
      {["CODE", "TEST", "BUILD", "DEPLOY", "MONITOR"].map((label, i) => (
        <motion.div key={label} className="svc2__viz-stage" {...reveal(i * 0.08)}>
          {label}
        </motion.div>
      ))}
      <motion.p className="svc2__viz-live mono" {...reveal(0.5)}>
        ● PRODUCTION
      </motion.p>
    </div>
  );
}
