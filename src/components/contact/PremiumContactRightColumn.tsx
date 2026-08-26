"use client";

import { useReducedMotion, motion } from "motion/react";
import { PremiumContactForm } from "@/components/contact/PremiumContactForm";
import { duration, ease } from "@/lib/motion";

export function PremiumContactRightColumn() {
  const reduce = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: reduce ? 0 : 0.25,
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

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="premium-contact-right-column"
    >
      <motion.div variants={itemVariants}>
        <PremiumContactForm />
      </motion.div>
    </motion.div>
  );
}
