import { contactCopy } from "@/content/contact";
import { engagementModels } from "@/content/engagement-models";
import { experience, formatRoleDates } from "@/content/experience";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { skillGroups } from "@/content/skills";
import { chatConfig } from "@/chat/config";
import type { DetectedEntities } from "@/chat/intent";
import type { ChatIntent, KnowledgeRecord } from "@/chat/models";

/**
 * Deterministic answers assembled straight from the content layer.
 *
 * Three jobs:
 *  1. Refusals (off-topic, injection) — never worth a model call.
 *  2. "No verified information" when retrieval comes back empty.
 *  3. A genuine, grounded answer when no AI provider is configured, so the
 *     assistant degrades to a useful navigator instead of breaking.
 */

export const REDIRECT_MESSAGE =
  `I'm ${chatConfig.name}, Rabin's portfolio assistant. I can help with his experience, projects, skills, services, availability and contact details.`;

export const REFUSAL_MESSAGE =
  "I can't provide private or internal information. I can help with Rabin's public professional portfolio instead — his experience, projects, skills, services and availability.";

export const UNVERIFIED_MESSAGE =
  "I don't have verified information about that in Rabin's portfolio.";

export const ERROR_MESSAGE =
  "I'm having trouble responding right now. You can still explore Rabin's work or contact him directly.";

const list = (items: string[]) => items.map((item) => `- ${item}`).join("\n");

/** A grounded answer built from records, with no model in the loop. */
/**
 * "Has Rabin worked at <X>?" where X is not one of the verified employers.
 *
 * Without this the experience branch would answer by listing the real roles —
 * truthful, but it reads as a dodge and leaves the visitor to infer the "no".
 * Returns the named organisation, or null when the question is not of that
 * shape or the organisation genuinely is in the record.
 */
function unverifiedEmployer(question: string): string | null {
  const match = /\b(?:work(?:ed|s|ing)?)\s+(?:at|for|with)\s+([a-z0-9][a-z0-9 .&'-]{1,40})/i.exec(question);
  if (!match) return null;

  const named = match[1].replace(/[?.!,]+$/, "").trim();
  if (!named || named.length < 2) return null;

  const lowered = named.toLowerCase();
  // Generic objects of "work with" — these are not employer claims.
  if (/^(you|him|her|them|us|me|clients?|teams?|companies|startups?|angular|react|ionic)$/.test(lowered)) return null;

  const known = experience.some(
    (role) => role.company.toLowerCase().includes(lowered) || lowered.includes(role.company.toLowerCase()),
  );
  return known ? null : named;
}

export function deterministicAnswer(
  intent: ChatIntent,
  entities: DetectedEntities,
  records: KnowledgeRecord[],
  question = "",
): string {
  if (intent === "EXPERIENCE" || intent === "PROJECT") {
    const unknown = unverifiedEmployer(question);
    if (unknown) {
      return [
        `${UNVERIFIED_MESSAGE} There's no record of ${unknown} in Rabin's published experience.`,
        "",
        "The roles listed on the site are:",
        list(experience.map((role) => `**${role.company}** — ${role.role}, ${formatRoleDates(role)}`)),
      ].join("\n");
    }
  }

  switch (intent) {
    case "INJECTION":
      return REFUSAL_MESSAGE;
    case "OFF_TOPIC":
      return REDIRECT_MESSAGE;
    case "PROFILE":
      return `${profile.name} is a ${profile.headlineRole} based in ${profile.locationShort}, with ${profile.yearsExperienceLabel} years of experience. His focus is ${profile.focus}.`;
    case "EXPERIENCE":
      return [
        `${profile.yearsExperienceLabel} years of frontend engineering experience across ${experience.length} roles:`,
        list(experience.map((role) => `**${role.role}**, ${role.company} — ${formatRoleDates(role)}`)),
      ].join("\n\n");
    case "SKILLS":
      return [
        `Rabin's core stack is ${profile.focus}.`,
        list(skillGroups.slice(0, 4).map((group) => `**${group.label}**: ${group.items.slice(0, 6).join(", ")}`)),
      ].join("\n\n");
    case "TECHNOLOGY":
      return technologyAnswer(entities);
    case "PROJECT":
    case "COMPARE":
      return projectAnswer(entities, records);
    case "SERVICE":
      return [
        "Rabin offers:",
        list(services.slice(0, 5).map((service) => `**${service.title}** — ${service.summary}`)),
      ].join("\n\n");
    case "PROCESS":
      return "Rabin works in defined stages — discover, define, design, build, test, launch and evolve — so each stage makes the next one precise.";
    case "AVAILABILITY":
      return [
        `${profile.availability.label}. ${profile.availability.responseTime}.`,
        "Open engagement types:",
        list([...contactCopy.availability.modes]),
        contactCopy.availability.workingModel,
      ].join("\n\n");
    case "ENGAGEMENT":
      return [
        "Rabin works through three engagement models:",
        list(engagementModels.map((model) => `**${model.title}** — ${model.description}`)),
      ].join("\n\n");
    case "RESUME":
      return `Rabin's resume covers his experience, stack and selected delivery in one place. It's published on the site and can be printed to PDF from that page.`;
    case "CONTACT":
      return `The fastest route is the contact form. Direct email is ${profile.email}, and ${profile.availability.responseTime.toLowerCase()}.`;
    case "LEAD":
      return "That's the kind of work Rabin takes on. I can help you start a project enquiry — share a few details and it goes straight to him.";
    case "INSIGHTS":
      return "Rabin publishes short engineering notes on Angular architecture, performance and interface design.";
    default:
      return records.length
        ? `${records[0].title}: ${firstSentences(records[0].content, 2)}`
        : `${UNVERIFIED_MESSAGE} I can help with his experience, projects, skills, services, availability or contact details.`;
  }
}

function technologyAnswer(entities: DetectedEntities): string {
  const tech = entities.technologies[0];
  if (!tech) {
    return `Rabin's primary stack is ${profile.focus}. His frontend group covers ${skillGroups[0].items.slice(0, 8).join(", ")}.`;
  }
  const using = projects.filter((project) =>
    project.technologies.some((t) => t.toLowerCase() === tech.toLowerCase()),
  );
  const group = skillGroups.find((g) => g.items.some((item) => item.toLowerCase() === tech.toLowerCase()));

  if (!using.length && !group) return `${UNVERIFIED_MESSAGE} ${tech} isn't listed in Rabin's published stack.`;

  const lines = [`Yes — ${tech} is part of Rabin's published stack${group ? ` (${group.label})` : ""}.`];
  if (using.length) {
    lines.push("", "Projects that use it:", list(using.slice(0, 4).map((project) => project.title)));
  }
  return lines.join("\n");
}

function projectAnswer(entities: DetectedEntities, records: KnowledgeRecord[]): string {
  const named = entities.projectSlugs
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is (typeof projects)[number] => Boolean(project));

  if (named.length === 1) {
    const project = named[0];
    return [
      `**${project.title}** — ${project.category}, ${project.year}.`,
      project.overview,
      `Rabin's role: ${project.role}, working with ${project.technologies.join(", ")}.`,
    ].join("\n\n");
  }

  if (named.length > 1) {
    return [
      "| Project | Type | Year | Technologies |",
      "| --- | --- | --- | --- |",
      ...named.map(
        (project) =>
          `| ${project.title} | ${project.category} | ${project.year} | ${project.technologies.join(", ")} |`,
      ),
    ].join("\n");
  }

  const fromRecords = records.filter((record) => record.type === "project").slice(0, 4);
  const shown = fromRecords.length ? fromRecords.map((r) => r.title) : projects.slice(0, 4).map((p) => p.title);
  return ["Here are some selected projects:", list(shown)].join("\n\n");
}

function firstSentences(text: string, count: number): string {
  const parts = text.split(/(?<=\.)\s+/);
  return parts.slice(0, count).join(" ");
}
