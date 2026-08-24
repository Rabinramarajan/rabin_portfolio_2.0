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
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<void>;
}

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
}

export class SmtpEmailProvider implements EmailProvider {
  private config: SmtpConfig;
  private transporter: any = null;
  private lastConnectAttempt = 0;
  private connectDelay = 1000;

  constructor(config: SmtpConfig) {
    this.config = config;
  }

  private async createTransporter() {
    const nodemailer = await import("nodemailer");
    const now = Date.now();
    const timeSinceLastAttempt = now - this.lastConnectAttempt;

    if (timeSinceLastAttempt < this.connectDelay) {
      await new Promise((resolve) => setTimeout(resolve, this.connectDelay - timeSinceLastAttempt));
    }

    this.lastConnectAttempt = Date.now();

    return nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      auth: this.config.user ? { user: this.config.user, pass: this.config.pass } : undefined,
      connectionTimeout: 10 * 1000,
      socketTimeout: 30 * 1000,
      maxConnections: 5,
      maxMessages: 100,
    });
  }

  async send(message: EmailMessage, attempt = 1): Promise<void> {
    const maxAttempts = 3;
    const referenceId = (message as any).referenceId || "unknown";

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

      const transporter = await this.createTransporter();
      await transporter.sendMail(message);

      this.connectDelay = Math.max(500, this.connectDelay * 0.9);

      mailLogger.log({
        timestamp: new Date().toISOString(),
        type: "send",
        referenceId,
        to: message.to,
        from: message.from,
        subject: message.subject,
        status: "success",
      });
    } catch (error) {
      this.connectDelay = Math.min(10000, this.connectDelay * 1.5);

      const isTransient =
        error instanceof Error &&
        (error.message.includes("ECONNREFUSED") ||
          error.message.includes("ETIMEDOUT") ||
          error.message.includes("EHOSTUNREACH") ||
          error.message.includes("socket hang up") ||
          error.message.includes("self-signed") ||
          error.message.includes("certificate") ||
          error.code === "ECONNRESET");

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
          errorMessage: error instanceof Error ? error.message : String(error),
          attempt,
          maxAttempts,
        });

        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.send(message, attempt + 1);
      }

      const errorMessage = error instanceof Error ? error.message : String(error);

      const isBounce = errorMessage.includes("550") || errorMessage.includes("Invalid");

      mailLogger.log({
        timestamp: new Date().toISOString(),
        type: isBounce ? "bounce" : "error",
        referenceId,
        to: message.to,
        from: message.from,
        subject: message.subject,
        status: "failed",
        errorMessage,
        errorCode: (error as any)?.code,
      });

      if (error instanceof Error) {
        console.error(`[contact] SMTP error (attempt ${attempt}/${maxAttempts}):`, {
          host: this.config.host,
          port: this.config.port,
          message: error.message,
          code: (error as any).code,
        });

        const isAuthError =
          error.message.includes("Invalid login") ||
          error.message.includes("authentication failed") ||
          error.message.includes("535");

        if (isAuthError) {
          throw new Error(
            `Email service authentication failed. Check SMTP_USER and SMTP_PASS. Details: ${error.message}`,
          );
        }
      }

      throw error;
    }
  }
}

export class MemoryEmailProvider implements EmailProvider {
  readonly sent: EmailMessage[] = [];
  async send(message: EmailMessage): Promise<void> {
    this.sent.push(message);
  }
}

export function createEmailProvider(env: NodeJS.Dict<string> = process.env): EmailProvider | null {
  const host = env.SMTP_HOST;
  if (!host) return null;

  const port = Number(env.SMTP_PORT || 587);
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
