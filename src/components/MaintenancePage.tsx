"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Magnetic } from "@/components/motion";
import { SmartImage } from "@/components/SmartImage";
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";
import { useMotionTier } from "@/lib/motion-tier";
import { profile } from "@/content/profile";
import "./maintenance.css";

/* The window the countdown runs against. Kept as a single constant so the
   copy ("back in ~2.5 days") and the timer can never drift apart. */
const WINDOW_MS = 2.6 * 24 * 60 * 60 * 1000;
const PROGRESS = 75;

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

const ZERO: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function remaining(target: number): TimeLeft {
  const diff = target - Date.now();
  if (diff <= 0) return ZERO;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/* --- icons (stroke-only, 24-grid, matched to the site's line weight) --- */

type IconProps = { className?: string };

function ClockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CodeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M8.5 8 4 12l4.5 4M15.5 8 20 12l-4.5 4M13.5 5l-3 14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BrushIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M19.5 4.5a2.1 2.1 0 0 0-3 0l-7.2 7.2 3 3 7.2-7.2a2.1 2.1 0 0 0 0-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8.4 14.2c-1.5-.5-3.2.3-3.7 1.9-.3 1-.9 1.7-1.7 2.2 1.5 1.3 4.2 1.6 5.6.2.9-.9 1-2.2.5-3.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RocketIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M14.2 4.6c2.6-1.3 5.2-1.1 5.2-1.1s.2 2.6-1.1 5.2c-1.1 2.3-3 4.3-5.1 5.8l-3.7-3.7c1.5-2.1 3.4-4.1 4.7-6.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m9.5 10.8-2.9.6-2 2 2.4 1M13.2 14.5l-.6 2.9-2 2-1-2.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m6.2 17.8-1.7 1.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M12 3.2 5.5 5.6v5.1c0 4 2.7 7.7 6.5 9.1 3.8-1.4 6.5-5.1 6.5-9.1V5.6L12 3.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="m9.4 11.8 1.9 1.9 3.4-3.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="m4.5 8 6.6 4.7a1.5 1.5 0 0 0 1.8 0L19.5 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.5 3h3.1l-6.8 7.7L21.8 21h-6.2l-4.9-6.3L5.1 21H2l7.3-8.3L2.4 3h6.4l4.4 5.8L17.5 3Zm-1.1 16.1h1.7L7.7 4.8H5.9l10.5 14.3Z" />
    </svg>
  );
}

function SendIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M20.5 3.5 3.8 9.8c-.8.3-.8 1.4 0 1.7l6.4 2.3 2.3 6.4c.3.8 1.4.8 1.7 0l6.3-16.7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="m10.2 13.8 4.1-4.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const PILLARS = [
  { Icon: ClockIcon, label: "Improving", value: "Performance" },
  { Icon: CodeIcon, label: "Refining", value: "Code" },
  { Icon: BrushIcon, label: "Enhancing", value: "Design" },
  { Icon: RocketIcon, label: "Better Than", value: "Before" },
] as const;

export function MaintenancePage() {
  const reduce = useReducedMotion();
  const { tier } = useMotionTier();
  const quiet = Boolean(reduce) || tier === "basic";

  /* The deadline is fixed on mount so the ticking display can never disagree
     with itself between frames. */
  const target = useRef<number>(0);
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(ZERO);

  useEffect(() => {
    target.current = Date.now() + WINDOW_MS;
    setTimeLeft(remaining(target.current));
    setMounted(true);

    const id = window.setInterval(() => {
      setTimeLeft(remaining(target.current));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const handleSubscribe = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!email || state !== "idle") return;
      setState("loading");
      await new Promise((resolve) => setTimeout(resolve, 700));
      setState("done");
      setEmail("");
      setTimeout(() => setState("idle"), 4000);
    },
    [email, state],
  );

  const socials = useMemo(() => {
    const find = (id: string) => profile.socials.find((s) => s.id === id)?.href;
    return [
      { id: "linkedin", label: "LinkedIn", href: find("linkedin") ?? "#", Icon: LinkedinIcon },
      { id: "github", label: "GitHub", href: find("github") ?? "#", Icon: GithubIcon },
      { id: "x", label: "X", href: "https://x.com/", Icon: XIcon },
      { id: "email", label: "Email", href: `mailto:${profile.email}`, Icon: MailIcon },
    ];
  }, []);

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: quiet ? 0.04 : 0.08, delayChildren: 0.08 } },
  };

  const rise = {
    hidden: { opacity: 0, y: quiet ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: quiet ? 0.24 : 0.62, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const units: Array<[string, number]> = [
    ["Days", timeLeft.days],
    ["Hours", timeLeft.hours],
    ["Minutes", timeLeft.minutes],
    ["Seconds", timeLeft.seconds],
  ];

  return (
    <div className="mnt" data-quiet={quiet ? "true" : "false"}>
      {/* Ambient backdrop: grid, radial lime bloom, scanning sweep. All CSS —
          no per-frame JS — so it costs nothing on the main thread. */}
      <div className="mnt__bg" aria-hidden>
        <div className="mnt__bg-grid" />
        <div className="mnt__bg-bloom" />
        <div className="mnt__bg-vignette" />
      </div>

      <motion.div className="mnt__shell" variants={stagger} initial="hidden" animate="visible">
        <motion.header className="mnt__topbar" variants={rise}>
          <div className="mnt__brand">
            <span className="mnt__brand-mark" aria-hidden>
              R
            </span>
            <span className="mnt__brand-text">
              <span className="mnt__brand-name">{profile.name}</span>
              <span className="mnt__brand-role">{profile.role}</span>
            </span>
          </div>

          <Magnetic>
            <a className="mnt__mail-pill" href={`mailto:${profile.email}`}>
              <MailIcon className="mnt__mail-pill-icon" />
              <span>{profile.email}</span>
            </a>
          </Magnetic>
        </motion.header>

        <div className="mnt__grid">
          {/* ---------------- left column ---------------- */}
          <div className="mnt__col mnt__col--copy">
            <motion.p className="mnt__eyebrow" variants={rise}>
              We&rsquo;re making things better
            </motion.p>

            <motion.h1 className="mnt__title" variants={rise}>
              <span className="mnt__title-line">Under</span>
              <span className="mnt__title-line mnt__title-line--accent">Maintenance</span>
            </motion.h1>

            <motion.span className="mnt__rule" variants={rise} aria-hidden />

            <motion.p className="mnt__lede" variants={rise}>
              I&rsquo;m currently working on something awesome.
              <br />
              The site will be back soon with an even better experience.
            </motion.p>

            <motion.ul className="mnt__pillars" variants={rise}>
              {PILLARS.map(({ Icon, label, value }) => (
                <li key={value} className="mnt__pillar">
                  <Icon className="mnt__pillar-icon" />
                  <span className="mnt__pillar-label">{label}</span>
                  <span className="mnt__pillar-value">{value}</span>
                </li>
              ))}
            </motion.ul>

            <motion.section className="mnt__notify" variants={rise} aria-labelledby="mnt-notify-title">
              <h2 className="mnt__notify-title" id="mnt-notify-title">
                Stay in the loop
              </h2>
              <p className="mnt__notify-text">
                Leave your email and I&rsquo;ll notify you
                <br />
                once we&rsquo;re live again.
              </p>

              <form className="mnt__form" onSubmit={handleSubscribe}>
                <div className="mnt__field">
                  <label className="sr-only" htmlFor="mnt-email">
                    Email address
                  </label>
                  <input
                    id="mnt-email"
                    className="mnt__input"
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={state !== "idle"}
                    required
                  />
                  <Magnetic>
                    <button className="mnt__submit" type="submit" disabled={state !== "idle"} data-state={state}>
                      <span className="mnt__submit-label">
                        {state === "done" ? "Subscribed" : state === "loading" ? "Sending" : "Notify Me"}
                      </span>
                      <SendIcon className="mnt__submit-icon" />
                    </button>
                  </Magnetic>
                </div>

                <p className="mnt__fineprint" role="status">
                  <ShieldIcon className="mnt__fineprint-icon" />
                  {state === "done"
                    ? "You're on the list — I'll email you the moment it's live."
                    : "No spam. Only updates about new launches and articles."}
                </p>
              </form>
            </motion.section>

            <motion.div className="mnt__social" variants={rise}>
              <p className="mnt__social-label">Follow for updates</p>
              <ul className="mnt__social-list">
                {socials.map(({ id, label, href, Icon }) => (
                  <li key={id}>
                    <a
                      className="mnt__social-link"
                      href={href}
                      aria-label={label}
                      {...(href.startsWith("http")
                        ? { target: "_blank", rel: "noreferrer noopener" }
                        : {})}
                    >
                      <Icon className="mnt__social-icon" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* ---------------- right column ---------------- */}
          <div className="mnt__col mnt__col--stage">
            <motion.div
              className="mnt__art"
              variants={rise}
              animate={quiet ? undefined : { y: [0, -12, 0] }}
              transition={quiet ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="mnt__art-glow" aria-hidden />
              <SmartImage
                src="/media/under-maintain/1.png"
                alt="A 3D construction scene: a crane lifting an “Upgrading experience” board over a glowing lime letter R, flanked by gears, a barrier and a traffic cone."
                width={1536}
                height={1024}
                priority
                blurColor="#0a0a0c"
                sizes="(max-width: 640px) 94vw, (max-width: 1080px) 82vw, 52vw"
                className="mnt__art-img"
              />
              <span className="mnt__art-floor" aria-hidden />
            </motion.div>

            <motion.section className="mnt__status" variants={rise} aria-labelledby="mnt-status-title">
              <div className="mnt__status-lead">
                <span className="mnt__status-dial" aria-hidden>
                  <ClockIcon className="mnt__status-dial-icon" />
                </span>
                <div>
                  <h2 className="mnt__status-title" id="mnt-status-title">
                    Back Online Soon
                  </h2>
                  <p className="mnt__status-text">
                    We&rsquo;re working hard to bring you
                    <br />a seamless experience.
                  </p>
                  <div className="mnt__progress">
                    <div
                      className="mnt__progress-track"
                      role="progressbar"
                      aria-valuenow={PROGRESS}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Upgrade progress"
                    >
                      <motion.span
                        className="mnt__progress-fill"
                        initial={{ width: quiet ? `${PROGRESS}%` : "0%" }}
                        animate={{ width: `${PROGRESS}%` }}
                        transition={quiet ? { duration: 0 } : { duration: 1.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                    <span className="mnt__progress-value">{PROGRESS}%</span>
                  </div>
                </div>
              </div>

              <div className="mnt__countdown" aria-live="off">
                {units.map(([label, value]) => (
                  <div className="mnt__unit" key={label}>
                    <span className="mnt__unit-value" suppressHydrationWarning>
                      {mounted ? pad(value) : "--"}
                    </span>
                    <span className="mnt__unit-label">{label}</span>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>
        </div>

        <motion.footer className="mnt__footer" variants={rise}>
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
        </motion.footer>
      </motion.div>
    </div>
  );
}
