"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, LoaderCircle, Mail, CircleAlert } from "lucide-react";
import Link from "next/link";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import { profile } from "@/content/profile";
import { services } from "@/content/services";
import { budgetRanges, timelines } from "@/content/pricing";
import { duration, ease } from "@/lib/motion";

type SubmitState = "idle" | "loading" | "ok" | "err";

const projectTypes = [...services.map((s) => s.title), "Other"];

export function ContactForm({ defaultProjectType }: { defaultProjectType?: string }) {
  const reduce = useReducedMotion();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [serverMessage, setServerMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isValidating },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: {
      projectType: defaultProjectType && projectTypes.includes(defaultProjectType) ? defaultProjectType : "",
    },
  });

  const fieldReveal = (i: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 10 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: reduce ? duration.micro : duration.interaction, delay: reduce ? 0 : Math.min(0.04 * i, 0.28), ease },
  });

  async function onSubmit(values: ContactInput) {
    setSubmitState("loading");
    setServerMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        setSubmitState("ok");
        toast.success("Message received");
        return;
      }

      const body = (await res.json().catch(() => null)) as { error?: string; fieldErrors?: Record<string, string[]> } | null;
      if (body?.fieldErrors) {
        const firstKey = Object.keys(body.fieldErrors)[0];
        for (const [key, msgs] of Object.entries(body.fieldErrors)) {
          setError(key as keyof ContactInput, { type: "server", message: msgs[0] });
        }
        setServerMessage(body.error ?? "Please fix the highlighted fields.");
        setSubmitState("err");
        toast.error("Please fix the highlighted fields.");
        if (firstKey) {
          const el = document.querySelector<HTMLElement>(`[name="${firstKey}"]`);
          el?.focus();
        }
        return;
      }
      setServerMessage(body?.error ?? "Could not send. Try email instead.");
      setSubmitState("err");
      toast.error(body?.error ?? "Could not send.");
    } catch {
      setSubmitState("err");
      setServerMessage("Something went wrong while sending your message. Please try again or email me directly.");
      toast.error("Something went wrong. Please try again.");
    }
  }

  const emailHref = useMemo(() => `mailto:${profile.email}`, []);

  /* ---- Success state ---- */
  if (submitState === "ok") {
    return (
      <motion.div
        className="form-success"
        role="status"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: duration.interaction, ease }}
      >
        <motion.div
          className="form-success__icon"
          initial={{ scale: reduce ? 1 : 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: duration.section, ease, delay: 0.05 }}
        >
          <Check aria-hidden />
        </motion.div>
        <motion.span
          className="form-success__line"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: duration.section, ease, delay: 0.25 }}
        />
        <h3 className="form-success__title">MESSAGE RECEIVED.</h3>
        <p className="form-success__text">
          Thanks for reaching out. Your project details are safely on their way — I will review them and get back to you.
        </p>
        <div className="form-success__actions">
          <button
            type="button"
            className="btn btn--line"
            onClick={() => {
              reset();
              setSubmitState("idle");
            }}
          >
            <span className="btn__label">Send another message</span>
          </button>
          <Link href="/work" className="btn btn--solid">
            <span className="btn__label">
              Back to portfolio
              <ArrowRight className="btn__arrow" aria-hidden />
            </span>
          </Link>
        </div>
      </motion.div>
    );
  }

  const inputProps = (name: keyof ContactInput) => ({
    ...register(name),
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Honeypot */}
      <div className="hp" aria-hidden>
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      <motion.div className="field" {...fieldReveal(0)}>
        <label htmlFor="name">Full name</label>
        <input id="name" autoComplete="name" {...inputProps("name")} />
        {errors.name ? (
          <p id="name-error" className="field-error" role="alert">
            {errors.name.message}
          </p>
        ) : null}
      </motion.div>

      <motion.div className="field" {...fieldReveal(1)}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" {...inputProps("email")} />
        {errors.email ? (
          <p id="email-error" className="field-error" role="alert">
            {errors.email.message}
          </p>
        ) : null}
      </motion.div>

      <motion.div className="field" {...fieldReveal(2)}>
        <label htmlFor="company">Company / organization</label>
        <input id="company" autoComplete="organization" {...inputProps("company")} />
        {errors.company ? (
          <p id="company-error" className="field-error" role="alert">
            {errors.company.message}
          </p>
        ) : null}
      </motion.div>

      <motion.div className="field" {...fieldReveal(3)}>
        <label htmlFor="projectType">Project type</label>
        <select id="projectType" {...inputProps("projectType")}>
          <option value="">Select a type</option>
          {projectTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.projectType ? (
          <p id="projectType-error" className="field-error" role="alert">
            {errors.projectType.message}
          </p>
        ) : null}
      </motion.div>

      <motion.div className="field" {...fieldReveal(4)}>
        <label htmlFor="budget">Budget</label>
        <select id="budget" {...inputProps("budget")}>
          <option value="">Select a range</option>
          {budgetRanges.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.budget ? (
          <p id="budget-error" className="field-error" role="alert">
            {errors.budget.message}
          </p>
        ) : null}
      </motion.div>

      <motion.div className="field" {...fieldReveal(5)}>
        <label htmlFor="timeline">Timeline</label>
        <select id="timeline" {...inputProps("timeline")}>
          <option value="">Select a timeline</option>
          {timelines.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.timeline ? (
          <p id="timeline-error" className="field-error" role="alert">
            {errors.timeline.message}
          </p>
        ) : null}
      </motion.div>

      <motion.div className="field field--full" {...fieldReveal(6)}>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          rows={6}
          placeholder="Tell me what you're building, what problem you're solving, and what you'd like help with..."
          {...inputProps("message")}
        />
        {errors.message ? (
          <p id="message-error" className="field-error" role="alert">
            {errors.message.message}
          </p>
        ) : null}
      </motion.div>

      <motion.div className="form__submit" {...fieldReveal(7)}>
        <button className="btn btn--solid" type="submit" disabled={submitState === "loading" || isSubmitting || isValidating}>
          <span className="btn__label">
            {submitState === "loading" || isSubmitting ? (
              <>
                SENDING...
                <LoaderCircle className="btn__arrow form__spin" aria-hidden />
              </>
            ) : (
              <>
                Start a Conversation
                <ArrowRight className="btn__arrow" aria-hidden />
              </>
            )}
          </span>
        </button>

        {submitState === "err" ? (
          <div className="form-status err" role="alert">
            <CircleAlert aria-hidden />
            <span>
              {serverMessage || "Something went wrong while sending your message. Please try again or email me directly."}{" "}
              <a href={emailHref}>Email me instead</a>
            </span>
          </div>
        ) : (
          <p className="form-note">
            <Mail aria-hidden /> Prefer email?{" "}
            <a className="form-note__link" href={emailHref}>
              {profile.email}
            </a>
          </p>
        )}
      </motion.div>
    </form>
  );
}