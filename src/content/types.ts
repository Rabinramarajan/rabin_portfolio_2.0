export type AvailabilityStatus = "available" | "limited" | "unavailable";

export interface SocialLink { id: "github" | "linkedin" | "email" | "website"; label: string; href: string; }
export interface NavItem { href: string; label: string; sectionId?: string; desktopOnly?: boolean; }
/** Which glyph renders beside a metric. Maps to an icon in the consuming component. */
export type MetricIcon = "projects" | "clients" | "experience" | "users" | "countries";
export interface Metric {
  value: string;
  label: string;
  icon?: MetricIcon;
  /** One-line qualifier shown under the label on the About stat cards. */
  note?: string;
}

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
  reel?: {
    src: string;
    poster?: string;
    /** Candidate widths for `poster`. The hero poster is the LCP element, so
     *  the home page also preloads it — both the <img> and that preload read
     *  these fields, which is what keeps them from resolving different files. */
    posterSrcSet?: string;
    posterSizes?: string;
  };
  description: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  /** Recruiter escape hatch out of the client funnel. */
  recruiterCta?: Cta & { linkLabel: string };
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
  /** Short first-person statements shown beside the About lead. */
  highlights: string[];
  /**
   * Long-form biography for the /about route — the page that answers "who
   * wrote this". Rendered as prose sections beneath the intro band.
   */
  story?: { title: string; paragraphs: string[] }[];
}

export type ProjectFilter =
  | "web"
  | "dashboards"
  | "platforms"
  | "marketplaces"
  | "systems";

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
  /**
   * Cover screenshot. Optional: a case study with no captured frame renders a
   * typographic poster (see ProjectCover) rather than a broken image.
   */
  cover?: Required<MediaRef>;
  gallery: Required<MediaRef>[];
  /** Public deployment, when there is one — drives the "Live Preview" action. */
  liveUrl?: string;
  problem: string;
  solution: string;
  overview: string;
  challenge?: string;
  architecture?: string;
  features: string[];
  results: string[];
  /**
   * Where the product runs, e.g. ["Enterprise Web"] or ["iOS", "Android"].
   * Derived from the delivery record, not from the stack.
   */
  platform?: string[];
  /** Named only when the engagement is public. Omitted otherwise. */
  client?: string;
  /**
   * The service this project is evidence for, surfaced in the closing CTA.
   *
   * A case study is the proof; the service page is the thing being sold, and
   * until now the proof pages carried far more internal links than the pages
   * they were proving. Populate ONLY where the project genuinely demonstrates
   * that service — a link asserting work that was not done is worse than a
   * missing link, and `label` is read as the anchor text, so it has to describe
   * the service rather than the project.
   */
  service?: { label: string; href: string };
  /**
   * What was personally contributed. Populate ONLY from the verified role
   * record — an empty array hides the section rather than inventing one.
   */
  responsibilities?: string[];
  /**
   * Verified, evidenced numbers. Never populate from estimation: a project
   * with no measured outcome carries no metrics and the impact section falls
   * back to the qualitative `results` lines.
   */
  metrics?: ProjectMetric[];
  /** Engineering decisions with a stated trade-off. Optional by design. */
  decisions?: EngineeringDecision[];
  /** Layered stack readout for the engineering section. */
  stack?: StackLayer[];
  /**
   * The delivery strip under the case-study hero. Every field is optional and
   * every absent field simply drops its cell — the strip narrows rather than
   * filling itself with an invented duration, headcount or status.
   */
  timeline?: string;
  team?: string;
  status?: string;
  /**
   * The named pressures behind `problem`, shown as the numbered challenge
   * cards. Omit it and the challenge section falls back to the single
   * `challenge` note instead of splitting one sentence into three cards.
   */
  challenges?: ProjectChallenge[];
  /**
   * Key features written out with a description and, where one exists, a
   * frame. Omit it and the feature rail is built from the `features` strings
   * as title-only cards — nothing is described that the record does not say.
   */
  keyFeatures?: ProjectFeature[];
  /**
   * Where this case study points next: the service that sells this kind of
   * work, and the article arguing the position it demonstrates.
   *
   * Case studies used to be a dead end — every inbound link, no outbound
   * ones — so a reader convinced by the Fiji write-up had nowhere to go but
   * the browser's back button. Each link is a claim that the two pages are
   * about the same thing, so populate it by hand, never by category.
   */
  related?: { label: string; href: string; note: string }[];
  seo: { title: string; description: string };
}

/** One named pressure on the project, shown as a numbered challenge card. */
export interface ProjectChallenge {
  title: string;
  description: string;
}

/** One key feature, optionally illustrated by a captured frame. */
export interface ProjectFeature {
  title: string;
  description: string;
  image?: Required<MediaRef>;
}

/** One evidenced outcome. `note` sources the claim so it can be traced. */
export interface ProjectMetric {
  value: string;
  label: string;
  note?: string;
}

export interface EngineeringDecision {
  problem: string;
  decision: string;
  why: string;
  tradeoff?: string;
  result?: string;
}

/** "Frontend — Angular", "API — Sails.js": one row of the engineering table. */
export interface StackLayer {
  layer: string;
  value: string;
}

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

/**
 * One block of an article body.
 *
 * A bare string stays a paragraph, so the plain-prose shape these articles
 * started in is still valid. The tagged variants exist because the SERP these
 * pieces compete in is uniformly code-heavy: arguing about `signal()` versus
 * `BehaviorSubject` in unbroken prose reads as weaker than the same argument
 * with the code beside it, however good the prose is.
 */
export type InsightBlock =
  | string
  | { type: "heading"; text: string }
  | { type: "code"; language: string; caption?: string; code: string }
  | { type: "aside"; text: string }
  /**
   * A diagram or screenshot. `alt` is required rather than optional: these
   * carry the argument of the section they sit in, so an image without one
   * silently drops that argument for anyone not seeing it. `width` and
   * `height` are the file's intrinsic pixels — they reserve the box and keep
   * the article off the CLS list.
   */
  | {
      type: "image";
      src: string;
      alt: string;
      width: number;
      height: number;
      caption?: string;
      /** Set on the first image in an article; it is the LCP candidate. */
      priority?: boolean;
    };

export interface Insight {
  id: string;
  /**
   * Metadata title, when the editorial headline is not what anyone searches
   * for. "Signals before ceremony" is the better thing to read and a worse
   * thing to rank: the <h1> keeps the headline, the <title> gets this.
   * Falls back to `title` when absent.
   */
  seoTitle?: string;
  /** Metadata description, when the dek is written for a reader, not a SERP. */
  seoDescription?: string;
  number?: string;
  title?: string;
  dek?: string;
  kicker?: string;
  value?: string;
  note?: string;
  /**
   * Article body. An insight without a body has no publishable article yet:
   * its detail route still renders (so the listing never dead-links) but stays
   * out of the sitemap and is marked `noindex`, because a page carrying only a
   * title and a one-line dek is thin content. Adding blocks here is all it
   * takes to publish and index the piece.
   */
  body?: InsightBlock[];
  /** ISO date. Emitted as datePublished and shown on the article. */
  datePublished?: string;
  /** ISO date of the last substantive revision. Falls back to datePublished. */
  dateModified?: string;
  /**
   * Where this argument is applied in practice. Rendered at the foot of the
   * article: each piece had exactly one inbound link (the index) and no
   * outbound links, so it sat off to one side of the site rather than in it.
   */
  related?: { label: string; href: string }[];
  /**
   * The closing ask. These pieces argued a position and then requested
   * nothing, which wasted the one reader most likely to hire: the engineering
   * lead who just read 1,300 words and agreed with them.
   */
  cta?: string;
}

export interface SeoContent {
  title: string;
  description: string;
  keywords: string[];
}

/**
 * One card in the "Services That Solve. Scale. Succeed." grid.
 *
 * Deliberately separate from `Service`: `Service` carries the long-form,
 * SEO-bearing copy that the /services journey, the JSON-LD graph and the
 * dedicated /services/* landing pages read (and whose ids those pages pin
 * against). This is the short marketing card — icon, blurb, three stack chips.
 */
export interface ServiceOffering {
  id: string;
  number: string;
  title: string;
  description: string;
  /** Exactly three, to keep every card's chip row one line deep. */
  stack: [string, string, string];
  icon: ServiceOfferingIcon;
  href: string;
}

export type ServiceOfferingIcon =
  | "code"
  | "layers"
  | "phone"
  | "cloud"
  | "pen"
  | "server"
  | "shield"
  | "support";

/**
 * Canonical, site-wide credibility figures.
 *
 * Every section that shows a headline number (About metrics, Skills stat
 * tiles, Hero metadata) reads from this one object. Before this existed the
 * About section claimed "30+ Projects / 20+ Clients" while the Skills section
 * claimed "20+ Projects / 15+ Clients" on the same site.
 */
/** One qualification on the resume. Formal degrees and training both. */
export interface EducationEntry {
  id: string;
  qualification: string;
  institution: string;
  location?: string;
  period?: string;
}

export interface Credentials {
  /** Years of professional experience — derived from experience.ts. */
  years: string;
  /** Delivered projects. `review: true` means the figure is unverified. */
  projects: string;
  /** Clients served. `review: true` means the figure is unverified. */
  clients: string;
  /**
   * People who actually use the shipped software, and the number of countries
   * those deployments run in. Both are countable from the case studies, which
   * is why they replaced the old "100% Focus on Quality" tile: that figure
   * measured nothing and read as filler.
   */
  users: string;
  countries: string;
  /** Figures that still need the owner to confirm a real number. */
  needsReview: readonly ("projects" | "clients")[];
}
