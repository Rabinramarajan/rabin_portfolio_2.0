import { profile } from "@/content/profile";
import { clean, isEmail } from "@/lib/sanitize";
import { fieldErrorsFromZod, contactSchema } from "@/lib/contact/validation";
import { createReferenceId } from "@/lib/contact/reference-id";
import { mailEnvelope, type EmailProvider } from "@/lib/contact/email-service";
import type { MessageStore } from "@/lib/contact/message-store";
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

export interface StoredContact {
  referenceId: string;
  receivedAt: string;
  payload: ContactPayload;
  notificationStatus: "pending" | "processing" | "sent" | "failed" | "retrying";
  acknowledgementStatus: "pending" | "processing" | "sent" | "failed";
  notificationAttempts: number;
  acknowledgementAttempts: number;
  lastEmailError?: string;
  lastAttemptAt: string;
  deliveredAt?: string;
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
    store: MessageStore;
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

  // Save submission first - this preserves the message even if email fails
  await deps.store.save({
    referenceId,
    receivedAt,
    payload,
    notificationStatus: "pending",
    acknowledgementStatus: "pending",
    notificationAttempts: 0,
    acknowledgementAttempts: 0,
    lastAttemptAt: new Date().toISOString(),
  });

  if (!deps.email) {
    if (env.CONTACT_ALLOW_UNCONFIGURED === "true") {
      return { ok: true, referenceId, responseTime: profile.availability.responseTime };
    }
    return {
      ok: false,
      error: `Mail is not configured yet. Email ${profile.email} directly.`,
    };
  }

  // Attempt owner notification
  try {
    await deps.email.send({
      to: envelope.to,
      from: envelope.from,
      replyTo: payload.email,
      referenceId,
      subject: `New Portfolio Inquiry — ${payload.inquiryType} (${referenceId})`,
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

    // Update notification status to sent
    await deps.store.save({
      referenceId,
      receivedAt,
      payload,
      notificationStatus: "sent",
      acknowledgementStatus: "pending",
      notificationAttempts: 0,
      acknowledgementAttempts: 0,
      lastAttemptAt: new Date().toISOString(),
      deliveredAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`[contact] notification email failed for ${referenceId}:`, error);
    // Preserve the submission regardless of email failure
    await deps.store.save({
      referenceId,
      receivedAt,
      payload,
      notificationStatus: "failed",
      acknowledgementStatus: "pending",
      notificationAttempts: 0,
      acknowledgementAttempts: 0,
      lastEmailError: (error as Error).message,
      lastAttemptAt: new Date().toISOString(),
    });
    // Still return success - the message was persisted
  }

  // The acknowledgement goes to the visitor's address - routine failure should
  // not undo the owner notification or persistence.
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

      await deps.store.save({
        referenceId,
        receivedAt,
        payload,
        notificationStatus: "sent",
        acknowledgementStatus: "sent",
        notificationAttempts: 0,
        acknowledgementAttempts: 0,
        lastAttemptAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`[contact] acknowledgement failed for ${referenceId}:`, error);
      // Do NOT fail the entire submission - only record the failure
      await deps.store.save({
        referenceId,
        receivedAt,
        payload,
        notificationStatus: "sent",
        acknowledgementStatus: "failed",
        notificationAttempts: 0,
        acknowledgementAttempts: 0,
        lastEmailError: (error as Error).message,
        lastAttemptAt: new Date().toISOString(),
      });
      // Important: we do NOT throw here - the submission was already successful
    }
  }

  return { ok: true, referenceId, responseTime: profile.availability.responseTime };
}