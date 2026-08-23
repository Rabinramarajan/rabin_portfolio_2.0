"use client";

import { useEffect, useRef, useState } from "react";
import { trackChat } from "@/chat/analytics";

/**
 * Progressive lead capture.
 *
 * One question at a time — asking for five fields at once inside a chat panel
 * reads as a form, not a conversation. The visitor sees exactly what will be
 * sent before anything leaves the browser, and can go back and edit it.
 */

type StepId = "projectType" | "name" | "email" | "company" | "message";

interface Step {
  id: StepId;
  prompt: string;
  placeholder: string;
  multiline?: boolean;
  optional?: boolean;
  validate?: (value: string) => string | null;
}

const STEPS: Step[] = [
  {
    id: "projectType",
    prompt: "What type of project are you planning?",
    placeholder: "e.g. Enterprise Angular dashboard",
    validate: (v) => (v.trim().length < 2 ? "A few words is enough." : null),
  },
  {
    id: "name",
    prompt: "And your name?",
    placeholder: "Your name",
    validate: (v) => (v.trim().length < 2 ? "Please enter your name." : null),
  },
  {
    id: "email",
    prompt: "What's the best email to reach you?",
    placeholder: "you@company.com",
    validate: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : "Enter a valid email address."),
  },
  {
    id: "company",
    prompt: "Which company are you with? (optional)",
    placeholder: "Company name",
    optional: true,
  },
  {
    id: "message",
    prompt: "Briefly, what do you need?",
    placeholder: "Goals, scope, timeline — a couple of lines is fine.",
    multiline: true,
    validate: (v) => (v.trim().length < 10 ? "A little more detail helps Rabin reply properly." : null),
  },
];

type Values = Record<StepId, string>;

const EMPTY: Values = { projectType: "", name: "", email: "", company: "", message: "" };

interface Props {
  onCancel: () => void;
  onSent: (referenceId: string, responseTime: string) => void;
}

export function LeadForm({ onCancel, onSent }: Props) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const step = STEPS[index];

  useEffect(() => {
    inputRef.current?.focus();
  }, [index, reviewing]);

  function advance(override?: string) {
    const value = (override ?? draft).trim();
    const message = step.optional && !value ? null : (step.validate?.(value) ?? null);
    if (message) {
      setError(message);
      return;
    }

    const next = { ...values, [step.id]: value };
    setValues(next);
    setError(null);
    setDraft("");

    if (index + 1 < STEPS.length) setIndex(index + 1);
    else setReviewing(true);
  }

  function editFrom(stepId: StepId) {
    const target = STEPS.findIndex((s) => s.id === stepId);
    setReviewing(false);
    setIndex(target);
    setDraft(values[stepId]);
    setError(null);
  }

  async function submit() {
    setSending(true);
    setError(null);
    try {
      const response = await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: true; referenceId?: string; responseTime?: string; error?: string }
        | null;

      if (!response.ok || !data?.ok) {
        setError(data?.error ?? "Could not send that. Please use the contact page instead.");
        return;
      }
      trackChat("lead_submitted", {});
      onSent(data.referenceId ?? "", data.responseTime ?? "");
    } catch {
      setError("Could not send that. Please use the contact page instead.");
    } finally {
      setSending(false);
    }
  }

  if (reviewing) {
    return (
      <div className="chat-lead" role="group" aria-label="Review your enquiry">
        <p className="chat-lead__prompt">Here&apos;s what I&apos;ll send:</p>
        <dl className="chat-lead__review">
          {STEPS.filter((s) => values[s.id]).map((s) => (
            <div key={s.id} className="chat-lead__row">
              <dt>{s.id === "projectType" ? "Project" : s.id === "message" ? "Requirement" : s.id}</dt>
              <dd>
                <span>{values[s.id]}</span>
                <button type="button" className="chat-lead__edit" onClick={() => editFrom(s.id)}>
                  Edit
                </button>
              </dd>
            </div>
          ))}
        </dl>
        {error ? (
          <p className="chat-lead__error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="chat-lead__buttons">
          <button type="button" className="chat-action chat-action--primary" onClick={submit} disabled={sending}>
            {sending ? "Sending…" : "Submit enquiry"}
          </button>
          <button type="button" className="chat-action" onClick={onCancel} disabled={sending}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-lead" role="group" aria-label="Start a project enquiry">
      <p className="chat-lead__prompt">
        <span className="chat-lead__step">
          Step {index + 1} of {STEPS.length}
        </span>
        {step.prompt}
      </p>

      <form
        className="chat-lead__field"
        onSubmit={(event) => {
          event.preventDefault();
          advance();
        }}
      >
        {step.multiline ? (
          <textarea
            ref={(node) => {
              inputRef.current = node;
            }}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={step.placeholder}
            aria-label={step.prompt}
            aria-invalid={Boolean(error)}
            rows={3}
            maxLength={3000}
          />
        ) : (
          <input
            ref={(node) => {
              inputRef.current = node;
            }}
            type={step.id === "email" ? "email" : "text"}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={step.placeholder}
            aria-label={step.prompt}
            aria-invalid={Boolean(error)}
            maxLength={200}
          />
        )}

        {error ? (
          <p className="chat-lead__error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="chat-lead__buttons">
          <button type="submit" className="chat-action chat-action--primary">
            {index + 1 === STEPS.length ? "Review" : "Continue"}
          </button>
          {step.optional ? (
            <button type="button" className="chat-action" onClick={() => advance("")}>
              Skip
            </button>
          ) : null}
          <button type="button" className="chat-action" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
