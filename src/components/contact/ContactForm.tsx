"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, ChevronDown, CircleAlert, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { contactSchema, type ContactInput } from "@/lib/contact/validation";
import { contactCopy } from "@/content/contact";
import { profile } from "@/content/profile";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import type { InquiryType } from "@/types/contact";

type SubmitState = "idle" | "loading" | "ok" | "err";

const defaults = (inquiryType?: InquiryType): ContactInput => ({
  name: "",
  email: "",
  inquiryType,
  projectType: "",
  company: "",
  projectUrl: "",
  budget: "",
  timeline: "",
  preferredContact: "",
  message: "",
  website: "",
});

export function ContactForm({ defaultInquiryType }: { defaultInquiryType?: InquiryType }) {
  const reduce = useReducedMotion();
  const liveId = useId();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [responseTime, setResponseTime] = useState(profile.availability.responseTime);
  const [detailsOpen, setDetailsOpen] = useState(Boolean(defaultInquiryType));

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: defaults(defaultInquiryType),
  });

  const [messageLen, setMessageLen] = useState(0);

  async function onSubmit(values: ContactInput) {
    if (submitState === "loading") return;
    setSubmitState("loading");
    setServerMessage("");
    try {
      const payload = {
        ...values,
        website: values.website ?? "",
      };
      const bodyString = JSON.stringify(payload);
      if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
        console.log("[contact-form] Submitting:", {
          fields: Object.keys(payload),
          bodyLength: bodyString.length,
          hasName: !!payload.name,
          hasEmail: !!payload.email,
          hasMessage: !!payload.message,
          hasInquiryType: !!payload.inquiryType,
        });
      }
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: bodyString,
      });
      const body = (await res.json().catch(() => null)) as {
        ok?: boolean;
        referenceId?: string;
        responseTime?: string;
        error?: string;
        fieldErrors?: Record<string, string[]>;
      } | null;

      if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
        console.log("[contact-form] Response:", {
          status: res.status,
          ok: res.ok,
          error: body?.error,
          hasFieldErrors: !!body?.fieldErrors,
        });
      }

      if (res.ok && body?.ok) {
        setReferenceId(body.referenceId ?? "");
        setResponseTime(body.responseTime ?? profile.availability.responseTime);
        setSubmitState("ok");
        toast.success("Message received.");
        return;
      }

      if (body?.fieldErrors) {
        const firstKey = Object.keys(body.fieldErrors)[0];
        for (const [key, msgs] of Object.entries(body.fieldErrors)) {
          setError(key as keyof ContactInput, { type: "server", message: msgs[0] });
        }
        setServerMessage(body.error ?? "Please fix the highlighted fields.");
        setSubmitState("err");
        toast.error("Please fix the highlighted fields.");
        if (firstKey) document.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
        return;
      }

      setServerMessage(body?.error ?? "Could not send. Please email me directly.");
      setSubmitState("err");
      toast.error(body?.error ?? "Could not send.");
    } catch {
      setServerMessage("Something went wrong while sending your message. Please try again or email me directly.");
      setSubmitState("err");
      toast.error("Something went wrong. Please try again.");
    }
  }

  function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    void handleSubmit(onSubmit)(event);
  }

  if (submitState === "ok") {
    return (
      <motion.div
        className="cp-success"
        role="status"
        aria-live="polite"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: duration.interaction, ease }}
      >
        <motion.span
          className="cp-success__mark"
          initial={{ scale: reduce ? 1 : 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: duration.section, ease }}
        >
          <Check aria-hidden />
        </motion.span>
        <h3 className="cp-success__title">Message received.</h3>
        <p className="cp-success__text">
          Thank you. I&apos;ll review what you sent and reply with a clear next step.
        </p>
        <dl className="cp-success__meta">
          <div>
            <dt>Reference</dt>
            <dd>{referenceId}</dd>
          </div>
          <div>
            <dt>Response</dt>
            <dd>{responseTime}</dd>
          </div>
        </dl>
        <div className="cp-success__actions">
          <Link href="/work" className="btn btn--solid">
            <span className="btn__label">
              Return to portfolio
              <svg viewBox="0 0 16 16" aria-hidden className="btn__arrow">
                <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </span>
          </Link>
          <button
            type="button"
            className="btn btn--line"
            onClick={() => {
              reset(defaults(defaultInquiryType));
              setMessageLen(0);
              setSubmitState("idle");
              setReferenceId("");
            }}
          >
            <span className="btn__label">Send another message</span>
          </button>
        </div>
      </motion.div>
    );
  }

  const busy = submitState === "loading" || isSubmitting;

  return (
    <form className="cp-form" onSubmit={onFormSubmit} noValidate aria-labelledby="contact-form-title">
      <div className="cp-form__head">
        <h3 id="contact-form-title">Write to me</h3>
        <p>Required fields are marked. Optional project details stay collapsed until you need them.</p>
      </div>

      <div className="hp" aria-hidden>
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      <div className="cp-form__grid">
        <Field label="Name" htmlFor="cp-name" error={errors.name?.message} required>
          <input
            id="cp-name"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "cp-name-err" : undefined}
            {...register("name")}
          />
        </Field>
        <Field label="Email" htmlFor="cp-email" error={errors.email?.message} required>
          <input
            id="cp-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "cp-email-err" : undefined}
            {...register("email")}
          />
        </Field>
      </div>

      <Field label="Inquiry type" htmlFor="cp-inquiry" error={errors.inquiryType?.message} required>
        <Controller
          name="inquiryType"
          control={control}
          render={({ field }) => (
            <select
              id="cp-inquiry"
              {...field}
              value={field.value ?? ""}
              aria-invalid={!!errors.inquiryType}
              aria-describedby={errors.inquiryType ? "cp-inquiry-err" : undefined}
            >
              <option value="">Select one</option>
              {contactCopy.form.inquiryTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          )}
        />
      </Field>

      <Field
        label="Message"
        htmlFor="cp-message"
        error={errors.message?.message}
        required
        hint={`${messageLen < contactCopy.form.messageMin ? `At least ${contactCopy.form.messageMin} characters · ${messageLen} so far` : `${messageLen} / ${contactCopy.form.messageMax}`}`}
        hintId="cp-message-hint"
      >
        <textarea
          id="cp-message"
          rows={7}
          maxLength={contactCopy.form.messageMax}
          aria-invalid={!!errors.message}
          aria-describedby={cn("cp-message-hint", errors.message && "cp-message-err")}
          {...register("message", {
            onChange: (event) => setMessageLen(String(event.target.value ?? "").trim().length),
          })}
        />
      </Field>

      <button
        type="button"
        className="cp-disclose"
        aria-expanded={detailsOpen}
        aria-controls="cp-optional"
        onClick={() => setDetailsOpen((open) => !open)}
      >
        <span>{detailsOpen ? "Hide project details" : "Add optional project details"}</span>
        <ChevronDown aria-hidden size={16} data-open={detailsOpen} />
      </button>

      <div id="cp-optional" hidden={!detailsOpen} className="cp-optional">
        <div className="cp-form__grid">
          <Field label="Company" htmlFor="cp-company" error={errors.company?.message}>
            <input id="cp-company" type="text" autoComplete="organization" {...register("company")} />
          </Field>
          <Field label="Website" htmlFor="cp-url" error={errors.projectUrl?.message}>
            <input
              id="cp-url"
              type="url"
              inputMode="url"
              autoComplete="url"
              placeholder="https://"
              aria-invalid={!!errors.projectUrl}
              {...register("projectUrl")}
            />
          </Field>
        </div>
        <div className="cp-form__grid">
          <Field label="Budget" htmlFor="cp-budget" error={errors.budget?.message}>
            <select id="cp-budget" {...register("budget")}>
              <option value="">Not sure yet</option>
              {contactCopy.form.budgets.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Timeline" htmlFor="cp-timeline" error={errors.timeline?.message}>
            <select id="cp-timeline" {...register("timeline")}>
              <option value="">Flexible</option>
              {contactCopy.form.timelines.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Preferred contact method" htmlFor="cp-method" error={errors.preferredContact?.message}>
          <select id="cp-method" {...register("preferredContact")}>
            <option value="">No preference</option>
            {contactCopy.form.preferredContact.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <p id={liveId} className="visually-hidden" aria-live="polite">
        {busy ? "Sending your message." : submitState === "err" ? serverMessage : ""}
      </p>

      <button className="cp-submit" type="submit" disabled={busy}>
        {busy ? <LoaderCircle className="form__spin" size={18} aria-hidden /> : <ArrowRight size={18} aria-hidden />}
        {busy ? "Sending…" : "Send message"}
      </button>

      {submitState === "err" ? (
        <p className="cp-form__alert" role="alert">
          <CircleAlert size={16} aria-hidden />
          <span>
            {serverMessage}{" "}
            <a href={`mailto:${profile.email}`}>Email me instead</a>
          </span>
        </p>
      ) : (
        <p className="cp-form__note">Your details stay with me. I don’t share them, and I don’t add you to a list.</p>
      )}
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  required,
  hint,
  hintId,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  hint?: string;
  hintId?: string;
  children: ReactNode;
}) {
  const errId = `${htmlFor}-err`;
  return (
    <div className={cn("cp-field", error && "is-invalid")}>
      <label htmlFor={htmlFor}>
        {label}
        {required ? (
          <span aria-hidden className="cp-req">
            *
          </span>
        ) : (
          <span className="cp-opt">Optional</span>
        )}
      </label>
      {children}
      {hint ? (
        <p className="cp-hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="cp-err" id={errId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
