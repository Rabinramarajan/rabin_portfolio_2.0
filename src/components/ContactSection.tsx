"use client";

import { motion, useReducedMotion } from "motion/react";
import { profile } from "@/content/profile";
import { ContactForm } from "@/components/ContactForm";
import { SectionKicker } from "@/components/ui";
import { duration, ease } from "@/lib/motion";
import { TextReveal } from "@/components/motion";

export function ContactSection() {
  const reduce = useReducedMotion();

  const view = (delay = 0) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: reduce ? duration.micro : duration.section, delay: reduce ? 0 : delay, ease },
  });

  return (
    <section id="contact" className="section">
      <div className="shell contact-grid">
        <motion.div {...view(0)}>
          <SectionKicker index="08" label="Contact" />
          <TextReveal
            lines={["Let's build something", "worth shipping."]}
            className="contact__heading"
            as="h2"
            accentIndex={1}
          />
          <p className="contact__lede">
            Tell me the product, the constraint, and the timeline. I reply within one business day.
          </p>
          <div className="contact__direct">
            <span className="contact__direct-label">Direct</span>
            <a className="contact__email" href={"mailto:" + profile.email}>
              {profile.email}
            </a>
            <span className="contact__meta">
              {profile.location} · {profile.availability.label}
            </span>
          </div>
        </motion.div>

        <motion.div {...view(0.12)}>
          <ContactForm />
        </motion.div>
      </div>
    </section>
  );
}