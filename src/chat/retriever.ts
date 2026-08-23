import { knowledgeBase } from "@/chat/knowledge";
import type { DetectedEntities } from "@/chat/intent";
import type { ChatIntent, KnowledgeRecord, KnowledgeType } from "@/chat/models";

/**
 * Retrieval abstraction.
 *
 * The current implementation is a lexical scorer over the normalized knowledge
 * base — the content volume (a few dozen records) does not justify a vector
 * database. A `VectorRetriever` can replace `JsonRetriever` later without any
 * caller changing, which is why every consumer depends on this interface.
 */
export interface KnowledgeRetriever {
  search(query: string, options?: SearchOptions): KnowledgeRecord[];
  findById(id: string): KnowledgeRecord | undefined;
  findByType(type: KnowledgeType): KnowledgeRecord[];
  findRelated(entities: DetectedEntities): KnowledgeRecord[];
}

export interface SearchOptions {
  limit?: number;
  /** Restricts the candidate set — used to bias results toward the intent. */
  types?: KnowledgeType[];
  entities?: DetectedEntities;
}

/** Which record types are most likely to answer each intent. */
export const INTENT_TYPES: Record<ChatIntent, KnowledgeType[]> = {
  PROFILE: ["profile", "skills", "experience"],
  EXPERIENCE: ["experience", "profile"],
  SKILLS: ["skills", "profile", "service"],
  TECHNOLOGY: ["skills", "project", "service"],
  PROJECT: ["project"],
  COMPARE: ["project"],
  SERVICE: ["service", "engagement"],
  PROCESS: ["process", "service"],
  AVAILABILITY: ["availability", "engagement", "contact"],
  ENGAGEMENT: ["engagement", "pricing", "availability"],
  RESUME: ["resume", "experience", "profile"],
  CONTACT: ["contact", "availability"],
  INSIGHTS: ["insight"],
  FAQ: ["faq", "profile"],
  NAVIGATION: ["project", "profile", "service", "resume", "contact"],
  LEAD: ["availability", "engagement", "service", "contact"],
  OFF_TOPIC: [],
  INJECTION: [],
  UNKNOWN: [],
};

const STOP_WORDS = new Set([
  "a","an","and","are","as","at","be","but","by","can","did","do","does","for","from","had","has","have","he","her",
  "him","his","how","i","in","is","it","its","me","my","of","on","or","she","should","so","some","tell","that","the",
  "their","them","then","there","these","they","this","to","us","was","we","were","what","when","where","which","who",
  "why","will","with","would","you","your","about","show","give","get","please","many","much","any","also",
]);

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function tokenize(value: string): string[] {
  return normalize(value)
    .split(" ")
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

/**
 * Levenshtein-based similarity, used only for short single tokens so a typo
 * ("angualr") still reaches the Angular records. Full-text fuzzy matching is
 * deliberately avoided — it produces confident-looking wrong retrievals.
 */
function isFuzzyMatch(a: string, b: string): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 2 || a.length < 4) return false;
  let distance = 0;
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix: number[][] = Array.from({ length: rows }, (_, i) => [i, ...Array(cols - 1).fill(0)]);
  for (let j = 0; j < cols; j += 1) matrix[0][j] = j;
  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
    }
  }
  distance = matrix[a.length][b.length];
  return distance <= (a.length > 6 ? 2 : 1);
}

interface Scored {
  record: KnowledgeRecord;
  score: number;
}

export class JsonRetriever implements KnowledgeRetriever {
  private readonly records: KnowledgeRecord[];

  constructor(records: KnowledgeRecord[] = knowledgeBase()) {
    this.records = records;
  }

  findById(id: string): KnowledgeRecord | undefined {
    return this.records.find((record) => record.id === id);
  }

  findByType(type: KnowledgeType): KnowledgeRecord[] {
    return this.records.filter((record) => record.type === type);
  }

  /** Records pinned by a detected entity — always ranked above lexical hits. */
  findRelated(entities: DetectedEntities): KnowledgeRecord[] {
    const pinned: KnowledgeRecord[] = [];
    for (const slug of entities.projectSlugs) {
      const record = this.findById(`project-${slug}`);
      if (record) pinned.push(record);
    }
    for (const id of entities.serviceIds) {
      const record = this.findById(`service-${id}`);
      if (record) pinned.push(record);
    }
    if (entities.technologies.length) {
      const wanted = entities.technologies.map(normalize);
      for (const record of this.records) {
        if (record.type !== "project" && record.type !== "skills" && record.type !== "service") continue;
        const tags = record.tags.map(normalize);
        if (wanted.some((tech) => tags.includes(tech))) pinned.push(record);
      }
    }
    return dedupeRecords(pinned);
  }

  search(query: string, options: SearchOptions = {}): KnowledgeRecord[] {
    const { limit = 6, types, entities } = options;
    const tokens = tokenize(query);

    const pinned = entities ? this.findRelated(entities) : [];
    const pinnedIds = new Set(pinned.map((record) => record.id));

    const candidates = types?.length
      ? this.records.filter((record) => types.includes(record.type))
      : this.records;

    const scored: Scored[] = [];
    for (const record of candidates) {
      if (pinnedIds.has(record.id)) continue;
      const score = this.score(record, tokens, types);
      if (score > 0) scored.push({ record, score });
    }

    scored.sort((a, b) => b.score - a.score);

    // Entity-pinned records first, then the best lexical matches.
    return [...pinned, ...scored.map((entry) => entry.record)].slice(0, limit);
  }

  private score(record: KnowledgeRecord, tokens: string[], types?: KnowledgeType[]): number {
    if (!tokens.length) return types?.includes(record.type) ? 1 : 0;

    const title = normalize(record.title);
    const content = normalize(record.content);
    const tags = record.tags.map(normalize);
    const tagTokens = new Set(tags.flatMap((tag) => tag.split(" ")));

    let score = 0;
    for (const token of tokens) {
      let tokenScore = 0;

      // Exact tag hit is the strongest lexical signal we have.
      if (tags.includes(token)) tokenScore += 6;
      else if (tagTokens.has(token)) tokenScore += 3;

      if (title.includes(token)) tokenScore += 4;
      if (content.includes(token)) tokenScore += 1;

      if (tokenScore === 0 && [...tagTokens].some((tag) => isFuzzyMatch(token, tag))) tokenScore += 2;

      score += tokenScore;
    }

    // A record that matches nothing in the question is not context, however
    // well its type fits the intent. Returning it anyway would hand the model
    // irrelevant material and invite an ungrounded answer.
    if (score === 0) return 0;

    // Multi-word phrase present verbatim — a strong signal for project titles.
    const phrase = tokens.join(" ");
    if (phrase.length > 6 && (title.includes(phrase) || content.includes(phrase))) score += 5;

    if (types?.includes(record.type)) score += 2;

    return score;
  }
}

function dedupeRecords(records: KnowledgeRecord[]): KnowledgeRecord[] {
  const seen = new Set<string>();
  return records.filter((record) => {
    if (seen.has(record.id)) return false;
    seen.add(record.id);
    return true;
  });
}

let defaultRetriever: KnowledgeRetriever | null = null;

export function getRetriever(): KnowledgeRetriever {
  return (defaultRetriever ??= new JsonRetriever());
}

/**
 * Retrieves the context for a classified question, biased by intent and any
 * detected entities. Returns an empty array when nothing is relevant, which is
 * the signal for the route to answer "I don't have that" rather than guess.
 */
export function retrieveContext(
  question: string,
  intent: ChatIntent,
  entities: DetectedEntities,
  limit = 6,
): KnowledgeRecord[] {
  const retriever = getRetriever();
  const types = INTENT_TYPES[intent];

  const primary = retriever.search(question, { limit, types: types.length ? types : undefined, entities });
  if (primary.length >= 2 || !types.length) return primary;

  // Intent-scoped search was thin — widen to the whole base before giving up.
  const widened = retriever.search(question, { limit, entities });
  return dedupeRecords([...primary, ...widened]).slice(0, limit);
}
