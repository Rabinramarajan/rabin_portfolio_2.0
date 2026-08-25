"use client";

import { useReducedMotion, motion } from "motion/react";
import { Mail, MessageSquare } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { duration, ease } from "@/lib/motion";

export function PremiumContactForm() {
  const reduce = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: reduce ? 0 : 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 32 },
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
    <section className="premium-contact-form" id="contact-form">
      <div className="premium-contact-form__backdrop" aria-hidden="true" />

      <div className="shell">
        <motion.div
          className="premium-contact-form__container"
          initial="hidden"
          whileInView="show"
          variants={containerVariants}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section header */}
          <motion.div className="premium-contact-form__header" variants={itemVariants}>
            <div className="premium-contact-form__eyebrow">
              <MessageSquare size={18} aria-hidden="true" />
              <span>Get in Touch</span>
            </div>
            <h2 className="premium-contact-form__title">Send me a message</h2>
            <p className="premium-contact-form__subtitle">
              I typically respond within 24 hours. Tell me about your project, challenge, or opportunity.
            </p>
          </motion.div>

          {/* Form container with glass effect */}
          <motion.div className="premium-contact-form__form-wrapper" variants={itemVariants}>
            <div className="premium-contact-form__glass">
              <ContactForm />
            </div>
          </motion.div>

          {/* Trust badges */}
          <motion.div className="premium-contact-form__trust" variants={itemVariants}>
            <div className="premium-contact-form__trust-item">
              <Mail size={20} className="premium-contact-form__trust-icon" aria-hidden="true" />
              <div>
                <div className="premium-contact-form__trust-label">Secure</div>
                <div className="premium-contact-form__trust-desc">End-to-end encrypted</div>
              </div>
            </div>
            <div className="premium-contact-form__divider" aria-hidden="true" />
            <div className="premium-contact-form__trust-item">
              <MessageSquare size={20} className="premium-contact-form__trust-icon" aria-hidden="true" />
              <div>
                <div className="premium-contact-form__trust-label">Fast Response</div>
                <div className="premium-contact-form__trust-desc">Usually within 1 day</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
