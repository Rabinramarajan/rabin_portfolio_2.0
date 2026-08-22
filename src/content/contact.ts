import { profile } from "@/content/profile";
import { budgetRanges, timelines } from "@/content/pricing";
import { INQUIRY_TYPES, PREFERRED_CONTACT_METHODS, type InquiryType } from "@/types/contact";

export const contactCopy = {
  hero: {
    index: "08",
    label: "Contact",
    title: ["Let's build something", "worth shipping."],
    lede:
      "Reach out for frontend engineering, Angular development, product work, consulting, collaboration, or selected career conversations. I read every note personally.",
    availability: profile.availability.label,
  },
  intro: {
    title: "A short note is enough to start.",
    body: `I'm ${profile.name}, a ${profile.headlineRole} based in ${profile.locationShort}. Share the problem, the product, or the opportunity — I'll reply with a clear next step.`,
  },
  workflow: {
    title: "How the work is structured.",
    lede: "Four stages. No theatre. Each one exists so the next one can be precise.",
    steps: [
      {
        id: "discover",
        number: "01",
        label: "Discover",
        body: "Understand the idea, business problem, goals, and constraints.",
      },
      {
        id: "discuss",
        number: "02",
        label: "Discuss",
        body: "Align on requirements, expectations, communication, and priorities.",
      },
      {
        id: "define",
        number: "03",
        label: "Define",
        body: "Shape the solution, architecture, scope, and delivery approach.",
      },
      {
        id: "build",
        number: "04",
        label: "Build",
        body: "Execute, refine, test, and move toward a production-ready result.",
      },
    ],
  },
  availability: {
    title: "Currently open to meaningful opportunities.",
    modes: ["Full-time", "Contract", "Consulting", "Collaboration"] as const,
    responseTime: profile.availability.responseTime,
    location: profile.location,
    timezone: "IST (UTC+5:30)",
    workingModel: "Remote-first, with overlap for India, Europe, and US time zones.",
  },
  channels: {
    email: {
      label: "Email",
      description: "Best for briefs, roles, and anything that needs a written trail.",
      href: `mailto:${profile.email}`,
      value: profile.email,
    },
    linkedin: {
      label: "LinkedIn",
      description: "Professional context, recommendations, and quieter introductions.",
      href: profile.socials.find((s) => s.id === "linkedin")?.href ?? "https://www.linkedin.com/in/rabinr",
    },
    github: {
      label: "GitHub",
      description: "Code, architecture decisions, and how I actually ship.",
      href: profile.socials.find((s) => s.id === "github")?.href ?? "https://github.com/Rabinramarajan",
    },
    resume: {
      label: "Resume",
      description: "Experience, stack, and selected delivery in one place.",
      href: profile.resumePath,
    },
  },
  cta: {
    title: ["Have an idea?", "Let's turn it into something real."],
    primary: { label: "Start a conversation", href: "#contact-form" },
    secondary: { label: "View my work", href: "/work" },
  },
  form: {
    inquiryTypes: INQUIRY_TYPES,
    budgets: budgetRanges,
    timelines,
    preferredContact: PREFERRED_CONTACT_METHODS,
    messageMin: 30,
    messageMax: 3000,
  },
} as const;

const INTENT_TO_INQUIRY: Record<string, InquiryType> = {
  angular: "Project",
  frontend: "Project",
  react: "Project",
  ionic: "Project",
  ui: "Project",
  performance: "Consultation",
  systems: "Consultation",
};

export function inquiryFromIntent(intent?: string): InquiryType | undefined {
  if (!intent) return undefined;
  return INTENT_TO_INQUIRY[intent] ?? "Project";
}
