/**
 * Chat domain models.
 *
 * These types are the contract between the retrieval layer, the API route and
 * the UI. Nothing here is provider-specific — swapping the AI provider or
 * moving the content layer to a CMS must not change these shapes.
 */

export type ChatIntent =
  | "PROFILE"
  | "EXPERIENCE"
  | "SKILLS"
  | "TECHNOLOGY"
  | "PROJECT"
  | "COMPARE"
  | "SERVICE"
  | "PROCESS"
  | "AVAILABILITY"
  | "ENGAGEMENT"
  | "RESUME"
  | "CONTACT"
  | "INSIGHTS"
  | "FAQ"
  | "NAVIGATION"
  | "LEAD"
  | "OFF_TOPIC"
  | "INJECTION"
  | "UNKNOWN";

/** Every kind of portfolio fact the retriever can return. */
export type KnowledgeType =
  | "profile"
  | "service"
  | "project"
  | "experience"
  | "skills"
  | "process"
  | "faq"
  | "availability"
  | "resume"
  | "insight"
  | "contact"
  | "engagement"
  | "pricing";

/**
 * A single normalized, retrievable portfolio fact.
 *
 * `content` is the text handed to the model — it is assembled from the typed
 * content layer, never authored here, so a content edit propagates without
 * touching the system prompt.
 */
export interface KnowledgeRecord {
  id: string;
  type: KnowledgeType;
  title: string;
  slug?: string;
  content: string;
  tags: string[];
  /** Canonical page this fact is published on — powers source links and CTAs. */
  url?: string;
  /** Structured payload for record types the UI renders richly (project cards). */
  data?: Record<string, unknown>;
}

export type ChatActionType = "internal-link" | "external-link" | "download" | "lead";

export interface ChatAction {
  label: string;
  type: ChatActionType;
  href: string;
}

export interface ChatSource {
  id: string;
  title: string;
  url?: string;
}

/** Compact project card rendered inline in the transcript. */
export interface ProjectCard {
  slug: string;
  title: string;
  category: string;
  tagline: string;
  technologies: string[];
  url: string;
  cover?: { src: string; alt: string };
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface ChatMessage extends ChatTurn {
  id: string;
  /** Assistant-only presentation payload. */
  actions?: ChatAction[];
  sources?: ChatSource[];
  suggestions?: string[];
  projects?: ProjectCard[];
  intent?: ChatIntent;
  error?: boolean;
  /** Renders the progressive lead-capture form instead of a text bubble. */
  lead?: boolean;
  /** Epoch ms the turn was created — rendered as the bubble timestamp. */
  at?: number;
}

/** Non-streamed metadata emitted before the answer text. */
export interface ChatResponseMeta {
  intent: ChatIntent;
  sources: ChatSource[];
  actions: ChatAction[];
  suggestions: string[];
  projects: ProjectCard[];
  lead?: boolean;
}
