import raw from "@/chat/chatbot.json";

export interface QuickAction {
  label: string;
  prompt: string;
}

export interface ChatbotConfig {
  enabled: boolean;
  name: string;
  subtitle: string;
  welcomeMessage: string;
  maxMessageLength: number;
  /** How many prior turns are replayed to the model. Bounded on purpose. */
  maxHistoryTurns: number;
  maxAnswerWords: number;
  showQuickActions: boolean;
  showSources: boolean;
  showProjectCards: boolean;
  allowLeadCapture: boolean;
  quickActions: QuickAction[];
}

export const chatConfig: ChatbotConfig = raw;
