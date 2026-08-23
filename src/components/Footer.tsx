"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { footerNavigation, profile } from "@/content/profile";
import { duration, ease } from "@/lib/motion";
import { Monogram } from "@/components/Logo";
import { MotionToggle } from "@/components/MotionToggle";
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";

const SOCIAL_ICONS = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  email: Mail,
} as const;

/*
 * The footer shows only the profiles that have a real icon and a real
 * destination — "website" is dropped because it points back at the page the
 * visitor is already on.
 */
const SOCIALS = profile.socials.filter(
  (s): s is (typeof profile.socials)[number] & { id: keyof typeof SOCIAL_ICONS } => s.id in SOCIAL_ICONS,
);

export function Footer() {
  const reduce = useReducedMotion();

  const view = (delay = 0) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: reduce ? duration.micro : duration.section, delay: reduce ? 0 : delay, ease },
  });

  return (
    <footer className="ft">
      <div className="ft__card">
        {/* Crest — the brand mark notched into the top edge, flanked by the
            hairline rail and its two terminal dots. */}
        <div className="ft__crest">
          <span className="ft__crest-rail" aria-hidden />
          <Link href="/" className="ft__crest-badge" aria-label={`${profile.name} — home`}>
            <Monogram />
          </Link>
          <span className="ft__crest-rail" aria-hidden />
        </div>

        <div className="ft__top">
          <motion.div className="ft__brand" {...view(0)}>
            <span className="ft__lockup">
              <span className="ft__name">{profile.name}</span>
              <span className="ft__role-tag">{profile.role}</span>
            </span>

            <p className="ft__blurb">
              Building scalable, high-performance digital experiences with modern frontend engineering.
            </p>

            <Link className="ft__cta" href="/contact">
              Let&apos;s Work Together
              <span className="ft__cta-go" aria-hidden>
                <ArrowRight size={16} />
              </span>
            </Link>
          </motion.div>

          <motion.div className="ft__cols" {...view(0.05)}>
            <nav className="ft__col" aria-labelledby="ft-explore">
              <h2 className="ft__label" id="ft-explore">
                Explore
              </h2>
              <ul className="ft__links">
                {footerNavigation.explore.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="ft__col" aria-labelledby="ft-resources">
              <h2 className="ft__label" id="ft-resources">
                Resources
              </h2>
              <ul className="ft__links">
                {footerNavigation.resources.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="ft__col" aria-labelledby="ft-connect">
              <h2 className="ft__label" id="ft-connect">
                Connect
              </h2>
              <ul className="ft__links ft__links--social">
                {SOCIALS.map((s) => {
                  const Icon = SOCIAL_ICONS[s.id];
                  const external = s.href.startsWith("http");
                  return (
                    <li key={s.id}>
                      <a
                        href={s.href}
                        // rel="me" declares these as the same person's verified profiles.
                        {...(external ? { target: "_blank", rel: "me noopener noreferrer" } : {})}
                      >
                        <Icon width={16} height={16} size={16} aria-hidden />
                        {s.label}
                        {external ? <ArrowUpRight size={13} aria-hidden className="ft__ext" /> : null}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>
        </div>

        <div className="ft__avail">
          <p className="ft__avail-text">
            <strong>{profile.availability.label}</strong>
            <span>Let&apos;s build something great together.</span>
          </p>
          <Link className="ft__avail-cta" href="/contact">
            Start a Conversation
            <ArrowUpRight size={16} aria-hidden />
          </Link>
        </div>

        <div className="ft__legal">
          <p>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <p className="ft__built">
            Built with <Link href="/skills">Next.js</Link> and <Link href="/skills">React</Link>.
          </p>
          <MotionToggle />
        </div>
      </div>
    </footer>
  );
}
