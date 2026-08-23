"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { trackChat } from "@/chat/analytics";
import { chatConfig } from "@/chat/config";
import { ChatMessageView } from "@/components/chat/ChatMessageView";
import { LeadForm } from "@/components/chat/LeadForm";
import { useChat } from "@/components/chat/useChat";

/**
 * The chat panel.
 *
 * Accessibility contract: it is a modal-less dialog that takes focus on open,
 * traps Tab inside itself while open, closes on Escape, and returns focus to
 * the launcher. Content updates are announced through a polite live region so
 * a screen reader hears the answer without the transcript re-reading itself.
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface Props {
  onClose: () => void;
}

export function ChatWindow({ onClose }: Props) {
  const { messages, busy, send, reset, stop } = useChat();
  const [input, setInput] = useState("");
  const [leadOpen, setLeadOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();

  // Focus the composer on open so a keyboard user can type immediately.
  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(timer);
  }, []);

  // Escape closes; Tab is trapped inside the panel while it is open.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (node) => node.offsetParent !== null,
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [onClose]);

  // Keep the newest turn in view as tokens arrive.
  useEffect(() => {
    const node = transcriptRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, leadOpen, confirmation]);

  const submit = useCallback(
    (text: string) => {
      const value = text.trim();
      if (!value || busy) return;
      setLeadOpen(false);
      setConfirmation(null);
      setInput("");
      void send(value);
    },
    [busy, send],
  );

  const lastMessage = messages[messages.length - 1];
  const streamingId = busy && lastMessage?.role === "assistant" ? lastMessage.id : null;
  const remaining = chatConfig.maxMessageLength - input.length;

  return (
    <div
      ref={panelRef}
      role="dialog"
      /* Focus is trapped here and Escape closes the panel, so it behaves as a
         modal — without aria-modal a screen reader still offers the page
         behind it, which no longer matches what a sighted user can reach. */
      aria-modal="true"
      aria-label={`${chatConfig.name}, ${chatConfig.subtitle}`}
      aria-labelledby={titleId}
      className="chat-panel"
    >
      <header className="chat-panel__header">
        <div className="chat-panel__identity">
          <span className="chat-panel__avatar" aria-hidden="true">
            AR
          </span>
          <span className="chat-panel__titles">
            <span className="chat-panel__title" id={titleId}>
              {chatConfig.name}
            </span>
            <span className="chat-panel__subtitle">
              <span className="chat-panel__status" aria-hidden="true" />
              Online · {chatConfig.subtitle}
            </span>
          </span>
        </div>
        <div className="chat-panel__controls">
          {messages.length ? (
            <button
              type="button"
              className="chat-panel__icon"
              onClick={() => {
                reset();
                setLeadOpen(false);
                setConfirmation(null);
                inputRef.current?.focus();
              }}
              aria-label="Clear conversation"
            >
              Clear
            </button>
          ) : null}
          <button type="button" className="chat-panel__icon" onClick={onClose} aria-label="Close assistant">
            Close
          </button>
        </div>
      </header>

      <div className="chat-panel__transcript" ref={transcriptRef}>
        {!messages.length ? (
          <div className="chat-msg chat-msg--bot">
            <p className="chat-msg__bubble">{chatConfig.welcomeMessage}</p>
            {chatConfig.showQuickActions ? (
              <div className="chat-msg__suggestions">
                {chatConfig.quickActions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    className="chat-chip"
                    onClick={() => {
                      trackChat("quick_action_clicked", { label: action.label });
                      submit(action.prompt);
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {messages.map((message) => (
          <ChatMessageView
            key={message.id}
            message={message}
            streaming={message.id === streamingId}
            onSuggestion={submit}
            onStartLead={() => setLeadOpen(true)}
            onNavigate={onClose}
          />
        ))}

        {leadOpen ? (
          <LeadForm
            onCancel={() => setLeadOpen(false)}
            onSent={(referenceId, responseTime) => {
              setLeadOpen(false);
              setConfirmation(
                `Thanks — your enquiry is with Rabin${referenceId ? ` (ref ${referenceId})` : ""}. ${responseTime || ""}`.trim(),
              );
            }}
          />
        ) : null}

        {confirmation ? (
          <div className="chat-msg chat-msg--bot">
            <p className="chat-msg__bubble">{confirmation}</p>
          </div>
        ) : null}

        {/* Answers are announced here; the transcript itself stays silent. */}
        <p className="visually-hidden" aria-live="polite" aria-atomic="true">
          {busy ? "Assistant is typing" : lastMessage?.role === "assistant" ? lastMessage.content : ""}
        </p>
      </div>

      <form
        className="chat-panel__composer"
        onSubmit={(event) => {
          event.preventDefault();
          submit(input);
        }}
      >
        <label className="visually-hidden" htmlFor="chat-input">
          Ask about Rabin&apos;s work
        </label>
        <textarea
          id="chat-input"
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value.slice(0, chatConfig.maxMessageLength))}
          onKeyDown={(event) => {
            // Enter sends; Shift+Enter is a newline.
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              submit(input);
            }
          }}
          placeholder="Ask about Rabin's experience, projects or availability…"
          rows={1}
          maxLength={chatConfig.maxMessageLength}
          aria-describedby={remaining < 100 ? "chat-remaining" : undefined}
        />
        {busy ? (
          <button type="button" className="chat-panel__send" onClick={stop}>
            Stop
          </button>
        ) : (
          <button type="submit" className="chat-panel__send" disabled={!input.trim()}>
            Send
          </button>
        )}
        {remaining < 100 ? (
          <span className="chat-panel__remaining" id="chat-remaining">
            {remaining}
          </span>
        ) : null}
      </form>
    </div>
  );
}
