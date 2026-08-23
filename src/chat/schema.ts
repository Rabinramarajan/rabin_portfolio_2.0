import { z } from "zod";
import { chatConfig } from "@/chat/config";

/** Wire contract for POST /api/chat. Enforced server-side, never trusted from the client. */
export const chatRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Ask a question to get started.")
    .max(chatConfig.maxMessageLength, "That message is too long."),
  /** Opaque client-generated id, used only to group analytics events. */
  conversationId: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9_-]{6,64}$/, "Invalid conversation id.")
    .optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(chatConfig.maxMessageLength),
      }),
    )
    .max(20)
    .optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

/** Lead enquiry captured inside the chat, before it is handed to the contact pipeline. */
export const chatLeadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().trim(),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  projectType: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10).max(3000),
});

export type ChatLeadInput = z.infer<typeof chatLeadSchema>;
