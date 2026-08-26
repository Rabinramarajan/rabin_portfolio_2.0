"use client";

import { useReducedMotion, motion } from "motion/react";
import { Clock, Headphones, Send, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { duration, ease } from "@/lib/motion";

const TRUST_ITEMS = [
  {
    icon: Clock,
    label: "Quick Response",
    desc: "I typically respond within 24 hours.",
  },
  {
    icon: Headphones,
    label: "Let's Connect",
    desc: "Easy communication through your preferred way.",
  },
  {
    icon: ShieldCheck,
    label: "Trusted & Secure",
    desc: "Your data is safe with privacy guaranteed.",
  },
] as const;

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
    <motion.div
      className="premium-contact-form"
      id="contact-form"
      initial="hidden"
      whileInView="show"
      variants={containerVariants}
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* Form panel */}
      <motion.div className="premium-contact-form__panel" variants={itemVariants}>
        <div className="premium-contact-form__header">
          <span className="premium-contact-form__badge" aria-hidden="true">
            <Send size={20} />
          </span>
          <div>
            <h2 className="premium-contact-form__title">Send a message</h2>
            <p className="premium-contact-form__subtitle">
              I&rsquo;ll get back to you as soon as possible.
            </p>
          </div>
        </div>

        <ContactForm />
      </motion.div>

      {/* Trust strip */}
      <motion.ul className="premium-contact-form__trust" variants={itemVariants}>
        {TRUST_ITEMS.map(({ icon: Icon, label, desc }) => (
          <li key={label} className="premium-contact-form__trust-item">
            <Icon size={22} className="premium-contact-form__trust-icon" aria-hidden="true" />
            <span className="premium-contact-form__trust-label">{label}</span>
            <span className="premium-contact-form__trust-desc">{desc}</span>
          </li>
        ))}
      </motion.ul>
    </motion.div>
  );
}
