import { GeminiProvider } from "@/chat/ai/gemini";
import { GroqProvider } from "@/chat/ai/groq";
import type { AIProvider } from "@/chat/ai/provider";

export type { AIProvider, AIRequest } from "@/chat/ai/provider";
export { AIProviderError } from "@/chat/ai/provider";

/**
 * Provider registry, in preference order.
 *
 * `AI_PROVIDER` pins one explicitly; otherwise the first provider with
 * credentials wins. When none is configured the route answers deterministically
 * from the knowledge base rather than failing — the site never depends on a
 * third-party key being present.
 */
const providers: AIProvider[] = [new GeminiProvider(), new GroqProvider()];

export function resolveProvider(): AIProvider | null {
  const pinned = process.env.AI_PROVIDER?.trim().toLowerCase();
  if (pinned) {
    const match = providers.find((provider) => provider.name === pinned);
    return match?.isConfigured() ? match : null;
  }
  return providers.find((provider) => provider.isConfigured()) ?? null;
}
