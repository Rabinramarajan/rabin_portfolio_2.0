"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  ChevronRight,
  Code2,
  FolderOpen,
  Globe,
  Heart,
  Mail,
  MapPin,
  MonitorSmartphone,
  Navigation,
  Phone,
  Rocket,
  Send,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { navigation, profile, secondaryNavigation, SITE_URL } from "@/content/profile";
import { services } from "@/content/services";
import { duration, ease } from "@/lib/motion";
import { Monogram } from "@/components/Logo";
import { MotionToggle } from "@/components/MotionToggle";
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";

/**
 * Routes that exist as their own page but are not in the primary nav — the
 * footer is the only internal link they get, so they stay out of the orphan
 * bucket in the sitemap. Defined in profile.ts alongside the primary nav.
 */
const STANDALONE_ROUTES = secondaryNavigation.standalone;

/*
 * The footer's Navigation column prefers a standalone page over its homepage
 * anchor ("/#skills" -> "/skills"), then appends any standalone route not
 * already covered — so no destination is listed twice under two labels
 * ("Skills … /#skills" directly above "Skills … /skills").
 */
const FOOTER_NAV = (() => {
  const standaloneByPath = new Map(STANDALONE_ROUTES.map((item) => [item.href, item]));
  const seen = new Set<string>();
  const items = navigation.map((item) => {
    const page = item.href.startsWith("/#") ? standaloneByPath.get(item.href.slice(1)) : undefined;
    const resolved = page ?? item;
    seen.add(resolved.href);
    return resolved;
  });
  items.push(...STANDALONE_ROUTES.filter((item) => !seen.has(item.href)));
  return items;
})();

/*
 * The services page renders one continuous showcase rather than per-service
 * anchors, so every entry deep-links to /services itself.
 */
const SERVICE_LINKS = services.slice(0, 7).map((s) => ({ href: "/services", label: s.title, id: s.id }));

const RESOURCE_LINKS = secondaryNavigation.resources;

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
  const rows = 16;
  const cols = 40;
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
  // Presence markers plus the great-circle arcs between them, as in the design.
  const pins: [number, number][] = [
    [64, 52],
    [110, 74],
    [214, 60],
    [268, 92],
    [300, 46],
  ];
  const arcs = pins.slice(0, -1).map(([x1, y1], i) => {
    const [x2, y2] = pins[i + 1];
    return `M ${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - 26} ${x2} ${y2}`;
  });
  return (
    <svg className="ft__map" viewBox={`0 0 ${cols * 8} ${rows * 8}`} aria-hidden focusable="false">
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="1.35" />
      ))}
      {arcs.map((d) => (
        <path key={d} className="ft__map-arc" d={d} />
      ))}
      {pins.map(([x, y]) => (
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
    { icon: Globe, label: SITE_URL.replace(/^https?:\/\//, ""), href: "/" },
  ];

  return (
    <footer className="ft">
      <div className="ft__wrap">
        <div className="ft__card">
          <span className="ft__topo" aria-hidden />

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
                <span className="ft__lockup-mark" aria-hidden>
                  <Monogram />
                </span>
                <span className="ft__lockup-text">
                  <span className="ft__name">{profile.name}</span>
                  <span className="ft__role-tag">{profile.role}</span>
                </span>
              </span>

              <p className="ft__blurb">
                I build scalable, high-performance web applications with modern technologies and exceptional
                user experiences.
              </p>

              <ul className="ft__contact">
                {contactRows.map(({ icon: Icon, label, href }) => (
                  <li key={label}>
                    <span className="ft__contact-icon" aria-hidden>
                      <Icon size={15} />
                    </span>
                    {href ? <a href={href}>{label}</a> : <span>{label}</span>}
                  </li>
                ))}
              </ul>

              <Link className="ft__cta" href="/#contact">
                Let&apos;s Work Together
                <span className="ft__cta-go" aria-hidden>
                  <ArrowRight size={16} />
                </span>
              </Link>
            </motion.div>

            <motion.nav className="ft__col" aria-label="Footer navigation" {...view(0.05)}>
              <h2 className="ft__label">
                <Navigation size={17} aria-hidden />
                Navigation
              </h2>
              <ul className="ft__links">
                <li>
                  <Link href="/">
                    <ChevronRight size={14} aria-hidden />
                    Home
                  </Link>
                </li>
                {FOOTER_NAV.map((item) => (
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
              <h2 className="ft__label">
                <Briefcase size={17} aria-hidden />
                Services
              </h2>
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
              <h2 className="ft__label">
                <FolderOpen size={17} aria-hidden />
                Resources
              </h2>
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
              <h2 className="ft__label">
                <Send size={17} aria-hidden />
                Stay Updated
              </h2>
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
                  <ArrowRight size={18} aria-hidden />
                </button>
              </form>
              <DotMap />
            </motion.div>
          </div>

          <motion.ul className="ft__pillars" {...view(0.1)}>
            {PILLARS.map(({ icon: Icon, title, copy }) => (
              <li key={title}>
                <span className="ft__pillar-icon" aria-hidden>
                  <Icon size={24} />
                </span>
                <span className="ft__pillar-text">
                  <strong>{title}</strong>
                  <span>{copy}</span>
                </span>
              </li>
            ))}
          </motion.ul>

          <div className="ft__legal">
            <div className="ft__legal-text">
              <p>
                © {new Date().getFullYear()} {profile.name}. All rights reserved.
              </p>
              <p>
                {/* The heart is decorative, so it is hidden from assistive tech. Without a
                    text equivalent the sentence read as "Built with using Next.js…" to a
                    screen reader, so the word it stands in for is supplied here. */}
                Built with <Heart size={13} aria-hidden className="ft__heart" />
                <span className="sr-only">love</span> using{" "}
                <Link href="/skills">Next.js</Link>, <Link href="/skills">React</Link> and{" "}
                <Link href="/skills">TypeScript</Link>.
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
                          <Icon width={20} height={20} size={20} aria-hidden />
                        </a>
                      </li>
                    );
                  })}
              </ul>
            </div>

            <Link className="ft__avail" href="/#contact">
              <span className="ft__avail-icon" aria-hidden>
                <Rocket size={22} />
              </span>
              <span className="ft__avail-text">
                <strong>{profile.availability.label}</strong>
                <span>Let&apos;s build something great together!</span>
              </span>
              <span className="ft__avail-go" aria-hidden>
                <ArrowUpRight size={18} />
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
