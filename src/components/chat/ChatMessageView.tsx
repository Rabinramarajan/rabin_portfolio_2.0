"use client";

import Link from "next/link";
import { trackChat } from "@/chat/analytics";
import { chatConfig } from "@/chat/config";
import type { ChatAction, ChatMessage, ProjectCard } from "@/chat/models";
import { Markdown } from "@/components/chat/Markdown";

/** Which analytics event an action click reports, based on where it points. */
function actionEvent(action: ChatAction) {
  if (action.type === "lead") return "lead_started" as const;
  if (action.href.startsWith("/work")) return "project_action_clicked" as const;
  if (action.href.startsWith("/resume")) return "resume_action_clicked" as const;
  if (action.href.startsWith("/contact")) return "contact_action_clicked" as const;
  return "project_action_clicked" as const;
}

function ProjectResult({ card, onNavigate }: { card: ProjectCard; onNavigate: () => void }) {
  return (
    <Link href={card.url} className="chat-card" onClick={onNavigate}>
      {card.cover ? (
        // eslint-disable-next-line @next/next/no-img-element -- decorative thumbnail inside an overlay; next/image adds no benefit at 96px and complicates the panel layout
        <img className="chat-card__media" src={card.cover.src} alt="" loading="lazy" width={96} height={64} />
      ) : null}
      <span className="chat-card__body">
        <span className="chat-card__title">{card.title}</span>
        <span className="chat-card__meta">{card.category}</span>
        <span className="chat-card__tags">{card.technologies.join(" · ")}</span>
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
        <p className="chat-msg__bubble">{message.content}</p>
      </div>
    );
  }

  const showTyping = streaming && !message.content;

  return (
    <div className="chat-msg chat-msg--bot">
      <div className="chat-msg__bubble">
        {showTyping ? (
          <span className="chat-typing" aria-label="Assistant is typing">
            <span />
            <span />
            <span />
          </span>
        ) : (
          <div className="chat-md">
            <Markdown content={message.content} />
            {streaming ? <span className="chat-cursor" aria-hidden="true" /> : null}
          </div>
        )}
      </div>

      {!streaming && message.projects?.length && chatConfig.showProjectCards ? (
        <div className="chat-msg__cards">
          {message.projects.map((card) => (
            <ProjectResult
              key={card.slug}
              card={card}
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

      {!streaming && message.suggestions?.length ? (
        <div className="chat-msg__suggestions">
          {message.suggestions.slice(0, 3).map((suggestion) => (
            <button key={suggestion} type="button" className="chat-chip" onClick={() => onSuggestion(suggestion)}>
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
