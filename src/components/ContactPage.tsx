"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Clock, Mail, MapPin, Phone, Send, ShieldCheck, Rocket, Zap } from "lucide-react";
import { profile, hero } from "@/content/profile";
import { SectionKicker } from "@/components/ui";
import { ContactForm } from "@/components/ContactForm";
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";
import { duration, ease } from "@/lib/motion";

const socialIcons = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  email: Mail,
  website: ArrowUpRight,
} as const;

const highlights = [
  { icon: Zap, title: "Quick Response", sub: "Within 24 hours" },
  { icon: ShieldCheck, title: "Professional", sub: "100% Reliable" },
  { icon: Rocket, title: "Result Driven", sub: "Impact Focused" },
];

function OrbitGraphic() {
  return (
    <div className="contact-orbit" aria-hidden>
      <span className="contact-orbit__ring r1" />
      <span className="contact-orbit__ring r2" />
      <span className="contact-orbit__core" />
      <span className="contact-orbit__dot d1" />
      <span className="contact-orbit__dot d2" />
    </div>
  );
}

export function ContactPage({ defaultProjectType }: { defaultProjectType?: string }) {
  const reduce = useReducedMotion();

  const seq = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? duration.micro : duration.section, delay: reduce ? 0 : delay, ease },
  });

  const socials = profile.socials.filter((s) => s.id !== "website");

  const methods = [
    { icon: Mail, label: "Email", primary: profile.email, secondary: "Send me an email", href: `mailto:${profile.email}` },
    { icon: Phone, label: "Phone", primary: profile.phone, secondary: profile.phoneHours, href: `tel:${profile.phone.replace(/\s+/g, "")}` },
    { icon: MapPin, label: "Location", primary: profile.locationShort, secondary: "India" },
    { icon: Clock, label: "Availability", primary: "Open for projects", secondary: "Let's collaborate!" },
  ];

  return (
    <>
      {/* ---- 08 / CONTACT — single two-column layout ---- */}
      <section className="contact-hero">
        <div className="shell contact-layout">
          {/* LEFT — pitch + info */}
          <div className="contact-info">
            <motion.div {...seq(0.05)}>
              <SectionKicker index="08" label="Get in touch" />
            </motion.div>

            <div className="contact-hero__headwrap">
              <h1 className="contact-hero__title">
                <motion.span {...seq(0.12)} style={{ display: "block" }}>
                  Let&apos;s build
                </motion.span>
                <motion.span {...seq(0.22)} style={{ display: "block" }}>
                  something
                </motion.span>
                <motion.span {...seq(0.32)} className="hl--accent" style={{ display: "block" }}>
                  extraordinary.
                </motion.span>
              </h1>
              <OrbitGraphic />
            </div>

            <motion.p className="contact-hero__lede" {...seq(0.45)}>
              Have a project in mind or want to collaborate? I&apos;m always open to discussing new ideas and
              opportunities.
            </motion.p>

            <motion.ul className="contact-highlights" {...seq(0.55)}>
              {highlights.map(({ icon: Icon, title, sub }) => (
                <li key={title} className="contact-highlight">
                  <span className="contact-highlight__icon">
                    <Icon aria-hidden size={18} />
                  </span>
                  <span>
                    <strong>{title}</strong>
                    <span>{sub}</span>
                  </span>
                </li>
              ))}
            </motion.ul>

            <motion.div className="contact-card" {...seq(0.65)}>
              <div className="contact-card__avatar">
                <Image src={hero.portrait.src} alt={hero.portrait.alt} width={96} height={96} />
                <span className="contact-card__status" aria-hidden />
              </div>
              <div className="contact-card__body">
                <p className="contact-card__name">{profile.name}</p>
                <p className="contact-card__role">{profile.headlineRole}</p>
                <p className="contact-card__location">
                  <MapPin aria-hidden size={13} /> {profile.location}
                </p>
              </div>
              <p className="contact-card__sig" aria-hidden>
                {profile.name}
              </p>
            </motion.div>

            <motion.div {...seq(0.75)}>
              <p className="contact-info__label">
                <span className="contact-info__dash" aria-hidden /> Other ways to reach me
              </p>

              <div className="contact-methods">
                {methods.map(({ icon: Icon, label, primary, secondary, href }) => {
                  const content = (
                    <>
                      <span className="contact-method__icon">
                        <Icon aria-hidden size={17} />
                      </span>
                      <span className="contact-method__label">{label}</span>
                      <span className="contact-method__primary">{primary}</span>
                      <span className="contact-method__secondary">{secondary}</span>
                    </>
                  );
                  return href ? (
                    <a key={label} href={href} className="contact-method">
                      {content}
                    </a>
                  ) : (
                    <div key={label} className="contact-method">
                      {content}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* RIGHT — premium form */}
          <motion.div className="contact-form-col" {...seq(0.3)}>
            <div className="contact-form-card">
              <div className="contact-form-card__header">
                <span className="contact-form-card__icon">
                  <Mail aria-hidden size={20} />
                </span>
                <div>
                  <p className="contact-form-card__title">Send me a message</p>
                  <p className="contact-form-card__sub">Fill in the details and I&apos;ll get back to you soon.</p>
                </div>
              </div>
              <ContactForm defaultProjectType={defaultProjectType} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---- socials (below the two-column layout) ---- */}
      <section className="section section--tight">
        <div className="shell">
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
        </div>
      </section>

      {/* ---- CTA strip ---- */}
      <section className="contact-outro">
        <div className="shell">
          <div className="contact-outro__inner">
            <svg className="contact-outro__wave" viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden>
              <path
                d="M0 150 C 150 40, 300 190, 460 100 S 760 10, 900 120 S 1100 60, 1200 90"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1.4"
                opacity="0.5"
              />
              <path
                d="M0 100 C 180 170, 320 20, 500 110 S 780 190, 940 70 S 1120 150, 1200 40"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1"
                opacity="0.3"
              />
              <path
                d="M0 60 C 200 130, 380 80, 560 150 S 820 40, 1000 130 S 1150 30, 1200 130"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="0.8"
                opacity="0.22"
              />
            </svg>
            <div className="contact-outro__lead">
              <span className="contact-outro__icon">
                <Send aria-hidden size={18} />
              </span>
              <div>
                <p className="contact-outro__title">Ready to start your next project?</p>
                <p className="contact-outro__sub">Let&apos;s turn your ideas into reality with clean code and great design.</p>
              </div>
            </div>
            <Link href="/work" className="contact-outro__link">
              <span>View My Work</span>
              <ArrowUpRight aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
