"use client";

import { motion } from "motion/react";
import { TextReveal } from "@/components/motion";
import { SmartImage } from "@/components/SmartImage";
import { SectionKicker } from "@/components/ui";
import { ContactReveal } from "@/components/contact/ContactMedia";
import { contactCopy } from "@/content/contact";
import { duration, ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

export function ContactHero() {
  const reduce = useReducedMotionSafe();
  const { hero, media } = contactCopy;

  return (
    <header className="cp-hero">
      <div className="cp-hero__bg" aria-hidden>
        <span className="cp-hero__orb cp-hero__orb--a" />
        <span className="cp-hero__orb cp-hero__orb--b" />
        <span className="cp-hero__grid" />
      </div>
      <div className="shell cp-hero__layout">
        <div className="cp-hero__copy">
          <SectionKicker index={hero.index} label={hero.label} />
          <TextReveal lines={[...hero.title]} as="h1" className="cp-hero__title" delay={0.04} accentIndex={1} />
          <motion.p
            className="cp-hero__lede"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? duration.micro : duration.section, delay: reduce ? 0 : 0.28, ease }}
          >
            {hero.lede}
          </motion.p>
        </div>

        <ContactReveal className="cp-hero__visual" hero hover="scale" delay={0.12}>
          <figure className="cp-frame cp-frame--hero">
            <SmartImage
              src={media.hero.src}
              alt={media.hero.alt}
              fill
              priority
              sizes="(max-width: 1023px) 92vw, 42vw"
              className="cp-frame__media"
            />
          </figure>
        </ContactReveal>

        <div className="cp-hero__meta">
          <motion.p
            className="cp-hero__avail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: duration.ui, delay: reduce ? 0 : 0.42, ease }}
          >
            <span className="cp-hero__pulse" aria-hidden />
            <span>{hero.availability}</span>
          </motion.p>
          <a className="cp-hero__scroll" href="#contact-intro">
            <span className="visually-hidden">Scroll to the contact form</span>
            <span aria-hidden className="cp-hero__scroll-line" />
          </a>
        </div>
      </div>
    </header>
  );
}
