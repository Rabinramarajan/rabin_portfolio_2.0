"use client";

/**
 * JOURNEY DATA — Cinematic career navigation experience.
 * Separated from presentation for clean architecture.
 */

export type JourneyMilestoneType = "foundation" | "evolution" | "current" | "now" | "next";

export interface JourneyMilestone {
  id: string;
  year: string;
  label: string;
  role: string;
  title: string;
  description: string;
  technologies: string[];
  type: JourneyMilestoneType;
  current?: boolean;
}

export const journeyMilestones: JourneyMilestone[] = [
  {
    id: "foundation",
    year: "2021",
    label: "FOUNDATION",
    role: "Frontend Developer",
    title: "The first production chapter.",
    description:
      "Started building real-world interfaces, learning component architecture, responsive systems, TypeScript and the discipline behind maintainable frontend code.",
    technologies: ["Angular", "TypeScript", "SCSS"],
    type: "foundation",
  },
  {
    id: "evolution",
    year: "2023",
    label: "EVOLUTION",
    role: "Frontend Developer",
    title: "From features to systems.",
    description:
      "Worked across multiple products and domains, solving complex UI problems while becoming deeply focused on reusable architecture, performance and UX.",
    technologies: ["Angular", "Ionic", "REST APIs"],
    type: "evolution",
  },
  {
    id: "current-chapter",
    year: "2026",
    label: "CURRENT CHAPTER",
    role: "Frontend Angular Consultant",
    title: "Engineering with intent.",
    description:
      "Building production healthcare experiences with modern Angular — Signals, Zoneless architecture, SSR, scalable component systems and performance-first thinking.",
    technologies: ["Angular 22", "Signals", "Zoneless", "SSR"],
    type: "current",
    current: true,
  },
  {
    id: "now",
    year: "NOW",
    label: "CURRENTLY BUILDING",
    role: "Active Focus",
    title: "Modern frontend systems.",
    description:
      "The live system status — what's being architected, optimized and shipped right now.",
    technologies: ["Angular", "Architecture", "Performance", "Design Systems"],
    type: "now",
    current: true,
  },
  {
    id: "next",
    year: "NEXT",
    label: "NEXT CHAPTER",
    role: "Future Direction",
    title: "Build. Lead. Shape.",
    description:
      "The next chapter is about designing systems that scale — combining frontend engineering, product thinking, AI and exceptional digital experiences.",
    technologies: ["AI", "Architecture", "Product"],
    type: "next",
  },
];

/** Route configuration for the horizontal career path */
export const routeConfig = {
  startYear: "2021",
  endYear: "2026",
  milestones: journeyMilestones.map((m) => ({
    id: m.id,
    year: m.year,
    label: m.label,
    progress: 0, // Will be calculated based on position
  })),
};

/** Background coordinate labels for the technical grid */
export const backgroundCoordinates = [
  "LAT 13.0827",
  "SYS 04",
  "BUILD 2026",
  "NODE 03",
  "GRID 07",
  "COORD 11",
  "VERT 09",
  "HORIZ 02",
];

/** Particle configuration */
export const particleConfig = {
  count: 24,
  minSize: 1,
  maxSize: 3,
  speedRange: [0.3, 0.8] as [number, number],
  opacityRange: [0.08, 0.22] as [number, number],
};