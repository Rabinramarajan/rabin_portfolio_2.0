"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Mail } from "lucide-react";
import { navigation, profile } from "@/content/profile";
import { duration, ease } from "@/lib/motion";
import { Monogram } from "@/components/Logo";
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";
import { Magnetic } from "@/components/motion";
import { isStandaloneRoute } from "@/lib/chrome-routes";
import { media } from "@/lib/media";
import { displayVersion } from "@/lib/version";

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

/* The closing rail carries four destinations, in the order the site tells its
   story. `navigation` is the single source of truth for the labels and hrefs;
   only the sequence is stated here. */
const RAIL_ORDER = ["/about", "/services", "/work", "/experience"];
const RAIL = RAIL_ORDER.map((href) => navigation.find((n) => n.href === href)).filter(
  (n): n is (typeof navigation)[number] => Boolean(n),
);

/* Standing for the person, not the stack — read top to bottom down the left
   rail, the way the reference lockup does. */
const TRAITS = ["Full Stack", "Developer", "Tech Enthusiast", "Lifelong Learner"];

function FooterInner() {
  const reduce = useReducedMotion();

  const view = (delay = 0) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: reduce ? duration.micro : duration.section, delay: reduce ? 0 : delay, ease },
  });

  return (
    <footer className="ft">
      {/* --- stage: the horizon art and the closing pitch --- */}
      <div className="ft__stage">
        <div className="ft__globe" aria-hidden>
          <Image src={media("other/footer/horizon.png")} alt="" width={1672} height={941} sizes="100vw" />
        </div>

        <div className="ft__stage-inner">
          {/* left rail — dot, hairline, and the four standing labels */}
          <motion.ul className="ft__traits" {...view(0)}>
            {TRAITS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </motion.ul>

          <motion.div className="ft__pitch" {...view(0.05)}>
            <p className="ft__eyebrow">
              <span>Ideas</span>
              <i aria-hidden />
              <span>Code</span>
              <i aria-hidden />
              <span>Impact</span>
            </p>

            <h2 className="ft__headline">
              Let&apos;s build something
              <br />
              <em>exceptional.</em>
            </h2>

            <span className="ft__rule" aria-hidden />

            <Magnetic strength={8}>
              <Link className="ft__cta" href="/contact" data-cursor="button" data-cursor-label="LET'S TALK →">
                Let&apos;s Connect
                <ArrowRight size={16} aria-hidden />
              </Link>
            </Magnetic>
          </motion.div>

          {/* right mark — handwritten promise, decorative only */}
          <p className="ft__script" aria-hidden>
            <span>Build</span>
            <span>Innovate</span>
            <span>Deliver</span>
          </p>
        </div>

        {/* Crest, pinned to the peak of the horizon arc. Both this and the
            artwork are sized from --ft-globe-h, so the badge stays on the arc
            at every width instead of drifting off it. */}
        <div className="ft__crest">
          <span className="ft__crest-stem" aria-hidden />
          <Link href="/" className="ft__crest-badge" aria-label={`${profile.name} — home`}>
            <Monogram />
          </Link>
          <p className="ft__crest-tag">Turning ideas into reality</p>
        </div>
      </div>

      {/* --- closing rail --- */}
      <div className="ft__divider" aria-hidden />

      <div className="ft__bar">
        <nav className="ft__nav" aria-label="Footer">
          <ul>
            {RAIL.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="ft__socials">
          {SOCIALS.map((s) => {
            const Icon = SOCIAL_ICONS[s.id];
            const external = s.href.startsWith("http");
            return (
              <li key={s.id}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  title={s.label}
                  // rel="me" declares these as the same person's verified profiles.
                  {...(external ? { target: "_blank", rel: "me noopener noreferrer" } : {})}
                >
                  <Icon width={16} height={16} size={16} aria-hidden />
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="ft__legal">
        <p>
          © {new Date().getFullYear()} <span className="ft__legal-name">{profile.name}</span>. All rights reserved.
          {/* The running build, linked to the full release ledger. */}
          <Link className="ft__version" href="/version" title="Release history">
            {displayVersion}
          </Link>
        </p>
        <p className="ft__passion">
          <span className="ft__passion-rule" aria-hidden />
          Built with passion
        </p>
      </div>
    </footer>
  );
}

/* The maintenance screen is standalone: it ships its own header and footer, so
   the global chrome stays out of its way. */
export function Footer() {
  const pathname = usePathname();
  if (isStandaloneRoute(pathname)) return null;
  return <FooterInner />;
}
