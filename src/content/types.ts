export type AvailabilityStatus = "available" | "limited" | "unavailable";

export interface SocialLink { id: "github" | "linkedin" | "email" | "website"; label: string; href: string; }
export interface NavItem { href: string; label: string; sectionId?: string; }
/** Which glyph renders beside a metric. Maps to an icon in the consuming component. */
export type MetricIcon = "projects" | "clients" | "experience" | "commitment";
export interface Metric { value: string; label: string; icon?: MetricIcon; }

/** A technology shown as a brand tile. `id` selects the mark in StackTechIcon. */
export interface ToolRef { id: string; label: string; }
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
  phone: string;
  phoneHours: string;
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
  /** Short, uppercase display lines for the cinematic hero. Last lines render accented. */
  displayLines?: { text: string; accent?: boolean }[];
  /** Discipline strip rendered under the display headline. */
  disciplines?: string[];
  /** Pull quote rendered beside the headline, with a script signature. */
  quote?: { lines: string[]; signature: string };
  /** Full-bleed background reel behind the hero. */
  reel?: { src: string; poster?: string };
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
  /** Second line of the pull quote — accented tail rendered after `philosophy`. */
  philosophyLines?: string[];
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
  /** "What I Do" sidebar panel — three short capability rows. */
  whatIDo: { title: string; body: string }[];
  /** "Tools & Technologies" sidebar panel — rendered as brand tiles. */
  tools: ToolRef[];
  /** Values row beneath the intro block. */
  values: { title: string; body: string }[];
}

export type ProjectFilter = "web" | "mobile" | "enterprise";

export interface Service {
  id: string;
  number: string;
  title: string;
  proposition: string;
  /** Short card-length blurb (~15 words). `proposition` is the long-form version. */
  summary: string;
  deliverables: string[];
  technologies: string[];
  idealFor: string;
  image: MediaRef;
  media?: {
    type: "image" | "video" | "gif";
    src: string;
    poster?: string;
    alt: string;
  };
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
  /** Employer logo image URL (favicon or mark), shown in the role header. */
  logo?: string;
}

/** One column on the horizontal career horizon. */
export type HorizonTone = "past" | "current" | "live" | "next";

export interface HorizonChapter {
  id: string;
  year: string;
  phase: string;
  /**
   * Verified job title. Omitted where the year is not an employment year —
   * 2021 is the B.Sc IT foundation, and the closing chapter has not happened
   * yet, so neither may carry a role.
   */
  role?: string;
  /** Company or institution the chapter is evidenced by. */
  org?: string;
  headline: string;
  body: string;
  tags: string[];
  tone: HorizonTone;
  /** Where the chapter was worked from — omitted when there is no workplace. */
  location?: string;
  /**
   * What the chapter actually produced. Every line is lifted from the verified
   * role record (`experience[].responsibilities` / `.impact`) — the timeline
   * restates that record, it never adds to it.
   */
  achievements?: string[];
  /** Two-letter mark for the chapter tile. Falls back to the org initials. */
  monogram?: string;
  /** Employer logo image URL. When set it replaces the monogram tile. */
  logo?: string;
  statuses?: string[];
  footer?: string;
  /** Which abstract scene renders alongside the chapter. */
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

/** One trait under the skills hero copy. */
export interface SkillTrait {
  id: "solver" | "learning" | "team";
  title: string;
  body: string;
}

/** Visual category card on the skills page. */
export interface SkillShowcase {
  id: string;
  label: string;
  description: string;
  tools: ToolRef[];
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

/** One chapter in the "pixel to protocol" product-architecture journey (homepage Services section). */
export type ServiceChapterVisual = "frontend" | "backend" | "fullstack" | "foundation" | "ship";

export interface ServiceChapter {
  id: string;
  number: string;
  label: string;
  title: string;
  headline: string;
  description: string;
  capabilities: string[];
  technologies: string[];
  visual: ServiceChapterVisual;
}

export interface SeoContent {
  title: string;
  description: string;
  keywords: string[];
}
