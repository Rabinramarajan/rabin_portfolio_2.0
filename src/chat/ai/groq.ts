import { AIProviderError, collect, readSse, type AIProvider, type AIRequest } from "@/chat/ai/provider";

const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
/**
 * Groq decommissions models periodically — the previous default
 * (`llama-3.3-70b-versatile`) now 404s. Override with AI_MODEL without a code
 * change; if the model disappears, the route falls back to a grounded
 * deterministic answer rather than failing the request.
 */
const DEFAULT_MODEL = "openai/gpt-oss-120b";

interface GroqChunk {
  choices?: { delta?: { content?: string } }[];
}

/** Groq (OpenAI-compatible chat completions). Server-only: reads GROQ_API_KEY. */
export class GroqProvider implements AIProvider {
  readonly name = "groq";

  isConfigured(): boolean {
    return Boolean(process.env.GROQ_API_KEY);
  }

  async stream(request: AIRequest): Promise<AsyncIterable<string>> {
    const key = process.env.GROQ_API_KEY;
    if (!key) throw new AIProviderError("Groq is not configured.");

    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      signal: request.signal,
      body: JSON.stringify({
        model: process.env.AI_MODEL || DEFAULT_MODEL,
        stream: true,
        temperature: request.temperature ?? 0.2,
        max_tokens: request.maxTokens ?? 400,
        messages: [{ role: "system", content: request.system }, ...request.messages],
      }),
    });

    if (!response.ok || !response.body) {
      throw new AIProviderError(`Groq request failed (${response.status}).`, response.status);
    }

    return readSse(response.body, (payload) => (payload as GroqChunk).choices?.[0]?.delta?.content);
  }

  async generate(request: AIRequest): Promise<string> {
    return collect(await this.stream(request));
  }
}
