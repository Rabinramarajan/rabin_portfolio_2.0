/**
 * Output-side safety.
 *
 * The system prompt tells the model what not to do; this enforces it. A model
 * that leaks instruction text, emits HTML, or invents a link gets corrected
 * here, on the server, before a single token reaches the browser.
 */

/** Fragments that would mean the model is echoing its own instructions. */
const LEAK_MARKERS = [
  "system prompt",
  "you are ask rabin",
  "context (the only facts",
  "visitor question:",
  "grounding — the single",
  "grounding - the single",
  "my instructions",
  "these instructions",
];

/** Secret-shaped strings that must never appear in an answer. */
const SECRET_PATTERNS: RegExp[] = [
  /\bsk-[a-z0-9]{16,}/gi,
  /\bgsk_[a-z0-9]{16,}/gi,
  /\bAIza[0-9A-Za-z_-]{20,}/g,
  /\b(GROQ|GEMINI|OPENAI|AI)_API_KEY\b/g,
  /\bprocess\.env\.[A-Z_]+/g,
];

export function containsLeak(text: string): boolean {
  const lower = text.toLowerCase();
  return LEAK_MARKERS.some((marker) => lower.includes(marker)) || SECRET_PATTERNS.some((p) => p.test(text));
}

/**
 * Strips anything the renderer must never receive. Runs on every streamed
 * chunk boundary and on the completed answer.
 */
export function sanitizeOutput(text: string): string {
  let output = text;

  // No raw HTML — the client renders markdown only, but defence in depth.
  output = output.replace(/<\/?[a-z][^>]*>/gi, "");

  for (const pattern of SECRET_PATTERNS) {
    output = output.replace(pattern, "[redacted]");
  }

  // Markdown links and bare URLs: navigation is delivered as structured
  // actions, so a model-authored URL is always either redundant or wrong.
  output = output.replace(/\[([^\]]+)\]\((?:https?:\/\/|mailto:)[^)]*\)/gi, "$1");
  output = output.replace(/\bhttps?:\/\/\S+/gi, "");

  return output.trimEnd();
}

/**
 * Final gate on a completed answer. Returns the safe text, or `null` when the
 * answer must be discarded in favour of the deterministic fallback.
 */
export function validateAnswer(text: string): string | null {
  const cleaned = sanitizeOutput(text).trim();
  if (cleaned.length < 2) return null;
  if (containsLeak(cleaned)) return null;
  return cleaned;
}
