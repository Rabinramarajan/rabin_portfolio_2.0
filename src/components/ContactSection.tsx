"use client";

import { useState } from "react";
import {
  useForm,
  useWatch,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Headphones,
  LoaderCircle,
  Lock,
  Mail,
  MapPin,
  Paperclip,
  Phone,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import { profile } from "@/content/profile";
import {
  ATTACHMENT,
  BUDGET_RANGES,
  CONTACT_ROLES,
  ENGAGEMENTS,
  PROJECT_STAGES,
  PROJECT_TYPES,
  REFERRAL_SOURCES,
  TECHNOLOGIES,
  TIMELINES,
} from "@/content/contact-fields";
import { duration, ease } from "@/lib/motion";
import { SectionKicker } from "@/components/ui";
import { SmartImage } from "@/components/SmartImage";

const OVERVIEW_MAX = 1200;

const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(120, "Name is too long."),
  email: z.email("Enter a valid work email address.").trim(),
  company: z
    .string()
    .trim()
    .max(160, "Company name is too long.")
    .optional()
    .or(z.literal("")),
  role: z.enum(CONTACT_ROLES).optional().or(z.literal("")),

  projectType: z.enum(PROJECT_TYPES, { message: "Choose the type of work." }),
  message: z
    .string()
    .trim()
    .min(30, "A couple of sentences is plenty — 30 characters or so.")
    .max(OVERVIEW_MAX, `Keep the overview under ${OVERVIEW_MAX} characters.`),
  projectStage: z.enum(PROJECT_STAGES).optional().or(z.literal("")),
  technologies: z.array(z.enum(TECHNOLOGIES)).optional(),

  timeline: z.enum(TIMELINES).optional().or(z.literal("")),
  budget: z.enum(BUDGET_RANGES).optional().or(z.literal("")),
  projectUrl: z
    .string()
    .trim()
    .max(200, "URL is too long.")
    .refine(
      (v) => !v || /^(https?:\/\/|www\.)\S+\.\S+/i.test(v),
      "Enter a full URL, or leave this blank.",
    )
    .optional()
    .or(z.literal("")),
  engagement: z.enum(ENGAGEMENTS).optional().or(z.literal("")),
  referralSource: z.enum(REFERRAL_SOURCES).optional().or(z.literal("")),

  /** Honeypot — must stay empty. */
  website: z.string().optional(),
});

type Enquiry = z.infer<typeof enquirySchema>;

/** Which fields each step owns, so a step can be validated on its own. */
const STEPS: Array<{
  id: string;
  title: string;
  fields: Array<Path<Enquiry>>;
}> = [
  {
    id: "you",
    title: "About you",
    fields: ["name", "email", "company", "role"],
  },
  {
    id: "project",
    title: "Your project",
    fields: ["projectType", "message", "projectStage", "technologies"],
  },
  {
    id: "details",
    title: "Details",
    fields: [
      "timeline",
      "budget",
      "projectUrl",
      "engagement",
      "referralSource",
    ],
  },
];

const CHANNELS: Array<{
  icon: typeof Mail;
  label: string;
  value: string;
  note: string;
  href: string;
}> = [
  {
    icon: Mail,
    label: "Email",
    value: profile.email,
    note: "Send me an email anytime",
    href: `mailto:${profile.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: profile.phone,
    note: profile.phoneHours,
    href: `tel:${profile.phone.replace(/\s/g, "")}`,
  },
  {
    icon: MapPin,
    label: "Location",
    value: profile.location,
    note: "Available for remote work",
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.location)}`,
  },
  {
    icon: Clock,
    label: "Availability",
    value: "Full-time · Freelance · Contract",
    note: profile.availability.label,
    href: "#cx-form-title",
  },
];

const ASSURANCES = [
  {
    icon: Clock,
    title: "Quick Response",
    body: profile.availability.responseTime,
  },
  {
    icon: Headphones,
    title: "Let's Connect",
    body: "Easy communication through your preferred way.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted & Secure",
    body: "Your data is safe with privacy guaranteed.",
  },
] as const;

/**
 * Decorative connected-globe artwork. Purely atmospheric — the location it
 * depicts is already stated as text in the Location channel card, so it is
 * hidden from assistive tech rather than described twice.
 */
function GlobeVisual() {
  return (
    <div className="cx__globe" aria-hidden>
      <SmartImage
        className="cx__globe-img"
        src="/media/contact/contact_h.png"
        alt=""
        width={1217}
        height={1293}
        sizes="(max-width: 1100px) 64vw, 34vw"
        blurColor="#0a0a0c"
      />
    </div>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * A labelled `<select>`; the first option acts as the empty state.
 *
 * Declared at module scope rather than inside `ContactSection` — a component
 * created during render is a fresh type on every pass, which would remount the
 * field and lose its state on each keystroke elsewhere in the form.
 */
function Select({
  name,
  label,
  required,
  placeholder,
  options,
  register,
  error,
}: {
  name: Path<Enquiry>;
  label: string;
  required?: boolean;
  placeholder: string;
  options: readonly string[];
  register: UseFormRegister<Enquiry>;
  error?: string;
}) {
  return (
    <div className="cx__field">
      <label htmlFor={`cx-${name}`}>
        {label}
        {required ? <span className="cx__req"> *</span> : null}
      </label>
      <select
        id={`cx-${name}`}
        className={`cx__input cx__select${error ? " is-invalid" : ""}`}
        defaultValue=""
        aria-invalid={!!error}
        aria-describedby={error ? `cx-${name}-err` : undefined}
        {...register(name)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? (
        <p className="cx__err" id={`cx-${name}-err`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactSection() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  /* Bumping this remounts the file input, which is the only way to clear a
     file picker's selection without reaching for a ref during render. */
  const [fileKey, setFileKey] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    control,
    trigger,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Enquiry>({
    resolver: zodResolver(enquirySchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      company: "",
      role: "",
      message: "",
      projectStage: "",
      technologies: [],
      timeline: "",
      budget: "",
      projectUrl: "",
      engagement: "",
      referralSource: "",
      website: "",
    },
  });

  const overviewLength = useWatch({ control, name: "message" })?.length ?? 0;
  const selectedTech = useWatch({ control, name: "technologies" }) ?? [];
  const isLast = step === STEPS.length - 1;

  const view = (delay = 0) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: {
      duration: reduce ? duration.micro : duration.section,
      delay: reduce ? 0 : delay,
      ease,
    },
  });

  function toggleTech(value: (typeof TECHNOLOGIES)[number]) {
    const next = selectedTech.includes(value)
      ? selectedTech.filter((t) => t !== value)
      : [...selectedTech, value];
    setValue("technologies", next, { shouldDirty: true });
  }

  function clearFile() {
    setFile(null);
    setFileError("");
    setFileKey((k) => k + 1);
  }

  function pickFile(picked: File | null) {
    if (!picked) {
      clearFile();
      return;
    }
    if (picked.size > ATTACHMENT.maxBytes) {
      clearFile();
      setFileError(
        `That file is ${formatBytes(picked.size)} — keep it under ${ATTACHMENT.maxLabel}.`,
      );
      return;
    }
    if (
      !ATTACHMENT.extensions.some((ext) =>
        picked.name.toLowerCase().endsWith(ext),
      )
    ) {
      clearFile();
      setFileError("Use a PDF, DOC/DOCX, PNG/JPG or ZIP file.");
      return;
    }
    setFileError("");
    setFile(picked);
  }

  /** Validates only the current step before advancing, and focuses what failed. */
  async function next() {
    const valid = await trigger(STEPS[step].fields, { shouldFocus: true });
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  /*
   * The nav button stays `type="submit"` on every step and this handler decides
   * what a submit means. Swapping the button's own `type` between steps looks
   * equivalent but is not: `next()` is async, so React flips the attribute to
   * "submit" while the click that triggered it is still in flight, and the
   * browser then performs a real submission on what the user pressed as
   * "Continue" — posting a half-filled form. Routing everything through one
   * handler avoids that race, and gives Enter the same behaviour as the button.
   */
  function onFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLast) {
      void next();
      return;
    }
    void handleSubmit(onSubmit)(event);
  }

  async function onSubmit(values: Enquiry) {
    try {
      const body = new FormData();
      body.set("name", values.name);
      body.set("email", values.email);
      body.set("message", values.message);
      body.set("projectType", values.projectType);
      body.set(
        "inquiryType",
        values.engagement === "Full-time Opportunity"
          ? "Full-time Opportunity"
          : "Project",
      );
      for (const key of [
        "company",
        "role",
        "projectStage",
        "timeline",
        "budget",
        "projectUrl",
        "engagement",
        "referralSource",
      ] as const) {
        const value = values[key];
        if (value) body.set(key, value);
      }
      for (const tech of values.technologies ?? [])
        body.append("technologies", tech);
      body.set("website", values.website ?? "");
      if (file) body.set("attachment", file);

      const res = await fetch("/api/contact", { method: "POST", body });

      if (res.ok) {
        toast.success("Message received — I'll get back to you shortly.");
        reset();
        clearFile();
        setStep(0);
        return;
      }

      const payload = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      toast.error(
        payload?.error ?? "Could not send. Please email me directly.",
      );
    } catch {
      toast.error(
        "Something went wrong. Please try again or email me directly.",
      );
    }
  }

  return (
    <section id="contact" className="section cx">
      <div className="cx__glow" aria-hidden />
      <GlobeVisual />

      <div className="shell cx__stack">
        <div className="cx__grid">
          {/* ---------- left: intro + channels ---------- */}
          <motion.div className="cx__intro" {...view(0)}>
            <SectionKicker index="02" label="Contact" />

            <h2 className="cx__title">
              Let&apos;s build something amazing <em>together.</em>
            </h2>
            <p className="cx__lede">
              I&apos;m always open to discussing new opportunities, interesting
              projects, or just having a chat about technology and ideas.
              Let&apos;s connect and create something impactful.
            </p>
            <span className="cx__rule" aria-hidden />

            <ul className="cx__channels">
              {CHANNELS.map(({ icon: Icon, label, value, note, href }) => (
                <li key={label}>
                  <a
                    className="cx__channel"
                    href={href}
                    {...(href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <span className="cx__channel-icon" aria-hidden>
                      <Icon size={16} strokeWidth={1.7} />
                    </span>
                    <span className="cx__channel-body">
                      <span className="cx__channel-label">{label}</span>
                      <span className="cx__channel-value">{value}</span>
                      <span className="cx__channel-note">{note}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ---------- right: enquiry wizard + assurances ---------- */}
          <motion.div className="cx__side" {...view(0.08)}>
            <div className="cx__panel">
              <div className="cx__panel-head">
                <span className="cx__panel-icon" aria-hidden>
                  <Send size={18} strokeWidth={1.7} />
                </span>
                <div>
                  <h3 className="cx__panel-title" id="cx-form-title">
                    Start a project
                  </h3>
                  <p className="cx__panel-sub">
                    Step {step + 1} of {STEPS.length} — {STEPS[step].title}
                  </p>
                </div>
              </div>

              <ol className="cx__steps" aria-label="Form progress">
                {STEPS.map((s, i) => (
                  <li
                    key={s.id}
                    className={`cx__step${i === step ? " is-current" : ""}${i < step ? " is-done" : ""}`}
                    aria-current={i === step ? "step" : undefined}
                  >
                    <span className="cx__step-dot" aria-hidden>
                      {i < step ? <Check size={11} strokeWidth={3} /> : i + 1}
                    </span>
                    <span className="cx__step-label">{s.title}</span>
                  </li>
                ))}
              </ol>

              <form
                className="cx__form"
                onSubmit={onFormSubmit}
                aria-labelledby="cx-form-title"
                noValidate
              >
                <div className="hp" aria-hidden>
                  <label>
                    Website
                    <input
                      tabIndex={-1}
                      autoComplete="off"
                      {...register("website")}
                    />
                  </label>
                </div>

                {/* ---- step 1: about you ---- */}
                <div className="cx__pane" hidden={step !== 0}>
                  <div className="cx__row">
                    <div className="cx__field">
                      <label htmlFor="cx-name">
                        Full Name<span className="cx__req"> *</span>
                      </label>
                      <input
                        id="cx-name"
                        className={`cx__input${errors.name ? " is-invalid" : ""}`}
                        type="text"
                        autoComplete="name"
                        placeholder="Enter your full name"
                        aria-invalid={!!errors.name}
                        aria-describedby={
                          errors.name ? "cx-name-err" : undefined
                        }
                        {...register("name")}
                      />
                      {errors.name ? (
                        <p className="cx__err" id="cx-name-err" role="alert">
                          {errors.name.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="cx__field">
                      <label htmlFor="cx-email">
                        Work Email<span className="cx__req"> *</span>
                      </label>
                      <input
                        id="cx-email"
                        className={`cx__input${errors.email ? " is-invalid" : ""}`}
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="you@company.com"
                        aria-invalid={!!errors.email}
                        aria-describedby={
                          errors.email ? "cx-email-err" : undefined
                        }
                        {...register("email")}
                      />
                      {errors.email ? (
                        <p className="cx__err" id="cx-email-err" role="alert">
                          {errors.email.message}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="cx__row">
                    <div className="cx__field">
                      <label htmlFor="cx-company">Company / Organization</label>
                      <input
                        id="cx-company"
                        className={`cx__input${errors.company ? " is-invalid" : ""}`}
                        type="text"
                        autoComplete="organization"
                        placeholder="Company name"
                        {...register("company")}
                      />
                    </div>
                    <Select
                      name="role"
                      label="Your Role"
                      placeholder="Select your role"
                      options={CONTACT_ROLES}
                      register={register}
                      error={errors.role?.message}
                    />
                  </div>
                </div>

                {/* ---- step 2: the project ---- */}
                <div className="cx__pane" hidden={step !== 1}>
                  <Select
                    name="projectType"
                    label="Project Type"
                    required
                    placeholder="What kind of work is it?"
                    options={PROJECT_TYPES}
                    register={register}
                    error={errors.projectType?.message}
                  />

                  <div className="cx__field">
                    <label htmlFor="cx-message">
                      Project Overview<span className="cx__req"> *</span>
                    </label>
                    <div className="cx__area">
                      <textarea
                        id="cx-message"
                        className={`cx__input cx__input--area${errors.message ? " is-invalid" : ""}`}
                        rows={4}
                        maxLength={OVERVIEW_MAX}
                        placeholder="Tell me briefly about what you're building, the problem you're trying to solve, or what you need help with."
                        aria-invalid={!!errors.message}
                        aria-describedby={
                          errors.message
                            ? "cx-message-err cx-count"
                            : "cx-count"
                        }
                        {...register("message")}
                      />
                      <span
                        className="cx__count"
                        id="cx-count"
                        aria-live="polite"
                      >
                        {overviewLength} / {OVERVIEW_MAX}
                      </span>
                    </div>
                    {errors.message ? (
                      <p className="cx__err" id="cx-message-err" role="alert">
                        {errors.message.message}
                      </p>
                    ) : null}
                  </div>

                  <Select
                    name="projectStage"
                    label="Current Project Stage"
                    placeholder="Where is it today?"
                    options={PROJECT_STAGES}
                    register={register}
                    error={errors.projectStage?.message}
                  />

                  <fieldset className="cx__chipset">
                    <legend>Required Technologies</legend>
                    <div className="cx__chips">
                      {TECHNOLOGIES.map((tech) => {
                        const on = selectedTech.includes(tech);
                        return (
                          <button
                            key={tech}
                            type="button"
                            className={`cx__chip${on ? " is-on" : ""}`}
                            aria-pressed={on}
                            onClick={() => toggleTech(tech)}
                          >
                            {on ? (
                              <Check size={12} strokeWidth={3} aria-hidden />
                            ) : null}
                            {tech}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                </div>

                {/* ---- step 3: logistics ---- */}
                <div className="cx__pane" hidden={step !== 2}>
                  <div className="cx__row">
                    <Select
                      name="timeline"
                      label="Expected Timeline"
                      placeholder="When do you need it?"
                      options={TIMELINES}
                      register={register}
                      error={errors.timeline?.message}
                    />
                    <Select
                      name="budget"
                      label="Budget Range (optional)"
                      placeholder="Select a range"
                      options={BUDGET_RANGES}
                      register={register}
                      error={errors.budget?.message}
                    />
                  </div>

                  <div className="cx__field">
                    <label htmlFor="cx-url">
                      Reference / Existing Product URL
                    </label>
                    <input
                      id="cx-url"
                      className={`cx__input${errors.projectUrl ? " is-invalid" : ""}`}
                      type="url"
                      inputMode="url"
                      placeholder="https://example.com"
                      aria-invalid={!!errors.projectUrl}
                      aria-describedby={
                        errors.projectUrl ? "cx-url-err" : undefined
                      }
                      {...register("projectUrl")}
                    />
                    {errors.projectUrl ? (
                      <p className="cx__err" id="cx-url-err" role="alert">
                        {errors.projectUrl.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="cx__row">
                    <Select
                      name="engagement"
                      label="Preferred Engagement"
                      placeholder="How should we work?"
                      options={ENGAGEMENTS}
                      register={register}
                      error={errors.engagement?.message}
                    />
                    <Select
                      name="referralSource"
                      label="How did you find me?"
                      placeholder="Select a source"
                      options={REFERRAL_SOURCES}
                      register={register}
                      error={errors.referralSource?.message}
                    />
                  </div>

                  <div className="cx__field">
                    <label htmlFor="cx-file">Attachment (optional)</label>
                    <input
                      key={fileKey}
                      id="cx-file"
                      className="visually-hidden"
                      type="file"
                      accept={ATTACHMENT.extensions.join(",")}
                      aria-describedby="cx-file-hint"
                      onChange={(event) =>
                        pickFile(event.target.files?.[0] ?? null)
                      }
                    />
                    <label className="cx__attach" htmlFor="cx-file">
                      <Paperclip size={15} aria-hidden />
                      <span>
                        {file
                          ? `${file.name} · ${formatBytes(file.size)}`
                          : "Choose a file"}
                      </span>
                    </label>
                    {file ? (
                      <button
                        type="button"
                        className="cx__attach-clear"
                        onClick={clearFile}
                      >
                        <X size={13} aria-hidden />
                        Remove attachment
                      </button>
                    ) : null}
                    <p className="cx__hint" id="cx-file-hint">
                      PDF, DOC/DOCX, PNG/JPG or ZIP · up to{" "}
                      {ATTACHMENT.maxLabel}
                    </p>
                    {fileError ? (
                      <p className="cx__err" role="alert">
                        {fileError}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="cx__nav">
                  {step > 0 ? (
                    <button
                      type="button"
                      className="cx__back"
                      onClick={() => setStep((s) => s - 1)}
                    >
                      <ArrowLeft size={16} aria-hidden />
                      Back
                    </button>
                  ) : (
                    <span />
                  )}

                  <button className="cx__submit" type="submit" disabled={isSubmitting}>
                    <span>
                      {isLast ? (isSubmitting ? "Sending…" : "Send Message") : "Continue"}
                    </span>
                    {isSubmitting ? (
                      <LoaderCircle className="form__spin" size={16} aria-hidden />
                    ) : (
                      <ArrowRight size={16} aria-hidden />
                    )}
                  </button>
                </div>

                <p className="cx__secure">
                  <Lock size={13} aria-hidden />
                  Your information is secure and will never be shared.
                </p>
              </form>
            </div>

            <ul className="cx__assurances">
              {ASSURANCES.map(({ icon: Icon, title, body }) => (
                <li key={title} className="cx__assurance">
                  <span className="cx__assurance-icon" aria-hidden>
                    <Icon size={18} strokeWidth={1.6} />
                  </span>
                  <p className="cx__assurance-title">{title}</p>
                  <p className="cx__assurance-body">{body}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
