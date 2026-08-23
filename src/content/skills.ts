import type { SkillGroup } from "@/content/types";
import { credentials } from "@/content/profile";

/** One numbered node on the snaking core-skill timeline. */
export interface SkillTimelineNode {
  id: string;
  index: string;
  title: [string, string];
  description: string;
  items: string[];
}

/** A stat tile in the left-hand credibility card. */
export interface SkillStat {
  id: string;
  icon: "star" | "rocket" | "people" | "target";
  value: string;
  label: [string, string];
}

export const skillHero = {
  index: "05",
  kicker: "Skills & Expertise",
  headline: ["Skills That", "Drive", "Solutions.", "Experience That", "Delivers", "Impact."] as const,
  lede: "A blend of technical expertise, modern tools, and problem-solving mindset to build scalable, high-performance digital products.",
  timelineLabel: "Core Skill Timeline",
};

// Values come from `credentials` in profile.ts — the one canonical source, so
// these tiles can never drift from the About section's metrics again.
export const skillStats: SkillStat[] = [
  { id: "years", icon: "star", value: credentials.years, label: ["Years of", "Experience"] },
  { id: "projects", icon: "rocket", value: credentials.projects, label: ["Projects", "Delivered"] },
  { id: "clients", icon: "people", value: credentials.clients, label: ["Happy", "Clients"] },
  { id: "quality", icon: "target", value: credentials.commitment.value, label: [credentials.commitment.label, "& Performance"] },
];

/**
 * Six timeline nodes. The first three read left to right; the last three run
 * back right to left, so the rendered order is 01 02 03 / 06 05 04.
 */
export const skillTimeline: SkillTimelineNode[] = [
  {
    id: "frontend",
    index: "01",
    title: ["Frontend", "Development"],
    description: "Building responsive, fast & modern web applications with Angular and latest web technologies.",
    items: ["Angular (17+)", "TypeScript", "HTML5, SCSS, Tailwind CSS"],
  },
  {
    id: "mobile",
    index: "02",
    title: ["Mobile", "Development"],
    description: "Cross-platform mobile apps that deliver native-like performance and great user experience.",
    items: ["Ionic", "Capacitor", "PWA, Responsive Design"],
  },
  {
    id: "state",
    index: "03",
    title: ["State Management", "& Data"],
    description: "Efficient state management, reactive programming and seamless data handling.",
    items: ["Angular Signals", "RxJS", "NgRx (State Management)"],
  },
  {
    id: "backend",
    index: "04",
    title: ["Backend &", "APIs"],
    description: "Building robust APIs and integrating secure, scalable backend services.",
    items: ["Node.js, Express.js", "RESTful APIs", "PostgreSQL, MySQL"],
  },
  {
    id: "devops",
    index: "05",
    title: ["Tools &", "DevOps"],
    description: "Modern tools and DevOps practices to streamline development and ensure smooth delivery.",
    items: ["Git, GitHub", "Docker", "CI/CD, Vercel"],
  },
  {
    id: "design",
    index: "06",
    title: ["Design &", "Experience"],
    description: "Design-driven development focused on intuitive UI and exceptional user experience.",
    items: ["Figma", "UI/UX Principles", "Clean, Modern Interfaces"],
  },
];

/** Brand marks in the bottom panel's first column. */
export const everydayTech = [
  "Angular",
  "TypeScript",
  "RxJS",
  "Ionic",
  "Tailwind CSS",
  "NgRx",
  "Node.js",
  "Express.js",
  "PostgreSQL",
  "MySQL",
  "Git",
  "Docker",
] as const;

export const coreCompetencies = [
  { id: "architecture", icon: "architecture", label: "Component Architecture" },
  { id: "clean-code", icon: "code", label: "Clean Code & SOLID" },
  { id: "performance", icon: "gauge", label: "Performance Optimization" },
  { id: "testing", icon: "bug", label: "Testing & Debugging" },
  { id: "api", icon: "link", label: "REST API Integration" },
  { id: "seo", icon: "accessibility", label: "SEO & Accessibility" },
] as const;

export const softSkills = [
  { id: "problem", icon: "bulb", label: "Problem Solving" },
  { id: "critical", icon: "brain", label: "Critical Thinking" },
  { id: "communication", icon: "chat", label: "Communication" },
  { id: "collaboration", icon: "people", label: "Team Collaboration" },
] as const;

/** The four quadrants orbiting the monogram in the approach dial. */
export const approachSteps = [
  { id: "understand", icon: "search", title: "Understand", body: ["Research &", "Analyze"] },
  { id: "plan", icon: "plan", title: "Plan", body: ["Strategy &", "Architecture"] },
  { id: "build", icon: "code", title: "Build", body: ["Develop &", "Implement"] },
  { id: "improve", icon: "trend", title: "Improve", body: ["Test, Optimize &", "Iterate"] },
] as const;

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    tier: "primary",
    note: "Where the depth is.",
    items: ["Angular", "TypeScript", "JavaScript", "HTML5", "CSS3", "Sass", "Tailwind CSS", "RxJS", "Signals", "React", "Next.js"],
  },
  {
    id: "mobile",
    label: "Mobile",
    note: "One codebase, both stores.",
    items: ["Ionic", "Flutter", "Capacitor", "Android", "iOS", "PWA"],
  },
  {
    id: "backend",
    label: "Backend",
    note: "Enough to own an integration end to end.",
    items: ["Node.js", "Express.js", "Python", "PHP", "REST API", "GraphQL"],
  },
  {
    id: "data",
    label: "Data",
    note: "Data and cloud services.",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Firebase", "Supabase", "AWS"],
  },
  {
    id: "design",
    label: "Design",
    note: "I work in the design file, not just from it.",
    items: ["Figma", "Adobe XD", "Photoshop", "Illustrator", "Canva", "Sketch"],
  },
  {
    id: "quality",
    label: "Quality",
    note: "Proof the product still works next month.",
    items: ["Playwright", "ESLint", "Prettier", "WCAG"],
  },
  {
    id: "tooling",
    label: "Tooling",
    note: "Daily drivers.",
    items: ["Git", "GitHub", "VS Code", "Postman"],
  },
];

/* ------------------------------------------------------------------
   SKILL DECK — the cinematic orbit + detail panel
   Each domain is one node on the orbit and one panel of detail. `label` is
   the short form the orbit node prints; the panel gets the long form.
------------------------------------------------------------------ */

export interface SkillDomain {
  id: string;
  index: string;
  /** Short label rendered under the orbit node — keep it to one word. */
  label: string;
  title: string;
  tagline: string;
  description: string;
  /** Three capability lines shown in the detail panel. */
  focus: [string, string, string];
  /** Brand chips — every label must resolve through `StackTechIcon`. */
  tech: string[];
}

export const skillDomains: SkillDomain[] = [
  {
    id: "frontend",
    index: "01",
    label: "Frontend",
    title: "Frontend Engineering",
    tagline: "The layer people actually touch",
    description:
      "Angular applications built to stay fast as they grow — typed end to end, componentised, and measured against real devices rather than a dev laptop.",
    focus: ["Standalone, zoneless Angular architecture", "Design-system driven component libraries", "Core Web Vitals held under budget"],
    tech: ["Angular", "TypeScript", "Tailwind CSS", "SCSS", "HTML5"],
  },
  {
    id: "state",
    index: "02",
    label: "State",
    title: "State & Data Flow",
    tagline: "Predictable under pressure",
    description:
      "Reactive state that a team can reason about — signals for local truth, RxJS for streams, and a store only where the complexity genuinely earns it.",
    focus: ["Signals-first component state", "RxJS stream composition and teardown", "NgRx for cross-feature domains"],
    tech: ["Angular Signals", "RxJS", "NgRx", "TypeScript"],
  },
  {
    id: "mobile",
    index: "03",
    label: "Mobile",
    title: "Mobile & Cross-Platform",
    tagline: "One codebase, both stores",
    description:
      "Ionic and Capacitor apps that feel native — native plugins where they matter, web speed everywhere else, shipped to iOS and Android from a single build.",
    focus: ["Ionic + Capacitor native bridges", "Offline-capable PWAs", "Touch-first responsive interaction"],
    tech: ["Ionic", "Capacitor", "PWA", "Android", "iOS"],
  },
  {
    id: "backend",
    index: "04",
    label: "Backend",
    title: "Backend & APIs",
    tagline: "Owning the integration end to end",
    description:
      "Node services and REST contracts designed alongside the UI that consumes them, so the frontend never has to paper over an awkward payload.",
    focus: ["Express and Nest service layers", "REST contract and schema design", "Relational data modelling"],
    tech: ["Node.js", "Express.js", "PostgreSQL", "MySQL", "GraphQL"],
  },
  {
    id: "devops",
    index: "05",
    label: "DevOps",
    title: "Tooling & Delivery",
    tagline: "Boring releases, on purpose",
    description:
      "Pipelines that catch problems before users do — typed builds, automated checks, preview deploys on every branch, and rollbacks that take one click.",
    focus: ["CI/CD with automated quality gates", "Containerised, reproducible builds", "Preview environments per branch"],
    tech: ["Git", "GitHub", "Docker", "Vercel", "Playwright"],
  },
  {
    id: "design",
    index: "06",
    label: "Design",
    title: "Design & Experience",
    tagline: "I work in the file, not just from it",
    description:
      "Interface work that starts in Figma and survives the handoff — accessible by default, consistent in spacing and motion, opinionated about hierarchy.",
    focus: ["Figma to production design systems", "WCAG AA accessibility baseline", "Motion with intent, never decoration"],
    tech: ["Figma", "Tailwind CSS", "CSS3", "WCAG"],
  },
];

/** The strength rail beside the detail panel — competencies plus soft skills. */
export const skillStrengths = [
  { id: "architecture", icon: "architecture", label: "Component Architecture", note: "Scalable & maintainable" },
  { id: "performance", icon: "gauge", label: "Performance Optimization", note: "Fast by default" },
  { id: "quality", icon: "bug", label: "Testing & Debugging", note: "Proof it still works" },
  { id: "accessibility", icon: "accessibility", label: "SEO & Accessibility", note: "Usable by everyone" },
  { id: "problem", icon: "bulb", label: "Problem Solving", note: "Analytical thinking" },
  { id: "communication", icon: "chat", label: "Clear Communication", note: "No surprises, ever" },
] as const;
