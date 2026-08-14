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
}

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
