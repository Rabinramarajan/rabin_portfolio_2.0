"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Clock, Mail, MapPin } from "lucide-react";
import { profile } from "@/content/profile";
import { SectionKicker } from "@/components/ui";
import { ContactForm } from "@/components/ContactForm";
import { Monogram } from "@/components/Logo";
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";
import { duration, ease } from "@/lib/motion";

const socialIcons = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  email: Mail,
  website: ArrowUpRight,
} as const;

export function ContactPage({ defaultProjectType }: { defaultProjectType?: string }) {
  const reduce = useReducedMotion();

  const seq = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? duration.micro : duration.section, delay: reduce ? 0 : delay, ease },
  });

  const socials = profile.socials.filter((s) => s.id !== "website");

  return (
    <>
      {/* ---- 08 / CONTACT — editorial hero ---- */}
      <section className="contact-hero">
        <div className="shell">
          <motion.div {...seq(0.05)}>
            <SectionKicker index="08" label="Contact" />
          </motion.div>

          <h1 className="contact-hero__title">
            <motion.span {...seq(0.12)} style={{ display: "block" }}>
              LET&apos;S BUILD
            </motion.span>
            <motion.span {...seq(0.22)} style={{ display: "block" }}>
              SOMETHING
            </motion.span>
            <motion.span {...seq(0.32)} className="hl--accent" style={{ display: "block" }}>
              WORTH SHIPPING.
            </motion.span>
          </h1>

          <motion.p className="contact-hero__lede" {...seq(0.45)}>
            Have a product, interface or engineering challenge in mind? Tell me what you&apos;re building —
            I reply within one business day.
          </motion.p>
        </div>
      </section>

      {/* ---- Contact layout — 45 / 55 ---- */}
      <section className="section">
        <div className="shell contact-layout">
          {/* LEFT — info */}
          <motion.div className="contact-info" {...seq(0.3)}>
            <div className="contact-visual" aria-hidden>
              <span className="contact-visual__grid" />
              <Monogram className="contact-visual__mark" />
              <span className="contact-visual__line l1" />
              <span className="contact-visual__line l2" />
            </div>

            {/* Availability */}
            <div className="contact-avail">
              <span className="contact-avail__dot" aria-hidden />
              <span>{profile.availability.label}</span>
            </div>

            {/* Contact information */}
            <dl className="contact-facts">
              <div>
                <dt>
                  <Mail aria-hidden /> Email
                </dt>
                <dd>
                  <a className="contact__email" href={"mailto:" + profile.email}>
                    {profile.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt>
                  <MapPin aria-hidden /> Location
                </dt>
                <dd>{profile.location}</dd>
              </div>
              <div>
                <dt>
                  <Clock aria-hidden /> Availability
                </dt>
                <dd>{profile.availability.label}</dd>
              </div>
              {profile.availability.responseTime ? (
                <div>
                  <dt>Response time</dt>
                  <dd>{profile.availability.responseTime}</dd>
                </div>
              ) : null}
            </dl>

            {/* Social */}
            <div className="contact-social">
              {socials.map((s) => {
                const Icon = socialIcons[s.id as keyof typeof socialIcons] ?? ArrowUpRight;
                return (
                  <a
                    key={s.id}
                    href={s.href}
                    className="contact-social__item"
                    {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <Icon aria-hidden className="contact-social__icon" />
                    <span>{s.label}</span>
                  </a>
                );
              })}
            </div>

            <p className="contact-fallback">
              Prefer email?{" "}
              <a className="contact-fallback__link" href={"mailto:" + profile.email}>
                {profile.email}
              </a>
            </p>
          </motion.div>

          {/* RIGHT — premium form */}
          <motion.div {...seq(0.42)}>
            <ContactForm defaultProjectType={defaultProjectType} />
          </motion.div>
        </div>
      </section>

      {/* ---- CTA strip ---- */}
      <section className="contact-outro">
        <div className="shell">
          <Link href="/work" className="contact-outro__link">
            <span>View the work</span>
            <ArrowUpRight aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}