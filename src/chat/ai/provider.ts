import type { ChatTurn } from "@/chat/models";

/**
 * Provider-agnostic AI contract.
 *
 * Nothing outside `src/chat/ai/` may import a provider SDK or hit a provider
 * URL, so adding a provider (or a local model) is a new file here plus one
 * line in `resolveProvider`.
 */
export interface AIProvider {
  readonly name: string;
  /** Whether the required server-side credentials are present. */
  isConfigured(): boolean;
  /** Streams the answer as plain text deltas. */
  stream(request: AIRequest): Promise<AsyncIterable<string>>;
  /** Non-streaming convenience, built on `stream` by default. */
  generate(request: AIRequest): Promise<string>;
}

export interface AIRequest {
  system: string;
  messages: ChatTurn[];
  signal?: AbortSignal;
  maxTokens?: number;
  temperature?: number;
}

export class AIProviderError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "AIProviderError";
  }
}

/** Shared SSE line reader — both supported providers speak `data:` frames. */
export async function* readSse(
  body: ReadableStream<Uint8Array>,
  extract: (payload: unknown) => string | undefined,
): AsyncIterable<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      // The final element may be a partial line; hold it for the next chunk.
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const text = extract(JSON.parse(payload));
          if (text) yield text;
        } catch {
          // Incomplete JSON frame — the next chunk completes it.
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/** Default `generate` implementation for providers that only stream. */
export async function collect(stream: AsyncIterable<string>): Promise<string> {
  let output = "";
  for await (const delta of stream) output += delta;
  return output;
}
