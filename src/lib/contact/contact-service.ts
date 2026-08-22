import { profile } from "@/content/profile";
import { clean, isEmail } from "@/lib/sanitize";
import { fieldErrorsFromZod, contactSchema } from "@/lib/contact/validation";
import { createReferenceId } from "@/lib/contact/reference-id";
import { mailEnvelope, type EmailProvider } from "@/lib/contact/email-service";
import type { MessageStore } from "@/lib/contact/message-store";
import { INQUIRY_TYPES, type ContactPayload, type ContactResult, type InquiryType } from "@/types/contact";

const INQUIRY_SET = new Set<string>(INQUIRY_TYPES);

function asInquiryType(value: string | undefined): InquiryType {
  if (value && INQUIRY_SET.has(value)) return value as InquiryType;
  return "Other";
}

export function normalizePayload(raw: unknown): { honeypot: boolean; payload?: ContactPayload; error?: ContactResult } {
  if (!raw || typeof raw !== "object") {
    return { honeypot: false, error: { ok: false, error: "Invalid request." } };
  }

  const body = raw as Record<string, unknown>;
  if (clean(body.website, 80)) {
    return { honeypot: true };
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return {
      honeypot: false,
      error: { ok: false, error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFromZod(parsed.error) },
    };
  }

  const data = parsed.data;
  const name = clean(data.name, 120);
  const email = clean(data.email, 160);
  const message = clean(data.message, 3000);
  const inquiryType = asInquiryType(data.inquiryType ?? data.projectType);

  if (name.length < 2 || !isEmail(email) || message.length < 30) {
    return {
      honeypot: false,
      error: { ok: false, error: "Please complete name, email and a message of at least 30 characters." },
    };
  }

  const payload: ContactPayload = {
    name,
    email,
    inquiryType,
    message,
    company: clean(data.company ?? "", 160) || undefined,
    projectUrl: clean(data.projectUrl ?? "", 200) || undefined,
    budget: clean(data.budget ?? "", 120) || undefined,
    timeline: clean(data.timeline ?? "", 120) || undefined,
    preferredContact: data.preferredContact || undefined,
    projectType: clean(data.projectType ?? "", 120) || undefined,
  };

  return { honeypot: false, payload };
}

function notificationText(payload: ContactPayload, referenceId: string, receivedAt: string) {
  return [
    `Reference: ${referenceId}`,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Inquiry: ${payload.inquiryType}`,
    `Company: ${payload.company || "—"}`,
    `Website: ${payload.projectUrl || "—"}`,
    `Budget: ${payload.budget || "—"}`,
    `Timeline: ${payload.timeline || "—"}`,
    `Preferred contact: ${payload.preferredContact || "—"}`,
    "",
    "Message:",
    payload.message,
    "",
    `Submitted: ${receivedAt}`,
  ].join("\n");
}

function acknowledgementText(payload: ContactPayload, referenceId: string) {
  return [
    `Hi ${payload.name},`,
    "",
    "Message received.",
    "",
    `Your reference is ${referenceId}. ${profile.availability.responseTime}.`,
    "",
    "If anything is urgent, reply to this email with the extra context.",
    "",
    `— ${profile.name}`,
  ].join("\n");
}

export async function submitContact(
  raw: unknown,
  deps: {
    email: EmailProvider | null;
    store: MessageStore;
    env?: NodeJS.Dict<string>;
    now?: Date;
  },
): Promise<ContactResult> {
  const normalized = normalizePayload(raw);
  if (normalized.honeypot) {
    return { ok: true, referenceId: "RR-FILTERED", responseTime: profile.availability.responseTime };
  }
  if (normalized.error || !normalized.payload) {
    return normalized.error ?? { ok: false, error: "Invalid request." };
  }

  const payload = normalized.payload;
  const referenceId = createReferenceId(deps.now);
  const receivedAt = (deps.now ?? new Date()).toISOString();
  const env = deps.env ?? process.env;
  const envelope = mailEnvelope(env);

  await deps.store.save({ referenceId, receivedAt, payload });

  if (!deps.email) {
    if (env.CONTACT_ALLOW_UNCONFIGURED === "true") {
      return { ok: true, referenceId, responseTime: profile.availability.responseTime };
    }
    return {
      ok: false,
      error: `Mail is not configured yet. Email ${profile.email} directly.`,
    };
  }

  await deps.email.send({
    to: envelope.to,
    from: envelope.from,
    replyTo: payload.email,
    subject: `New Portfolio Inquiry — ${payload.inquiryType} (${referenceId})`,
    text: notificationText(payload, referenceId, receivedAt),
  });

  if (envelope.ackEnabled) {
    await deps.email.send({
      to: payload.email,
      from: envelope.from,
      subject: `Message received — ${referenceId}`,
      text: acknowledgementText(payload, referenceId),
    });
  }

  return { ok: true, referenceId, responseTime: profile.availability.responseTime };
}
