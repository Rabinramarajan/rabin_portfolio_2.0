"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Copy, Check, Phone, Mail, MapPin, Clock } from "lucide-react";
import { profile } from "@/content/profile";
import { duration, ease } from "@/lib/motion";

export function ContactInformation() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: duration.ui, ease },
    },
  };

  return (
    <section className="contact-information">
      <div className="shell">
        <motion.div
          className="contact-information__grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Email */}
          <motion.div
            className="contact-information__item"
            variants={item}
          >
            <div className="contact-information__icon">
              <Mail size={20} />
            </div>
            <div className="contact-information__content">
              <h3 className="contact-information__label">Email</h3>
              <a
                href={`mailto:${profile.email}`}
                className="contact-information__value contact-information__value--link"
              >
                {profile.email}
              </a>
              <button
                onClick={copyEmail}
                className="contact-information__action"
                aria-label="Copy email address"
                style={{ color: copiedEmail ? '#c9f24d' : 'rgb(201, 242, 77)' }}
              >
                {copiedEmail ? (
                  <>
                    <Check size={14} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    Copy
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Phone */}
          <motion.div
            className="contact-information__item"
            variants={item}
          >
            <div className="contact-information__icon">
              <Phone size={20} />
            </div>
            <div className="contact-information__content">
              <h3 className="contact-information__label">Phone</h3>
              <a
                href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                className="contact-information__value contact-information__value--link"
              >
                {profile.phone}
              </a>
              <p className="contact-information__meta">
                {profile.phoneHours}
              </p>
            </div>
          </motion.div>

          {/* Location */}
          <motion.div
            className="contact-information__item"
            variants={item}
          >
            <div className="contact-information__icon">
              <MapPin size={20} />
            </div>
            <div className="contact-information__content">
              <h3 className="contact-information__label">Location</h3>
              <p className="contact-information__value">
                {profile.locationShort}
              </p>
              <p className="contact-information__meta">
                Remote-friendly
              </p>
            </div>
          </motion.div>

          {/* Availability */}
          <motion.div
            className="contact-information__item"
            variants={item}
          >
            <div className="contact-information__icon">
              <Clock size={20} />
            </div>
            <div className="contact-information__content">
              <h3 className="contact-information__label">Availability</h3>
              <p className="contact-information__value">
                {profile.availability.label}
              </p>
              <p className="contact-information__meta">
                {profile.availability.responseTime}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
