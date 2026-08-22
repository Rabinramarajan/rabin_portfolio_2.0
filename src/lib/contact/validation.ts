import { z } from "zod";
import { INQUIRY_TYPES, PREFERRED_CONTACT_METHODS } from "@/types/contact";

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
