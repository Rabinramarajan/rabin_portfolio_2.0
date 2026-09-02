import raw from "@/chat/chatbot.json";

import type { QuickIconName } from "@/components/chat/ChatIcons";

export interface QuickAction {
  label: string;
  prompt: string;
  /** Glyph shown beside the label in the quick-action bar. */
  icon: QuickIconName;
}

export interface ChatbotConfig {
  enabled: boolean;
  name: string;
  /** Leading word of the name, tinted with the accent in the header. */
  brandWord: string;
  subtitle: string;
  welcomeMessage: string;
  /** One-liner shown in the pre-open preview card. */
  previewMessage: string;
  maxMessageLength: number;
  /** How many prior turns are replayed to the model. Bounded on purpose. */
  maxHistoryTurns: number;
  maxAnswerWords: number;
  showQuickActions: boolean;
  showSources: boolean;
  showProjectCards: boolean;
  allowLeadCapture: boolean;
  /** Suggestion chips offered before the first question. */
  starterPrompts: string[];
  quickActions: QuickAction[];
}

export const chatConfig: ChatbotConfig = raw as ChatbotConfig;
