"use client";

import { useReducedMotion, motion } from "motion/react";
import { Clock, Headphones, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { TextReveal } from "@/components/motion";
import { contactCopy, contactInfo } from "@/content/contact";
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

type Detail = {
  key: string;
  icon: typeof Mail;
  label: string;
  value: string;
  sub?: string;
  href?: string;
};

const details: Detail[] = [
  contactInfo.email && {
    key: "email",
    icon: Mail,
    label: "Email",
    value: contactInfo.email,
    sub: "Send me an email anytime",
    href: `mailto:${contactInfo.email}`,
  },
  contactInfo.phone && {
    key: "phone",
    icon: Phone,
    label: "Phone",
    value: contactInfo.phone,
    sub: contactInfo.phoneHours,
    href: `tel:${contactInfo.phone.replace(/\s/g, "")}`,
  },
  contactInfo.location && {
    key: "location",
    icon: MapPin,
    label: "Location",
    value: contactInfo.location,
    sub: "Available for remote work",
  },
  contactInfo.availability && {
    key: "availability",
    icon: Clock,
    label: "Availability",
    value: contactInfo.availability,
    sub: "Open to new opportunities",
  },
].filter(Boolean) as Detail[];

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
        lines={[...contactCopy.hero.title]}
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

      {/* Contact rails */}
      <motion.ul className="premium-contact-left-column__details" variants={itemVariants}>
        {details.map(({ key, icon: Icon, label, value, sub, href }) => (
          <li key={key} className="premium-contact-left-column__detail-item">
            <span className="premium-contact-left-column__detail-icon" aria-hidden="true">
              <Icon size={20} />
            </span>
            <span className="premium-contact-left-column__detail-body">
              <span className="premium-contact-left-column__detail-label">{label}</span>
              {href ? (
                <a href={href} className="premium-contact-left-column__detail-value">
                  {value}
                </a>
              ) : (
                <span className="premium-contact-left-column__detail-value">{value}</span>
              )}
              {sub ? (
                <span className="premium-contact-left-column__detail-subtext">{sub}</span>
              ) : null}
            </span>
          </li>
        ))}
      </motion.ul>

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
