import type { SkillGroup, SkillShowcase, SkillTrait } from "@/content/types";

export const coreStack = ["Angular", "TypeScript", "Signals", "RxJS"] as const;

export const skillTraits: SkillTrait[] = [
  {
    id: "solver",
    title: "Problem Solver",
    body: "I turn complex problems into simple, efficient solutions.",
  },
  {
    id: "learning",
    title: "Always Learning",
    body: "I stay updated with new technologies and industry trends.",
  },
  {
    id: "team",
    title: "Team Player",
    body: "I collaborate, communicate and deliver results that matter.",
  },
];

export const skillHero = {
  kicker: "My Skills",
  headline: ["The Right Skills.", "Real Impact."] as const,
  lede: "A blend of modern technologies and proven practices — chosen to ship products that stay fast, accessible, and maintainable.",
  visual: {
    src: "/media/skills/1.png",
    alt: "Skill map — frontend, backend, database, DevOps, tools, and design orbiting a neural core",
    width: 570,
    height: 296,
  },
  quote: {
    before: "Skills are important, but the ability to apply them to solve ",
    accent: "real problems",
    after: " is what creates impact.",
  },
  quoteRole: "Frontend Angular Consultant",
};

/** Six visual categories matching the skills page layout. Items stay inside the real stack. */
export const skillShowcase: SkillShowcase[] = [
  {
    id: "frontend",
    label: "Frontend",
    description: "Building fast, scalable, and user-friendly web applications.",
    tools: [
      { id: "angular", label: "Angular" },
      { id: "typescript", label: "TypeScript" },
      { id: "rxjs", label: "RxJS" },
      { id: "tailwind", label: "Tailwind CSS" },
      { id: "react", label: "React" },
      { id: "nextjs", label: "Next.js" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    description: "Designing secure, efficient, and high-performance APIs.",
    tools: [
      { id: "node", label: "Node.js" },
      { id: "express", label: "Express" },
      { id: "graphql", label: "GraphQL" },
      { id: "python", label: "Python" },
      { id: "php", label: "PHP" },
      { id: "javascript", label: "JavaScript" },
    ],
  },
  {
    id: "database",
    label: "Database",
    description: "Structuring and managing data with reliable, scalable systems.",
    tools: [
      { id: "postgres", label: "PostgreSQL" },
      { id: "mysql", label: "MySQL" },
      { id: "supabase", label: "Supabase" },
      { id: "firebase", label: "Firebase" },
      { id: "mongodb", label: "MongoDB" },
      { id: "aws", label: "AWS" },
    ],
  },
  {
    id: "devops",
    label: "DevOps",
    description: "Streamlining development, deployment, and infrastructure workflows.",
    tools: [
      { id: "git", label: "Git" },
      { id: "github", label: "GitHub" },
      { id: "aws", label: "AWS" },
      { id: "nx", label: "Nx" },
      { id: "playwright", label: "Playwright" },
      { id: "eslint", label: "ESLint" },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    description: "Using the right tools to boost productivity and code quality.",
    tools: [
      { id: "vscode", label: "VS Code" },
      { id: "figma", label: "Figma" },
      { id: "postman", label: "Postman" },
      { id: "nx", label: "Nx" },
      { id: "prettier", label: "Prettier" },
      { id: "playwright", label: "Playwright" },
    ],
  },
  {
    id: "design",
    label: "Design",
    description: "Crafting intuitive, visually appealing, and user-centered experiences.",
    tools: [
      { id: "figma", label: "Figma" },
      { id: "adobexd", label: "Adobe XD" },
      { id: "photoshop", label: "Photoshop" },
      { id: "illustrator", label: "Illustrator" },
      { id: "canva", label: "Canva" },
      { id: "sketch", label: "Sketch" },
    ],
  },
];

export const everydayTech = [
  "Angular",
  "TypeScript",
  "RxJS",
  "Tailwind CSS",
  "React",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "Supabase",
  "Firebase",
  "Git",
  "Nx",
  "VS Code",
  "Figma",
  "Postman",
  "Playwright",
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
