import type { Service } from "@/content/types";

export const services: Service[] = [
  {
    id: "frontend",
    number: "01",
    title: "Frontend Engineering",
    proposition:
      "Production interfaces from design handoff to ship — typed, testable, and built to survive the third release, not just the first demo.",
    deliverables: ["Component architecture", "Production-ready interfaces", "Design-system implementation"],
    technologies: ["TypeScript", "Angular", "React", "Next.js"],
    idealFor: "Product teams that need a senior frontend owner.",
    image: { src: "/media/service/service_1.png", alt: "Frontend engineering component architecture diagram" },
    media: {
      type: "image",
      src: "/media/service/service_1.png",
      alt: "Frontend engineering component architecture showcase",
    },
  },
  {
    id: "angular",
    number: "02",
    title: "Angular Development",
    proposition:
      "Enterprise Angular applications with signals, standalone APIs, and architecture that stays maintainable under real traffic and real teams.",
    deliverables: ["Modern Angular applications", "Legacy migrations", "State and data-flow design"],
    technologies: ["Angular 17–22", "Signals", "Standalone APIs", "RxJS"],
    idealFor: "Government, insurance, and enterprise platforms.",
    image: { src: "/media/service/service_2.png", alt: "Angular enterprise application architecture" },
    media: {
      type: "video",
      src: "/media/service/angular.mp4",
      poster: "/media/service/service_2.png",
      alt: "Enterprise Angular portal workflow walkthrough",
    },
  },
  {
    id: "react",
    number: "03",
    title: "React / Next.js",
    proposition:
      "Server-first React applications with typed data, careful rendering, and Core Web Vitals treated as product requirements.",
    deliverables: ["App Router architecture", "Typed content models", "Performance-minded UI"],
    technologies: ["React 19", "Next.js", "TypeScript", "Tailwind CSS"],
    idealFor: "Marketing sites, product surfaces, and editorial web apps.",
    image: { src: "/media/service/service_3.png", alt: "React Next.js server-first application preview" },
    media: {
      type: "video",
      src: "/media/service/react_application.mp4",
      poster: "/media/service/service_3.png",
      alt: "React Next.js digital experience preview",
    },
  },
  {
    id: "ui",
    number: "04",
    title: "UI Engineering",
    proposition:
      "Pixel-accurate, accessible interfaces with a restrained motion language — hierarchy, not decoration.",
    deliverables: ["Accessible markup", "Interaction states", "Cross-browser consistency"],
    technologies: ["SCSS", "Tailwind CSS", "WCAG 2.1 AA", "Motion"],
    idealFor: "Teams who care how the product feels after launch day.",
    image: { src: "/media/service/service_4.png", alt: "UI engineering accessible interface showcase" },
    media: {
      type: "image",
      src: "/media/service/service_4.png",
      alt: "UI engineering design system component card",
    },
  },
  {
    id: "performance",
    number: "05",
    title: "Performance Optimization",
    proposition:
      "Faster loads and calmer runtime through profiling, splitting, and budgets — measured, not guessed.",
    deliverables: ["Core Web Vitals pass", "Bundle reduction", "Runtime profiling"],
    technologies: ["Lighthouse", "Code splitting", "SSR", "Image strategy"],
    idealFor: "Products that already work, but feel heavy.",
    image: { src: "/media/service/service_5.png", alt: "Performance optimization analytics dashboard" },
    media: {
      type: "video",
      src: "/media/service/performance.mp4",
      poster: "/media/service/service_5.png",
      alt: "Performance profiling and Core Web Vitals demonstration",
    },
  },
  {
    id: "ionic",
    number: "06",
    title: "Mobile / Ionic",
    proposition:
      "iOS and Android from one Angular + Ionic codebase, including store builds, native APIs, and offline-aware behaviour.",
    deliverables: ["iOS & Android apps", "Capacitor integration", "Release support"],
    technologies: ["Ionic", "Angular", "Capacitor", "Native APIs"],
    idealFor: "Member apps and field tools that must live on a phone.",
    image: { src: "/media/service/service_6.png", alt: "Cross-platform mobile application screens" },
    media: {
      type: "gif",
      src: "/media/service/angular.gif",
      poster: "/media/service/service_6.png",
      alt: "Cross-platform Ionic mobile application demo",
    },
  },
  {
    id: "design-systems",
    number: "07",
    title: "Design Systems",
    proposition:
      "Reusable component systems that scale with your product — from tokens to production, built for consistency and developer velocity.",
    deliverables: ["Component architecture", "Design tokens", "Documentation", "Implementation support"],
    technologies: ["TypeScript", "Tailwind CSS", "Storybook", "Angular", "React"],
    idealFor: "Growing teams building multiple products or platforms.",
    image: { src: "/media/service/service_7.png", alt: "Design system component ecosystem" },
    media: {
      type: "image",
      src: "/media/service/service_7.png",
      alt: "Design system component layout and documentation",
    },
  },
];
