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
  /** Optional rich part. Clients that cannot render it fall back to `text`. */
  html?: string;
  attachments?: EmailAttachment[];
  /** Carried through to the logs only; never sent to the SMTP server. */
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

export const EMAIL_CONNECTION_TIMEOUT = 15000;
export const EMAIL_GREETING_TIMEOUT = 15000;
export const EMAIL_SOCKET_TIMEOUT = 30000;
export const EMAIL_MAX_CONNECTIONS = 3;
export const EMAIL_MAX_MESSAGES = 50;
export const EMAIL_MAX_RETRIES = 3;

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
}

function isPermanentErrorCode(code: string | undefined): boolean {
  if (!code) return false;
  const upper = code.toUpperCase();
  if (upper.startsWith("5")) return true;
  const permanentPatterns = [
    "550",
    "551",
    "552",
    "553",
    "554",
    "invalid from",
    "not authorized",
    "relaying denied",
    "mailbox full",
    "user not local",
  ];
  return permanentPatterns.some((p) => upper.includes(p));
}

function maskSensitiveData(message: string): string {
  return message
    .replace(/pass(wd)?[=:\s]+[\S]+/gi, "****")
    .replace(/authenticat[^.\n]{0,50}/gi, "*** censored ***")
    .replace(/user[=:\s]+[\S]+/gi, "USER redacted");
}

export class SmtpEmailProvider implements EmailProvider {
  private config: SmtpConfig;
  private transporter: unknown = null;
  private isVerified = false;

  constructor(config: SmtpConfig) {
    this.config = config;
  }

  async verify(): Promise<boolean> {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: this.config.host,
        port: this.config.port,
        secure: this.config.secure,
        auth: this.config.user ? { user: this.config.user, pass: this.config.pass } : undefined,
        connectionTimeout: EMAIL_CONNECTION_TIMEOUT,
        socketTimeout: EMAIL_SOCKET_TIMEOUT,
      });

      await transporter.verify();
      this.isVerified = true;
      mailLogger.log({
        timestamp: new Date().toISOString(),
        type: "send",
        referenceId: "system",
        to: "",
        from: this.config.user || "SMTP_USER redacted",
        subject: "SMTP Verify",
        status: "success",
      });
      console.log("[contact] SMTP connection verified successfully");
      return true;
    } catch (error) {
      this.isVerified = false;
      const err = error instanceof Error ? error : new Error(String(error));
      mailLogger.log({
        timestamp: new Date().toISOString(),
        type: "error",
        referenceId: "system",
        to: "",
        from: this.config.user || "SMTP_USER redacted",
        subject: "SMTP Verify",
        status: "failed",
        errorMessage: err.message,
      });
      console.log("[contact] SMTP connection verification failed");
      return false;
    }
  }

  async send(message: EmailMessage, attempt = 1): Promise<void> {
    const maxAttempts = EMAIL_MAX_RETRIES;
    const { referenceId = "unknown", ...mail } = message;

    try {
      if (attempt === 1) {
        mailLogger.log({
          timestamp: new Date().toISOString(),
          type: "send",
          referenceId,
          to: message.to,
          from: message.from,
          subject: message.subject,
          status: "pending",
        });
      }

if (!this.transporter) {
        this.transporter = await this.createTransporter();
      }

      /* eslint-disable @typescript-eslint/no-explicit-any */
      const info = (await (this.transporter as any).sendMail(mail)) as {
        messageId?: string;
        response?: string;
        accepted?: string[];
        rejected?: string[];
      };
      /* eslint-enable @typescript-eslint/no-explicit-any */

      // A resolved sendMail only means the relay accepted the envelope. It can
      // still have refused individual recipients in the same 250 response.
      if (info?.rejected?.length) {
        throw new Error(`SMTP server rejected recipient(s): ${info.rejected.join(", ")}`);
      }

      mailLogger.log({
        timestamp: new Date().toISOString(),
        type: "send",
        referenceId,
        to: message.to,
        from: message.from,
        subject: message.subject,
        status: "success",
        messageId: info?.messageId,
        smtpResponse: info?.response,
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      const apiErr = err as { code?: string; response?: { code?: string } };
      let errorCode: string | undefined;
      if (apiErr.code) errorCode = apiErr.code;
      else if (apiErr.response?.code) errorCode = apiErr.response.code;

      const isTransient =
        errorCode === "ECONNREFUSED" ||
        errorCode === "ETIMEDOUT" ||
        errorCode === "EHOSTUNREACH" ||
        errorCode === "ECONNRESET";

      const isPermanent = isPermanentErrorCode(errorCode);

      if (isTransient && attempt < maxAttempts) {
        const delay = Math.pow(2, attempt - 1) * 1000;

        mailLogger.log({
          timestamp: new Date().toISOString(),
          type: "retry",
          referenceId,
          to: message.to,
          from: message.from,
          subject: message.subject,
          status: "pending",
          errorMessage: maskSensitiveData(err.message),
          attempt,
          maxAttempts,
        });

        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.send(message, attempt + 1);
      }

      const logStatus = isPermanent ? "failed" : "pending";

      mailLogger.log({
        timestamp: new Date().toISOString(),
        type: isPermanent ? "error" : "retry",
        referenceId,
        to: message.to,
        from: message.from,
        subject: message.subject,
        status: logStatus,
        errorMessage: maskSensitiveData(err.message),
        errorCode,
        attempt,
        maxAttempts,
      });

      if (isPermanent) {
        const isAuthError =
          err.message?.includes("Invalid login") ||
          err.message?.includes("authentication failed") ||
          err.message?.includes("535");

        if (isAuthError) {
          throw new Error("Email service authentication failed. Check SMTP credentials.");
        }
      }

      throw error;
    }
  }

  getStatus(): EmailDeliveryStatus {
    return {
      status: this.isVerified ? "sent" : "failed",
      attempts: 1,
      maxAttempts: EMAIL_MAX_RETRIES,
    };
  }

private async createTransporter() {
    const nodemailer = await import("nodemailer");

    const transportConfig: Record<string, unknown> = {
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      connectionTimeout: EMAIL_CONNECTION_TIMEOUT,
      greetingTimeout: EMAIL_GREETING_TIMEOUT,
      socketTimeout: EMAIL_SOCKET_TIMEOUT,
      pool: true,
      maxConnections: EMAIL_MAX_CONNECTIONS,
      maxMessages: EMAIL_MAX_MESSAGES,
    };

    if (this.config.user) {
      transportConfig.auth = { user: this.config.user, pass: this.config.pass };
    }

    return nodemailer.createTransport(transportConfig as Record<string, unknown>);
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
  const host = env.SMTP_HOST;
  if (!host) return null;

  const port = Number(env.SMTP_PORT || 465);
  if (!Number.isFinite(port) || port < 1 || port > 65535) {
    console.error(`[contact] Invalid SMTP_PORT: ${env.SMTP_PORT}`);
    return null;
  }

  return new SmtpEmailProvider({
    host,
    port,
    secure: env.SMTP_SECURE === "true",
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  });
}

export function mailEnvelope(env: NodeJS.Dict<string> = process.env) {
  return {
    from: env.SMTP_FROM || env.SMTP_USER || profile.email,
    to: env.CONTACT_TO || profile.email,
    ackEnabled: env.CONTACT_ACK_EMAIL !== "false",
  };
}