"use client";

import { useState } from "react";
import { useForm, useWatch, type Path, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, LoaderCircle, X, Paperclip, Lock } from "lucide-react";
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

const OVERVIEW_MAX = 1200;

const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(120, "Name is too long."),
  email: z.email("Enter a valid work email address.").trim(),
  company: z.string().trim().max(160, "Company name is too long.").optional().or(z.literal("")),
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
    .refine((v) => !v || /^(https?:\/\/|www\.)\S+\.\S+/i.test(v), "Enter a full URL, or leave this blank.")
    .optional()
    .or(z.literal("")),
  engagement: z.enum(ENGAGEMENTS).optional().or(z.literal("")),
  referralSource: z.enum(REFERRAL_SOURCES).optional().or(z.literal("")),
  website: z.string().optional(),
});

type Enquiry = z.infer<typeof enquirySchema>;

const STEPS: Array<{ id: string; title: string; fields: Array<Path<Enquiry>> }> = [
  { id: "you", title: "About you", fields: ["name", "email", "company", "role"] },
  { id: "project", title: "Your project", fields: ["projectType", "message", "projectStage", "technologies"] },
  { id: "details", title: "Details", fields: ["timeline", "budget", "projectUrl", "engagement", "referralSource"] },
];

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
    <div className="contact-form__field">
      <label htmlFor={`cpi-${name}`}>
        {label}
        {required && <span className="contact-form__req"> *</span>}
      </label>
      <select
        id={`cpi-${name}`}
        className={`contact-form__input contact-form__select${error ? " is-invalid" : ""}`}
        defaultValue=""
        aria-invalid={!!error}
        aria-describedby={error ? `cpi-${name}-err` : undefined}
        {...register(name)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && (
        <p className="contact-form__err" id={`cpi-${name}-err`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function ContactProjectInquiry() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [fileKey, setFileKey] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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
      setFileError(`That file is ${formatBytes(picked.size)} — keep it under ${ATTACHMENT.maxLabel}.`);
      return;
    }
    if (!ATTACHMENT.extensions.some((ext) => picked.name.toLowerCase().endsWith(ext))) {
      clearFile();
      setFileError("Use a PDF, DOC/DOCX, PNG/JPG or ZIP file.");
      return;
    }
    setFileError("");
    setFile(picked);
  }

  async function next() {
    const valid = await trigger(STEPS[step].fields, { shouldFocus: true });
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

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
      body.set("inquiryType", values.engagement === "Full-time Opportunity" ? "Full-time Opportunity" : "Project");

      for (const key of ["company", "role", "projectStage", "timeline", "budget", "projectUrl", "engagement", "referralSource"] as const) {
        const value = values[key];
        if (value) body.set(key, value);
      }

      for (const tech of values.technologies ?? []) body.append("technologies", tech);
      body.set("website", values.website ?? "");

      if (file) body.set("attachment", file);

      const res = await fetch("/api/contact", { method: "POST", body });

      if (res.ok) {
        // Show success state animation instead of immediate reset
        setIsSuccess(true);

        // Auto-reset after 4 seconds
        setTimeout(() => {
          reset();
          clearFile();
          setStep(0);
          setIsSuccess(false);
          setShowDetails(false);
        }, 4000);
        return;
      }

      const payload = (await res.json().catch(() => null)) as { error?: string } | null;
      toast.error(payload?.error ?? "Could not send. Please email me directly.");
    } catch {
      toast.error("Something went wrong. Please try again or email me directly.");
    }
  }

  return (
    <section className="section contact-inquiry" id="inquiry" aria-labelledby="inquiry-title">
      <div className="shell contact-inquiry__container">
        <div className="contact-inquiry__grid">
          {/* LEFT: Intro & Copy */}
          <motion.div className="contact-inquiry__intro" {...view()}>
            <SectionKicker index="02" label="Project" />
            <h2 className="contact-inquiry__title" id="inquiry-title">
              Start a project
            </h2>
            <p className="contact-inquiry__description">
              Tell me what you're building, improving, or trying to solve. I'll review the details and get back to you with a clear next step.
            </p>
          </motion.div>

          {/* RIGHT: Form */}
          <motion.div className="contact-inquiry__form-wrapper" {...view(0.08)}>
            {isSuccess ? (
              <motion.div
                className="contact-form__success"
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: duration.section, ease }}
              >
                <div className="contact-form__success-icon">
                  <Check size={32} strokeWidth={2} />
                </div>
                <h3 className="contact-form__success-title">Message received</h3>
                <p className="contact-form__success-message">
                  Thanks for reaching out. I'll review the details and get back to you with the next step.
                </p>
                <motion.a
                  href="/work"
                  className="contact-form__success-cta"
                  whileHover={reduce ? {} : { y: -2 }}
                  transition={{ duration: duration.micro, ease }}
                >
                  <span>View my work</span>
                  <ArrowRight size={16} strokeWidth={2} />
                </motion.a>
              </motion.div>
            ) : (
              <div className="contact-form__panel">
                <div className="contact-form__header">
                  <div>
                    <p className="contact-form__title" id="inquiry-form-title">
                      Step {step + 1} of {STEPS.length}
                    </p>
                    <h3 className="contact-form__subtitle">{STEPS[step].title}</h3>
                  </div>

                  {/* Progress Bar */}
                  <div className="contact-form__progress" aria-label="Form progress" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={STEPS.length}>
                    <div className="contact-form__progress-track">
                      {STEPS.map((_, i) => (
                        <div
                          key={i}
                          className={`contact-form__progress-segment${i === step ? " is-current" : ""}${i < step ? " is-complete" : ""}`}
                          aria-hidden
                        />
                      ))}
                    </div>
                  </div>
                </div>

              <form
                className="contact-form__form"
                onSubmit={onFormSubmit}
                aria-labelledby="inquiry-form-title"
                noValidate
              >
                <div className="hp" aria-hidden>
                  <label>
                    Website
                    <input tabIndex={-1} autoComplete="off" {...register("website")} />
                  </label>
                </div>

                {/* STEP 1: ABOUT YOU */}
                <motion.div
                  className="contact-form__pane"
                  hidden={step !== 0}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
                  animate={step === 0 ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
                  transition={{ duration: duration.ui, ease }}
                >
                  <div className="contact-form__row">
                    <div className="contact-form__field">
                      <label htmlFor="cpi-name">
                        Full Name<span className="contact-form__req"> *</span>
                      </label>
                      <input
                        id="cpi-name"
                        className={`contact-form__input${errors.name ? " is-invalid" : ""}`}
                        type="text"
                        autoComplete="name"
                        placeholder="Enter your full name"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "cpi-name-err" : undefined}
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="contact-form__err" id="cpi-name-err" role="alert">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="contact-form__field">
                      <label htmlFor="cpi-email">
                        Work Email<span className="contact-form__req"> *</span>
                      </label>
                      <input
                        id="cpi-email"
                        className={`contact-form__input${errors.email ? " is-invalid" : ""}`}
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="you@company.com"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "cpi-email-err" : undefined}
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="contact-form__err" id="cpi-email-err" role="alert">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="contact-form__row">
                    <div className="contact-form__field">
                      <label htmlFor="cpi-company">Company / Organization</label>
                      <input
                        id="cpi-company"
                        className={`contact-form__input${errors.company ? " is-invalid" : ""}`}
                        type="text"
                        autoComplete="organization"
                        placeholder="Company name (optional)"
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
                </motion.div>

                {/* STEP 2: PROJECT */}
                <motion.div
                  className="contact-form__pane"
                  hidden={step !== 1}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: step < 1 ? 24 : -24 }}
                  animate={step === 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: step > 1 ? -24 : 24 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: step > 1 ? -24 : 24 }}
                  transition={{ duration: duration.ui, ease }}
                >
                  <Select
                    name="projectType"
                    label="Project Type"
                    required
                    placeholder="What kind of work is it?"
                    options={PROJECT_TYPES}
                    register={register}
                    error={errors.projectType?.message}
                  />

                  <div className="contact-form__field">
                    <label htmlFor="cpi-message">
                      Project Overview<span className="contact-form__req"> *</span>
                    </label>
                    <div className="contact-form__area">
                      <textarea
                        id="cpi-message"
                        className={`contact-form__input contact-form__input--area${errors.message ? " is-invalid" : ""}`}
                        rows={4}
                        maxLength={OVERVIEW_MAX}
                        placeholder="Tell me briefly about what you're building, the problem you're trying to solve, or what you need help with."
                        aria-invalid={!!errors.message}
                        aria-describedby={
                          errors.message ? "cpi-message-err cpi-count" : "cpi-count"
                        }
                        {...register("message")}
                      />
                      <span
                        className="contact-form__count"
                        id="cpi-count"
                        aria-live="polite"
                        data-near-limit={overviewLength > OVERVIEW_MAX * 0.9 ? "true" : "false"}
                      >
                        {overviewLength} / {OVERVIEW_MAX}
                      </span>
                    </div>
                    {errors.message && (
                      <p className="contact-form__err" id="cpi-message-err" role="alert">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Select
                    name="projectStage"
                    label="Current Project Stage"
                    placeholder="Where is it today?"
                    options={PROJECT_STAGES}
                    register={register}
                    error={errors.projectStage?.message}
                  />

                  <fieldset className="contact-form__chipset">
                    <legend>Required Technologies</legend>
                    <div className="contact-form__chips">
                      {TECHNOLOGIES.map((tech) => {
                        const on = selectedTech.includes(tech);
                        return (
                          <button
                            key={tech}
                            type="button"
                            className={`contact-form__chip${on ? " is-on" : ""}`}
                            aria-pressed={on}
                            onClick={() => toggleTech(tech)}
                          >
                            {on && <Check size={12} strokeWidth={3} aria-hidden />}
                            {tech}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                </motion.div>

                {/* STEP 3: DETAILS */}
                <motion.div
                  className="contact-form__pane"
                  hidden={step !== 2}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: step < 2 ? 24 : -24 }}
                  animate={step === 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
                  transition={{ duration: duration.ui, ease }}
                >
                  <div className="contact-form__row">
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

                  <div className="contact-form__field">
                    <label htmlFor="cpi-url">Reference / Existing Product URL</label>
                    <input
                      id="cpi-url"
                      className={`contact-form__input${errors.projectUrl ? " is-invalid" : ""}`}
                      type="url"
                      inputMode="url"
                      placeholder="https://example.com"
                      aria-invalid={!!errors.projectUrl}
                      aria-describedby={errors.projectUrl ? "cpi-url-err" : undefined}
                      {...register("projectUrl")}
                    />
                    {errors.projectUrl && (
                      <p className="contact-form__err" id="cpi-url-err" role="alert">
                        {errors.projectUrl.message}
                      </p>
                    )}
                  </div>

                  <div className="contact-form__row">
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

                  <div className="contact-form__field">
                    <label htmlFor="cpi-file">Attachment (optional)</label>
                    <input
                      key={fileKey}
                      id="cpi-file"
                      className="visually-hidden"
                      type="file"
                      accept={ATTACHMENT.extensions.join(",")}
                      aria-describedby="cpi-file-hint"
                      onChange={(event) => pickFile(event.target.files?.[0] ?? null)}
                    />
                    <label className="contact-form__attach" htmlFor="cpi-file">
                      <Paperclip size={15} aria-hidden />
                      <span>{file ? `${file.name} · ${formatBytes(file.size)}` : "Choose a file"}</span>
                    </label>
                    {file && (
                      <button type="button" className="contact-form__attach-clear" onClick={clearFile}>
                        <X size={13} aria-hidden />
                        Remove attachment
                      </button>
                    )}
                    <p className="contact-form__hint" id="cpi-file-hint">
                      PDF, DOC/DOCX, PNG/JPG or ZIP · up to {ATTACHMENT.maxLabel}
                    </p>
                    {fileError && (
                      <p className="contact-form__err" role="alert">
                        {fileError}
                      </p>
                    )}
                  </div>
                </motion.div>

                <div className="contact-form__nav">
                  {step > 0 ? (
                    <button type="button" className="contact-form__back" onClick={() => setStep((s) => s - 1)}>
                      <ArrowLeft size={16} aria-hidden />
                      Back
                    </button>
                  ) : (
                    <span />
                  )}

                  <button className="contact-form__submit" type="submit" disabled={isSubmitting}>
                    <span>{isLast ? (isSubmitting ? "Sending…" : "Send Message") : "Continue"}</span>
                    {isSubmitting ? (
                      <LoaderCircle className="form__spin" size={16} aria-hidden />
                    ) : (
                      <ArrowRight size={16} aria-hidden />
                    )}
                  </button>
                </div>

                <p className="contact-form__secure">
                  <Lock size={13} aria-hidden />
                  Your information is secure and will never be shared.
                </p>
              </form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
