/**
 * SECTION REGISTRY — the eyebrow, headline and lede for every section.
 *
 * Two problems this solves.
 *
 * 1. The `// NN` index used to be typed as a literal in each component, so
 *    reordering the homepage silently produced a broken sequence. `ORDER`
 *    below is now the only place the sequence exists; the numbers are derived
 *    from it.
 * 2. The headline and lede were duplicated wherever a section appears on more
 *    than one route (the journey block renders on `/` and on `/experience`),
 *    which let the two copies drift apart.
 *
 * Sections whose intro carries extra fields beyond the common four keep their
 * own module (`processIntro`, `skillHero`, `contact.hero`) and pull their
 * index from `sectionIndex()` so every eyebrow on the site stays in sequence.
 */

/** Accented runs render in the accent colour; see `TextReveal`. */
export interface TitleLine {
  text: string;
  accent?: boolean;
  /**
   * Start this run on a new visual line. Sections differ here — the work
   * headline breaks between every run, the services headline breaks once —
   * so the break belongs to the copy, not to the component.
   */
  newline?: boolean;
}

export interface SectionIntro {
  /** Derived from ORDER — never write this by hand. */
  index: string;
  /** The eyebrow label beside the index. */
  label: string;
  title: TitleLine[];
  lede: string;
}

/**
 * Homepage section sequence. This array defines the `// NN` eyebrow numbers;
 * move an entry and every index follows.
 */
export const ORDER = [
  "about",
  "services",
  "work",
  "journey",
  "skills",
  "process",
  "faq",
  "engagement",
  "contact",
  "insights",
] as const;

export type SectionId = (typeof ORDER)[number];

/** Zero-padded position of a section in ORDER, e.g. "04". */
export function sectionIndex(id: SectionId): string {
  const position = ORDER.indexOf(id);
  if (position === -1) {
    throw new Error(`[content] Unknown section id "${id}" — add it to ORDER in content/sections.ts.`);
  }
  return String(position + 1).padStart(2, "0");
}

type IntroCopy = Omit<SectionIntro, "index">;

const COPY: Record<SectionId, IntroCopy> = {
  about: {
    label: "About Me",
    // Title lines come from `about.headingLines`, which encodes its own accents.
    title: [],
    lede: "",
  },
  work: {
    label: "Selected Work",
    title: [{ text: "Work that" }, { text: "makes an", newline: true }, { text: "impact.", accent: true }],
    lede:
      "A selection of digital products I've engineered for startups and businesses across industries.",
  },
  services: {
    label: "Our Services",
    title: [
      { text: "Services That" },
      { text: "Solve. Scale.", accent: true, newline: true },
      { text: "Succeed." },
    ],
    lede:
      "I help businesses and startups transform ideas into high-performance digital products with modern technologies, clean architecture, and exceptional user experiences.",
  },
  journey: {
    label: "Experience",
    title: [{ text: "My Journey." }, { text: "Real Impact.", accent: true }],
    lede:
      "A timeline of growth, challenges and shipped work — the chapters that shaped how I build today.",
  },
  skills: {
    label: "Skills & Expertise",
    title: [],
    lede: "",
  },
  process: {
    label: "My Process",
    title: [],
    lede: "",
  },
  engagement: {
    label: "Engagement",
    title: [{ text: "How the work" }, { text: "is structured." }],
    lede: "INR first. Indicative starting points — scope decides the rest.",
  },
  contact: {
    label: "Contact",
    title: [],
    lede: "",
  },
  insights: {
    label: "Insights",
    title: [{ text: "Notes from the work." }],
    lede: "Short engineering positions — not a blog farm.",
  },
  faq: {
    label: "FAQ",
    title: [{ text: "Questions you" }, { text: "might *have.*", newline: true }],
    lede: "Straight answers about the work, the stack and how an engagement starts.",
  },
};

export const sections: Record<SectionId, SectionIntro> = Object.fromEntries(
  ORDER.map((id) => [id, { ...COPY[id], index: sectionIndex(id) }]),
) as Record<SectionId, SectionIntro>;

/** Plain strings for `TextReveal`, which takes `string[]` and an accent index. */
export function titleLines(intro: SectionIntro): string[] {
  return intro.title.map((line) => line.text);
}

/** Index of the first accented line, or -1 — matches `TextReveal`'s prop. */
export function accentIndex(intro: SectionIntro): number {
  return intro.title.findIndex((line) => line.accent);
}

/**
 * The journey block also opens `/experience` as that route's hero, where it
 * carries the shared headline and lede plus the ascent artwork.
 */
export const journeyArt = {
  src: "/media/experience/banner_img.png",
  alt: "A climber at the summit looking up a glowing path that switchbacks toward a flag on the next peak",
  width: 1536,
  height: 1024,
} as const;

/** Closing beat on `/experience`, above the CTA. */
export const nextChapter = {
  kicker: "Still being built",
  lede:
    "The work continues — Angular architecture, modern React and Next.js, and product surfaces where AI actually earns its place. Still learning, still shipping, still solving problems worth solving.",
} as const;
