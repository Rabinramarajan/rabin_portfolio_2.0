import type { ServiceChapter } from "@/content/types";

/**
 * The "Pixel to Protocol" product-architecture journey — homepage Services section.
 * Five chapters, problem to production. Kept separate from `services.ts`
 * (the /services detail page) so that page's routing and content stay untouched.
 */
export const serviceChapters: ServiceChapter[] = [
  {
    id: "frontend",
    number: "01",
    label: "EXPERIENCE",
    title: "Frontend Engineering",
    headline: "Where the product becomes tangible.",
    description:
      "Build responsive, accessible and production-ready interfaces with strong component architecture, performance and interaction design.",
    capabilities: ["Component architecture", "Responsive UI", "State management", "SSR", "Accessibility", "Motion", "Performance"],
    technologies: ["Angular", "React", "Next.js", "TypeScript", "Tailwind CSS"],
    visual: "frontend",
  },
  {
    id: "backend",
    number: "02",
    label: "SYSTEM",
    title: "Backend Engineering",
    headline: "The system behind the experience.",
    description:
      "Build APIs, integrations, authentication flows, business logic and data services that connect the interface to the underlying product system.",
    capabilities: ["REST APIs", "API integration", "Authentication", "Business logic", "Server-side services", "Data access", "Third-party integrations"],
    technologies: ["Node.js", "Express.js", "NestJS", "REST", "PostgreSQL", "Prisma"],
    visual: "backend",
  },
  {
    id: "fullstack",
    number: "03",
    label: "COMPLETE PRODUCT",
    title: "Full-Stack Development",
    headline: "From first endpoint to final pixel.",
    description:
      "Build complete digital products across frontend, backend, data and deployment — connecting every layer into one cohesive production system.",
    capabilities: ["Product architecture", "API design", "Data modeling", "Deployment", "End-to-end ownership"],
    technologies: ["Angular", "Next.js", "Node.js", "NestJS", "PostgreSQL", "Supabase"],
    visual: "fullstack",
  },
  {
    id: "architecture",
    number: "04",
    label: "FOUNDATION",
    title: "Architecture & Design Systems",
    headline: "Systems that scale beyond the first release.",
    description:
      "Design reusable component systems, frontend architecture and engineering patterns that keep products consistent, maintainable and easier to evolve.",
    capabilities: ["Design systems", "Component libraries", "Architecture", "Design tokens", "Reusable components", "API contracts", "Clean architecture"],
    technologies: ["Angular", "React", "TypeScript", "Tailwind CSS", "Storybook"],
    visual: "foundation",
  },
  {
    id: "production",
    number: "05",
    label: "SHIP",
    title: "Performance & Production",
    headline: "Built to survive the real world.",
    description:
      "Prepare applications for production through testing, performance optimization, SSR, deployment workflows and continuous improvement.",
    capabilities: ["Performance optimization", "Core Web Vitals", "SSR", "E2E testing", "CI/CD", "Deployment", "Monitoring"],
    technologies: ["Playwright", "SSR", "CI/CD", "Docker", "Lighthouse"],
    visual: "ship",
  },
];
