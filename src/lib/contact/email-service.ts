import { profile } from "@/content/profile";
import { mailLogger } from "./mail-logger";

export interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

export interface EmailMessage {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: EmailAttachment[];
  referenceId?: string;
}

export interface EmailDeliveryStatus {
  status: "pending" | "processing" | "sent" | "failed" | "retrying";
  attempts: number;
  maxAttempts: number;
  lastError?: string;
  lastAttemptAt?: Date;
  deliveredAt?: Date;
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<void>;
  getStatus(): EmailDeliveryStatus;
  verify(): Promise<boolean>;
}

export const EMAIL_MAX_RETRIES = 3;

function maskSensitiveData(message: string): string {
  return message
    .replace(/pass(wd)?[=:\s]+[\S]+/gi, "****")
    .replace(/authenticat[^.\n]{0,50}/gi, "*** censored ***")
    .replace(/user[=:\s]+[\S]+/gi, "USER redacted");
}

export class ResendEmailProvider implements EmailProvider {
  private readonly apiKey: string;
  private lastStatus: EmailDeliveryStatus = {
    status: "pending",
    attempts: 0,
    maxAttempts: EMAIL_MAX_RETRIES,
  };

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async verify(): Promise<boolean> {
    return this.apiKey.length > 0;
  }

  async send(message: EmailMessage): Promise<void> {
    const { referenceId = "unknown" } = message;

    mailLogger.log({
      timestamp: new Date().toISOString(),
      type: "send",
      referenceId,
      to: message.to,
      from: message.from,
      subject: message.subject,
      status: "pending",
    });

    try {
      const { Resend } = await import("resend");
      const resend = new Resend(this.apiKey);

      const { data, error } = await resend.emails.send({
        from: message.from,
        to: message.to,
        replyTo: message.replyTo,
        subject: message.subject,
        text: message.text,
        html: message.html,
        attachments: message.attachments?.map((file) => ({
          filename: file.filename,
          content: file.content,
          contentType: file.contentType,
        })),
      });

      if (error) {
        throw new Error(`${error.name}: ${error.message}`);
      }

      this.lastStatus = {
        status: "sent",
        attempts: 1,
        maxAttempts: EMAIL_MAX_RETRIES,
        deliveredAt: new Date(),
      };

      mailLogger.log({
        timestamp: new Date().toISOString(),
        type: "send",
        referenceId,
        to: message.to,
        from: message.from,
        subject: message.subject,
        status: "success",
        messageId: data?.id,
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));

      this.lastStatus = {
        status: "failed",
        attempts: 1,
        maxAttempts: EMAIL_MAX_RETRIES,
        lastError: err.message,
        lastAttemptAt: new Date(),
      };

      mailLogger.log({
        timestamp: new Date().toISOString(),
        type: "error",
        referenceId,
        to: message.to,
        from: message.from,
        subject: message.subject,
        status: "failed",
        errorMessage: maskSensitiveData(err.message),
      });

      throw err;
    }
  }

  getStatus(): EmailDeliveryStatus {
    return this.lastStatus;
  }
}

export class MemoryEmailProvider implements EmailProvider {
  readonly sent: EmailMessage[] = [];

  async send(message: EmailMessage): Promise<void> {
    this.sent.push(message);
  }

  async verify(): Promise<boolean> {
    return true;
  }

  getStatus(): EmailDeliveryStatus {
    return {
      status: "sent",
      attempts: 1,
      maxAttempts: EMAIL_MAX_RETRIES,
    };
  }
}

export function createEmailProvider(env: NodeJS.Dict<string> = process.env): EmailProvider | null {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new ResendEmailProvider(apiKey);
}

export function mailEnvelope(env: NodeJS.Dict<string> = process.env) {
  const fromEmail = env.CONTACT_FROM_EMAIL || "hello@rabinr.in";
  const fromName = env.CONTACT_FROM_NAME || profile.name;
  const toEmail = env.CONTACT_TO_EMAIL || profile.email;

  return {
    from: `"${fromName}" <${fromEmail}>`,
    to: toEmail,
    ackEnabled: env.CONTACT_ACK_EMAIL !== "false",
  };
}
