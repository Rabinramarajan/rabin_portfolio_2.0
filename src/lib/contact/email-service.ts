import { profile } from "@/content/profile";

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

export interface EmailProvider {
  send(message: EmailMessage): Promise<void>;
}

export const EMAIL_MAX_RETRIES = 3;

/** Keeps credentials out of the server log when a transport error is printed. */
function maskSensitiveData(message: string): string {
  return message
    .replace(/pass(wd)?[=:\s]+[\S]+/gi, "****")
    .replace(/authenticat[^.\n]{0,50}/gi, "*** censored ***")
    .replace(/user[=:\s]+[\S]+/gi, "USER redacted");
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
}

/**
 * Zoho (and any other) SMTP relay via Nodemailer.
 *
 * The transport is created once and reused: Nodemailer pools the TLS
 * connection, which matters on Fluid Compute where a warm function instance
 * serves several submissions.
 */
export class SmtpEmailProvider implements EmailProvider {
  private readonly config: SmtpConfig;
  private transporter: import("nodemailer").Transporter | null = null;

  constructor(config: SmtpConfig) {
    this.config = config;
  }

  private async getTransporter() {
    if (this.transporter) return this.transporter;
    const nodemailer = await import("nodemailer");
    this.transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      // Port 465 speaks TLS from the first byte; 587 upgrades via STARTTLS.
      secure: this.config.secure,
      auth: { user: this.config.user, pass: this.config.pass },
      pool: true,
      maxConnections: 1,
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 30_000,
    });
    return this.transporter;
  }

  async send(message: EmailMessage): Promise<void> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= EMAIL_MAX_RETRIES; attempt += 1) {
      try {
        const transporter = await this.getTransporter();
        await transporter.sendMail({
          // Always the authenticated Zoho mailbox — SPF/DKIM are published for
          // this domain, so spoofing the visitor here would get us rejected.
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
        return;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // 5xx replies are permanent (bad credentials, rejected recipient);
        // retrying only burns the request's time budget.
        const code = (error as { responseCode?: number }).responseCode;
        const permanent = typeof code === "number" && code >= 500 && code < 600;

        if (permanent || attempt === EMAIL_MAX_RETRIES) break;

        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
      }
    }

    const err = lastError ?? new Error("SMTP send failed");
    console.error(
      `[contact] SMTP send failed for ${message.referenceId ?? "unknown"}:`,
      maskSensitiveData(err.message),
    );
    throw err;
  }
}

export function smtpConfig(env: NodeJS.Dict<string> = process.env): SmtpConfig | null {
  const host = env.ZOHO_SMTP_HOST || env.SMTP_HOST;
  const user = env.ZOHO_SMTP_USER || env.SMTP_USER;
  const pass = env.ZOHO_SMTP_PASSWORD || env.SMTP_PASSWORD;
  if (!host || !user || !pass) return null;

  const port = Number(env.ZOHO_SMTP_PORT || env.SMTP_PORT || 465);
  if (!Number.isFinite(port) || port <= 0) return null;

  // Implicit TLS on 465, STARTTLS on 587 — derived from the port unless the
  // deployment says otherwise.
  const secureRaw = env.ZOHO_SMTP_SECURE || env.SMTP_SECURE;
  const secure = secureRaw ? secureRaw !== "false" : port === 465;

  return { host, port, secure, user, pass };
}

/**
 * Zoho SMTP is the only transport: it is the mailbox the domain publishes
 * SPF/DKIM for. Returns null when the credentials are absent, which the route
 * surfaces as a 503 rather than silently dropping the enquiry.
 */
export function createEmailProvider(env: NodeJS.Dict<string> = process.env): EmailProvider | null {
  const smtp = smtpConfig(env);
  return smtp ? new SmtpEmailProvider(smtp) : null;
}

export function mailEnvelope(env: NodeJS.Dict<string> = process.env) {
  const fromEmail = env.CONTACT_FROM_EMAIL || env.ZOHO_SMTP_USER || env.SMTP_USER || "hello@rabinr.in";
  const fromName = env.CONTACT_FROM_NAME || profile.name;
  const toEmail = env.CONTACT_TO_EMAIL || profile.email;

  return {
    from: `"${fromName}" <${fromEmail}>`,
    to: toEmail,
    ackEnabled: env.CONTACT_ACK_EMAIL !== "false",
  };
}
