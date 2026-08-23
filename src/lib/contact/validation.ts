import { z } from "zod";
import { INQUIRY_TYPES, PREFERRED_CONTACT_METHODS } from "@/types/contact";
import {
  BUDGET_RANGES,
  CONTACT_ROLES,
  ENGAGEMENTS,
  PROJECT_STAGES,
  REFERRAL_SOURCES,
  TECHNOLOGIES,
  TIMELINES,
} from "@/content/contact-fields";

/** An enum field that is allowed to be absent or an empty string. */
const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.enum(values).optional().or(z.literal(""));

const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label} is too long.`)
    .optional()
    .or(z.literal(""));

export const contactSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your name.").max(120, "Name is too long."),
    email: z.email("Enter a valid email address.").trim(),
    inquiryType: z.enum(INQUIRY_TYPES).optional().or(z.literal("")),
    projectType: z.string().trim().max(120).optional().or(z.literal("")),
    company: optionalText(160, "Company"),
    projectUrl: optionalText(200, "Website"),
    budget: optionalText(120, "Budget"),
    timeline: optionalText(120, "Timeline"),
    preferredContact: z.enum(PREFERRED_CONTACT_METHODS).optional().or(z.literal("")),
    role: optionalEnum(CONTACT_ROLES),
    projectStage: optionalEnum(PROJECT_STAGES),
    engagement: optionalEnum(ENGAGEMENTS),
    referralSource: optionalEnum(REFERRAL_SOURCES),
    technologies: z.array(z.enum(TECHNOLOGIES)).max(TECHNOLOGIES.length).optional(),
    attachmentName: optionalText(200, "Attachment name"),
    message: z
      .string()
      .trim()
      .min(30, "Tell me a little more — at least 30 characters.")
      .max(3000, "Message is too long. Please keep it under 3,000 characters."),
    /** Honeypot — must stay empty. */
    website: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (!value.inquiryType && !value.projectType) {
      ctx.addIssue({
        code: "custom",
        path: ["inquiryType"],
        message: "Please choose what this is about.",
      });
    }
    for (const [field, allowed] of [
      ["budget", BUDGET_RANGES],
      ["timeline", TIMELINES],
    ] as const) {
      const raw = value[field]?.trim();
      // Free text is still accepted from the long-form /contact page; only the
      // homepage's fixed vocabulary is enforced when the value looks like one
      // of the ranges (i.e. it contains a currency or range marker).
      if (raw && /[₹–]/.test(raw) && !(allowed as readonly string[]).includes(raw)) {
        ctx.addIssue({ code: "custom", path: [field], message: "Choose one of the listed options." });
      }
    }

    const url = value.projectUrl?.trim();
    if (url && !/^https?:\/\/\S+\.\S+/i.test(url) && !/^www\.\S+\.\S+/i.test(url)) {
      ctx.addIssue({
        code: "custom",
        path: ["projectUrl"],
        message: "Enter a full website URL, or leave this blank.",
      });
    }
  });

export type ContactInput = z.infer<typeof contactSchema>;

export function fieldErrorsFromZod(error: z.ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string") {
      (fieldErrors[key] ??= []).push(issue.message);
    }
  }
  return fieldErrors;
}
