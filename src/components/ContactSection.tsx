"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Clock,
  Headphones,
  LoaderCircle,
  Mail,
  MapPin,
  PencilLine,
  Phone,
  Send,
  ShieldCheck,
  Tag,
  User,
} from "lucide-react";
import { profile } from "@/content/profile";
import { duration, ease } from "@/lib/motion";
import { Monogram } from "@/components/Logo";
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";

const SOCIAL_ICONS = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  email: Mail,
} as const;

/**
 * Short-form schema for the homepage panel. The full qualifying form lives on
 * /contact — this one only asks the four things the visitor can answer without
 * thinking, and the API route fills the rest in as unspecified.
 */
const quickContactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120, "Name is too long."),
  email: z.email("Enter a valid email address.").trim(),
  subject: z.string().trim().min(3, "Add a short subject.").max(160, "Subject is too long."),
  message: z
    .string()
    .trim()
    .min(20, "Tell me a little more — 20 characters or so.")
    .max(3000, "Message is too long."),
  /** Honeypot — must stay empty. */
  website: z.string().optional(),
});

type QuickContact = z.infer<typeof quickContactSchema>;

/**
 * Decorative dot-globe with the dashed flight path and paper plane behind the
 * left column. Purely ornamental — hidden from assistive tech.
 */
function DotGlobe() {
  const dots = useMemo(() => {
    const out: { x: number; y: number; r: number; o: number }[] = [];
    const radius = 150;
    const rings = 22;
    for (let i = 1; i < rings; i++) {
      const phi = (i / rings) * Math.PI;
      const ringRadius = Math.sin(phi) * radius;
      const y = -Math.cos(phi) * radius;
      const count = Math.max(6, Math.round(Math.sin(phi) * 34));
      for (let j = 0; j < count; j++) {
        const theta = (j / count) * Math.PI * 2;
        const z = Math.sin(theta) * ringRadius;
        // Fade the far hemisphere so the sphere reads as volume, not a flat disc.
        const depth = (z + radius) / (2 * radius);
        out.push({
          x: 230 + Math.cos(theta) * ringRadius,
          y: 210 + y * 0.94,
          r: 0.6 + depth * 1.05,
          o: 0.1 + depth * 0.5,
        });
      }
    }
    return out;
  }, []);

  return (
    <svg className="cx__globe" viewBox="0 0 520 420" aria-hidden focusable="false">
      <g className="cx__globe-dots">
        {dots.map((d, i) => (
          <circle key={i} cx={d.x.toFixed(8)} cy={d.y.toFixed(8)} r={d.r.toFixed(8)} opacity={d.o.toFixed(8)} />
        ))}
      </g>
      <path className="cx__trail" d="M120 330 C 190 330, 300 296, 352 190 C 376 142, 404 116, 440 106" />
      <g className="cx__plane" transform="translate(430 78)">
        <path d="M2 26 L48 2 L28 50 L21 30 Z" />
      </g>
    </svg>
  );
}

export function ContactSection() {
  const reduce = useReducedMotion();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuickContact>({
    resolver: zodResolver(quickContactSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", subject: "", message: "", website: "" },
  });

  const view = (delay = 0) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: reduce ? duration.micro : duration.section, delay: reduce ? 0 : delay, ease },
  });

  /*
   * Posts to the same /api/contact route the full form uses. That route's schema
   * expects the qualifying fields, so the subject is folded into the message body
   * and the fields this panel doesn't ask for are sent as explicit placeholders
   * rather than being silently dropped.
   */
  async function onSubmit(values: QuickContact) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          company: "",
          projectType: "Other",
          budget: "Not specified",
          timeline: "Not specified",
          message: `Subject: ${values.subject}\n\n${values.message}`,
          website: values.website ?? "",
        }),
      });

      if (res.ok) {
        toast.success("Message received — I'll get back to you shortly.");
        reset();
        return;
      }

      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      toast.error(body?.error ?? "Could not send. Please email me directly.");
    } catch {
      toast.error("Something went wrong. Please try again or email me directly.");
    }
  }

  const infoCards = [
    { icon: MapPin, label: "Location", value: profile.location, sub: "Open to remote & hybrid" },
    {
      icon: Mail,
      label: "Email",
      value: profile.email,
      sub: "I'll get back to you soon!",
      href: `mailto:${profile.email}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: profile.phone,
      sub: `${profile.phoneHours} IST`,
      href: `tel:${profile.phone.replace(/\s/g, "")}`,
    },
    { icon: Clock, label: "Response time", value: "Usually within 24 hours", sub: "Quick & reliable support" },
  ];

  const socials = profile.socials.filter((s) => s.id !== "website");

  return (
    <section id="contact" className="section cx">
      <div className="shell cx__grid">
        {/* ---------- Left: pitch + contact details ---------- */}
        <motion.div className="cx__intro" {...view(0)}>
          <DotGlobe />

          <p className="cx__eyebrow">
            <span className="cx__eyebrow-dot" aria-hidden />
            Let&apos;s connect
            <span className="cx__eyebrow-rule" aria-hidden />
          </p>

          <h2 className="cx__title">
            Let&apos;s Build
            <span>Something Amazing</span>
          </h2>

          <span className="cx__title-bar" aria-hidden />

          <p className="cx__lede">
            Have a project in mind or want to collaborate?
            <br />
            I&apos;m always open to discussing new ideas and opportunities.
          </p>

          <ul className="cx__info">
            {infoCards.map(({ icon: Icon, label, value, sub, href }) => (
              <li key={label} className="cx__info-card">
                <span className="cx__info-icon" aria-hidden>
                  <Icon size={22} />
                </span>
                <span className="cx__info-body">
                  <span className="cx__info-label">{label}</span>
                  {href ? (
                    <a className="cx__info-value" href={href}>
                      {value}
                    </a>
                  ) : (
                    <span className="cx__info-value">{value}</span>
                  )}
                  <span className="cx__info-sub">{sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* ---------- Right: message form + alternate channels ---------- */}
        <div className="cx__right">
          <motion.div className="cx__panel" {...view(0.08)}>
            <span className="cx__badge" aria-hidden>
              <Monogram />
            </span>

            <h3 className="cx__panel-title" id="cx-form-title">
              <span className="cx__panel-dot" aria-hidden />
              Send Me a Message
            </h3>
            <p className="cx__panel-sub">
              Fill out the form below and I&apos;ll get back to you as soon as possible.
            </p>

            <form className="cx__form" onSubmit={handleSubmit(onSubmit)} aria-labelledby="cx-form-title" noValidate>
              {/* Honeypot */}
              <div className="hp" aria-hidden>
                <label>
                  Website
                  <input tabIndex={-1} autoComplete="off" {...register("website")} />
                </label>
              </div>

              <div className="cx__row">
                <div className="cx__field">
                  <label htmlFor="cx-name">Your name</label>
                  <div className={`cx__input${errors.name ? " is-invalid" : ""}`}>
                    <User size={18} aria-hidden />
                    <input
                      id="cx-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Enter your name"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "cx-name-err" : undefined}
                      {...register("name")}
                    />
                  </div>
                  {errors.name ? (
                    <p className="cx__err" id="cx-name-err" role="alert">
                      {errors.name.message}
                    </p>
                  ) : null}
                </div>

                <div className="cx__field">
                  <label htmlFor="cx-email">Email address</label>
                  <div className={`cx__input${errors.email ? " is-invalid" : ""}`}>
                    <Mail size={18} aria-hidden />
                    <input
                      id="cx-email"
                      type="email"
                      autoComplete="email"
                      placeholder="Enter your email"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "cx-email-err" : undefined}
                      {...register("email")}
                    />
                  </div>
                  {errors.email ? (
                    <p className="cx__err" id="cx-email-err" role="alert">
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="cx__field">
                <label htmlFor="cx-subject">Subject</label>
                <div className={`cx__input${errors.subject ? " is-invalid" : ""}`}>
                  <Tag size={18} aria-hidden />
                  <input
                    id="cx-subject"
                    type="text"
                    placeholder="What's this about?"
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? "cx-subject-err" : undefined}
                    {...register("subject")}
                  />
                </div>
                {errors.subject ? (
                  <p className="cx__err" id="cx-subject-err" role="alert">
                    {errors.subject.message}
                  </p>
                ) : null}
              </div>

              <div className="cx__field">
                <label htmlFor="cx-message">Your message</label>
                <div className={`cx__input cx__input--area${errors.message ? " is-invalid" : ""}`}>
                  <PencilLine size={18} aria-hidden />
                  <textarea
                    id="cx-message"
                    rows={6}
                    placeholder="Tell me about your project or idea..."
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "cx-message-err" : undefined}
                    {...register("message")}
                  />
                </div>
                {errors.message ? (
                  <p className="cx__err" id="cx-message-err" role="alert">
                    {errors.message.message}
                  </p>
                ) : null}
              </div>

              <div className="cx__actions">
                <button className="cx__submit" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <LoaderCircle className="form__spin" size={20} aria-hidden />
                  ) : (
                    <Send size={20} aria-hidden />
                  )}
                  {isSubmitting ? "Sending…" : "Send Message"}
                  <ArrowRight className="cx__submit-go" size={20} aria-hidden />
                </button>

                <p className="cx__assure">
                  <ShieldCheck size={22} aria-hidden />
                  <span>
                    <strong>100% Confidential</strong>
                    Your information is safe
                  </span>
                </p>
              </div>
            </form>
          </motion.div>

          <motion.div className="cx__alt" {...view(0.16)}>
            <div className="cx__alt-social">
              <h3 className="cx__alt-label">Prefer other ways to connect?</h3>
              <ul>
                {socials.map((s) => {
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
                        <Icon width={22} height={22} size={22} aria-hidden />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <p className="cx__alt-pitch">
              <Headphones size={40} aria-hidden />
              <span>
                Let&apos;s turn your ideas
                <br />
                into <em>real products.</em>
              </span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
