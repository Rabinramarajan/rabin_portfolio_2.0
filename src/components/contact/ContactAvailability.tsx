"use client";

import { motion, useReducedMotion } from "motion/react";
import { profile } from "@/content/profile";
import { duration, ease } from "@/lib/motion";
import { SectionKicker } from "@/components/ui";

export function ContactAvailability() {
  const reduce = useReducedMotion();

  const view = {
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: {
      duration: reduce ? duration.micro : duration.section,
      ease,
    },
  };

  return (
    <section className="section contact-availability" aria-labelledby="availability-title">
      <div className="shell">
        <motion.div className="contact-availability__content" {...view}>
          <SectionKicker index="03" label="Availability" />

          <h2 className="contact-availability__title" id="availability-title">
            Currently open to meaningful opportunities.
          </h2>

          <div className="contact-availability__grid">
            <div className="contact-availability__card">
              <h3 className="contact-availability__card-title">Engagement Types</h3>
              <ul className="contact-availability__tags">
                <li className="contact-availability__tag">Full-time</li>
                <li className="contact-availability__tag">Contract</li>
                <li className="contact-availability__tag">Consulting</li>
                <li className="contact-availability__tag">Collaboration</li>
              </ul>
            </div>

            <div className="contact-availability__card">
              <h3 className="contact-availability__card-title">Response Time</h3>
              <p className="contact-availability__stat">{profile.availability.responseTime}</p>
              <p className="contact-availability__note">I'll review and get back to you with a clear next step.</p>
            </div>

            <div className="contact-availability__card">
              <h3 className="contact-availability__card-title">Work Model</h3>
              <p className="contact-availability__stat">Remote-first</p>
              <p className="contact-availability__note">India / Europe / US timezone overlap.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
