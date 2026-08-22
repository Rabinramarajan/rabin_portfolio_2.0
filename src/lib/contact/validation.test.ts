import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/contact/validation";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  inquiryType: "Project" as const,
  message: "We need a senior Angular engineer to rebuild a member portal for launch next quarter.",
  website: "",
};

describe("contactSchema", () => {
  it("accepts a complete required payload", () => {
    const result = contactSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects a missing name", () => {
    const result = contactSchema.safeParse({ ...valid, name: " " });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = contactSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects a short message", () => {
    const result = contactSchema.safeParse({ ...valid, message: "Too short" });
    expect(result.success).toBe(false);
  });

  it("rejects a message over the maximum", () => {
    const result = contactSchema.safeParse({ ...valid, message: "x".repeat(3001) });
    expect(result.success).toBe(false);
  });

  it("requires an inquiry type when projectType is absent", () => {
    const result = contactSchema.safeParse({ ...valid, inquiryType: "" });
    expect(result.success).toBe(false);
  });

  it("accepts the homepage payload that uses projectType", () => {
    const result = contactSchema.safeParse({
      name: "Ada Lovelace",
      email: "ada@example.com",
      projectType: "Other",
      budget: "Not specified",
      timeline: "Not specified",
      message: "Subject: Hello\n\nWe would like to discuss a contract engagement next month.",
      website: "",
    });
    expect(result.success).toBe(true);
  });

  it("trims whitespace on name and message", () => {
    const result = contactSchema.safeParse({
      ...valid,
      name: "  Ada  ",
      message: "  We need a senior Angular engineer to rebuild a member portal.  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Ada");
      expect(result.data.message.startsWith("We need")).toBe(true);
    }
  });
});
