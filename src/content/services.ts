import type { Service } from "@/content/types";
import { media } from "@/lib/media";

export const services: Service[] = [
  {
    id: "frontend",
    number: "01",
    title: "Frontend Engineering",
    proposition:
      "Production interfaces from design handoff to ship — typed, testable, and built to survive the third release, not just the first demo.",
    summary:
      "Production interfaces built to survive the third release, not just the first demo.",
    deliverables: ["Component architecture", "Production-ready interfaces", "Design-system implementation"],
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
    id: "fullstack",
    number: "02",
    title: "Full-Stack Development",
    proposition:
      "Complete product delivery from API to UI. Angular for enterprise, React for modern web. Scalable, typed, and built for growth.",
    summary:
      "Complete product delivery from API to UI with scalable architecture.",
    deliverables: ["Node.js & API design", "Angular or React implementation", "Database architecture", "Deployment pipeline"],
    technologies: ["Node.js", "PostgreSQL", "Angular", "React", "TypeScript"],
    idealFor: "Startups and enterprises building complete products.",
    image: { src: media("services/angular-development.webp"), alt: "Full-stack application architecture" },
    media: {
      type: "video",
      src: media("services/angular-development.mp4"),
      poster: media("services/angular-development.webp"),
      alt: "Full-stack development workflow demonstration",
    },
  },
  {
    id: "mobile",
    number: "03",
    title: "Mobile Applications",
    proposition:
      "iOS and Android from one Angular + Ionic codebase, including store builds, native APIs, and offline-aware behaviour.",
    summary:
      "iOS and Android from one codebase, with native capabilities and app store releases.",
    deliverables: ["iOS & Android apps", "Capacitor integration", "Release support"],
    technologies: ["Ionic", "Angular", "Capacitor", "Native APIs"],
    idealFor: "Member apps and field tools that must live on a phone.",
    image: { src: media("services/mobile-development.webp"), alt: "Cross-platform mobile application screens" },
  },
  {
    id: "performance",
    number: "04",
    title: "Performance & Architecture",
    proposition:
      "Fast, scalable products measured against Core Web Vitals and real-world performance. From optimization audits to architecture design.",
    summary:
      "Scalable architecture and performance optimization for production systems.",
    deliverables: ["Core Web Vitals optimization", "Scalable architecture", "Performance audits", "Design systems"],
    technologies: ["Lighthouse", "Node.js", "React", "Angular", "PostgreSQL"],
    idealFor: "Products that need to scale reliably and perform under real traffic.",
    image: { src: media("services/performance-optimization.webp"), alt: "Performance optimization and architecture" },
    media: {
      type: "video",
      src: media("services/performance-optimization.mp4"),
      poster: media("services/performance-optimization.webp"),
      alt: "Performance profiling and architecture demonstration",
    },
  },
];
