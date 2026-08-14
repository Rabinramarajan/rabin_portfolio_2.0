"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { navigation, profile } from "@/content/profile";
import { duration, ease } from "@/lib/motion";
import { Logo } from "@/components/Logo";

export function Footer() {
  const reduce = useReducedMotion();

  const view = (delay = 0) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: reduce ? duration.micro : duration.section, delay: reduce ? 0 : delay, ease },
  });

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
              <li>
                <Link href="/resume">Résumé</Link>
              </li>
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
                      {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
            <Link href="/work">Work</Link> · <Link href="/insights">Insights</Link> · Next.js · Motion
          </p>
        </div>
      </div>
    </footer>
  );
}