"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { navigation, profile } from "@/content/profile";
import { duration, ease } from "@/lib/motion";
import { useScrollSync } from "@/lib/scroll-sync";
import { Logo } from "@/components/Logo";
import { MotionToggle } from "@/components/MotionToggle";

/** Routes that exist as their own page but are not in the primary nav. */
const STANDALONE_ROUTES = [
  { href: "/skills", label: "Skills" },
  { href: "/process", label: "Process" },
  { href: "/pricing", label: "Pricing" },
  { href: "/insights", label: "Insights" },
  { href: "/resume", label: "Résumé" },
];

export function Footer() {
  const reduce = useReducedMotion();
  const { percent } = useScrollSync();

  const view = (delay = 0) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: reduce ? duration.micro : duration.section, delay: reduce ? 0 : delay, ease },
  });

  /*
   * The primary nav points Skills/Process/Contact at homepage anchors, which
   * left the standalone /skills, /process and /pricing routes orphaned — in the
   * sitemap but reachable by no internal link. The footer is where they get one.
   */
  return (
    <footer className="ft">
      <div className="shell">
        <div className="ft__top">
          <motion.div className="ft__brand" {...view(0)}>
            <Link href="/" aria-label="Rabin R — home" className="logo">
              <Logo showWordmark={false} />
            </Link>
            <p className="ft__role">
              Angular specialist. React / Next.js when the product asks for it. Chennai, working worldwide.
            </p>
          </motion.div>

          <motion.nav className="ft__nav" aria-label="Footer" {...view(0.05)}>
            <h3 className="ft__label">Navigate</h3>
            <ul>
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
              {STANDALONE_ROUTES.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          <motion.div className="ft__social" {...view(0.1)}>
            <h3 className="ft__label">Elsewhere</h3>
            <ul>
              {profile.socials
                .filter((s) => s.id !== "website")
                .map((s) => (
                  <li key={s.id}>
                    <a
                      href={s.href}
                      {...(s.href.startsWith("http")
                        ? // rel="me" declares these as the same person's verified profiles.
                          { target: "_blank", rel: "me noopener noreferrer" }
                        : {})}
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
            </ul>
          </motion.div>

          <motion.div {...view(0.15)}>
            <h3 className="ft__label">Availability</h3>
            <p className="muted" style={{ fontSize: "var(--text-sm)" }}>
              {profile.availability.label}
            </p>
            <a className="ft__email" href={"mailto:" + profile.email}>
              {profile.email}
            </a>
          </motion.div>
        </div>

        <div className="ft__legal">
          <p>© 2026 Rabin R. All rights reserved.</p>
          <p>
            <Link href="/work">Selected work</Link> · <Link href="/services">Angular &amp; frontend services</Link>{" "}
            · Built with Next.js and Motion
          </p>
          <p className="ft__read">{percent}%</p>
          <MotionToggle />
        </div>
      </div>
    </footer>
  );
}