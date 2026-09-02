import { describe, expect, it } from "vitest";
import { submitContact } from "@/lib/contact/contact-service";
import type { EmailMessage, EmailProvider } from "@/lib/contact/email-service";

/** Records what would have been sent, so tests can assert on the envelope. */
class StubEmailProvider implements EmailProvider {
  readonly sent: EmailMessage[] = [];
  /** Throws on the nth send (1-based) to simulate a per-message failure. */
  constructor(private readonly failOnCall?: number) {}

  async send(message: EmailMessage): Promise<void> {
    if (this.sent.length + 1 === this.failOnCall) {
      throw new Error("550 5.1.1 recipient does not exist");
    }
    this.sent.push(message);
  }
}

const payload = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  inquiryType: "Consultation",
  message: "We need architecture advice for an Angular 22 migration across two product teams.",
  website: "",
};

describe("submitContact", () => {
  it("notifies the owner and acknowledges the visitor on success", async () => {
    const email = new StubEmailProvider();
    const result = await submitContact(payload, {
      email,
      env: { CONTACT_TO_EMAIL: "hello@rabinr.in", CONTACT_FROM_EMAIL: "portfolio@example.com" },
      now: new Date("2026-08-22T10:00:00.000Z"),
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.referenceId).toMatch(/^RR-20260822-[A-Z0-9]{4}$/);
    expect(email.sent).toHaveLength(2);
    expect(email.sent[0].to).toBe("hello@rabinr.in");
    expect(email.sent[0].replyTo).toBe("ada@example.com");
    expect(email.sent[1].to).toBe("ada@example.com");
  });

  it("never puts the visitor's address in the From header", async () => {
    const email = new StubEmailProvider();
    await submitContact(payload, {
      email,
      env: { CONTACT_TO_EMAIL: "hello@rabinr.in", CONTACT_FROM_EMAIL: "portfolio@example.com" },
    });

    for (const message of email.sent) {
      expect(message.from).toBe('"Rabin R" <portfolio@example.com>');
      expect(message.from).not.toContain("ada@example.com");
    }
  });

  it("subjects the notification with the sender's name", async () => {
    const email = new StubEmailProvider();
    await submitContact(payload, { email });
    expect(email.sent[0].subject).toBe("New project enquiry from Ada Lovelace");
  });

  it("silently accepts honeypot spam", async () => {
    const email = new StubEmailProvider();
    const result = await submitContact({ ...payload, website: "https://spam.test" }, { email });
    expect(result.ok).toBe(true);
    expect(email.sent).toHaveLength(0);
  });

  it("returns field errors for invalid input", async () => {
    const result = await submitContact({ ...payload, email: "bad" }, { email: new StubEmailProvider() });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.fieldErrors?.email?.[0]).toBeTruthy();
  });

  it("returns a configuration error when mail is unavailable", async () => {
    const result = await submitContact(payload, { email: null, env: {} });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toMatch(/not configured/i);
  });

  it("still succeeds when the visitor acknowledgement bounces", async () => {
    // A dead or mistyped visitor address must not undo a delivered notification.
    const email = new StubEmailProvider(2);
    const result = await submitContact(payload, { email });

    expect(result.ok).toBe(true);
    expect(email.sent).toHaveLength(1);
  });

  it("propagates a failed owner notification so the route can report it", async () => {
    // With no store behind it, a silent success here would lose the enquiry.
    const email = new StubEmailProvider(1);
    await expect(submitContact(payload, { email })).rejects.toThrow();
  });
});
