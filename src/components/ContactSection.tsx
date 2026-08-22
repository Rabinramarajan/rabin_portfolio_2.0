"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  FileText,
  FolderKanban,
  Globe,
  Handshake,
  LoaderCircle,
  Mail,
  MapPin,
  MessageSquare,
  Paperclip,
  Phone,
  Send,
  Tag,
  User,
} from "lucide-react";
import { profile } from "@/content/profile";
import { duration, ease } from "@/lib/motion";
import { Monogram } from "@/components/Logo";
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";
import { SectionKicker } from "@/components/ui";

const quickContactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120, "Name is too long."),
  email: z.email("Enter a valid email address.").trim(),
  subject: z.string().trim().min(3, "Add a short subject.").max(160, "Subject is too long."),
  message: z
    .string()
    .trim()
    .min(30, "Tell me a little more — 30 characters or so.")
    .max(3000, "Message is too long."),
  website: z.string().optional(),
});

type QuickContact = z.infer<typeof quickContactSchema>;

const INFO: Array<{
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}> = [
  {
    icon: Mail,
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: profile.phone,
    href: `tel:${profile.phone.replace(/\s/g, "")}`,
  },
  {
    icon: MapPin,
    label: "Location",
    value: profile.location,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.location)}`,
  },
  {
    icon: Calendar,
    label: "Availability",
    value: profile.availability.label,
    href: "#cx-form-title",
  },
];

const SOCIALS = [
  {
    id: "linkedin",
    label: "LinkedIn",
    href: profile.socials.find((s) => s.id === "linkedin")?.href ?? "https://www.linkedin.com/in/rabinr",
    Icon: LinkedinIcon,
  },
  {
    id: "github",
    label: "GitHub",
    href: profile.socials.find((s) => s.id === "github")?.href ?? "https://github.com/Rabinramarajan",
    Icon: GithubIcon,
  },
  {
    id: "website",
    label: "Website",
    href: profile.socials.find((s) => s.id === "website")?.href ?? "/",
    Icon: Globe,
  },
  {
    id: "resume",
    label: "Resume",
    href: profile.resumePath,
    Icon: FileText,
  },
  {
    id: "email",
    label: "Email",
    href: `mailto:${profile.email}`,
    Icon: Mail,
  },
] as const;

const OPEN_FOR = [
  { icon: Briefcase, label: "Consulting" },
  { icon: FolderKanban, label: "Freelance Projects" },
  { icon: Handshake, label: "Collaborations" },
  { icon: Building2, label: "Full-time Opportunities" },
] as const;

function OrbitMark() {
  return (
    <div className="cx__orbit" aria-hidden>
      <span className="cx__orbit-ring cx__orbit-ring--a" />
      <span className="cx__orbit-ring cx__orbit-ring--b" />
      <span className="cx__orbit-ring cx__orbit-ring--c" />
      <span className="cx__orbit-core">
        <Monogram className="cx__orbit-mark" />
      </span>
      <span className="cx__orbit-dot cx__orbit-dot--a" />
      <span className="cx__orbit-dot cx__orbit-dot--b" />
    </div>
  );
}

function GlobeMap() {
  return (
    <svg className="cx__globe" viewBox="0 0 560 280" role="img" aria-label="Clients across North America, Europe, the Middle East, Asia and Australia">
      <defs>
        <pattern id="cx-dots" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="1.4" cy="1.4" r="1.15" fill="currentColor" />
        </pattern>
        <linearGradient id="cx-arc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.15" />
          <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      <g fill="url(#cx-dots)" opacity="0.55">
        {/* North America */}
        <path d="M78 58c28-18 62-22 92-8 22 10 38 32 42 56 4 26-6 48-22 66-14 16-36 28-58 24-22-4-38-22-54-38-18-18-32-40-28-64 3-16 14-28 28-36z" />
        {/* Central / Caribbean */}
        <path d="M128 148c12 4 22 16 20 28-8 8-20 6-28-2-8-10-4-24 8-26z" />
        {/* South America */}
        <path d="M142 176c18 2 32 18 36 36 4 22-4 44-16 60-10 12-26 16-36 8-8-8-10-24-8-38 4-22 10-44 24-66z" />
        {/* Europe */}
        <path d="M268 52c22-8 44-4 58 10 10 12 8 28-2 38-14 12-34 10-50 2-16-8-18-28-6-50z" />
        {/* Africa */}
        <path d="M272 108c24-4 46 8 54 28 8 22 4 46-6 66-8 16-24 26-40 24-18-2-30-20-34-38-6-24 4-52 26-80z" />
        {/* Middle East / India */}
        <path d="M338 108c18 2 32 16 42 32 8 14 22 22 36 20 12-2 18 10 14 22-8 16-28 22-46 18-22-4-40-18-52-36-12-18-10-42 6-56z" />
        {/* Asia */}
        <path d="M360 48c36-16 78-14 112 4 28 16 48 42 52 72 2 18-8 34-24 40-22 8-46-2-64-16-16 10-36 16-54 8-22-8-32-32-28-54 4-22 4-40 6-54z" />
        {/* SE Asia / archipelago */}
        <path d="M430 168c16 2 30 14 28 26-12 8-28 4-38-6-8-10 0-22 10-20z" />
        {/* Australia */}
        <path d="M468 196c22-4 44 6 52 24 6 16-2 32-18 38-18 6-38-2-48-16-10-16-6-40 14-46z" />
        {/* Japan / islands */}
        <path d="M508 92c10-2 16 8 14 16-8 6-18 4-22-4-4-8 0-12 8-12z" />
      </g>

      <g fill="none" stroke="url(#cx-arc)" strokeWidth="1.2">
        <path d="M132 118 C 210 28, 320 24, 392 138" />
        <path d="M132 118 C 250 70, 330 90, 372 158" />
        <path d="M392 138 C 430 90, 490 120, 500 214" />
        <path d="M372 158 C 300 200, 220 190, 168 214" />
      </g>

      {[
        [132, 118],
        [168, 214],
        [300, 92],
        [372, 158],
        [392, 138],
        [500, 214],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r="10" className="cx__pin-halo" />
          <circle r="4.5" className="cx__pin" />
          <circle r="1.8" className="cx__pin-core" />
        </g>
      ))}
    </svg>
  );
}

export function ContactSection() {
  const reduce = useReducedMotion();
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");

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
    viewport: { once: true, amount: 0.12 },
    transition: { duration: reduce ? duration.micro : duration.section, delay: reduce ? 0 : delay, ease },
  });

  async function onSubmit(values: QuickContact) {
    try {
      const attachmentNote = fileName ? `\n\n[Visitor selected a file named "${fileName}" — not uploaded. Ask them to email it.]` : "";
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          company: "",
          inquiryType: "Other",
          projectType: "Other",
          budget: "Not specified",
          timeline: "Not specified",
          message: `Subject: ${values.subject}\n\n${values.message}${attachmentNote}`,
          website: values.website ?? "",
        }),
      });

      if (res.ok) {
        toast.success("Message received — I'll get back to you shortly.");
        reset();
        setFileName("");
        if (fileRef.current) fileRef.current.value = "";
        return;
      }

      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      toast.error(body?.error ?? "Could not send. Please email me directly.");
    } catch {
      toast.error("Something went wrong. Please try again or email me directly.");
    }
  }

  return (
    <section id="contact" className="section cx">
      <div className="cx__glow" aria-hidden />
      <div className="shell cx__stack">
        <div className="cx__top">
          <motion.div className="cx__intro" {...view(0)}>
            <SectionKicker index="08" label="Contact" />

            <div className="cx__hero">
              <div className="cx__hero-copy">
                <h2 className="cx__title">
                  Let&apos;s Create Something Amazing <em>Together.</em>
                </h2>
                <p className="cx__lede">
                  Have a project in mind or want to collaborate? I&apos;m always open to discussing new ideas,
                  products, and opportunities that deserve careful engineering.
                </p>
                <div className="cx__sign">
                  <p className="cx__sign-name">Rabin R.</p>
                  <p className="cx__sign-role">Frontend Angular Consultant</p>
                </div>
              </div>
              <OrbitMark />
            </div>

            <ul className="cx__info">
              {INFO.map(({ icon: Icon, label, value, href }) => {
                const inner = (
                  <>
                    <span className="cx__info-icon" aria-hidden>
                      <Icon size={18} strokeWidth={1.7} />
                    </span>
                    <span className="cx__info-body">
                      <span className="cx__info-label">{label}</span>
                      <span className="cx__info-value">{value}</span>
                    </span>
                    <span className="cx__info-go" aria-hidden>
                      <ArrowRight size={14} />
                    </span>
                  </>
                );
                return (
                  <li key={label}>
                    {href ? (
                      <a
                        className="cx__info-card"
                        href={href}
                        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="cx__info-card">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </motion.div>

          <motion.div className="cx__panel" {...view(0.08)}>
            <span className="cx__panel-dots" aria-hidden />
            <div className="cx__panel-head">
              <span className="cx__panel-icon" aria-hidden>
                <Send size={22} strokeWidth={1.7} />
              </span>
              <div>
                <h3 className="cx__panel-title" id="cx-form-title">
                  Send a Message
                </h3>
                <p className="cx__panel-sub">Fill out the form and I&apos;ll get back to you as soon as possible.</p>
              </div>
            </div>

            <form className="cx__form" onSubmit={handleSubmit(onSubmit)} aria-labelledby="cx-form-title" noValidate>
              <div className="hp" aria-hidden>
                <label>
                  Website
                  <input tabIndex={-1} autoComplete="off" {...register("website")} />
                </label>
              </div>

              <div className="cx__row">
                <div className="cx__field">
                  <label className="visually-hidden" htmlFor="cx-name">Your Name</label>
                  <div className={`cx__input${errors.name ? " is-invalid" : ""}`}>
                    <User size={16} aria-hidden />
                    <input
                      id="cx-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your Name"
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
                  <label className="visually-hidden" htmlFor="cx-email">Your Email</label>
                  <div className={`cx__input${errors.email ? " is-invalid" : ""}`}>
                    <Mail size={16} aria-hidden />
                    <input
                      id="cx-email"
                      type="email"
                      autoComplete="email"
                      placeholder="Your Email"
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
                <label className="visually-hidden" htmlFor="cx-subject">Subject</label>
                <div className={`cx__input${errors.subject ? " is-invalid" : ""}`}>
                  <Tag size={16} aria-hidden />
                  <input
                    id="cx-subject"
                    type="text"
                    placeholder="Subject"
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
                <label className="visually-hidden" htmlFor="cx-message">Your Message</label>
                <div className={`cx__input cx__input--area${errors.message ? " is-invalid" : ""}`}>
                  <MessageSquare size={16} aria-hidden />
                  <textarea
                    id="cx-message"
                    rows={6}
                    placeholder="Your Message"
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
                <input
                  ref={fileRef}
                  className="visually-hidden"
                  type="file"
                  id="cx-file"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
                />
                <label className="cx__attach" htmlFor="cx-file">
                  <Paperclip size={16} aria-hidden />
                  <span>{fileName || "Attach File (Optional)"}</span>
                </label>

                <button className="cx__submit" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <LoaderCircle className="form__spin" size={18} aria-hidden />
                  ) : (
                    <Send size={18} aria-hidden />
                  )}
                  {isSubmitting ? "Sending…" : "Send Message"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        <motion.div className="cx__band" {...view(0.1)}>
          <div className="cx__connect">
            <p className="cx__band-title">
              Let&apos;s Connect <em>on</em>
            </p>
            <ul className="cx__socials">
              {SOCIALS.map(({ id, label, href, Icon }) => (
                <li key={id}>
                  <a
                    href={href}
                    aria-label={label}
                    className="cx__social"
                    {...(href.startsWith("http") ? { target: "_blank", rel: "me noopener noreferrer" } : {})}
                  >
                    <Icon width={18} height={18} size={18} aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
            <p className="cx__script">Let&apos;s build the future together</p>
          </div>

          <div className="cx__open">
            <p className="cx__band-title cx__band-title--center">
              I&apos;m Currently <em>Available For</em>
            </p>
            <ul className="cx__open-grid">
              {OPEN_FOR.map(({ icon: Icon, label }) => (
                <li key={label} className="cx__open-card">
                  <span className="cx__open-icon" aria-hidden>
                    <Icon size={18} strokeWidth={1.6} />
                  </span>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="cx__world">
            <p className="cx__band-title cx__band-title--right">
              Working With Clients <em>Across The Globe</em>
            </p>
            <GlobeMap />
          </div>
        </motion.div>

        <motion.blockquote className="cx__quote" {...view(0.14)}>
          <span className="cx__quote-mark" aria-hidden>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M7.2 19.2c-2.4 0-4.4-2-4.4-4.6 0-3.4 2.5-6.7 6.2-9.2l1.1 1.5C7.4 8.7 5.6 11 5.6 13.4c.6-.4 1.4-.6 2.2-.6 1.9 0 3.4 1.4 3.4 3.4s-1.6 3-4 3zm9.6 0c-2.4 0-4.4-2-4.4-4.6 0-3.4 2.5-6.7 6.2-9.2l1.1 1.5c-2.7 1.8-4.5 4.1-4.5 6.5.6-.4 1.4-.6 2.2-.6 1.9 0 3.4 1.4 3.4 3.4s-1.6 3-4 3z" />
            </svg>
          </span>
          <p>
            Great things in business are never done by one person. They&apos;re done by a team of people.
          </p>
          <footer className="cx__quote-by">— Steve Jobs</footer>
        </motion.blockquote>
      </div>
    </section>
  );
}
