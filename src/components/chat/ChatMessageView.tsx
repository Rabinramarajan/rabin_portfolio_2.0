"use client";

import Link from "next/link";
import { trackChat } from "@/chat/analytics";
import { chatConfig } from "@/chat/config";
import type { ChatAction, ChatMessage, ProjectCard } from "@/chat/models";
import { BotMark } from "@/components/chat/BotMark";
import { IconCheckDouble } from "@/components/chat/ChatIcons";
import { Markdown } from "@/components/chat/Markdown";

/** Which analytics event an action click reports, based on where it points. */
function actionEvent(action: ChatAction) {
  if (action.type === "lead") return "lead_started" as const;
  if (action.href.startsWith("/work")) return "project_action_clicked" as const;
  if (action.href.startsWith("/resume")) return "resume_action_clicked" as const;
  if (action.href.startsWith("/contact") || action.href.includes("#contact")) return "contact_action_clicked" as const;
  return "project_action_clicked" as const;
}

/** Bubble timestamps use the reader's locale, in the panel's short form. */
function clock(at?: number) {
  return new Date(at ?? Date.now()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function ProjectResult({
  card,
  index,
  onNavigate,
}: {
  card: ProjectCard;
  index: number;
  onNavigate: () => void;
}) {
  return (
    <Link href={card.url} className="chat-card" onClick={onNavigate}>
      <span className="chat-card__frame">
        <span className="chat-card__index" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        {card.cover ? (
          // eslint-disable-next-line @next/next/no-img-element -- decorative thumbnail inside an overlay; next/image adds no benefit at this size and complicates the panel layout
          <img className="chat-card__media" src={card.cover.src} alt="" loading="lazy" width={220} height={124} />
        ) : null}
      </span>
      <span className="chat-card__body">
        <span className="chat-card__title">{card.title}</span>
        <span className="chat-card__meta">{card.category}</span>
        <span className="chat-card__tagline">{card.tagline}</span>
        <span className="chat-card__cta">View Case Study →</span>
      </span>
    </Link>
  );
}

interface Props {
  message: ChatMessage;
  streaming: boolean;
  onSuggestion: (prompt: string) => void;
  onStartLead: () => void;
  onNavigate: () => void;
}

export function ChatMessageView({ message, streaming, onSuggestion, onStartLead, onNavigate }: Props) {
  if (message.role === "user") {
    return (
      <div className="chat-msg chat-msg--user">
        <div className="chat-msg__stack">
          <div className="chat-msg__bubble">
            <p>{message.content}</p>
            <span className="chat-msg__receipt">
              <time className="chat-msg__time">{clock(message.at)}</time>
              <IconCheckDouble className="chat-msg__ticks" />
            </span>
          </div>
        </div>
      </div>
    );
  }

  const showTyping = streaming && !message.content;

  return (
    <div className="chat-msg chat-msg--bot" data-error={message.error ? "true" : undefined}>
      <span className="chat-msg__avatar" aria-hidden="true">
        <BotMark />
      </span>

      <div className="chat-msg__stack">
        <div className="chat-msg__bubble">
          {showTyping ? (
            <span className="chat-typing" aria-label="Assistant is typing">
              <span />
              <span />
              <span />
            </span>
          ) : (
            <>
              <div className="chat-md">
                <Markdown content={message.content} />
                {streaming ? <span className="chat-cursor" aria-hidden="true" /> : null}
              </div>
              {!streaming ? <time className="chat-msg__time">{clock(message.at)}</time> : null}
            </>
          )}
        </div>

        {!streaming && message.projects?.length && chatConfig.showProjectCards ? (
          <div className="chat-msg__cards">
            {message.projects.map((card, index) => (
              <ProjectResult
                key={card.slug}
                card={card}
                index={index}
                onNavigate={() => {
                  trackChat("project_action_clicked", { slug: card.slug });
                  onNavigate();
                }}
              />
            ))}
          </div>
        ) : null}

        {!streaming && message.actions?.length ? (
          <div className="chat-msg__actions">
            {message.actions.map((action) =>
              action.type === "lead" ? (
                <button
                  key={action.label}
                  type="button"
                  className="chat-action chat-action--primary"
                  onClick={() => {
                    trackChat("lead_started", {});
                    onStartLead();
                  }}
                >
                  {action.label}
                </button>
              ) : (
                <Link
                  key={action.label}
                  href={action.href}
                  className="chat-action"
                  onClick={() => {
                    trackChat(actionEvent(action), { href: action.href });
                    onNavigate();
                  }}
                >
                  {action.label}
                </Link>
              ),
            )}
          </div>
        ) : null}

        {!streaming && chatConfig.showSources && message.sources?.length ? (
          <p className="chat-msg__sources">
            <span className="chat-msg__sources-label">Based on Rabin&apos;s portfolio:</span>{" "}
            {message.sources.map((source, index) => (
              <span key={source.id}>
                {index > 0 ? ", " : ""}
                {source.url ? (
                  <Link href={source.url} onClick={onNavigate}>
                    {source.title}
                  </Link>
                ) : (
                  source.title
                )}
              </span>
            ))}
          </p>
        ) : null}
      </div>

      {!streaming && message.suggestions?.length ? (
        <div className="chat-msg__suggestions">
          {message.suggestions.slice(0, 3).map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              className={index === 0 ? "chat-chip chat-chip--primary" : "chat-chip"}
              onClick={() => onSuggestion(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
