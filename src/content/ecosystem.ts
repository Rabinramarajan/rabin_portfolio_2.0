/**
 * The technology ecosystem — the data behind the skills orbit.
 *
 * Seven categories, each an arm of the orbit; every technology carries the
 * honest depth ("how far would I take this into production") rather than a
 * percentage bar, plus the reason it is on the list at all. The three
 * `featured` technologies per category are drawn inside the cluster; the rest
 * surface in the detail panel.
 */

export type EcoDepth = 1 | 2 | 3 | 4;

export interface EcoCategory {
  id: string;
  label: string;
  subtitle: string;
  /** Cluster hue. Per-category so the orbit reads as seven distinct arms. */
  accent: string;
  /** Position on the orbit, in degrees clockwise from the top. */
  angle: number;
}

export interface EcoTech {
  id: string;
  label: string;
  categoryId: string;
  /** Shown under the name in the detail panel. */
  tier: string;
  /** 1–4, rendered as the depth meter. */
  depth: EcoDepth;
  /** What it is used for here, not what it is. */
  summary: string;
  /** Capability chips. */
  traits: string[];
  /** The "Used in" line. */
  usedIn: string;
  /** Drawn inside the orbit cluster. Three per category. */
  featured?: boolean;
}

export const ECO_CATEGORIES: EcoCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    subtitle: "Modern web experiences",
    accent: "#c9f24d",
    angle: 0,
  },
  {
    id: "backend",
    label: "Backend",
    subtitle: "Powering products",
    accent: "#34d399",
    angle: 51,
  },
  {
    id: "data",
    label: "Data",
    subtitle: "Turning data into insight",
    accent: "#38bdf8",
    angle: 103,
  },
  {
    id: "quality",
    label: "Quality",
    subtitle: "Ship with confidence",
    accent: "#a78bfa",
    angle: 154,
  },
  {
    id: "tooling",
    label: "Tooling",
    subtitle: "Build. Deploy. Automate.",
    accent: "#fb923c",
    angle: 206,
  },
  {
    id: "design",
    label: "Design",
    subtitle: "From ideas to interfaces",
    accent: "#f472b6",
    angle: 257,
  },
  {
    id: "mobile",
    label: "Mobile",
    subtitle: "Apps for everyone",
    accent: "#60a5fa",
    angle: 309,
  },
];

export const ECO_TECHS: EcoTech[] = [
  /* --- frontend --- */
  {
    id: "angular",
    label: "Angular",
    categoryId: "frontend",
    tier: "Primary technology",
    depth: 4,
    summary:
      "A scalable framework for modern web applications, built here with standalone components, signals and zoneless change detection. Four years of daily production work, versions 17 through 22.",
    traits: ["Standalone", "Signals", "Zoneless", "SSR"],
    usedIn: "Every production system I have shipped",
    featured: true,
  },
  {
    id: "typescript",
    label: "TypeScript",
    categoryId: "frontend",
    tier: "Core language",
    depth: 4,
    summary:
      "Strict mode on every project, with types carried through to the API boundary rather than stopping at it. Most runtime bugs I have debugged elsewhere were preventable by a type nobody wrote.",
    traits: ["Strict mode", "Generics", "Typed contracts"],
    usedIn: "Every project on this site",
    featured: true,
  },
  {
    id: "rxjs",
    label: "RxJS",
    categoryId: "frontend",
    tier: "Reactive streams",
    depth: 4,
    summary:
      "Used where work is genuinely asynchronous — search as you type, websocket feeds, request cancellation — and deliberately not used where a signal is simpler.",
    traits: ["switchMap", "Cancellation", "Websockets"],
    usedIn: "Case management and pension platforms",
    featured: true,
  },
  {
    id: "react",
    label: "React",
    categoryId: "frontend",
    tier: "Secondary framework",
    depth: 3,
    summary:
      "Production-real for product and marketing frontends. Strong rather than expert — a distinction worth making rather than blurring.",
    traits: ["Hooks", "Server components", "Composition"],
    usedIn: "Product frontends and this site",
  },
  {
    id: "nextjs",
    label: "Next.js",
    categoryId: "frontend",
    tier: "Full-stack React",
    depth: 3,
    summary:
      "App Router, server components, streaming and typed content models — chosen when rendering strategy matters more than form-heavy application logic.",
    traits: ["App Router", "SSR / ISR", "Typed content"],
    usedIn: "This site and client marketing builds",
  },
  {
    id: "tailwindcss",
    label: "Tailwind CSS",
    categoryId: "frontend",
    tier: "Styling system",
    depth: 4,
    summary:
      "Token-driven design systems with effectively zero runtime CSS cost, paired with hand-written CSS wherever a utility would obscure the intent.",
    traits: ["Design tokens", "Dark mode", "Zero runtime"],
    usedIn: "Most interfaces since 2022",
  },

  /* --- mobile --- */
  {
    id: "ionic",
    label: "Ionic",
    categoryId: "mobile",
    tier: "Primary mobile framework",
    depth: 4,
    summary:
      "Cross-platform iOS and Android from a single Angular codebase, including the parts teams underestimate: signing, provisioning, store review and the update path.",
    traits: ["iOS + Android", "Angular native", "Store shipped"],
    usedIn: "VNPF blo mi, live in both stores",
    featured: true,
  },
  {
    id: "capacitor",
    label: "Capacitor",
    categoryId: "mobile",
    tier: "Native bridge",
    depth: 4,
    summary:
      "Device access where the web platform stops — biometric authentication, secure storage, camera, push notifications and offline behaviour.",
    traits: ["Biometrics", "Secure storage", "Push"],
    usedIn: "Member apps handling personal records",
    featured: true,
  },
  {
    id: "flutter",
    label: "Flutter",
    categoryId: "mobile",
    tier: "Working knowledge",
    depth: 2,
    summary:
      "Enough to build and read a Flutter app, not enough that I would claim it as a specialism next to Ionic.",
    traits: ["Widgets", "Cross-platform"],
    usedIn: "Prototypes and evaluations",
    featured: true,
  },
  {
    id: "pwa",
    label: "PWA",
    categoryId: "mobile",
    tier: "Web delivery",
    depth: 3,
    summary:
      "Installable, offline-capable web apps with service-worker caching — often the right answer before a store build is worth its overhead.",
    traits: ["Offline", "Service workers", "Installable"],
    usedIn: "Internal tools on unreliable connections",
  },

  /* --- backend --- */
  {
    id: "nodejs",
    label: "Node.js",
    categoryId: "backend",
    tier: "Service runtime",
    depth: 3,
    summary:
      "I build and extend Node services and propose API changes that remove complexity from the frontend. Useful end to end; not the person to architect your data layer from scratch.",
    traits: ["REST", "Auth", "Integrations"],
    usedIn: "Internal services and integrations",
    featured: true,
  },
  {
    id: "express",
    label: "Express",
    categoryId: "backend",
    tier: "HTTP layer",
    depth: 3,
    summary:
      "Clean router architecture, authentication pipelines and rate limiting for the services behind the interfaces I build.",
    traits: ["Routing", "Middleware", "JWT"],
    usedIn: "Insurance and resume-builder backends",
    featured: true,
  },
  {
    id: "graphql",
    label: "GraphQL",
    categoryId: "backend",
    tier: "Query layer",
    depth: 2,
    summary:
      "Consumed daily, authored occasionally: typed schemas, single-round-trip data resolution and generated client types.",
    traits: ["Typed schema", "Codegen"],
    usedIn: "Client integrations",
    featured: true,
  },
  {
    id: "python",
    label: "Python",
    categoryId: "backend",
    tier: "Automation",
    depth: 2,
    summary:
      "Scripting, data wrangling and AI orchestration around the products rather than inside them.",
    traits: ["Scripting", "Automation"],
    usedIn: "Build and content tooling",
  },

  /* --- data --- */
  {
    id: "postgresql",
    label: "PostgreSQL",
    categoryId: "data",
    tier: "Primary database",
    depth: 3,
    summary:
      "Relational modelling, transactional integrity and JSONB where the shape is genuinely open. My default when the data has relationships worth protecting.",
    traits: ["Relational", "JSONB", "Transactions"],
    usedIn: "Pension and case management systems",
    featured: true,
  },
  {
    id: "mysql",
    label: "MySQL",
    categoryId: "data",
    tier: "Relational store",
    depth: 3,
    summary:
      "Schema management and query tuning on read-heavy legacy platforms inherited mid-life.",
    traits: ["Schema design", "Query tuning"],
    usedIn: "Legacy government platforms",
    featured: true,
  },
  {
    id: "supabase",
    label: "Supabase",
    categoryId: "data",
    tier: "Backend as a service",
    depth: 3,
    summary:
      "Row-level security, instant Postgres subscriptions and auth — the fastest honest path from an idea to a product with real users.",
    traits: ["RLS", "Realtime", "Auth"],
    usedIn: "Zellavora and product prototypes",
    featured: true,
  },
  {
    id: "firebase",
    label: "Firebase",
    categoryId: "data",
    tier: "Realtime cloud",
    depth: 2,
    summary:
      "Firestore listeners, push triggers and cloud functions for apps that need sync more than they need SQL.",
    traits: ["Firestore", "Cloud functions"],
    usedIn: "Mobile app backends",
  },
  {
    id: "mongodb",
    label: "MongoDB",
    categoryId: "data",
    tier: "Document store",
    depth: 2,
    summary: "Document modelling and aggregation pipelines where the schema is still moving.",
    traits: ["Documents", "Aggregation"],
    usedIn: "Early-stage product work",
  },

  /* --- design --- */
  {
    id: "figma",
    label: "Figma",
    categoryId: "design",
    tier: "Design surface",
    depth: 3,
    summary:
      "I work in the file, not only from it: auto-layout components, variants and tokens — and I design an interface where none exists rather than waiting for one.",
    traits: ["Auto layout", "Variants", "Tokens"],
    usedIn: "Every interface on this site",
    featured: true,
  },
  {
    id: "tailwind-design",
    label: "Tailwind",
    categoryId: "design",
    tier: "Design to code",
    depth: 4,
    summary:
      "The bridge between the design file and the shipped interface — tokens defined once and honoured everywhere.",
    traits: ["Tokens", "Systemised spacing"],
    usedIn: "The design systems I have built",
    featured: true,
  },
  {
    id: "adobexd",
    label: "Adobe XD",
    categoryId: "design",
    tier: "Prototyping",
    depth: 2,
    summary:
      "Wireframes, prototype flows and client design reviews — mostly on projects that started before Figma won.",
    traits: ["Wireframes", "Prototypes"],
    usedIn: "Client engagements",
    featured: true,
  },
  {
    id: "illustrator",
    label: "Illustrator",
    categoryId: "design",
    tier: "Vector work",
    depth: 2,
    summary:
      "Icon and mark production at implementation level. For brand and visual identity, hire a designer.",
    traits: ["SVG", "Iconography"],
    usedIn: "Product marks and icon sets",
  },

  /* --- quality --- */
  {
    id: "playwright",
    label: "Playwright",
    categoryId: "quality",
    tier: "End-to-end testing",
    depth: 3,
    summary:
      "The flows that would cost real money if they broke, run on every build. A green build should mean the important paths still work.",
    traits: ["Cross-browser", "CI gates", "Traces"],
    usedIn: "This site and client platforms",
    featured: true,
  },
  {
    id: "jest",
    label: "Jest",
    categoryId: "quality",
    tier: "Unit testing",
    depth: 3,
    summary: "Unit coverage for logic with a right answer. I do not chase coverage percentages.",
    traits: ["Units", "Mocks", "Snapshots"],
    usedIn: "Angular and Node codebases",
    featured: true,
  },
  {
    id: "wcag",
    label: "WCAG",
    categoryId: "quality",
    tier: "Accessibility standard",
    depth: 4,
    summary:
      "WCAG 2.1 AA as the working standard, built in rather than audited at the end: semantic markup, keyboard operability, visible focus, screen-reader behaviour.",
    traits: ["AA contrast", "Keyboard", "Screen readers"],
    usedIn: "Public-facing government services",
    featured: true,
  },
  {
    id: "eslint",
    label: "ESLint",
    categoryId: "quality",
    tier: "Static analysis",
    depth: 3,
    summary:
      "Strict rules and architectural boundaries enforced by the toolchain instead of by review comments.",
    traits: ["Strict rules", "Boundaries"],
    usedIn: "Every repository I own",
  },

  /* --- tooling --- */
  {
    id: "git",
    label: "Git",
    categoryId: "tooling",
    tier: "Version control",
    depth: 4,
    summary:
      "Trunk-based branching, clean rebases and atomic commits — the history is documentation for whoever inherits the codebase.",
    traits: ["Trunk-based", "Rebase", "Atomic commits"],
    usedIn: "Every project",
    featured: true,
  },
  {
    id: "github",
    label: "GitHub",
    categoryId: "tooling",
    tier: "CI / CD",
    depth: 3,
    summary:
      "Actions pipelines that build, test and deploy, with review and issue tracking that survives a handover.",
    traits: ["Actions", "Reviews", "Releases"],
    usedIn: "Delivery pipelines",
    featured: true,
  },
  {
    id: "docker",
    label: "Docker",
    categoryId: "tooling",
    tier: "Environment parity",
    depth: 2,
    summary:
      "Containerised services and reproducible environments, so “works on my machine” stops being part of the conversation.",
    traits: ["Containers", "Parity"],
    usedIn: "Service deployments",
    featured: true,
  },
  {
    id: "postman",
    label: "Postman",
    categoryId: "tooling",
    tier: "API workflow",
    depth: 3,
    summary:
      "Environment collections, auth automation and mock servers while a backend is still catching up with the interface.",
    traits: ["Collections", "Mock servers"],
    usedIn: "Integration work",
  },
];

/** Technologies in a category, featured ones first. */
export function techsIn(categoryId: string): EcoTech[] {
  return ECO_TECHS.filter((t) => t.categoryId === categoryId).sort(
    (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
  );
}

/** The three technologies drawn inside a cluster. */
export function featuredIn(categoryId: string): EcoTech[] {
  return ECO_TECHS.filter((t) => t.categoryId === categoryId && t.featured);
}

/**
 * Cluster coordinates, in the orbit SVG's viewBox units.
 *
 * The viewBox aspect matches the stage's `aspect-ratio`, so connector lines
 * drawn in SVG units and cluster cards positioned in percentages land on
 * exactly the same points at every width — no second layout system, no drift.
 */
export const ORBIT_VIEWBOX = { w: 118, h: 100 } as const;
export const ORBIT_CENTER = { x: 59, y: 50 } as const;
const ORBIT_RADIUS = { x: 44, y: 37 } as const;

export function orbitPoint(angle: number) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: ORBIT_CENTER.x + Math.sin(rad) * ORBIT_RADIUS.x,
    y: ORBIT_CENTER.y - Math.cos(rad) * ORBIT_RADIUS.y,
  };
}
