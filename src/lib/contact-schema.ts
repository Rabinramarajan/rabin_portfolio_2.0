import { z } from "zod";

/**
 * Contact form schema — shared between the client form and the server route.
 * Client uses it via @hookform/resolvers; the API re-validates the same shape
 * server-side. Never trust client-only validation.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(120, "Name is too long."),
  email: z.email("Enter a valid email address.").trim(),
  company: z.string().trim().max(160, "Company is too long.").optional().or(z.literal("")),
  projectType: z.string().min(1, "Please select a project type.").max(120),
  budget: z.string().min(1, "Please select a budget range.").max(120),
  timeline: z.string().min(1, "Please select a timeline.").max(120),
  message: z
    .string()
    .trim()
    .min(30, "Tell me a little about your project.")
    .max(3000, "Message is too long."),
  /** Honeypot — must stay empty. */
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Field-level error shape returned by the API for client display. */
export type ContactApiError = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};