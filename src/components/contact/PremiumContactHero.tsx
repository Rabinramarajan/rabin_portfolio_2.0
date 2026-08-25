"use client";

import { useReducedMotion, motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { TextReveal } from "@/components/motion";
import { profile } from "@/content/profile";
import { duration, ease } from "@/lib/motion";

export function PremiumContactHero() {
  const reduce = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: reduce ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? duration.micro : duration.section,
        ease,
      },
    },
  };

  return (
    <header className="premium-contact-hero">
      {/* Animated background elements */}
      <div className="premium-contact-hero__bg" aria-hidden="true">
        {/* Gradient orbs */}
        <div className="premium-contact-hero__orb premium-contact-hero__orb--1" />
        <div className="premium-contact-hero__orb premium-contact-hero__orb--2" />
        <div className="premium-contact-hero__orb premium-contact-hero__orb--3" />

        {/* Grid pattern */}
        <div className="premium-contact-hero__grid" />

        {/* Ambient light effects */}
        <div className="premium-contact-hero__ambient" />
      </div>

      {/* Main content */}
      <div className="shell premium-contact-hero__content">
        <motion.div
          className="premium-contact-hero__inner"
          initial="hidden"
          animate="show"
          variants={containerVariants}
        >
          {/* Eyebrow with icon */}
          <motion.div
            className="premium-contact-hero__eyebrow"
            variants={itemVariants}
          >
            <Sparkles size={16} className="premium-contact-hero__eyebrow-icon" aria-hidden="true" />
            <span>Let's Create Something Amazing</span>
          </motion.div>

          {/* Main headline */}
          <TextReveal
            lines={["Ready to", "build the", "future?"]}
            className="premium-contact-hero__title"
            as="h1"
            delay={reduce ? 0 : 0.12}
            accentIndex={1}
          />

          {/* Subtitle */}
          <motion.p
            className="premium-contact-hero__subtitle"
            variants={itemVariants}
          >
            I'm passionate about creating digital products that make an impact. Whether you have a bold idea, a technical challenge, or want to explore collaboration opportunities, let's talk.
          </motion.p>

          {/* Stats grid */}
          <motion.div
            className="premium-contact-hero__stats"
            variants={itemVariants}
          >
            <div className="premium-contact-hero__stat">
              <div className="premium-contact-hero__stat-value">7+</div>
              <div className="premium-contact-hero__stat-label">Years Experience</div>
            </div>
            <div className="premium-contact-hero__stat">
              <div className="premium-contact-hero__stat-value">50+</div>
              <div className="premium-contact-hero__stat-label">Projects Shipped</div>
            </div>
            <div className="premium-contact-hero__stat">
              <div className="premium-contact-hero__stat-value">100%</div>
              <div className="premium-contact-hero__stat-label">Client Satisfaction</div>
            </div>
          </motion.div>

          {/* CTA button */}
          <motion.div
            className="premium-contact-hero__cta-wrapper"
            variants={itemVariants}
          >
            <a href="#contact-form" className="premium-contact-hero__cta">
              <span className="premium-contact-hero__cta-text">Start a Conversation</span>
              <ArrowRight size={20} className="premium-contact-hero__cta-icon" />
            </a>
          </motion.div>

          {/* Availability badge */}
          <motion.div
            className="premium-contact-hero__availability"
            variants={itemVariants}
          >
            <div className="premium-contact-hero__availability-dot" aria-hidden="true" />
            <span className="premium-contact-hero__availability-text">
              {profile.availability.label}
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="premium-contact-hero__scroll"
        animate={reduce ? {} : { y: [0, 8, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1],
        }}
        aria-hidden="true"
      >
        <span className="premium-contact-hero__scroll-line" />
      </motion.div>
    </header>
  );
}
