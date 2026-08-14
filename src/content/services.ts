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
    image: { src: "/media/working/projects-flatlay.jpg", alt: "Component library and code editor across two monitors and a laptop" },
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
    image: { src: "/media/working/services-whiteboard.jpg", alt: "Rabin at a whiteboard explaining a system architecture" },
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
    image: { src: "/media/working/skills-keyboard.jpg", alt: "Hands on a mechanical keyboard with a laptop and editor beyond" },
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
    image: { src: "/media/working/experience-collaboration.jpg", alt: "Walking through code on a dual-monitor setup" },
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
    image: { src: "/media/working/divider-night-desk.jpg", alt: "A lit desk with two monitors in an otherwise dark room" },
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
    image: { src: "/media/vnpf_mobile/composite-thumb.png", alt: "Cross-platform member application screens" },
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
    image: { src: "/media/working/projects-flatlay.jpg", alt: "Component library documentation and design system components" },
  },
];
