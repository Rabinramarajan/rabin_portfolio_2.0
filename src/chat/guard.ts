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
 * Drops a tail the model never finished.
 *
 * When the token budget runs out mid-sentence the visitor is left reading
 * "...Management System (" — worse than a shorter, complete answer. Only a
 * clearly broken tail is cut: a final line that is a bullet, or any text
 * already ending in terminal punctuation, is left alone, and the trim is
 * abandoned if it would remove most of the answer.
 */
export function trimIncompleteTail(text: string): string {
  const trimmed = text.trimEnd();
  if (!trimmed) return trimmed;

  const lines = trimmed.split("\n");
  const lastLine = lines[lines.length - 1].trim();

  // A line ending on a function word is a sentence that was still going. This
  // is what separates a truncated bullet ("- VNPF Mobile App is where he")
  // from an ordinary one that simply carries no full stop.
  const danglingWord =
    /\b(and|or|but|with|the|a|an|to|for|of|in|on|at|is|are|was|were|that|which|where|his|her|their|its|he|she|they|it|as|by|from|into|about|using|including|such)$/i.test(lastLine);

  // An unclosed bold/code span means the model stopped mid-token, whatever
  // the line looks like — check before the bullet exemption below.
  const unbalanced =
    (trimmed.match(/\*\*/g)?.length ?? 0) % 2 === 1 || (trimmed.match(/`/g)?.length ?? 0) % 2 === 1;

  // A bullet or heading is a complete thought without closing punctuation, so
  // it is only cut when something above proves the answer was interrupted.
  const interrupted = unbalanced || danglingWord;
  if (!interrupted && /^([-*•]|\d+\.|#{1,6})\s/.test(lastLine)) return trimmed;
  if (!interrupted && /[.!?:]["')\]]?$/.test(trimmed)) return trimmed;

  // Interrupted inside a list: drop the unfinished bullet, keep the rest.
  if (lines.length > 1 && /^([-*•]|\d+\.)\s/.test(lastLine)) {
    const kept = lines.slice(0, -1).join("\n").trimEnd();
    if (kept.length >= trimmed.length * 0.4) return kept;
  }

  // Cut back to the last sentence that actually closed.
  const lastStop = Math.max(trimmed.lastIndexOf("."), trimmed.lastIndexOf("!"), trimmed.lastIndexOf("?"));
  if (lastStop < 0) return trimmed;

  const candidate = trimmed.slice(0, lastStop + 1).trimEnd();
  // Never gut the answer to remove a fragment — a stub is worse than a tail.
  return candidate.length >= trimmed.length * 0.4 ? candidate : trimmed;
}

/**
 * Final gate on a completed answer. Returns the safe text, or `null` when the
 * answer must be discarded in favour of the deterministic fallback.
 */
export function validateAnswer(text: string): string | null {
  const cleaned = trimIncompleteTail(sanitizeOutput(text).trim());
  if (cleaned.length < 2) return null;
  if (containsLeak(cleaned)) return null;
  return cleaned;
}
