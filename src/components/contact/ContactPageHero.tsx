"use client";

import { useReducedMotion } from "motion/react";
import { motion } from "motion/react";
import { profile } from "@/content/profile";
import { TextReveal } from "@/components/motion";
import { Magnetic } from "@/components/motion";
import { duration, ease, stagger } from "@/lib/motion";
import { ArrowRight } from "lucide-react";

export function ContactPageHero() {
  const reduce = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: reduce ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? duration.micro : duration.section,
        ease,
      },
    },
  };

  const eyebrowVariants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? duration.micro : duration.ui,
        ease,
      },
    },
  };

  return (
    <header className="contact-hero">
      {/* Background video */}
      <video
        className="contact-hero__video"
        src="/media/contact/hero.mp4"
        autoPlay={!reduce}
        loop
        muted
        playsInline
        preload={reduce ? "none" : "metadata"}
        disablePictureInPicture
        aria-hidden="true"
      />

      {/* Cinematic overlay with gradient */}
      <div className="contact-hero__overlay" aria-hidden="true" />

      {/* Technical decoration layer */}
      <div className="contact-hero__decoration" aria-hidden="true">
        <div className="contact-hero__decoration-corner contact-hero__decoration-corner--tl" />
        <div className="contact-hero__decoration-corner contact-hero__decoration-corner--br" />
      </div>

      {/* Main content */}
      <div className="contact-hero__content">
        <div className="shell contact-hero__shell">
          <motion.div
            className="contact-hero__grid"
            initial="hidden"
            animate="show"
            variants={containerVariants}
          >
            {/* LEFT COLUMN: Premium copy section (55-60%) */}
            <div className="contact-hero__column contact-hero__column--left">
              {/* Eyebrow */}
              <motion.div
                className="contact-hero__eyebrow"
                variants={eyebrowVariants}
              >
                <span className="contact-hero__eyebrow-number">01</span>
                <span className="contact-hero__eyebrow-divider">/</span>
                <span className="contact-hero__eyebrow-text">LET'S TALK</span>
              </motion.div>

              {/* Premium headline with line reveal */}
              <TextReveal
                lines={["Let's build", "something", "useful."]}
                className="contact-hero__title"
                as="h1"
                delay={reduce ? 0 : 0.12}
                accentIndex={2}
              />

              {/* Supporting copy */}
              <motion.p
                className="contact-hero__description"
                variants={itemVariants}
              >
                Have a product, platform, or frontend challenge in mind? Tell me what you're building and I'll help you figure out the next step.
              </motion.p>

              {/* CTA wrapper with magnetic effect */}
              <motion.div variants={itemVariants}>
                <Magnetic strength={reduce ? 0 : 6} className="contact-hero__cta-magnetic">
                  <motion.a
                    href="#inquiry"
                    className="contact-hero__cta"
                    whileHover={reduce ? {} : { y: -2 }}
                    transition={{ duration: duration.micro, ease }}
                  >
                    <span className="contact-hero__cta-text">START A PROJECT</span>
                    <motion.span
                      className="contact-hero__cta-arrow"
                      animate={reduce ? {} : { x: 0 }}
                      whileHover={reduce ? {} : { x: 4 }}
                      transition={{ duration: duration.micro, ease }}
                    >
                      <ArrowRight size={18} strokeWidth={2.5} />
                    </motion.span>
                  </motion.a>
                </Magnetic>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Premium availability card (40-45%) */}
            <motion.div
              className="contact-hero__column contact-hero__column--right"
              variants={itemVariants}
            >
              <div className="contact-hero__availability">
                {/* Status indicator with subtle pulse */}
                <div className="contact-hero__availability-indicator">
                  <motion.span
                    className="contact-hero__availability-dot"
                    animate={reduce ? {} : {
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: [0.4, 0, 0.6, 1],
                    }}
                    aria-hidden="true"
                  />
                  <span className="contact-hero__availability-status">
                    AVAILABLE FOR SELECT PROJECTS
                  </span>
                </div>

                {/* Main description */}
                <p className="contact-hero__availability-text">
                  Currently open to freelance projects, consulting, and selected long-term engagements.
                </p>

                {/* Metadata divider */}
                <div className="contact-hero__availability-divider" aria-hidden="true" />

                {/* Metadata items */}
                <div className="contact-hero__availability-meta">
                  <div className="contact-hero__availability-item">
                    <span className="contact-hero__availability-label">Location</span>
                    <span className="contact-hero__availability-value">Remote</span>
                  </div>
                  <div className="contact-hero__availability-item">
                    <span className="contact-hero__availability-label">Response</span>
                    <span className="contact-hero__availability-value">1 business day</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
