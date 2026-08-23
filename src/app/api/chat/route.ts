import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { buildActions, buildProjectCards, buildSources, buildSuggestions } from "@/chat/actions";
import { resolveProvider } from "@/chat/ai";
import { logChatEvent } from "@/chat/analytics";
import { chatConfig } from "@/chat/config";
import {
  ERROR_MESSAGE,
  REDIRECT_MESSAGE,
  REFUSAL_MESSAGE,
  UNVERIFIED_MESSAGE,
  deterministicAnswer,
} from "@/chat/fallback";
import { sanitizeOutput, validateAnswer } from "@/chat/guard";
import { detectIntent } from "@/chat/intent";
import type { ChatResponseMeta, ChatTurn, KnowledgeRecord } from "@/chat/models";
import { buildMessages, systemPrompt } from "@/chat/prompt";
import { retrieveContext } from "@/chat/retriever";
import { chatRequestSchema } from "@/chat/schema";

/**
 * POST /api/chat — the only entry point to the assistant.
 *
 * Pipeline: validate -> rate limit -> intent -> retrieve -> ground -> generate
 * -> validate output -> stream. Refusals and empty retrievals never reach the
 * model, and the AI key never leaves this process.
 */

export const runtime = "nodejs";

const MAX_BODY_BYTES = 16 * 1024;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const encoder = new TextEncoder();

/** Messages allowed per client per window. Raised only for automated runs. */
function rateLimitCeiling(): number {
  const configured = Number(process.env.CHAT_RATE_LIMIT);
  return Number.isFinite(configured) && configured > 0 ? configured : 20;
}

function clientKey(req: NextRequest): string {
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "anon";
  return `chat:${ip}:${(req.headers.get("user-agent") ?? "").slice(0, 48)}`;
}

/** One SSE frame. `meta` precedes the answer; `delta` carries text; `done` ends it. */
function frame(event: "meta" | "delta" | "done" | "error", data: unknown): Uint8Array {
  return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function sseHeaders() {
  return {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    // The assistant is same-origin only; no CORS header is emitted on purpose.
    "X-Content-Type-Options": "nosniff",
  };
}

/** Streams a fixed answer using the same envelope as a model-backed one. */
function staticStream(meta: ChatResponseMeta, text: string): Response {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(frame("meta", meta));
      controller.enqueue(frame("delta", { text }));
      controller.enqueue(frame("done", {}));
      controller.close();
    },
  });
  return new Response(stream, { headers: sseHeaders() });
}

export async function POST(req: NextRequest) {
  if (!chatConfig.enabled) {
    return NextResponse.json({ error: "The assistant is currently unavailable." }, { status: 503 });
  }

  const declaredLength = Number(req.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  }

  if (!rateLimit(clientKey(req), rateLimitCeiling(), RATE_WINDOW_MS)) {
    logChatEvent("chat_error", { reason: "rate_limited" });
    return NextResponse.json(
      { error: "Too many messages. Give it a minute and try again." },
      { status: 429 },
    );
  }

  const rawText = await req.text().catch(() => "");
  if (rawText.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = rawText ? JSON.parse(rawText) : null;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  const { message, history = [], conversationId } = parsed.data;

  // ---- Intent + entity detection (deterministic, no model call) ----
  const priorUserTurns = history.filter((turn) => turn.role === "user").map((turn) => turn.content);
  const { intent, entities } = detectIntent(message, priorUserTurns);
  logChatEvent("chat_message_sent", { intent, conversationId: conversationId ?? "anon" });

  // ---- Refusals: never spend a model call, never echo the attempt ----
  if (intent === "INJECTION" || intent === "OFF_TOPIC") {
    const meta: ChatResponseMeta = {
      intent,
      sources: [],
      actions: buildActions(intent, entities, []),
      suggestions: buildSuggestions(intent),
      projects: [],
    };
    return staticStream(meta, intent === "INJECTION" ? REFUSAL_MESSAGE : REDIRECT_MESSAGE);
  }

  // ---- Retrieval ----
  const records: KnowledgeRecord[] = retrieveContext(message, intent, entities);

  const meta: ChatResponseMeta = {
    intent,
    sources: chatConfig.showSources ? buildSources(records) : [],
    actions: buildActions(intent, entities, records),
    suggestions: buildSuggestions(intent),
    projects: chatConfig.showProjectCards ? buildProjectCards(records) : [],
    lead: chatConfig.allowLeadCapture && intent === "LEAD",
  };

  // Nothing relevant retrieved — say so rather than let the model improvise.
  if (!records.length) {
    return staticStream(meta, `${UNVERIFIED_MESSAGE} I can help with Rabin's experience, projects, skills, services, availability or contact details.`);
  }

  const provider = resolveProvider();
  if (!provider) {
    // No key configured: still a grounded, useful answer from the same records.
    return staticStream(meta, deterministicAnswer(intent, entities, records, message));
  }

  const messages: ChatTurn[] = buildMessages(message, records, history, intent);

  let upstream: AsyncIterable<string>;
  try {
    upstream = await provider.stream({
      system: systemPrompt(),
      messages,
      signal: req.signal,
      maxTokens: 400,
    });
  } catch {
    // Provider errors are never surfaced verbatim — the visitor gets a grounded
    // answer from the retrieved records instead of a stack trace.
    logChatEvent("chat_error", { reason: "provider_unavailable", provider: provider.name });
    return staticStream(meta, deterministicAnswer(intent, entities, records, message));
  }

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(frame("meta", meta));

      let full = "";
      let emitted = 0;
      try {
        for await (const delta of upstream) {
          full += delta;

          // Hold back the tail: a leak marker can straddle a chunk boundary, so
          // only text that is definitively safe is released to the client.
          const safe = sanitizeOutput(full);
          if (safe.length > emitted) {
            const chunk = safe.slice(emitted);
            emitted = safe.length;
            controller.enqueue(frame("delta", { text: chunk }));
          }
        }

        const validated = validateAnswer(full);
        if (!validated) {
          // The completed answer failed the gate — replace it wholesale.
          logChatEvent("chat_error", { reason: "answer_rejected", intent });
          controller.enqueue(frame("delta", { replace: deterministicAnswer(intent, entities, records, message) }));
        } else if (validated.length > emitted) {
          controller.enqueue(frame("delta", { text: validated.slice(emitted) }));
        }

        logChatEvent("chat_response_received", { intent, provider: provider.name });
        controller.enqueue(frame("done", {}));
      } catch {
        logChatEvent("chat_error", { reason: "stream_failed", intent });
        controller.enqueue(frame("delta", { replace: emitted ? sanitizeOutput(full) : ERROR_MESSAGE }));
        controller.enqueue(frame("done", {}));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: sseHeaders() });
}

/** Explicitly reject non-POST verbs rather than letting Next 405 generically. */
export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
