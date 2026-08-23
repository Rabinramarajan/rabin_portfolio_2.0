import { AIProviderError, collect, readSse, type AIProvider, type AIRequest } from "@/chat/ai/provider";

const DEFAULT_MODEL = "gemini-flash-latest";

interface GeminiChunk {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
}

/** Google Gemini. Server-only: reads GEMINI_API_KEY. */
export class GeminiProvider implements AIProvider {
  readonly name = "gemini";

  isConfigured(): boolean {
    return Boolean(process.env.GEMINI_API_KEY);
  }

  async stream(request: AIRequest): Promise<AsyncIterable<string>> {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new AIProviderError("Gemini is not configured.");

    const model = process.env.AI_MODEL || DEFAULT_MODEL;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`;

    const response = await fetch(url, {
      method: "POST",
      // The key travels as a header, never in the URL, so it cannot leak
      // through request logs or an error message that echoes the URL.
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      signal: request.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: request.system }] },
        contents: request.messages.map((message) => ({
          role: message.role === "assistant" ? "model" : "user",
          parts: [{ text: message.content }],
        })),
        generationConfig: {
          temperature: request.temperature ?? 0.2,
          maxOutputTokens: request.maxTokens ?? 400,
        },
      }),
    });

    if (!response.ok || !response.body) {
      throw new AIProviderError(`Gemini request failed (${response.status}).`, response.status);
    }

    return readSse(response.body, (payload) => (payload as GeminiChunk).candidates?.[0]?.content?.parts?.[0]?.text);
  }

  async generate(request: AIRequest): Promise<string> {
    return collect(await this.stream(request));
  }
}
