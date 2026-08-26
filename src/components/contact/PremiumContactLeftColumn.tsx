"use client";

import { useReducedMotion, motion } from "motion/react";
import { TextReveal } from "@/components/motion";
import { contactCopy, contactInfo } from "@/content/contact";
import { duration, ease } from "@/lib/motion";

export function PremiumContactLeftColumn() {
  const reduce = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: reduce ? 0 : 0.15,
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

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="premium-contact-left-column"
    >
      {/* Eyebrow label */}
      <motion.div className="premium-contact-left-column__eyebrow" variants={itemVariants}>
        <span className="premium-contact-left-column__index">
          {contactCopy.hero.index}
        </span>
        <span className="premium-contact-left-column__label">
          {contactCopy.hero.label}
        </span>
      </motion.div>

      {/* Main heading */}
      <TextReveal
        lines={contactCopy.hero.title}
        as="h1"
        className="premium-contact-left-column__title"
        delay={reduce ? 0 : 0.12}
        accentIndex={2}
      />

      {/* Description */}
      <motion.p className="premium-contact-left-column__description" variants={itemVariants}>
        {contactCopy.hero.lede}
      </motion.p>

      {/* Divider */}
      <motion.div
        className="premium-contact-left-column__divider"
        variants={itemVariants}
        aria-hidden="true"
      />

      {/* Contact details grid */}
      <motion.div
        className="premium-contact-left-column__details"
        variants={itemVariants}
      >
        {contactInfo && (
          <>
            {contactInfo.email && (
              <div className="premium-contact-left-column__detail-item">
                <span className="premium-contact-left-column__detail-label">Email</span>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="premium-contact-left-column__detail-value"
                >
                  {contactInfo.email}
                </a>
              </div>
            )}

            {contactInfo.phone && (
              <div className="premium-contact-left-column__detail-item">
                <span className="premium-contact-left-column__detail-label">Phone</span>
                <a
                  href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                  className="premium-contact-left-column__detail-value"
                >
                  {contactInfo.phone}
                </a>
                <span className="premium-contact-left-column__detail-subtext">
                  {contactInfo.phoneHours}
                </span>
              </div>
            )}

            {contactInfo.location && (
              <div className="premium-contact-left-column__detail-item">
                <span className="premium-contact-left-column__detail-label">Location</span>
                <address className="premium-contact-left-column__detail-value">
                  {contactInfo.location}
                </address>
              </div>
            )}

            {contactInfo.availability && (
              <div className="premium-contact-left-column__detail-item">
                <span className="premium-contact-left-column__detail-label">Availability</span>
                <p className="premium-contact-left-column__detail-value">
                  {contactInfo.availability}
                </p>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Quote section */}
      <motion.blockquote
        className="premium-contact-left-column__quote"
        variants={itemVariants}
      >
        <p className="premium-contact-left-column__quote-text">
          Great things happen<br />
          when ideas <span className="premium-contact-left-column__quote-accent">connect</span>.
        </p>
      </motion.blockquote>
    </motion.div>
  );
}
