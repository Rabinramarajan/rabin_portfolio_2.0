"use client";

import { motion, useReducedMotion } from "motion/react";
import { TextReveal } from "@/components/motion";
import { Magnetic } from "@/components/motion";
import { duration, ease } from "@/lib/motion";
import { ArrowRight } from "lucide-react";

export function ContactFinalCTA() {
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
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? duration.section : duration.section,
        ease,
      },
    },
  };

  return (
    <section className="section contact-final-cta">
      <div className="shell">
        <motion.div
          className="contact-final-cta__content"
          initial="hidden"
          whileInView="show"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div id="final-cta-title">
            <TextReveal
              lines={["Have an idea?", "Let's turn it into", "something real."]}
              className="contact-final-cta__title"
              as="h2"
              delay={reduce ? 0 : 0.12}
            />
          </div>

          <motion.div className="contact-final-cta__cta-group" variants={itemVariants}>
            <Magnetic strength={reduce ? 0 : 6} className="contact-final-cta__magnetic">
              <motion.a
                href="#inquiry"
                className="contact-final-cta__primary"
                whileHover={reduce ? {} : { y: -2 }}
                transition={{ duration: duration.micro, ease }}
              >
                <span className="contact-final-cta__primary-text">START A CONVERSATION</span>
                <motion.span
                  className="contact-final-cta__primary-arrow"
                  animate={reduce ? {} : { x: 0 }}
                  whileHover={reduce ? {} : { x: 4 }}
                  transition={{ duration: duration.micro, ease }}
                >
                  <ArrowRight size={18} strokeWidth={2.5} />
                </motion.span>
              </motion.a>
            </Magnetic>

            <motion.a
              href="/work"
              className="contact-final-cta__secondary"
              whileHover={reduce ? {} : { x: 4 }}
              transition={{ duration: duration.micro, ease }}
            >
              <span>View my work</span>
              <ArrowRight size={16} strokeWidth={2} />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
