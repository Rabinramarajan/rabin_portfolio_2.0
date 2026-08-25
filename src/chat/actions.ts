import { profile } from "@/content/profile";
import { projectCard } from "@/chat/knowledge";
import type { DetectedEntities } from "@/chat/intent";
import type { ChatAction, ChatIntent, ChatSource, KnowledgeRecord, ProjectCard } from "@/chat/models";

/**
 * Builds the navigation affordances that accompany an answer.
 *
 * Actions are structured objects, never links improvised by the model — so a
 * CTA can never point at a page that does not exist.
 */

const link = (label: string, href: string): ChatAction => ({ label, type: "internal-link", href });

const VIEW_WORK = link("View Work", "/work");
const VIEW_SKILLS = link("View Skills", "/skills");
const VIEW_EXPERIENCE = link("View Experience", "/experience");
const VIEW_SERVICES = link("View Services", "/services");
const VIEW_RESUME = link("View Resume", profile.resumePath);
const VIEW_PROCESS = link("View Process", "/process");
const VIEW_PRICING = link("Engagement Models", "/pricing");
const VIEW_INSIGHTS = link("Read Insights", "/insights");
const CONTACT: ChatAction = link("Contact Rabin", "/contact");
const START_PROJECT: ChatAction = { label: "Start a Project", type: "lead", href: "/contact" };

export function buildActions(
  intent: ChatIntent,
  entities: DetectedEntities,
  records: KnowledgeRecord[],
): ChatAction[] {
  const actions: ChatAction[] = [];

  // A named project earns a direct case-study link, ahead of anything generic.
  const projectRecords = records.filter((record) => record.type === "project");
  if (entities.projectSlugs.length === 1 && projectRecords.length) {
    const record = projectRecords[0];
    actions.push(link("View Case Study", record.url ?? `/work/${record.slug}`));
  }

  switch (intent) {
    case "PROJECT":
    case "COMPARE":
    case "NAVIGATION":
      actions.push(VIEW_WORK);
      break;
    case "PROFILE":
      actions.push(VIEW_SKILLS, VIEW_WORK);
      break;
    case "EXPERIENCE":
      actions.push(VIEW_EXPERIENCE, VIEW_RESUME);
      break;
    case "SKILLS":
    case "TECHNOLOGY":
      actions.push(VIEW_SKILLS, VIEW_WORK);
      break;
    case "SERVICE":
      actions.push(VIEW_SERVICES, START_PROJECT);
      break;
    case "PROCESS":
      actions.push(VIEW_PROCESS);
      break;
    case "AVAILABILITY":
      actions.push(START_PROJECT, CONTACT);
      break;
    case "ENGAGEMENT":
      actions.push(VIEW_PRICING, START_PROJECT);
      break;
    case "RESUME":
      actions.push(VIEW_RESUME, VIEW_EXPERIENCE);
      break;
    case "CONTACT":
      actions.push(CONTACT, START_PROJECT);
      break;
    case "INSIGHTS":
      actions.push(VIEW_INSIGHTS);
      break;
    case "LEAD":
      actions.push(START_PROJECT, CONTACT);
      break;
    case "FAQ":
    case "UNKNOWN":
      actions.push(VIEW_WORK, CONTACT);
      break;
    case "OFF_TOPIC":
    case "INJECTION":
      actions.push(VIEW_WORK, VIEW_SERVICES, CONTACT);
      break;
  }

  return dedupeActions(actions).slice(0, 3);
}

/** At most three follow-up prompts, per the response-quality rules. */
export function buildSuggestions(intent: ChatIntent): string[] {
  switch (intent) {
    case "PROJECT":
    case "COMPARE":
      return ["Show me other projects", "What Angular technologies does he use?", "Is Rabin available?"];
    case "PROFILE":
      return ["How many years of experience does he have?", "Show me his projects", "What services does he offer?"];
    case "EXPERIENCE":
      return ["What companies has he worked with?", "Show me his resume", "Which projects use Angular?"];
    case "SKILLS":
    case "TECHNOLOGY":
      return ["Which projects use Angular?", "Does he build mobile apps?", "What services does Rabin offer?"];
    case "SERVICE":
      return ["Show me relevant work", "What are the engagement models?", "I have a project"];
    case "PROCESS":
      return ["What services does Rabin offer?", "Is Rabin available?", "Show me his work"];
    case "AVAILABILITY":
    case "ENGAGEMENT":
      return ["I have a project", "What services does Rabin offer?", "How can I contact Rabin?"];
    case "RESUME":
      return ["Show me his experience", "What are his strongest skills?", "How can I contact Rabin?"];
    case "CONTACT":
    case "LEAD":
      return ["Is Rabin available?", "What services does Rabin offer?", "Show me his work"];
    case "INSIGHTS":
      return ["What are his strongest skills?", "Show me his projects", "How can I contact Rabin?"];
    default:
      return ["Who is Rabin?", "Show me his projects", "Is Rabin available?"];
  }
}

export function buildSources(records: KnowledgeRecord[], limit = 3): ChatSource[] {
  const seen = new Set<string>();
  const sources: ChatSource[] = [];
  for (const record of records) {
    const key = record.url ?? record.id;
    if (seen.has(key)) continue;
    seen.add(key);
    sources.push({ id: record.id, title: record.title, url: record.url });
    if (sources.length >= limit) break;
  }
  return sources;
}

/** Project cards for the retrieved projects, capped so the panel stays light. */
export function buildProjectCards(records: KnowledgeRecord[], limit = 3): ProjectCard[] {
  return records
    .filter((record) => record.type === "project" && record.slug)
    .slice(0, limit)
    .map((record) => projectCard(record.slug as string))
    .filter((card): card is ProjectCard => Boolean(card));
}

function dedupeActions(actions: ChatAction[]): ChatAction[] {
  const seen = new Set<string>();
  return actions.filter((action) => {
    const key = `${action.type}:${action.href}:${action.label}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
