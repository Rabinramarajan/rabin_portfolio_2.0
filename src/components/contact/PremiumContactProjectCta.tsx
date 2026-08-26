"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useReducedMotion, motion } from "motion/react";
import { duration, ease } from "@/lib/motion";

/**
 * Compact closing card that sits under the two columns — the reference pairs a
 * small orbital visual with a single "view my work" exit. Deliberately not the
 * full-bleed PremiumContactCTA section, which is far too heavy for this slot.
 */
export function PremiumContactProjectCta() {
  const reduce = useReducedMotion();

  return (
    <motion.aside
      className="premium-contact-project-cta"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reduce ? duration.micro : duration.section, ease }}
    >
      <div className="premium-contact-project-cta__visual" aria-hidden="true">
        <Image
          src="/media/contact/contact_h.png"
          alt=""
          width={280}
          height={280}
          sizes="220px"
          className="premium-contact-project-cta__image"
        />
      </div>

      <div className="premium-contact-project-cta__body">
        <h2 className="premium-contact-project-cta__title">Have a project in mind?</h2>
        <p className="premium-contact-project-cta__text">
          Let&rsquo;s create something amazing together and build digital solutions that make an
          impact.
        </p>
      </div>

      <Link href="/work" className="premium-contact-project-cta__action">
        View my work
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </motion.aside>
  );
}
