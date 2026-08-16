import { z } from "zod";
import { assistantChoiceIds } from "@/lib/assistant";

/**
 * Request shape for /api/assistant. Exactly one of `choice` (Layer 1,
 * deterministic) or `question` (Layer 3, AI fallback) is expected per call.
 */
export const assistantRequestSchema = z
  .object({
    choice: z.enum(assistantChoiceIds).optional(),
    question: z.string().trim().min(1).max(500).optional(),
  })
  .refine((v) => Boolean(v.choice || v.question), { message: "Provide a choice or a question." });
