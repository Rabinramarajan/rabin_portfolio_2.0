"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Reply = { body?: string; title?: string; projects?: string[]; choices?: { id: string; label: string }[] };

export function Chatbot({ onClose }: { onClose: () => void }) {
  const [data, setData] = useState<Reply>({ body: "What are you looking for?" });
  const [question, setQuestion] = useState("");
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ body: "Unavailable. Use Contact instead." }));
    return () => abortRef.current?.abort();
  }, []);

  async function pick(id: string) {
    const res = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ choice: id }),
    });
    setData(await res.json());
  }

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    const q = question.trim();
    if (!q || streaming) return;
    setQuestion("");
    setData({ title: "Assistant", body: "" });
    setStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
        signal: controller.signal,
      });
      const choicesHeader = res.headers.get("X-Choices");
      const choices = choicesHeader ? JSON.parse(choicesHeader) : undefined;
      const contentType = res.headers.get("Content-Type") || "";
      if (res.status === 429) {
        setData((prev) => ({ title: "Assistant", body: "Too many questions at once — give it a minute and try again.", choices: prev.choices }));
      } else if (contentType.includes("application/json")) {
        setData(await res.json());
      } else if (!res.ok) {
        setData((prev) => ({ title: "Assistant", body: "Unavailable. Use Contact instead.", choices: prev.choices }));
      } else if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let text = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          setData({ title: "Assistant", body: text, choices });
        }
        setData({ title: "Assistant", body: text || "I can only speak to published portfolio facts.", choices });
      }
    } catch {
      setData({ title: "Assistant", body: "Unavailable. Use Contact instead." });
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div role="dialog" aria-label="Portfolio assistant" className="chat-panel">
      <button type="button" onClick={onClose} style={{ justifySelf: "end", minHeight: 44 }}>
        Close
      </button>
      <p className="mono faint">{data.title || "Assistant"}</p>
      <p>
        {data.body}
        {streaming ? <span className="chat-panel__cursor" aria-hidden="true">▋</span> : null}
      </p>
      <div className="chat-panel__choices">
        {(data.choices || []).map((c) => (
          <button key={c.id} type="button" onClick={() => pick(c.id)} disabled={streaming}>
            {c.label}
          </button>
        ))}
      </div>
      <form onSubmit={ask} className="chat-panel__form">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about Rabin's work..."
          aria-label="Ask a question"
          disabled={streaming}
        />
        <button type="submit" disabled={streaming || !question.trim()}>
          {streaming ? "..." : "Send"}
        </button>
      </form>
      <Link className="btn btn--line" href="/contact" onClick={onClose}>
        <span className="btn__label">Hire Rabin →</span>
      </Link>
    </div>
  );
}
