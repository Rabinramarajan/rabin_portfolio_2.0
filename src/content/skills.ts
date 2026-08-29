import type { SkillGroup } from "@/content/types";

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
