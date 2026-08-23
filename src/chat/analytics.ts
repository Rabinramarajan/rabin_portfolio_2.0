/**
 * Chat analytics.
 *
 * Event names only — message contents are never recorded, on the server or in
 * the browser. Intent and record ids are safe because they are drawn from a
 * closed set defined in this repository, not from visitor input.
 */
export type ChatEvent =
  | "chat_opened"
  | "chat_closed"
  | "chat_message_sent"
  | "chat_response_received"
  | "project_action_clicked"
  | "resume_action_clicked"
  | "contact_action_clicked"
  | "quick_action_clicked"
  | "lead_started"
  | "lead_submitted"
  | "chat_error";

type Props = Record<string, string | number | boolean>;

interface VercelAnalyticsWindow {
  va?: (event: "event", payload: { name: string } & Props) => void;
}

/** Client-side event. Routed to Vercel Analytics when present, else dropped. */
export function trackChat(event: ChatEvent, props: Props = {}): void {
  if (typeof window === "undefined") return;
  try {
    (window as VercelAnalyticsWindow).va?.("event", { name: event, ...props });
  } catch {
    // Analytics must never break the chat.
  }
}

/** Server-side event. Off unless DEBUG_CHAT is enabled. */
export function logChatEvent(event: ChatEvent, props: Props = {}): void {
  if (process.env.DEBUG_CHAT !== "true") return;
  console.log(`[chat] ${event}`, props);
}
