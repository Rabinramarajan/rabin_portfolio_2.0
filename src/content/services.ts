import type { Service } from "@/content/types";
import { media } from "@/lib/media";

/**
 * Everything I can be hired for, in one place. This is NOT what the site
 * markets: `services` below narrows it to four.
 */
const catalogue: Service[] = [
  {
    id: "frontend",
    number: "01",
    title: "Frontend Architecture",
    proposition:
      "Component architecture, design systems and state flow designed once, so the third release costs what the first one did.",
    summary:
      "Component architecture, design systems and data flow built for maintainability.",
    deliverables: ["Component architecture", "Design systems", "State and data flow", "Maintainability"],
    technologies: ["TypeScript", "Angular", "React", "Next.js"],
    idealFor: "Product teams that need a senior frontend owner.",
    image: { src: media("services/frontend-engineering.webp"), alt: "Frontend engineering component architecture diagram" },
    media: {
      type: "image",
      src: media("services/frontend-engineering.webp"),
      alt: "Frontend engineering component architecture showcase",
    },
  },
  {
    id: "angular",
    number: "02",
    title: "Angular Engineering",
    proposition:
      "Enterprise Angular applications with signals, standalone APIs, and architecture that stays maintainable under real traffic and real teams.",
    summary:
      "Enterprise Angular with signals and standalone APIs, maintainable under real traffic.",
    deliverables: ["Angular 17–22 applications", "Signals and RxJS", "Standalone architecture", "Migration and modernization"],
    technologies: ["Angular 17–22", "Signals", "Standalone APIs", "RxJS"],
    idealFor: "Government, insurance, and enterprise platforms.",
    image: { src: media("services/angular-development.webp"), alt: "Angular enterprise application architecture" },
    media: {
      type: "video",
      src: media("services/angular-development.mp4"),
      poster: media("services/angular-development.webp"),
      alt: "Enterprise Angular portal workflow walkthrough",
    },
  },
  {
    id: "react",
    number: "03",
    title: "React / Next.js",
    proposition:
      "Server-first React applications with typed data, careful rendering, and Core Web Vitals treated as product requirements.",
    summary:
      "Server-first React with typed data and Core Web Vitals treated as requirements.",
    deliverables: ["App Router architecture", "Typed content models", "Performance-minded UI"],
    technologies: ["React 19", "Next.js", "TypeScript", "Tailwind CSS"],
    idealFor: "Marketing sites, product surfaces, and editorial web apps.",
    image: { src: media("services/react-nextjs.webp"), alt: "React Next.js server-first application preview" },
    media: {
      type: "video",
      src: media("services/react-nextjs.mp4"),
      poster: media("services/react-nextjs.webp"),
      alt: "React Next.js digital experience preview",
    },
  },
  {
    id: "ui",
    number: "04",
    title: "UI Engineering",
    proposition:
      "Pixel-accurate, accessible interfaces with a restrained motion language — hierarchy, not decoration.",
    summary:
      "Pixel-accurate, accessible interfaces with restrained motion — hierarchy, not decoration.",
    deliverables: ["Accessible markup", "Interaction states", "Cross-browser consistency"],
    technologies: ["SCSS", "Tailwind CSS", "WCAG 2.1 AA", "Motion"],
    idealFor: "Teams who care how the product feels after launch day.",
    image: { src: media("services/ui-engineering.webp"), alt: "UI engineering accessible interface showcase" },
    media: {
      type: "image",
      src: media("services/ui-engineering.webp"),
      alt: "UI engineering design system component card",
    },
  },
  {
    id: "performance",
    number: "05",
    title: "Performance Optimization",
    proposition:
      "Faster loads and calmer runtime through profiling, splitting, and budgets — measured, not guessed.",
    summary:
      "Faster loads and calmer runtime through profiling, splitting, and budgets.",
    deliverables: ["Core Web Vitals", "Rendering and runtime", "API and network optimization", "Bundle optimization"],
    technologies: ["Lighthouse", "Code splitting", "SSR", "Image strategy"],
    idealFor: "Products that already work, but feel heavy.",
    image: { src: media("services/performance-optimization.webp"), alt: "Performance optimization analytics dashboard" },
    media: {
      type: "video",
      src: media("services/performance-optimization.mp4"),
      poster: media("services/performance-optimization.webp"),
      alt: "Performance profiling and Core Web Vitals demonstration",
    },
  },
  {
    id: "ionic",
    number: "06",
    title: "Ionic / Cross-platform Mobile",
    proposition:
      "iOS and Android from one Angular + Ionic codebase, including store builds, native APIs, and offline-aware behaviour.",
    summary:
      "iOS and Android from one Angular + Ionic codebase, including store builds.",
    deliverables: ["Angular + Ionic", "Capacitor", "iOS and Android releases", "Native integrations"],
    technologies: ["Ionic", "Angular", "Capacitor", "Native APIs"],
    idealFor: "Member apps and field tools that must live on a phone.",
    image: { src: media("services/mobile-development.webp"), alt: "Cross-platform mobile application screens" },
  },
  {
    id: "design-systems",
    number: "07",
    title: "Design Systems",
    proposition:
      "Reusable component systems that scale with your product — from tokens to production, built for consistency and developer velocity.",
    summary:
      "Reusable component systems from tokens to production, built for consistency.",
    deliverables: ["Component architecture", "Design tokens", "Documentation", "Implementation support"],
    technologies: ["TypeScript", "Tailwind CSS", "Storybook", "Angular", "React"],
    idealFor: "Growing teams building multiple products or platforms.",
    image: { src: media("services/design-systems.webp"), alt: "Design system component ecosystem" },
    media: {
      type: "image",
      src: media("services/design-systems.webp"),
      alt: "Design system component layout and documentation",
    },
  },
];

/** Picks a service out of the catalogue, failing loudly on a typo. */
function fromCatalogue(id: string): Service {
  const entry = catalogue.find((service) => service.id === id);
  if (!entry) throw new Error(`[content] Unknown service id "${id}".`);
  return entry;
}

/**
 * THE four services the site markets, in order, renumbered from this array.
 *
 * The site used to present seven of these as equals, alongside eight more on
 * /services — cloud, DevOps, UI/UX, backend. A visitor could not tell from
 * that whether they had found an Angular specialist, an agency or a designer,
 * and the answer decides whether they enquire. React/Next.js, UI engineering
 * and design systems are real capabilities and stay in the catalogue; they
 * are just no longer sold with the same weight as the Angular work.
 */
export const services: Service[] = ["angular", "frontend", "performance", "ionic"].map(
  (id, index) => ({ ...fromCatalogue(id), number: String(index + 1).padStart(2, "0") }),
);

/** Named on service pages as capability, never marketed as a headline offer. */
export const secondaryServices: Service[] = ["react", "ui", "design-systems"].map(fromCatalogue);

/**
 * The rest of the stack — real, shipped, and deliberately listed as support
 * rather than as something to hire me as a specialist for.
 */
export const supportingCapabilities: { title: string; items: string[] }[] = [
  { title: "Secondary frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { title: "Backend & data", items: ["Node.js", "Express", "REST APIs", "PostgreSQL", "MongoDB"] },
  { title: "Platform", items: ["Docker", "CI/CD", "Vercel", "Azure DevOps", "Git"] },
  { title: "Quality", items: ["Vitest", "Playwright", "WCAG 2.1 AA", "Lighthouse budgets"] },
];
