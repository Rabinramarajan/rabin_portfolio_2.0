"use client";

import { useReducedMotion, motion } from "motion/react";
import { ArrowRight, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";
import { TextReveal } from "@/components/motion";
import { profile } from "@/content/profile";
import { duration, ease } from "@/lib/motion";

export function PremiumContactCTA() {
  const reduce = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: reduce ? 0 : 0.2,
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

  const links = [
    {
      label: "Email",
      href: `mailto:${profile.email}`,
      icon: Mail,
      description: "Direct email",
    },
    {
      label: "LinkedIn",
      href: profile.socials.find((s) => s.id === "linkedin")?.href || "#",
      icon: LinkedinIcon,
      description: "Professional",
    },
    {
      label: "GitHub",
      href: profile.socials.find((s) => s.id === "github")?.href || "#",
      icon: GithubIcon,
      description: "Code & projects",
    },
  ];

  return (
    <section className="premium-contact-cta">
      <div className="premium-contact-cta__bg" aria-hidden="true" />

      <div className="shell">
        <motion.div
          initial="hidden"
          whileInView="show"
          variants={containerVariants}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Main message */}
          <motion.div className="premium-contact-cta__message" variants={itemVariants}>
            <TextReveal
              lines={["Have a bold", "idea in mind?"]}
              className="premium-contact-cta__title"
              as="h2"
              delay={reduce ? 0 : 0.12}
              accentIndex={0}
              mode="word"
            />
            <p className="premium-contact-cta__subtitle">
              Let's turn it into reality. Whether it's a full project, quick consultation, or just exploring ideas together.
            </p>
          </motion.div>

          {/* Connection methods */}
          <motion.div className="premium-contact-cta__methods" variants={itemVariants}>
            {links.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="premium-contact-cta__method"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={reduce ? {} : { y: -4, x: 4 }}
                  transition={{
                    duration: reduce ? duration.micro : duration.ui,
                    ease,
                  }}
                  viewport={{ once: true }}
                >
                  <div className="premium-contact-cta__method-icon">
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <div className="premium-contact-cta__method-content">
                    <div className="premium-contact-cta__method-label">{link.label}</div>
                    <div className="premium-contact-cta__method-desc">{link.description}</div>
                  </div>
                  <ArrowRight size={18} className="premium-contact-cta__method-arrow" aria-hidden="true" />
                </motion.a>
              );
            })}
          </motion.div>

          {/* Back to work CTA */}
          <motion.div className="premium-contact-cta__back" variants={itemVariants}>
            <a href="/work" className="premium-contact-cta__back-link">
              <ArrowRight size={18} aria-hidden="true" />
              <span>Explore my work</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
