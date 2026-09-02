"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { trackChat } from "@/chat/analytics";
import { chatConfig } from "@/chat/config";
import type { ChatMessage, ChatResponseMeta, ChatTurn } from "@/chat/models";

/**
 * Chat transport + transcript state.
 *
 * Conversation memory lives here only — nothing is persisted, so closing the
 * tab discards the exchange. History sent to the server is bounded to the last
 * few turns so a long session cannot grow the request without limit.
 */

const ERROR_TEXT =
  "I'm having trouble responding right now. You can still explore Rabin's work or contact him directly.";

const ERROR_ACTIONS: ChatMessage["actions"] = [
  { label: "View Work", type: "internal-link", href: "/work" },
  { label: "Contact Rabin", type: "internal-link", href: "/contact" },
];

let messageCounter = 0;
const nextId = () => `m${++messageCounter}-${Date.now().toString(36)}`;

function newConversationId(): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "")
      : Math.random().toString(36).slice(2);
  return random.slice(0, 24);
}

interface SseEvent {
  event: string;
  data: unknown;
}

/** Splits the raw stream into complete `event:`/`data:` frames. */
function parseFrames(buffer: string): { events: SseEvent[]; rest: string } {
  const events: SseEvent[] = [];
  const parts = buffer.split("\n\n");
  const rest = parts.pop() ?? "";

  for (const part of parts) {
    let event = "message";
    let data = "";
    for (const line of part.split("\n")) {
      if (line.startsWith("event:")) event = line.slice(6).trim();
      else if (line.startsWith("data:")) data += line.slice(5).trim();
    }
    if (!data) continue;
    try {
      events.push({ event, data: JSON.parse(data) });
    } catch {
      // Malformed frame — drop it rather than corrupt the transcript.
    }
  }

  return { events, rest };
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const conversationId = useMemo(() => newConversationId(), []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setMessages([]);
    setBusy(false);
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setBusy(false);
  }, []);

  const send = useCallback(
    async (rawText: string) => {
      const text = rawText.trim().slice(0, chatConfig.maxMessageLength);
      if (!text || busy) return;

      const userMessage: ChatMessage = { id: nextId(), role: "user", content: text, at: Date.now() };
      const assistantId = nextId();

      // History is captured before the new turn is appended.
      let history: ChatTurn[] = [];
      setMessages((prev) => {
        history = prev
          .filter((message) => !message.error && message.content)
          .slice(-chatConfig.maxHistoryTurns)
          .map((message) => ({ role: message.role, content: message.content }));
        return [...prev, userMessage, { id: assistantId, role: "assistant", content: "", at: Date.now() }];
      });

      setBusy(true);
      trackChat("chat_message_sent", { length: text.length });

      const controller = new AbortController();
      abortRef.current = controller;

      const patch = (updater: (message: ChatMessage) => ChatMessage) =>
        setMessages((prev) => prev.map((message) => (message.id === assistantId ? updater(message) : message)));

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, conversationId, history }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          const message =
            response.status === 429
              ? "Too many messages at once — give it a minute and try again."
              : ERROR_TEXT;
          trackChat("chat_error", { status: response.status });
          patch((m) => ({ ...m, content: message, error: true, actions: ERROR_ACTIONS }));
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let answer = "";
        let done = false;

        while (!done) {
          const { done: finished, value } = await reader.read();
          if (finished) break;
          buffer += decoder.decode(value, { stream: true });

          const { events, rest } = parseFrames(buffer);
          buffer = rest;

          for (const item of events) {
            if (item.event === "meta") {
              const meta = item.data as ChatResponseMeta;
              patch((m) => ({
                ...m,
                intent: meta.intent,
                actions: meta.actions,
                sources: meta.sources,
                suggestions: meta.suggestions,
                projects: meta.projects,
                lead: meta.lead,
              }));
            } else if (item.event === "delta") {
              const delta = item.data as { text?: string; replace?: string };
              // `replace` is the server discarding an answer that failed its
              // output gate — the transcript must show the replacement only.
              answer = delta.replace !== undefined ? delta.replace : answer + (delta.text ?? "");
              patch((m) => ({ ...m, content: answer }));
            } else if (item.event === "done") {
              done = true;
            }
          }
        }

        if (!answer.trim()) {
          patch((m) => ({ ...m, content: ERROR_TEXT, error: true, actions: ERROR_ACTIONS }));
        } else {
          trackChat("chat_response_received", {});
        }
      } catch (error) {
        if ((error as Error)?.name === "AbortError") {
          patch((m) => (m.content ? m : { ...m, content: "Cancelled.", error: true }));
          return;
        }
        trackChat("chat_error", { reason: "network" });
        patch((m) => ({ ...m, content: ERROR_TEXT, error: true, actions: ERROR_ACTIONS }));
      } finally {
        abortRef.current = null;
        setBusy(false);
      }
    },
    [busy, conversationId],
  );

  return { messages, busy, send, reset, stop };
}
