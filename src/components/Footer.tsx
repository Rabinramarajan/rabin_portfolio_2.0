"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  ChevronRight,
  Code2,
  Heart,
  Mail,
  MapPin,
  MonitorSmartphone,
  Phone,
  Send,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { navigation, profile } from "@/content/profile";
import { services } from "@/content/services";
import { duration, ease } from "@/lib/motion";
import { Logo } from "@/components/Logo";
import { MotionToggle } from "@/components/MotionToggle";
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";

/**
 * Routes that exist as their own page but are not in the primary nav — the
 * footer is the only internal link they get, so they stay out of the orphan
 * bucket in the sitemap.
 */
const STANDALONE_ROUTES = [
  { href: "/skills", label: "Skills" },
  { href: "/process", label: "Process" },
  { href: "/insights", label: "Insights" },
];

/*
 * The services page renders one continuous showcase rather than per-service
 * anchors, so every entry deep-links to /services itself.
 */
const SERVICE_LINKS = services.slice(0, 6).map((s) => ({ href: "/services", label: s.title, id: s.id }));

const RESOURCE_LINKS = [
  { href: "/work", label: "Case Studies" },
  { href: "/insights", label: "Articles" },
  { href: "/pricing", label: "Engagement Models" },
  { href: profile.resumePath, label: "Résumé" },
  { href: "/skills", label: "Tech Stack" },
  { href: "/#faq", label: "FAQs" },
];

const PILLARS = [
  { icon: Zap, title: "Fast & Performant", copy: "Optimized for speed and performance" },
  { icon: ShieldCheck, title: "Secure & Reliable", copy: "Best practices for security and reliability" },
  { icon: Code2, title: "Clean & Maintainable", copy: "Clean code that is easy to maintain" },
  { icon: MonitorSmartphone, title: "Responsive Design", copy: "Perfect experience on all devices" },
  { icon: Users, title: "Client Focused", copy: "Dedicated to delivering client success" },
];

const SOCIAL_ICONS = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  email: Mail,
} as const;

/** Dot-matrix world silhouette — decorative texture behind the newsletter column. */
function DotMap() {
  const rows = 14;
  const cols = 34;
  const dots: { x: number; y: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Two soft landmasses either side of the meridian, thinned toward the poles.
      const nx = c / (cols - 1);
      const ny = r / (rows - 1);
      const polar = Math.sin(ny * Math.PI);
      const west = Math.exp(-(((nx - 0.22) / 0.16) ** 2));
      const east = Math.exp(-(((nx - 0.66) / 0.26) ** 2));
      if ((west + east) * polar > 0.45) dots.push({ x: c * 8 + 4, y: r * 8 + 4 });
    }
  }
  return (
    <svg className="ft__map" viewBox={`0 0 ${cols * 8} ${rows * 8}`} aria-hidden focusable="false">
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="1.35" />
      ))}
      {/* Presence markers — Chennai plus the three timezones I work across. */}
      {[
        [58, 46],
        [96, 62],
        [186, 54],
        [232, 78],
      ].map(([x, y]) => (
        <circle key={`p-${x}`} className="ft__map-pin" cx={x} cy={y} r="2.6" />
      ))}
    </svg>
  );
}

export function Footer() {
  const reduce = useReducedMotion();
  const [email, setEmail] = useState("");

  const view = (delay = 0) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: reduce ? duration.micro : duration.section, delay: reduce ? 0 : delay, ease },
  });

  /*
   * No newsletter backend exists yet, so the form composes a subscribe mail
   * instead of silently dropping the address.
   */
  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const subject = encodeURIComponent("Subscribe to updates");
    const body = encodeURIComponent(`Please add ${email} to your updates list.`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const contactRows = [
    { icon: MapPin, label: profile.location, href: null },
    { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, label: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
  ];

  return (
    <footer className="ft">
      <div className="ft__wrap">
        <div className="ft__card">
          <span className="ft__topo" aria-hidden />

          <div className="ft__top">
            <motion.div className="ft__brand" {...view(0)}>
              <Link href="/" aria-label={`${profile.name} — home`} className="ft__lockup">
                <Logo showWordmark={false} />
                <span className="ft__lockup-text">
                  <span className="ft__name">
                    {profile.name}
                    <i aria-hidden />
                  </span>
                  <span className="ft__role-tag">{profile.role}</span>
                </span>
              </Link>

              <p className="ft__blurb">
                I build scalable, high-performance web applications with modern technologies and exceptional
                user experiences.
              </p>

              <ul className="ft__contact">
                {contactRows.map(({ icon: Icon, label, href }) => (
                  <li key={label}>
                    <Icon size={16} aria-hidden />
                    {href ? <a href={href}>{label}</a> : <span>{label}</span>}
                  </li>
                ))}
              </ul>

              <Link className="ft__cta" href="/#contact">
                Let&apos;s Work Together
                <ArrowUpRight size={18} aria-hidden />
              </Link>
            </motion.div>

            <motion.nav className="ft__col" aria-label="Footer navigation" {...view(0.05)}>
              <h3 className="ft__label">Navigation</h3>
              <ul className="ft__links">
                <li>
                  <Link href="/">
                    <ChevronRight size={14} aria-hidden />
                    Home
                  </Link>
                </li>
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <ChevronRight size={14} aria-hidden />
                      {item.label}
                    </Link>
                  </li>
                ))}
                {STANDALONE_ROUTES.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <ChevronRight size={14} aria-hidden />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>

            <motion.div className="ft__col" {...view(0.1)}>
              <h3 className="ft__label">Services</h3>
              <ul className="ft__links">
                {SERVICE_LINKS.map((item) => (
                  <li key={item.id}>
                    <Link href={item.href}>
                      <ChevronRight size={14} aria-hidden />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div className="ft__col" {...view(0.15)}>
              <h3 className="ft__label">Resources</h3>
              <ul className="ft__links">
                {RESOURCE_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <ChevronRight size={14} aria-hidden />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div className="ft__col ft__news" {...view(0.2)}>
              <h3 className="ft__label">Stay Updated</h3>
              <p className="ft__news-copy">
                Get the latest insights on Angular, web development, and tech trends.
              </p>
              <form className="ft__form" onSubmit={subscribe}>
                <label className="sr-only" htmlFor="ft-email">
                  Your email address
                </label>
                <input
                  id="ft-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" aria-label="Subscribe">
                  <Send size={18} aria-hidden />
                </button>
              </form>
              <DotMap />
            </motion.div>
          </div>



          <div className="ft__legal">
            <div className="ft__legal-text">
              <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
              <p>
                Built with <Heart size={13} aria-hidden className="ft__heart" /> using{" "}
                <Link href="/skills">Angular &amp; Next.js</Link>.
              </p>
            </div>

            <div className="ft__connect">
              <span className="ft__connect-label">Let&apos;s connect</span>
              <ul>
                {profile.socials
                  .filter((s) => s.id !== "website")
                  .map((s) => {
                    const Icon = SOCIAL_ICONS[s.id as keyof typeof SOCIAL_ICONS] ?? Mail;
                    return (
                      <li key={s.id}>
                        <a
                          href={s.href}
                          aria-label={s.label}
                          {...(s.href.startsWith("http")
                            ? // rel="me" declares these as the same person's verified profiles.
                              { target: "_blank", rel: "me noopener noreferrer" }
                            : {})}
                        >
                          <Icon width={18} height={18} size={18} aria-hidden />
                        </a>
                      </li>
                    );
                  })}
              </ul>
            </div>

            <Link className="ft__avail" href="/#contact">
              <span className="ft__avail-dot" aria-hidden />
              <span className="ft__avail-text">
                <strong>{profile.availability.label}</strong>
                <span>Let&apos;s build something great together!</span>
              </span>
              <span className="ft__avail-go" aria-hidden>
                <ArrowUpRight size={16} />
              </span>
            </Link>
          </div>

          <div className="ft__prefs">
            <MotionToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
