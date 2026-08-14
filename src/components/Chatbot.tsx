"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Reply = { body?: string; title?: string; projects?: string[]; choices?: { id: string; label: string }[] };

export function Chatbot({ onClose }: { onClose: () => void }) {
  const [data, setData] = useState<Reply>({ body: "What are you looking for?" });

  useEffect(() => {
    fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ body: "Unavailable. Use Contact instead." }));
  }, []);

  async function pick(id: string) {
    const res = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ choice: id }),
    });
    setData(await res.json());
  }

  return (
    <div role="dialog" aria-label="Portfolio assistant" className="chat-panel">
      <button type="button" onClick={onClose} style={{ justifySelf: "end", minHeight: 44 }}>
        Close
      </button>
      <p className="mono faint">{data.title || "Assistant"}</p>
      <p>{data.body}</p>
      <div className="chat-panel__choices">
        {(data.choices || []).map((c) => (
          <button key={c.id} type="button" onClick={() => pick(c.id)}>
            {c.label}
          </button>
        ))}
      </div>
      <Link className="btn btn--line" href="/contact" onClick={onClose}>
        <span className="btn__label">Hire Rabin →</span>
      </Link>
    </div>
  );
}
