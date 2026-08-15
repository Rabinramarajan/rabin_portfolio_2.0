export type AvailabilityStatus = "available" | "limited" | "unavailable";

export interface SocialLink { id: "github" | "linkedin" | "email" | "website"; label: string; href: string; }
export interface NavItem { href: string; label: string; sectionId?: string; }
export interface Metric { value: string; label: string; }
export interface Cta { label: string; href: string; }
export interface MediaRef { src: string; alt: string; width?: number; height?: number; }

export interface Profile {
  name: string;
  shortName: string;
  monogram: string;
  role: string;
  headlineRole: string;
  location: string;
  locationShort: string;
  email: string;
  yearsExperienceLabel: string;
  availability: { status: AvailabilityStatus; label: string; responseTime: string };
  focus: string;
  socials: SocialLink[];
  resumePath: string;
}

export interface HeroContent {
  name: string;
  role: string;
  availability: string;
  headline: string;
  headlineLines: string[];
  description: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  metadata: { label: string; value: string }[];
  portrait: Required<MediaRef>;
  midground: Required<MediaRef>;
}

export interface AboutContent {
  label: string;
  heading: string;
  headingLines?: string[];
  positioning: string;
  paragraphs: string[];
  philosophy: string;
  industries: string[];
  workingStyle: string;
  principles: { id: string; title: string; body: string }[];
  milestones: { year: string; title: string; body: string }[];
  metrics: Metric[];
  portrait: Required<MediaRef>;
  /** About page hero — editorial frame. */
  hero: {
    headline: string[];
    statement: string;
  };
  /** "WHAT I BUILD" editorial rows. */
  capabilities: { number: string; title: string; description: string }[];
  /** Full-width typographic statement (line by line). */
  quote: string[];
  /** Closing CTA band. */
  cta: { headline: string[]; label: string; href: string };
}

export type ProjectFilter = "web" | "mobile" | "enterprise";

export interface Service {
  id: string;
  number: string;
  title: string;
  proposition: string;
  deliverables: string[];
  technologies: string[];
  idealFor: string;
  image: MediaRef;
}

export interface Project {
  slug: string;
  number: string;
  title: string;
  tagline: string;
  category: string;
  year: string;
  role: string;
  technologies: string[];
  featured: boolean;
  layout: "large" | "medium" | "full";
  filter: ProjectFilter;
  cover: Required<MediaRef>;
  gallery: Required<MediaRef>[];
  problem: string;
  solution: string;
  overview: string;
  challenge?: string;
  architecture?: string;
  features: string[];
  results: string[];
  seo: { title: string; description: string };
}

/** Abstract visual identity rendered beside each career stage. */
export type RoleVisualId = "foundation" | "interface" | "projects" | "enterprise" | "ecosystem";

/** One movement of the career narrative. Labels the stage, never invents it. */
export type CareerChapter = "BEGIN" | "BUILD" | "DEEPEN" | "CONSULT" | "EXTEND";

export interface ExperienceRole {
  id: string;
  company: string;
  role: string;
  type: string;
  start: string;
  end: string | null;
  location: string;
  description: string;
  responsibilities: string[];
  impact: string[];
  technologies: string[];
  /** Narrative editorial marker shown above the role on the career timeline. */
  milestone?: string;
  /** Which movement of the story this role belongs to. */
  chapter?: CareerChapter;
  /** Which abstract scene renders alongside the role. */
  visual?: RoleVisualId;
}

/**
 * One technology stream in the stack evolution. `enteredAt` is the first year
 * the technology is verifiably present in the career record; `source` names
 * where that evidence comes from so nothing is implied without support.
 */
export interface StackTrack {
  id: string;
  label: string;
  /** Year the technology verifiably enters the record. */
  enteredAt: string;
  /** Where the evidence comes from — a role id, or "foundation" / "toolkit". */
  source: string;
  /** Still in active use. */
  active: boolean;
}

/** An editorial statement about how the work itself changed. */
export interface CapabilityStep {
  number: string;
  key: string;
  title: string;
  description: string;
  /** Small technical metadata line — grounded in a real role. */
  evidence: string;
  /** Which direction this block reveals from, so no two repeat. */
  from: "left" | "right" | "bottom";
}

/** A real, dated turning point in the career. */
export interface CareerMilestone {
  id: string;
  year: string;
  event: string;
  /** Why it mattered — the consequence, not a claim. */
  why: string;
}

/** One branch of the engineering map. */
export interface EngineeringMapBranch {
  id: string;
  label: string;
  items: string[];
}

export interface SkillGroup {
  id: string;
  label: string;
  tier?: "core" | "group" | "primary" | "secondary" | "supporting";
  items: string[];
  note?: string;
}

export type ProcessVisualId =
  | "discover"
  | "define"
  | "design"
  | "build"
  | "test"
  | "launch"
  | "evolve";

export interface ProcessStep {
  id: ProcessVisualId;
  number: string;
  label: string;
  title: string;
  /** One line. What this stage is for. */
  purpose: string;
  /** Two to three sentences at most. */
  description: string;
  /** What actually happens during the stage. */
  happens: string[];
  /** Editorial rows — what the client receives. */
  deliverables: string[];
  /** Technology or output signature for the stage. */
  output: string;
  /** The client-facing result of the stage. */
  outcome: string;
  /** Which generated visual system renders for this stage. */
  visual: ProcessVisualId;
}

export interface PricingPlan {
  id: string;
  name: string;
  model: "project" | "retainer" | "contract";
  currency: "INR";
  startingFrom: string | null;
  startingLabel: string;
  scope: string;
  timeline: string;
  deliverables: string[];
  idealClient: string;
  featured?: boolean;
}

export interface Insight {
  id: string;
  number?: string;
  title?: string;
  dek?: string;
  kicker?: string;
  value?: string;
  note?: string;
}

export interface SeoContent {
  title: string;
  description: string;
  keywords: string[];
}
