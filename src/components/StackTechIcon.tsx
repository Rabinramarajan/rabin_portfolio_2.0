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
};

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
  return (
    <span className={cn("stack-tech-icon", className)} data-stack-icon="fallback" aria-hidden>
      {label.slice(0, 2)}
    </span>
  );
}

/** Resolves a technology label to an icon, trying slash-separated tokens too. */
function resolveIcon(label: string, id?: string): StackIconName | undefined {
  const parts = label.split("/").map((p) => p.trim().toLowerCase()).filter(Boolean);
  for (const part of parts) {
    if (TECH_ICON[part]) return TECH_ICON[part];
  }
  return TECH_ICON[id ?? ""];
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