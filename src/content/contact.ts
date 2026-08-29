import { profile } from "@/content/profile";
import { budgetRanges, timelines } from "@/content/pricing";
import { INQUIRY_TYPES, PREFERRED_CONTACT_METHODS } from "@/types/contact";

export const contactCopy = {
  hero: {
    index: "08",
    label: "Contact",
    title: ["Let's build", "something", "useful."],
    lede:
      "Have a product, platform, or frontend challenge in mind? Tell me what you're building and I'll help you figure out the next step.",
    availability: profile.availability.label,
  },
  media: {
    hero: {
      src: "/media/contact/hero_b.png",
      alt: "Dark workstation with a system map from frontend through API and data to production, marked available",
      width: 1672,
      height: 941,
    },
    conversation: {
      src: "/media/contact/intelligent.png",
      alt: "Editorial diagram of an idea becoming a product through conversation, frontend, API, database, and deployment",
      width: 1448,
      height: 1086,
      index: "CONNECTION / 02",
      caption: "IDEA → CONVERSATION",
    },
    messageFlow: {
      src: "/media/contact/Create_a_second_seamless_lo.mp4",
      width: 1280,
      height: 720,
    },
    availability: {
      src: "/media/contact/Create_a_minimal_second_loo.mp4",
      width: 1280,
      height: 720,
    },
    process: {
      // No clip shipped for this bridge — the referenced file was never added to
      // /public and 404'd on every contact-page view. The band renders its copy
      // over the flat stage until a real loop exists; set `src` to restore it.
      src: undefined as string | undefined,
      width: 1280,
      height: 720,
      kicker: "From idea to product",
      index: "03 / Process →",
    },
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

export const contactInfo = {
  email: profile.email,
  phone: profile.phone,
  phoneHours: profile.phoneHours,
  location: profile.location,
  availability: profile.availability.label,
  responseTime: profile.availability.responseTime,
} as const;
