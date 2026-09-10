import { AIProviderError, collect, readSse, type AIProvider, type AIRequest } from "@/chat/ai/provider";

const ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";
/**
 * NVIDIA NIM (build.nvidia.com) exposes a free-tier, OpenAI-compatible endpoint.
 * Models are versioned in the catalogue and get retired, so `AI_MODEL` overrides
 * this without a code change; if the model disappears the route falls back to a
 * grounded deterministic answer rather than failing.
 */
const DEFAULT_MODEL = "nvidia/nemotron-3.5-lightning-30b-a3b";
/**
 * Nemotron is a reasoning model: left to itself it streams its entire chain of
 * thought as the answer ("Here's a thinking process: 1. Analyze User Input…")
 * and mirrors it into both `content` and `reasoning_content`, so the visitor
 * reads the scratchpad and the real reply never fits in the token budget.
 * `reasoning_effort: "none"` turns that off — verified against the live endpoint,
 * where it is the only switch that works (`chat_template_kwargs.thinking:false`
 * times out with a 504 and a `/no_think` system token is ignored). Set
 * AI_REASONING_EFFORT to "low"/"medium"/"high" only alongside a model whose
 * thinking is tag-delimited, since `stripThinking` below is what keeps it out
 * of the transcript.
 */
const DEFAULT_REASONING_EFFORT = "none";

interface NvidiaChunk {
  /** `reasoning_content` is deliberately never read — only the answer ships. */
  choices?: { delta?: { content?: string } }[];
}

/**
 * Drops `<think>…</think>` spans from a delta stream.
 *
 * Defence in depth behind `reasoning_effort`: most other NIM reasoning models
 * tag their scratchpad this way, so overriding AI_MODEL cannot dump raw
 * reasoning into the chat. A tag can straddle a chunk boundary, so any trailing
 * partial `<` run is held back until the next chunk resolves it.
 */
export async function* stripThinking(deltas: AsyncIterable<string>): AsyncIterable<string> {
  const OPEN = "<think>";
  const CLOSE = "</think>";
  let buffer = "";
  let thinking = false;

  const longestPartialSuffix = (text: string, tag: string): number => {
    const max = Math.min(text.length, tag.length - 1);
    for (let size = max; size > 0; size -= 1) {
      if (tag.startsWith(text.slice(text.length - size))) return size;
    }
    return 0;
  };

  for await (const delta of deltas) {
    buffer += delta;

    for (;;) {
      if (thinking) {
        const end = buffer.indexOf(CLOSE);
        if (end === -1) break;
        buffer = buffer.slice(end + CLOSE.length);
        thinking = false;
        continue;
      }

      const start = buffer.indexOf(OPEN);
      if (start === -1) break;
      const before = buffer.slice(0, start);
      if (before) yield before;
      buffer = buffer.slice(start + OPEN.length);
      thinking = true;
    }

    if (thinking) continue;
    // Emit everything that cannot still turn out to be the head of a tag.
    const held = longestPartialSuffix(buffer, OPEN);
    const emit = buffer.slice(0, buffer.length - held);
    if (emit) yield emit;
    buffer = buffer.slice(buffer.length - held);
  }

  // An unclosed <think> means the answer never arrived — emit nothing rather
  // than presenting a scratchpad fragment as the reply.
  if (!thinking && buffer) yield buffer;
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
        reasoning_effort: process.env.AI_REASONING_EFFORT || DEFAULT_REASONING_EFFORT,
        messages: [{ role: "system", content: request.system }, ...request.messages],
      }),
    });

    if (!response.ok || !response.body) {
      throw new AIProviderError(`NVIDIA request failed (${response.status}).`, response.status);
    }

    return stripThinking(
      readSse(response.body, (payload) => (payload as NvidiaChunk).choices?.[0]?.delta?.content),
    );
  }

  async generate(request: AIRequest): Promise<string> {
    return collect(await this.stream(request));
  }
}
