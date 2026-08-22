import { profile } from "@/content/profile";

export interface EmailMessage {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  text: string;
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<void>;
}

export class SmtpEmailProvider implements EmailProvider {
  constructor(
    private readonly config: {
      host: string;
      port: number;
      secure: boolean;
      user?: string;
      pass?: string;
    },
  ) {}

  async send(message: EmailMessage): Promise<void> {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      auth: this.config.user ? { user: this.config.user, pass: this.config.pass } : undefined,
    });
    await transporter.sendMail(message);
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
  return new SmtpEmailProvider({
    host,
    port: Number(env.SMTP_PORT || 587),
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
