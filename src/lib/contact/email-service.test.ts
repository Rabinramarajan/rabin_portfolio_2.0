import { describe, expect, it } from "vitest";
import { createEmailProvider, mailEnvelope, smtpConfig, SmtpEmailProvider } from "./email-service";

const smtpEnv = {
  ZOHO_SMTP_HOST: "smtp.zoho.in",
  ZOHO_SMTP_PORT: "465",
  ZOHO_SMTP_USER: "hello@rabinr.in",
  ZOHO_SMTP_PASSWORD: "app-password",
};

describe("smtpConfig", () => {
  it("derives implicit TLS from port 465", () => {
    expect(smtpConfig(smtpEnv)).toEqual({
      host: "smtp.zoho.in",
      port: 465,
      secure: true,
      user: "hello@rabinr.in",
      pass: "app-password",
    });
  });

  it("uses STARTTLS for port 587", () => {
    expect(smtpConfig({ ...smtpEnv, ZOHO_SMTP_PORT: "587" })?.secure).toBe(false);
  });

  it("returns null when credentials are incomplete", () => {
    expect(smtpConfig({ ...smtpEnv, ZOHO_SMTP_PASSWORD: undefined })).toBeNull();
    expect(smtpConfig({})).toBeNull();
  });
});

describe("createEmailProvider", () => {
  it("builds an SMTP provider from the Zoho credentials", () => {
    expect(createEmailProvider(smtpEnv)).toBeInstanceOf(SmtpEmailProvider);
  });

  it("returns null when nothing is configured", () => {
    expect(createEmailProvider({})).toBeNull();
  });
});

describe("mailEnvelope", () => {
  it("falls back to the authenticated SMTP mailbox as sender", () => {
    expect(mailEnvelope(smtpEnv).from).toContain("<hello@rabinr.in>");
  });
});
