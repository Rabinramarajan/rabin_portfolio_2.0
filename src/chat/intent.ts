import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { everydayTech, skillGroups } from "@/content/skills";
import type { ChatIntent } from "@/chat/models";

/**
 * Deterministic intent + entity detection.
 *
 * Runs before any model call so the pipeline can (a) route to the right slice
 * of the knowledge base, (b) attach the right actions, and (c) refuse
 * off-topic and injection attempts without spending a model call on them.
 */

export interface DetectedEntities {
  projectSlugs: string[];
  technologies: string[];
  serviceIds: string[];
}

export interface IntentResult {
  intent: ChatIntent;
  entities: DetectedEntities;
  /** Whether the previous turn's subject was reused to resolve a pronoun. */
  usedContext: boolean;
}

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Phrases that try to extract the system prompt, credentials or internals.
 * Matched before anything else — these never reach the model.
 */
const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+|any\s+)?(your\s+|the\s+)?(previous|prior|above|earlier)\s+(instructions?|prompts?|rules?)/,
  /disregard\s+(all\s+|the\s+|your\s+)?(previous|prior|above)\s/,
  /(show|reveal|print|repeat|output|give|tell)\s+(me\s+)?(your|the)\s+(system|initial|hidden|original|secret)\s*(prompt|instructions?|message|rules?)/,
  /what\s+(is|are)\s+(your|the)\s+(system\s+)?(prompt|instructions)/,
  /\b(api[\s_-]?key|secret[\s_-]?key|access[\s_-]?token|private[\s_-]?key)\b/,
  /\benv(ironment)?\s+(variable|var|file)s?\b/,
  /\.env\b/,
  /\b(database|db)\s+(credential|password|connection\s+string|uri)/,
  /\bsystem\s+prompt\b/,
  /you\s+are\s+now\s+(a|an)\s/,
  /\bdeveloper\s+mode\b/,
  /\bjailbreak\b/,
  /\bprompt\s+injection\b/,
  /pretend\s+(you\s+are|to\s+be)\s+(?!rabin)/,
  /\bact\s+as\s+(a|an)\s+(?!portfolio)/,
];

/**
 * Requests that are plainly outside a portfolio assistant's remit. Only used
 * when no portfolio signal is present, so "write me an Angular component for
 * Rabin's stack" is not caught by the code-generation rule.
 */
const OFF_TOPIC_PATTERNS: RegExp[] = [
  // Allows an adjective or two between the verb and the language, so
  // "write a random Python application" is caught alongside "write Python".
  /\b(write|build|create|generate|code|implement)\b[^.?!]{0,40}\b(python|java|c\+\+|rust|golang|php|ruby|bash|shell)\b/,
  /\boperating\s+system\b/,
  /\bweather\b/,
  /\b(relationship|dating|marriage)\s+advice\b/,
  /\b(election|president|prime\s+minister|politics|political)\b/,
  /\b(stock|crypto|bitcoin)\s+(tip|advice|price|prediction)/,
  /\b(recipe|cook|cooking)\b/,
  /\b(joke|poem|story|song|essay)\b/,
  /\b(medical|legal|tax)\s+advice\b/,
  /\bwho\s+will\s+win\b/,
  /\btranslate\s+(this|the\s+following)\b/,
  /\bsolve\s+(this\s+)?(math|equation)\b/,
];

/**
 * Words that name Rabin or this portfolio as the *subject* of the question.
 *
 * Kept separate from the broader signal list because a bare technology name is
 * not a portfolio question: "write me a Python operating system" mentions a
 * real skill tag but is still off topic, whereas "does Rabin use Python?"
 * is not.
 */
const EXPLICIT_SUBJECTS = ["rabin", "he", "his", "him", "you", "your", "portfolio", "resume", "cv"];

/** Words that mark a question as being about Rabin or this portfolio. */
const PORTFOLIO_SIGNALS = [
  ...EXPLICIT_SUBJECTS,
  "project",
  "projects",
  "case study",
  "work",
  "experience",
  "skill",
  "skills",
  "service",
  "services",
  "hire",
  "available",
  "availability",
  "contact",
  "angular",
  "frontend",
  "stack",
  "tech",
  "process",
  "engagement",
  "pricing",
  "insight",
  "article",
];

interface IntentRule {
  intent: ChatIntent;
  patterns: RegExp[];
}

/** Order matters: the first rule that matches wins. */
const INTENT_RULES: IntentRule[] = [
  { intent: "COMPARE", patterns: [/\bcompare\b/, /\b(difference|differences)\s+between\b/, /\bvs\.?\b/, /\bversus\b/] },
  {
    intent: "LEAD",
    patterns: [
      /\bi\s+(want|need|am\s+looking)\s+(to\s+hire|for|an?\s+(angular|frontend|react|ionic))/,
      /\bi\s+have\s+a\s+(project|requirement|brief|idea)\b/,
      /\b(start|begin)\s+(a\s+)?(project|enquiry|inquiry|conversation)\b/,
      /\bhow\s+(do|can)\s+we\s+(start|begin|proceed)\b/,
      /\bwork\s+with\s+(you|him|rabin)\b/,
      /\bget\s+a\s+quote\b/,
      /\bhire\s+(you|him|rabin)\b/,
    ],
  },
  {
    intent: "RESUME",
    patterns: [/\bresume\b/, /\bcv\b/, /\bcurriculum\s+vitae\b/, /\bdownload\s+.*\b(resume|cv)\b/],
  },
  {
    intent: "CONTACT",
    patterns: [
      /\b(contact|reach|email|e-mail|phone|call|message)\b/,
      /\bget\s+in\s+touch\b/,
      /\bwhats?\s+(his|your|rabins)\s+email\b/,
    ],
  },
  {
    intent: "AVAILABILITY",
    patterns: [
      /\b(available|availability|free\s+for|open\s+for|open\s+to|accepting)\b/,
      /\bcan\s+i\s+hire\b/,
      /\bis\s+he\s+(taking|accepting)\b/,
      /\bwork\s+remotely\b/,
      /\bfreelance\b/,
      /\bfull[\s-]?time\b/,
    ],
  },
  {
    intent: "ENGAGEMENT",
    patterns: [
      /\bengagement\s+model/,
      /\b(retainer|contract\s+work)\b/,
      /\b(price|pricing|cost|rate|budget|charge|how\s+much)\b/,
    ],
  },
  {
    intent: "PROJECT",
    patterns: [
      /\b(project|projects|case\s+stud(y|ies)|portfolio\s+work|built|build(s)?\s+for|worked\s+on)\b/,
      /\bshow\s+me\s+(his|your|the)?\s*work\b/,
    ],
  },
  {
    intent: "EXPERIENCE",
    patterns: [
      /\b(experience|years|worked\s+at|work\s+history|career|employer|companies|company|background)\b/,
      /\bhow\s+long\s+has\s+he\b/,
    ],
  },
  {
    intent: "SERVICE",
    patterns: [
      /\b(service|services|offer|offering|provide|help\s+with)\b/,
      /\b(can|does|do)\s+(he|rabin|you)\s+(build|develop|make|create|optimi[sz]e|do|handle|take\s+on)\b/,
      /\b(mobile|web|cross[\s-]?platform)\s+(app|apps|application|applications)\b/,
    ],
  },
  {
    intent: "PROCESS",
    patterns: [/\b(process|workflow|how\s+does\s+he\s+work|methodology|approach|stages?)\b/],
  },
  {
    intent: "INSIGHTS",
    patterns: [/\b(insight|insights|article|articles|blog|writing|writes)\b/],
  },
  {
    intent: "SKILLS",
    patterns: [
      /\b(skill|skills|strongest|expertise|proficient|capable)\b/,
      /\bgood\s+at\b/,
      // Prefix stems: no trailing \b, so "specialise"/"specializing" both match.
      /\bspecialis/,
      /\bspecializ/,
    ],
  },
  {
    intent: "TECHNOLOGY",
    patterns: [
      /\b(technolog|tech\s+stack|stack|framework|library|language|tool|version)\b/,
      /\bdoes\s+(he|rabin|you)\s+(use|know|work\s+with)\b/,
    ],
  },
  {
    intent: "PROFILE",
    patterns: [/\bwho\s+is\b/, /\btell\s+me\s+about\s+(rabin|him|yourself)\b/, /\babout\s+(rabin|him)\b/, /\bintroduce\b/],
  },
  {
    intent: "NAVIGATION",
    patterns: [/\b(show|take|navigate|go)\s+me?\s*(to|the)?\b/, /\bwhere\s+can\s+i\s+(find|see|download)\b/],
  },
  { intent: "FAQ", patterns: [/\bfaq\b/, /\bfrequently\s+asked\b/] },
];

/** Technologies the assistant can recognise — derived from the content layer. */
function knownTechnologies(): string[] {
  const fromSkills = skillGroups.flatMap((group) => group.items);
  const fromProjects = projects.flatMap((project) => project.technologies);
  const fromServices = services.flatMap((service) => service.technologies);
  return Array.from(new Set([...fromSkills, ...fromProjects, ...fromServices, ...everydayTech]));
}

let techCache: string[] | null = null;
const technologies = () => (techCache ??= knownTechnologies());

/**
 * Extra ways visitors name a project. Keys are matched against the normalized
 * question; values are project slugs that must exist in the content layer.
 */
const PROJECT_ALIASES: Record<string, string> = {
  fiji: "fiji-immigration-internal",
  "fiji immigration": "fiji-immigration-internal",
  immigration: "fiji-immigration-internal",
  "citizen portal": "fiji-immigration-external",
  prims: "prims-member-portal",
  vnpf: "vnpf-blo-mi",
  insuremet: "insuremet",
  galaxy: "galaxy-sofas",
  zellavora: "zellavora-ai-resume-builder",
  "resume builder": "zellavora-ai-resume-builder",
  "control center": "zellavora-control-center",
  "component architecture": "ui-component-architecture",
};

export function detectEntities(question: string): DetectedEntities {
  const text = normalize(question);

  const projectSlugs = new Set<string>();
  for (const project of projects) {
    const title = normalize(project.title);
    const slugWords = project.slug.replace(/-/g, " ");
    if (text.includes(title) || text.includes(slugWords) || text.includes(project.slug)) {
      projectSlugs.add(project.slug);
    }
  }
  for (const [alias, slug] of Object.entries(PROJECT_ALIASES)) {
    // Only trust an alias that resolves to a project the content layer still ships.
    if (text.includes(alias) && projects.some((p) => p.slug === slug)) projectSlugs.add(slug);
  }

  const matchedTech = technologies().filter((tech) => {
    const t = normalize(tech);
    if (t.length < 2) return false;
    return new RegExp(`(^|[^a-z0-9])${escapeRegExp(t)}([^a-z0-9]|$)`).test(text);
  });

  const serviceIds = services
    .filter((service) => text.includes(normalize(service.title)) || text.includes(normalize(service.id)))
    .map((service) => service.id);

  return {
    projectSlugs: [...projectSlugs],
    technologies: matchedTech,
    serviceIds,
  };
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function isInjectionAttempt(question: string): boolean {
  const text = normalize(question);
  return INJECTION_PATTERNS.some((pattern) => pattern.test(text));
}

const mentions = (text: string, word: string) =>
  new RegExp(`(^|[^a-z0-9])${escapeRegExp(word)}([^a-z0-9]|$)`).test(text);

/** Is Rabin or his portfolio the explicit subject of this question? */
function hasExplicitSubject(text: string): boolean {
  return EXPLICIT_SUBJECTS.some((word) => mentions(text, word));
}

function hasPortfolioSignal(text: string, entities: DetectedEntities): boolean {
  if (entities.projectSlugs.length || entities.technologies.length || entities.serviceIds.length) return true;
  return PORTFOLIO_SIGNALS.some((signal) => mentions(text, signal));
}

/**
 * Classifies a question. `history` carries the previous user turns so a
 * follow-up like "what technologies were used?" can inherit the subject of the
 * turn before it.
 */
export function detectIntent(question: string, history: string[] = []): IntentResult {
  const text = normalize(question);

  if (isInjectionAttempt(question)) {
    return { intent: "INJECTION", entities: emptyEntities(), usedContext: false };
  }

  let entities = detectEntities(question);
  let usedContext = false;

  // Pronoun follow-up: no entity in this turn, but the conversation already
  // established one. Reuse it rather than asking the visitor to repeat itself.
  const isFollowUp = /\b(that|this|it|its|there|those|the\s+project|same)\b/.test(text) || text.split(" ").length <= 6;
  if (isFollowUp && !entities.projectSlugs.length && history.length) {
    for (let i = history.length - 1; i >= 0; i -= 1) {
      const prior = detectEntities(history[i]);
      if (prior.projectSlugs.length || prior.technologies.length) {
        entities = {
          projectSlugs: prior.projectSlugs,
          technologies: entities.technologies.length ? entities.technologies : prior.technologies,
          serviceIds: entities.serviceIds.length ? entities.serviceIds : prior.serviceIds,
        };
        usedContext = true;
        break;
      }
    }
  }

  const portfolioRelevant = hasPortfolioSignal(text, entities);

  // An off-topic request is only rescued by Rabin being the explicit subject.
  // A matching technology name is not enough — "write me a Python operating
  // system" names a real skill tag but is still not a portfolio question.
  if (!hasExplicitSubject(text) && OFF_TOPIC_PATTERNS.some((pattern) => pattern.test(text))) {
    return { intent: "OFF_TOPIC", entities, usedContext };
  }

  for (const rule of INTENT_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(text))) {
      return { intent: rule.intent, entities, usedContext };
    }
  }

  // A named project or technology is itself enough to classify the question.
  if (entities.projectSlugs.length) return { intent: "PROJECT", entities, usedContext };
  if (entities.technologies.length) return { intent: "TECHNOLOGY", entities, usedContext };

  if (!portfolioRelevant) return { intent: "OFF_TOPIC", entities, usedContext };

  return { intent: "UNKNOWN", entities, usedContext };
}

export function emptyEntities(): DetectedEntities {
  return { projectSlugs: [], technologies: [], serviceIds: [] };
}
