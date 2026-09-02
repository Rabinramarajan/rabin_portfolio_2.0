import { AIProviderError, collect, readSse, type AIProvider, type AIRequest } from "@/chat/ai/provider";

/**
 * `gemini-flash-latest` tracks Google's newest flash model, which carries a
 * 20-requests-per-day free tier — far too small for a public site. The lite
 * line has its own, larger quota and suits this workload better: the assistant
 * extracts from a supplied CONTEXT block rather than reasoning. Override with
 * AI_MODEL.
 */
const DEFAULT_MODEL = "gemini-flash-lite-latest";

/**
 * Gemini returns 503 when the model is momentarily overloaded and 429 when the
 * project is throttled. Both are transient and worth one short retry — without
 * it a single blip downgrades the visitor to the deterministic fallback. Other
 * statuses (401, 400) are permanent and must fail fast.
 */
const RETRY_STATUSES = new Set([429, 503]);

/**
 * Thinking budget, opt-in via AI_THINKING_BUDGET.
 *
 * On a thinking model (the `gemini-flash-latest` line) reasoning tokens come
 * out of maxOutputTokens and truncate the reply, so `0` is worth setting. The
 * lite models reject `thinkingConfig` outright with a 400, so it is omitted
 * unless asked for — the field is not portable across the Gemini lineup.
 */
function thinkingConfig(): { thinkingConfig?: { thinkingBudget: number } } {
  const raw = process.env.AI_THINKING_BUDGET?.trim();
  if (!raw) return {};
  const budget = Number(raw);
  return Number.isFinite(budget) ? { thinkingConfig: { thinkingBudget: budget } } : {};
}
const MAX_ATTEMPTS = 3;
const BASE_BACKOFF_MS = 400;

const wait = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new AIProviderError("Aborted."));
      },
      { once: true },
    );
  });

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

    const body = JSON.stringify({
      systemInstruction: { parts: [{ text: request.system }] },
      contents: request.messages.map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      })),
      generationConfig: {
        temperature: request.temperature ?? 0.2,
        maxOutputTokens: request.maxTokens ?? 400,
        ...thinkingConfig(),
      },
    });

    let status = 0;
    let detail = "";
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      const response = await fetch(url, {
        method: "POST",
        // The key travels as a header, never in the URL, so it cannot leak
        // through request logs or an error message that echoes the URL.
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        signal: request.signal,
        body,
      });

      if (response.ok && response.body) {
        return readSse(response.body, (payload) => (payload as GeminiChunk).candidates?.[0]?.content?.parts?.[0]?.text);
      }

      status = response.status;
      // Keep the upstream reason for the server log. It never reaches the
      // browser — the route discards it and serves a grounded answer instead —
      // but without it a 400 is undiagnosable. Capped, and the key travels as
      // a header so it cannot appear in the body.
      detail = (await response.text().catch(() => "")).slice(0, 300);

      if (!RETRY_STATUSES.has(status) || attempt === MAX_ATTEMPTS) break;
      await wait(BASE_BACKOFF_MS * 2 ** (attempt - 1), request.signal);
    }

    throw new AIProviderError(`Gemini request failed (${status}). ${detail}`.trim(), status);
  }

  async generate(request: AIRequest): Promise<string> {
    return collect(await this.stream(request));
  }
}
