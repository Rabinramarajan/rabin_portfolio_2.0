import { describe, expect, it } from "vitest";
import { submitContact } from "@/lib/contact/contact-service";
import { MemoryEmailProvider } from "@/lib/contact/email-service";
import { MemoryMessageStore } from "@/lib/contact/message-store";

const payload = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  inquiryType: "Consultation",
  message: "We need architecture advice for an Angular 22 migration across two product teams.",
  website: "",
};

describe("submitContact", () => {
  it("stores the message, notifies, and acknowledges on success", async () => {
    const email = new MemoryEmailProvider();
    const store = new MemoryMessageStore();
    const result = await submitContact(payload, {
      email,
      store,
      env: { CONTACT_TO: "rabinr2607@gmail.com", SMTP_FROM: "portfolio@example.com" },
      now: new Date("2026-08-22T10:00:00.000Z"),
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.referenceId).toMatch(/^RR-20260822-[A-Z0-9]{4}$/);
    expect(email.sent).toHaveLength(2);
    expect(email.sent[0].replyTo).toBe("ada@example.com");
    expect(email.sent[1].to).toBe("ada@example.com");
    expect(await store.get(result.referenceId)).toBeTruthy();
  });

  it("silently accepts honeypot spam", async () => {
    const email = new MemoryEmailProvider();
    const result = await submitContact({ ...payload, website: "https://spam.test" }, {
      email,
      store: new MemoryMessageStore(),
    });
    expect(result.ok).toBe(true);
    expect(email.sent).toHaveLength(0);
  });

  it("returns field errors for invalid input", async () => {
    const result = await submitContact({ ...payload, email: "bad" }, {
      email: new MemoryEmailProvider(),
      store: new MemoryMessageStore(),
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.fieldErrors?.email?.[0]).toBeTruthy();
  });

  it("returns a configuration error when mail is unavailable", async () => {
    const result = await submitContact(payload, {
      email: null,
      store: new MemoryMessageStore(),
      env: {},
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toMatch(/not configured/i);
  });

  it("still succeeds when the visitor acknowledgement bounces", async () => {
    // A dead or mistyped visitor address must not undo a delivered notification.
    const store = new MemoryMessageStore();
    const email = new MemoryEmailProvider();
    const send = email.send.bind(email);
    let call = 0;
    email.send = async (message) => {
      call += 1;
      if (call === 2) throw new Error("550 5.1.1 recipient does not exist");
      return send(message);
    };

    const result = await submitContact(payload, { email, store });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    // The notification to the inbox owner went out and was persisted.
    expect(email.sent).toHaveLength(1);
    expect(await store.get(result.referenceId)).toBeTruthy();
  });
});
