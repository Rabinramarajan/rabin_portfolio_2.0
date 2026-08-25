import { about } from "@/content/about";
import { contactCopy } from "@/content/contact";
import { engagementModels } from "@/content/engagement-models";
import { experience, formatRoleDates } from "@/content/experience";
import { faqs } from "@/content/faq";
import { insights } from "@/content/insights";
import { pricingDisclaimer, pricingPlans } from "@/content/pricing";
import { processIntro, processSteps } from "@/content/process";
import { credentials, profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { everydayTech, skillGroups } from "@/content/skills";
import type { KnowledgeRecord, ProjectCard } from "@/chat/models";

/**
 * Normalizes the typed content layer into flat, retrievable knowledge records.
 *
 * This is the ONLY place portfolio facts enter the chat pipeline. The system
 * prompt carries no facts of its own, so editing `src/content/*.ts` updates
 * the assistant's answers with no prompt change — the requirement that the
 * chatbot and the website can never drift apart.
 */

const dedupe = (values: (string | undefined)[]) =>
  Array.from(new Set(values.filter((v): v is string => Boolean(v)).map((v) => v.trim())));

function profileRecords(): KnowledgeRecord[] {
  return [
    {
      id: "profile-overview",
      type: "profile",
      title: `${profile.name} — ${profile.headlineRole}`,
      content: [
        `${profile.name} is a ${profile.headlineRole} based in ${profile.location}.`,
        `Focus: ${profile.focus}.`,
        `Experience: ${profile.yearsExperienceLabel} years.`,
        about.positioning,
        about.workingStyle,
        `Industries worked in: ${about.industries.join(", ")}.`,
      ].join(" "),
      tags: dedupe([
        "rabin",
        "profile",
        "about",
        "who",
        "specialise",
        "specialize",
        "bio",
        profile.role,
        ...about.industries,
      ]),
      url: "/#about",
    },
    {
      id: "profile-metrics",
      type: "profile",
      title: "Track record",
      content:
        `Years of experience: ${credentials.years}. Projects delivered: ${credentials.projects}. ` +
        `Clients: ${credentials.clients}. ${credentials.commitment.value} ${credentials.commitment.label}. ` +
        `${projects.length} published case studies are on the site.`,
      tags: ["years", "experience", "projects", "clients", "metrics", "track record", "how many"],
      url: "/#about",
    },
  ];
}

function serviceRecords(): KnowledgeRecord[] {
  return services.map((service) => ({
    id: `service-${service.id}`,
    type: "service" as const,
    title: service.title,
    slug: service.id,
    content: [
      service.proposition,
      `Deliverables: ${service.deliverables.join(", ")}.`,
      `Technologies: ${service.technologies.join(", ")}.`,
      `Ideal for: ${service.idealFor}.`,
    ].join(" "),
    tags: dedupe([
      "service",
      "offer",
      "offering",
      service.title,
      service.id,
      ...service.technologies,
      ...service.deliverables,
    ]),
    url: "/services",
  }));
}

export function projectCard(slug: string): ProjectCard | undefined {
  const project = projects.find((p) => p.slug === slug);
  if (!project) return undefined;
  return {
    slug: project.slug,
    title: project.title,
    category: project.category,
    tagline: project.tagline,
    technologies: project.technologies.slice(0, 4),
    url: `/work/${project.slug}`,
    cover: project.cover ? { src: project.cover.src, alt: project.cover.alt } : undefined,
  };
}

function projectRecords(): KnowledgeRecord[] {
  return projects.map((project) => ({
    id: `project-${project.slug}`,
    type: "project" as const,
    title: project.title,
    slug: project.slug,
    content: [
      `${project.tagline} Category: ${project.category}. Year: ${project.year}.`,
      `Role: ${project.role}.`,
      `Overview: ${project.overview}`,
      `Problem: ${project.problem}`,
      `Solution: ${project.solution}`,
      project.architecture ? `Architecture: ${project.architecture}` : "",
      `Technologies: ${project.technologies.join(", ")}.`,
      `Key features: ${project.features.join(", ")}.`,
      `Results: ${project.results.join(" ")}`,
    ]
      .filter(Boolean)
      .join(" "),
    tags: dedupe([
      "project",
      "case study",
      project.title,
      project.slug,
      project.category,
      project.filter,
      project.year,
      project.role,
      ...project.technologies,
    ]),
    url: `/work/${project.slug}`,
    data: { card: projectCard(project.slug) },
  }));
}

function experienceRecords(): KnowledgeRecord[] {
  return experience.map((role) => ({
    id: `experience-${role.id}`,
    type: "experience" as const,
    title: `${role.role} — ${role.company}`,
    slug: role.id,
    content: [
      `${role.role} at ${role.company} (${role.type}), ${formatRoleDates(role)}, ${role.location}.`,
      role.description,
      role.responsibilities.length ? `Responsibilities: ${role.responsibilities.join(" ")}` : "",
      role.impact.length ? `Impact: ${role.impact.join(" ")}` : "",
      `Technologies: ${role.technologies.join(", ")}.`,
    ]
      .filter(Boolean)
      .join(" "),
    tags: dedupe([
      "experience",
      "work history",
      "employer",
      "company",
      "role",
      "job",
      role.company,
      role.role,
      role.type,
      ...role.technologies,
    ]),
    url: "/experience",
  }));
}

function skillRecords(): KnowledgeRecord[] {
  const groups: KnowledgeRecord[] = skillGroups.map((group) => ({
    id: `skills-${group.id}`,
    type: "skills" as const,
    title: `${group.label} skills`,
    slug: group.id,
    content: `${group.label}${group.note ? ` — ${group.note}` : ""} ${group.items.join(", ")}.`,
    tags: dedupe(["skill", "skills", "stack", "technology", group.label, ...group.items]),
    url: "/skills",
  }));

  return [
    ...groups,
    {
      id: "skills-everyday",
      type: "skills",
      title: "Everyday stack",
      content: `Technologies Rabin uses day to day: ${everydayTech.join(", ")}.`,
      tags: dedupe(["stack", "everyday", "primary", "preferred", ...everydayTech]),
      url: "/skills",
    },
  ];
}

function processRecords(): KnowledgeRecord[] {
  return [
    {
      id: "process-overview",
      type: "process",
      title: "How Rabin works",
      content: `${processIntro.lede} Stages: ${processSteps
        .map((step) => `${step.label} — ${step.purpose}`)
        .join("; ")}.`,
      tags: dedupe(["process", "how", "workflow", "method", "stages", ...processSteps.map((s) => s.label)]),
      url: "/process",
    },
  ];
}

function availabilityRecords(): KnowledgeRecord[] {
  const { availability } = contactCopy;
  return [
    {
      id: "availability-current",
      type: "availability",
      title: "Availability",
      content: [
        `${profile.availability.label}. Status: ${profile.availability.status}.`,
        `${profile.availability.responseTime}.`,
        `Engagement modes currently open: ${availability.modes.join(", ")}.`,
        `Based in ${availability.location}, timezone ${availability.timezone}.`,
        availability.workingModel,
      ].join(" "),
      tags: [
        "available",
        "availability",
        "hire",
        "hiring",
        "free",
        "open",
        "remote",
        "freelance",
        "full-time",
        "contract",
        "consulting",
        "timezone",
      ],
      url: "/#contact",
    },
  ];
}

function engagementRecords(): KnowledgeRecord[] {
  const models: KnowledgeRecord[] = engagementModels.map((model) => ({
    id: `engagement-${model.id}`,
    type: "engagement" as const,
    title: `${model.title} engagement`,
    slug: model.id,
    content: [
      model.description,
      model.scope ? `Scope: ${model.scope}.` : "",
      model.timeline ? `Timeline: ${model.timeline}.` : "",
      model.idealFor ? `Ideal for: ${model.idealFor}.` : "",
    ]
      .filter(Boolean)
      .join(" "),
    tags: dedupe(["engagement", "model", "work together", model.title, model.id]),
    url: "/pricing",
  }));

  return [
    ...models,
    {
      id: "pricing-plans",
      type: "pricing",
      title: "Engagement pricing",
      content: `${pricingPlans
        .map(
          (plan) =>
            `${plan.name} (${plan.model}) from ${plan.startingLabel}, timeline ${plan.timeline}, for ${plan.idealClient}`,
        )
        .join("; ")}. ${pricingDisclaimer}`,
      tags: ["pricing", "price", "cost", "budget", "rate", "how much", "quote"],
      url: "/pricing",
    },
  ];
}

function resumeRecords(): KnowledgeRecord[] {
  return [
    {
      id: "resume",
      type: "resume",
      title: "Resume",
      content:
        `The resume is published at ${profile.resumePath} and covers experience, stack and selected delivery in one place. ` +
        `It can be viewed in the browser or printed to PDF from that page.`,
      tags: ["resume", "cv", "download", "pdf", "curriculum vitae"],
      url: profile.resumePath,
    },
  ];
}

function contactRecords(): KnowledgeRecord[] {
  return [
    {
      id: "contact",
      type: "contact",
      title: "Contact",
      content: [
        `Email: ${profile.email}. Phone: ${profile.phone} (${profile.phoneHours}).`,
        `LinkedIn: ${contactCopy.channels.linkedin.href}. GitHub: ${contactCopy.channels.github.href}.`,
        `The contact form at /#contact is the best route for a brief. ${profile.availability.responseTime}.`,
      ].join(" "),
      tags: ["contact", "email", "phone", "reach", "get in touch", "linkedin", "github", "message", "enquiry"],
      url: "/#contact",
    },
  ];
}

function faqRecords(): KnowledgeRecord[] {
  return faqs.map((faq) => ({
    id: `faq-${faq.id}`,
    type: "faq" as const,
    title: faq.question,
    slug: faq.id,
    content: `${faq.question} ${faq.answer}`,
    tags: dedupe([
      "faq",
      faq.id,
      ...faq.question
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/),
    ]),
    url: "/#faq",
  }));
}

function insightRecords(): KnowledgeRecord[] {
  return insights.map((insight) => ({
    id: `insight-${insight.id}`,
    type: "insight" as const,
    title: insight.title ?? insight.id,
    slug: insight.id,
    content: [insight.title, insight.dek, ...(insight.body ?? [])].filter(Boolean).join(" "),
    tags: dedupe(["insight", "article", "writing", "blog", insight.id, insight.title]),
    url: `/insights/${insight.id}`,
  }));
}

let cached: KnowledgeRecord[] | null = null;

/** The full normalized knowledge base. Built once per server process. */
export function knowledgeBase(): KnowledgeRecord[] {
  if (!cached) {
    cached = [
      ...profileRecords(),
      ...serviceRecords(),
      ...projectRecords(),
      ...experienceRecords(),
      ...skillRecords(),
      ...processRecords(),
      ...availabilityRecords(),
      ...engagementRecords(),
      ...resumeRecords(),
      ...contactRecords(),
      ...faqRecords(),
      ...insightRecords(),
    ];
  }
  return cached;
}
