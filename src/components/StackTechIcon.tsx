import { useId } from "react";
import { STACK_ICON_SVG } from "@/components/tech-icons-data";
import type { StackIconName } from "@/components/tech-icons-data";
import { cn } from "@/lib/cn";

/**
 * Brand marks from tech-stack-icons.com (MIT), resolved from a technology
 * label or the old Simple Icons id used across the content files.
 *
 * Only the marks actually used by the site are inlined (see
 * `tech-icons-data.ts`), so the whole icon set never ships to the client.
 * Unmapped technologies degrade to a two-letter mark instead of an empty tile.
 */

const TECH_ICON: Record<string, StackIconName> = {
  angular: "angular",
  "angular material": "angular",
  "angular signals": "angular",
  typescript: "typescript",
  rxjs: "rxjs",
  tailwind: "tailwindcss",
  "tailwind css": "tailwindcss",
  react: "react",
  nextjs: "nextjs",
  "next.js": "nextjs",
  node: "nodejs",
  nodejs: "nodejs",
  "node.js": "nodejs",
  express: "expressjs",
  expressjs: "expressjs",
  "express.js": "expressjs",
  graphql: "graphql",
  python: "python",
  php: "php",
  javascript: "js",
  js: "js",
  postgres: "postgresql",
  postgresql: "postgresql",
  mysql: "mysql",
  supabase: "supabase",
  firebase: "firebase",
  mongodb: "mongodb",
  aws: "aws",
  git: "git",
  github: "github",
  playwright: "playwright",
  eslint: "eslint",
  vscode: "vscode",
  "vs code": "vscode",
  figma: "figma",
  postman: "postman",
  prettier: "prettier",
  adobexd: "xd",
  xd: "xd",
  "adobe xd": "xd",
  photoshop: "photoshop",
  illustrator: "illustrator",
  canva: "canva",
  sketch: "sketch",
  docker: "docker",
  ionic: "ionic",
  flutter: "flutter",
  html5: "html5",
  css3: "css3",
  sass: "sass",
  android: "android",
  pwa: "pwa",
  "react native": "reactnative",
  "react router": "reactrouter",
  redux: "redux",
  vercel: "vercel",
  jest: "jest",
  nx: "nx",
  // Angular family — every qualified Angular label resolves to the Angular mark.
  "angular cdk": "angular",
  "angular universal": "angular",
  "zoneless angular": "angular",
  "standalone components": "angular",
  "standalone apis": "angular",
  signals: "angular",
  ngrx: "angular",
  capacitor: "ionic",
  "capacitor integration": "ionic",
  // Web platform
  scss: "sass",
  html: "html5",
  css: "css3",
  "react 19": "react",
  ssr: "nextjs",
  "app router": "nextjs",
  // Backend — Sails and Nest are both Node frameworks, so the Node mark is
  // accurate. Deliberately NOT mapped: REST, Prisma, Storybook, Lighthouse,
  // AI/ML, WCAG. No correct brand mark ships in the set, and borrowing an
  // unrelated logo (GraphQL for REST, Figma for Storybook) misinforms the
  // reader — those fall through to the neutral mark instead.
  "sails.js": "nodejs",
  sails: "nodejs",
  nestjs: "nodejs",
  "ci/cd": "github",
};

/**
 * Label cleanups applied before lookup, so one mapping entry covers the many
 * phrasings the content layer uses ("Capacitor integration", "REST APIs",
 * "AI/ML integration"). Order matters: the longest suffix is stripped first.
 */
const LABEL_NOISE = /\s+(integration|implementation|architecture|development|apis?|support)$/;

export function StackTechIcon({
  id,
  label,
  className,
}: {
  id?: string;
  label: string;
  className?: string;
}) {
  const name = resolveIcon(label, id);
  if (name) {
    return <InlineStackIcon name={name} className={cn("stack-tech-icon", className)} />;
  }
  // No brand mark for this technology. Render a neutral dot rather than the
  // label's first two letters: every call site prints the full label right
  // next to this tile, so initials rendered as "Ca Capacitor", "RE REST APIs",
  // "Ng NgRx" and "AI AI/ML" on the live site.
  return (
    <span className={cn("stack-tech-icon", className)} data-stack-icon="fallback" aria-hidden>
      <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

/** Resolves a technology label to an icon, trying slash-separated tokens too. */
function resolveIcon(label: string, id?: string): StackIconName | undefined {
  const parts = label.split("/").map((p) => p.trim().toLowerCase()).filter(Boolean);
  for (const part of parts) {
    if (TECH_ICON[part]) return TECH_ICON[part];
    const trimmed = part.replace(LABEL_NOISE, "").trim();
    if (trimmed && TECH_ICON[trimmed]) return TECH_ICON[trimmed];
  }
  return TECH_ICON[(id ?? "").toLowerCase()];
}

/** Renders one inlined mark with per-instance fragment ids so defs never collide. */
function InlineStackIcon({ name, className }: { name: StackIconName; className?: string }) {
  const uid = useId();
  const raw = STACK_ICON_SVG[name];
  const svg = raw
    .replace(/(?<!-)id="([^"]+)"/g, (_m, c: string) => `id="${uid}-${c}"`)
    .replace(/url\(#([^)]+)\)/g, (_m, c: string) => `url(#${uid}-${c})`)
    .replace(/href="#([^"]+)"/g, (_m, c: string) => `href="#${uid}-${c}"`);

  return (
    <span className={className} data-stack-icon={name} aria-hidden dangerouslySetInnerHTML={{ __html: svg }} />
  );
}