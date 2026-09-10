import { AIProviderError, collect, readSse, type AIProvider, type AIRequest } from "@/chat/ai/provider";

const ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";
/**
 * NVIDIA NIM (build.nvidia.com) exposes a free-tier, OpenAI-compatible endpoint.
 * Models are versioned in the catalogue and get retired, so `AI_MODEL` overrides
 * this without a code change; if the model disappears the route falls back to a
 * grounded deterministic answer rather than failing.
 */
const DEFAULT_MODEL = "nvidia/nemotron-3.5-lightning-30b-a3b";

interface NvidiaChunk {
  /** Reasoning models also emit `reasoning_content`, which we deliberately drop. */
  choices?: { delta?: { content?: string } }[];
}

/** NVIDIA NIM (OpenAI-compatible chat completions). Server-only: reads NVIDIA_API_KEY. */
export class NvidiaProvider implements AIProvider {
  readonly name = "nvidia";

  isConfigured(): boolean {
    return Boolean(process.env.NVIDIA_API_KEY);
  }

  async stream(request: AIRequest): Promise<AsyncIterable<string>> {
    const key = process.env.NVIDIA_API_KEY;
    if (!key) throw new AIProviderError("NVIDIA is not configured.");

    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      signal: request.signal,
      body: JSON.stringify({
        model: process.env.AI_MODEL || DEFAULT_MODEL,
        stream: true,
        temperature: request.temperature ?? 0.2,
        top_p: 0.95,
        max_tokens: request.maxTokens ?? 400,
        messages: [{ role: "system", content: request.system }, ...request.messages],
      }),
    });

    if (!response.ok || !response.body) {
      throw new AIProviderError(`NVIDIA request failed (${response.status}).`, response.status);
    }

    return readSse(response.body, (payload) => (payload as NvidiaChunk).choices?.[0]?.delta?.content);
  }

  async generate(request: AIRequest): Promise<string> {
    return collect(await this.stream(request));
  }
}
