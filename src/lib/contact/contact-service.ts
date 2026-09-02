import { profile } from "@/content/profile";
import { clean, isEmail } from "@/lib/sanitize";
import { fieldErrorsFromZod, contactSchema } from "@/lib/contact/validation";
import { createReferenceId } from "@/lib/contact/reference-id";
import { mailEnvelope, type EmailProvider } from "@/lib/contact/email-service";
import {
  acknowledgementHtml,
  acknowledgementText,
  notificationHtml,
  notificationText,
} from "@/lib/contact/email-template";
import {
  INQUIRY_TYPES,
  type ContactAttachment,
  type ContactPayload,
  type ContactResult,
  type InquiryType,
} from "@/types/contact";

const INQUIRY_SET = new Set<string>(INQUIRY_TYPES);

function asInquiryType(value: string | undefined): InquiryType {
  if (value && INQUIRY_SET.has(value)) return value as InquiryType;
  return "Other";
}

export function normalizePayload(raw: unknown): { honeypot: boolean; payload?: ContactPayload; error?: ContactResult } {
  if (!raw || typeof raw !== "object") {
    console.error("[contact] Invalid payload type:", typeof raw, "value:", raw);
    return { honeypot: false, error: { ok: false, error: "Invalid request: payload must be an object." } };
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
    role: data.role || undefined,
    projectStage: data.projectStage || undefined,
    engagement: data.engagement || undefined,
    referralSource: data.referralSource || undefined,
    technologies: data.technologies?.length ? data.technologies : undefined,
    attachmentName: clean(data.attachmentName ?? "", 200) || undefined,
  };

  return { honeypot: false, payload };
}

export async function submitContact(
  raw: unknown,
  deps: {
    email: EmailProvider | null;
    env?: NodeJS.Dict<string>;
    now?: Date;
    /** Uploaded file, already size- and type-checked by the route. */
    attachment?: ContactAttachment;
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

  // Header injection prevention - reject newlines in fields that land in mail headers.
  // The message body is not a header, so newlines there are legitimate.
  const hasNewline = (value: string) => /\r|\n/.test(value);
  if (hasNewline(payload.name) || hasNewline(payload.email)) {
    console.error("[contact] Header injection attempt detected");
    return { ok: false, error: "Invalid request: contains forbidden characters." };
  }
  const referenceId = createReferenceId(deps.now);
  const receivedAt = (deps.now ?? new Date()).toISOString();
  const env = deps.env ?? process.env;
  const envelope = mailEnvelope(env);

  if (!deps.email) {
    if (env.CONTACT_ALLOW_UNCONFIGURED === "true") {
      return { ok: true, referenceId, responseTime: profile.availability.responseTime };
    }
    return {
      ok: false,
      error: `Mail is not configured yet. Email ${profile.email} directly.`,
    };
  }

  // The owner notification is the whole point of the submission: if it cannot
  // be delivered the visitor must be told, so the error propagates to the route.
  await deps.email.send({
    to: envelope.to,
    from: envelope.from,
    replyTo: payload.email,
    referenceId,
    subject: `New project enquiry from ${payload.name}`,
    text: notificationText({ payload, referenceId, receivedAt }),
    html: notificationHtml({ payload, referenceId, receivedAt }),
    attachments: deps.attachment
      ? [
          {
            filename: deps.attachment.filename,
            content: deps.attachment.content,
            contentType: deps.attachment.contentType,
          },
        ]
      : undefined,
  });

  // The acknowledgement goes to the visitor's address — a routine failure there
  // must not undo an owner notification that already went out.
  if (envelope.ackEnabled) {
    try {
      await deps.email.send({
        to: payload.email,
        from: envelope.from,
        replyTo: envelope.to,
        referenceId,
        subject: `Message received — ${referenceId}`,
        text: acknowledgementText({ payload, referenceId }),
        html: acknowledgementHtml({ payload, referenceId }),
      });
    } catch (error) {
      console.error(`[contact] acknowledgement failed for ${referenceId}:`, error);
    }
  }

  return { ok: true, referenceId, responseTime: profile.availability.responseTime };
}