"use client";

import { motion, useReducedMotion } from "motion/react";
import { profile } from "@/content/profile";
import { contactCopy } from "@/content/contact";
import { duration, ease, stagger } from "@/lib/motion";
import { SectionKicker } from "@/components/ui";
import { ArrowRight } from "lucide-react";

export function ContactChannelsNew() {
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

  const channels = [
    {
      title: "Email",
      description: "Best for project briefs and detailed conversations.",
      href: `mailto:${profile.email}`,
      value: profile.email,
    },
    {
      title: "LinkedIn",
      description: "Professional context, recommendations, and introductions.",
      href: profile.socials.find((s) => s.id === "linkedin")?.href ?? "https://www.linkedin.com/in/rabinr",
      value: "linkedin.com/in/rabinr",
    },
    {
      title: "GitHub",
      description: "Code, architecture decisions, and how I ship.",
      href: profile.socials.find((s) => s.id === "github")?.href ?? "https://github.com/Rabinramarajan",
      value: "github.com/Rabinramarajan",
    },
  ];

  return (
    <section className="section contact-channels-new" aria-labelledby="channels-title">
      <div className="shell">
        <motion.div
          className="contact-channels-new__content"
          initial="hidden"
          whileInView="show"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.12 }}
        >
          <motion.div className="contact-channels-new__header" variants={itemVariants}>
            <SectionKicker index="04" label="Connect" />
            <h2 className="contact-channels-new__title" id="channels-title">
              Other ways to connect.
            </h2>
          </motion.div>

          <div className="contact-channels-new__grid">
            {channels.map((channel, index) => (
              <motion.a
                key={channel.href}
                href={channel.href}
                className="contact-channels-new__row"
                variants={itemVariants}
                {...(channel.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                <div className="contact-channels-new__body">
                  <h3 className="contact-channels-new__channel-title">{channel.title}</h3>
                  <p className="contact-channels-new__channel-description">{channel.description}</p>
                  <p className="contact-channels-new__channel-value">{channel.value}</p>
                </div>
                <div className="contact-channels-new__arrow">
                  <ArrowRight size={18} strokeWidth={2} />
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
