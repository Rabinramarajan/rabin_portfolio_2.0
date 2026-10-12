/**
 * Contact message contract, shared by the Angular form and the Cloudflare Worker
 * (worker/index.ts) so the client and the server can never disagree on a rule.
 * Pure TypeScript: no Angular or Worker imports.
 */

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/** What the browser posts: the visible fields plus two spam traps. */
export interface ContactRequest extends ContactMessage {
  /** Honeypot. Hidden from people and assistive tech; bots fill it in. */
  website: string;
  /** Epoch ms when the form was first rendered; instant submissions are bots. */
  startedAt: number;
}

export type ContactResponse = { ok: true } | { ok: false; error: string };

export const CONTACT_LIMITS = {
  name: { min: 2, max: 120 },
  email: { max: 254 },
  subject: { min: 3, max: 160 },
  message: { min: 20, max: 5000 },
  /** A person cannot read and fill the form faster than this. */
  minFillMs: 3000,
} as const;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type ContactErrors = Partial<Record<keyof ContactMessage, string>>;

/** Server-side validation. The form applies the same limits through Signal Forms validators. */
export function validateContact(input: ContactMessage): ContactErrors {
  const errors: ContactErrors = {};
  const { name, email, subject, message } = CONTACT_LIMITS;

  const trimmed = {
    name: input.name.trim(),
    email: input.email.trim(),
    subject: input.subject.trim(),
    message: input.message.trim(),
  };

  if (trimmed.name.length < name.min || trimmed.name.length > name.max) {
    errors.name = `Name must be ${name.min}–${name.max} characters.`;
  }
  if (!EMAIL_PATTERN.test(trimmed.email) || trimmed.email.length > email.max) {
    errors.email = 'Enter a valid email address.';
  }
  if (trimmed.subject.length < subject.min || trimmed.subject.length > subject.max) {
    errors.subject = `Subject must be ${subject.min}–${subject.max} characters.`;
  }
  if (trimmed.message.length < message.min || trimmed.message.length > message.max) {
    errors.message = `Message must be ${message.min}–${message.max} characters.`;
  }

  return errors;
}

/** True when either spam trap was tripped. The server answers these with a fake success. */
export function looksAutomated(request: Pick<ContactRequest, 'website' | 'startedAt'>, now = Date.now()): boolean {
  if (request.website.trim() !== '') return true;
  if (!Number.isFinite(request.startedAt)) return true;
  return now - request.startedAt < CONTACT_LIMITS.minFillMs;
}
