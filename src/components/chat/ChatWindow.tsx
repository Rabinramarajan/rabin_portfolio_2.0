"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { trackChat } from "@/chat/analytics";
import { chatConfig } from "@/chat/config";
import { BotMark } from "@/components/chat/BotMark";
import {
  IconBolt,
  IconClose,
  IconCollapse,
  IconExpand,
  IconRefresh,
  IconSend,
  QUICK_ICONS,
} from "@/components/chat/ChatIcons";
import { ChatMessageView } from "@/components/chat/ChatMessageView";
import { LeadForm } from "@/components/chat/LeadForm";
import { useChat } from "@/components/chat/useChat";

/**
 * The chat panel.
 *
 * Two sizes share one component: the docked window, and the expanded view that
 * gives project cards room to sit three across. Only the width, height and
 * grid density change — the transcript, composer and controls are identical,
 * so a conversation survives the switch untouched.
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
  /** Prompt to ask immediately, when the panel was opened from a shortcut. */
  seed?: string | null;
}

/** Splits "Rabin AI Assistant" into its tinted first word and the remainder. */
function splitName(name: string, brand: string): [string, string] {
  return name.startsWith(brand) ? [brand, name.slice(brand.length).trim()] : ["", name];
}

export function ChatWindow({ onClose, seed = null }: Props) {
  const { messages, busy, send, reset, stop } = useChat();
  const [input, setInput] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const [brandWord, restOfName] = splitName(chatConfig.name, chatConfig.brandWord);

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

  // Focus the composer on open so a keyboard user can type immediately.
  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(timer);
  }, []);

  // A shortcut that opened the panel asks its question straight away.
  const seeded = useRef(false);
  useEffect(() => {
    if (!seed || seeded.current) return;
    seeded.current = true;
    submit(seed);
  }, [seed, submit]);

  // Auto-resize the textarea based on content to prevent scroll clipping.
  useEffect(() => {
    const textarea = inputRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 132)}px`;
  }, [input]);

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
  }, [messages, leadOpen, confirmation, expanded]);

  const lastMessage = messages[messages.length - 1];
  const streamingId = busy && lastMessage?.role === "assistant" ? lastMessage.id : null;
  const remaining = chatConfig.maxMessageLength - input.length;
  /* The bar shows fewer shortcuts in the docked width, where five would wrap
     into a second row and crowd the composer. */
  const barActions = chatConfig.quickActions.slice(0, expanded ? 4 : 3);

  return (
    <div className="chat-dock" data-expanded={expanded ? "true" : undefined}>
      <div
        ref={panelRef}
        role="dialog"
        /* Focus is trapped here and Escape closes the panel, so it behaves as a
           modal — without aria-modal a screen reader still offers the page
           behind it, which no longer matches what a sighted user can reach. */
        aria-modal="true"
        aria-labelledby={titleId}
        className="chat-panel"
      >
        <header className="chat-panel__header">
          <span className="chat-panel__avatar" aria-hidden="true">
            <BotMark />
          </span>
          <span className="chat-panel__titles">
            <span className="chat-panel__title" id={titleId}>
              {brandWord ? <b>{brandWord}</b> : null}
              {brandWord ? " " : ""}
              {restOfName}
            </span>
            <span className="chat-panel__subtitle">{chatConfig.subtitle}</span>
          </span>

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
                aria-label="Start a new conversation"
              >
                <IconRefresh />
              </button>
            ) : null}
            <button
              type="button"
              className="chat-panel__icon"
              onClick={() => setExpanded((value) => !value)}
              aria-label={expanded ? "Shrink assistant" : "Expand assistant"}
              aria-pressed={expanded}
            >
              {expanded ? <IconCollapse /> : <IconExpand />}
            </button>
            <button type="button" className="chat-panel__icon" onClick={onClose} aria-label="Close assistant">
              <IconClose />
            </button>
          </div>

          {/* The header's hairline: a lime run that traces how far the answer
              has got, and rests full-width between turns. */}
          <span className="chat-panel__thread" data-busy={busy ? "true" : undefined} aria-hidden="true">
            <i />
          </span>
        </header>

        <div className="chat-panel__transcript" ref={transcriptRef}>
          {!messages.length ? (
            <>
              <div className="chat-msg chat-msg--bot">
                <span className="chat-msg__avatar" aria-hidden="true">
                  <BotMark />
                </span>
                <div className="chat-msg__stack">
                  <div className="chat-msg__bubble">
                    {chatConfig.welcomeMessage.split("\n\n").map((para) => (
                      <p key={para}>{para}</p>
                    ))}
                    <time className="chat-msg__time">
                      {new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                    </time>
                  </div>
                </div>
              </div>

              {chatConfig.showQuickActions ? (
                <div className="chat-msg__suggestions">
                  {chatConfig.starterPrompts.map((prompt, index) => (
                    <button
                      key={prompt}
                      type="button"
                      className={index === 0 ? "chat-chip chat-chip--primary" : "chat-chip"}
                      onClick={() => {
                        trackChat("quick_action_clicked", { label: prompt });
                        submit(prompt);
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              ) : null}
            </>
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
              <span className="chat-msg__avatar" aria-hidden="true">
                <BotMark />
              </span>
              <div className="chat-msg__stack">
                <div className="chat-msg__bubble">
                  <p>{confirmation}</p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Answers are announced here; the transcript itself stays silent. */}
          <p className="visually-hidden" aria-live="polite" aria-atomic="true">
            {busy ? "Assistant is typing" : lastMessage?.role === "assistant" ? lastMessage.content : ""}
          </p>
        </div>

        <div className="chat-panel__foot">
          {chatConfig.showQuickActions ? (
            <div className="chat-panel__quickbar">
              {barActions.map((action) => {
                const Icon = QUICK_ICONS[action.icon];
                return (
                  <button
                    key={action.label}
                    type="button"
                    className="chat-quick"
                    disabled={busy}
                    onClick={() => {
                      trackChat("quick_action_clicked", { label: action.label });
                      submit(action.prompt);
                    }}
                  >
                    <Icon className="chat-quick__icon" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          ) : null}

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
              placeholder="Type a message…"
              rows={1}
              maxLength={chatConfig.maxMessageLength}
              aria-describedby={remaining < 100 ? "chat-remaining" : undefined}
            />
            {remaining < 100 ? (
              <span className="chat-panel__remaining" id="chat-remaining">
                {remaining}
              </span>
            ) : null}
            {busy ? (
              <button type="button" className="chat-panel__send" onClick={stop} aria-label="Stop responding">
                <span className="chat-panel__stop" aria-hidden="true" />
              </button>
            ) : (
              <button type="submit" className="chat-panel__send" disabled={!input.trim()} aria-label="Send message">
                <IconSend />
              </button>
            )}
          </form>
        </div>
      </div>

      <p className="chat-dock__brand">
        <IconBolt className="chat-dock__bolt" />
        Powered by Rabin AI
      </p>
    </div>
  );
}
