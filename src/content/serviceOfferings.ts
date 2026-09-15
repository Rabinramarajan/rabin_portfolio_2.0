import type { ServiceOffering } from "@/content/types";

/**
 * The four core services on the homepage rail.
 *
 * They mirror `services` and `serviceHighlights` one-for-one on purpose: a
 * visitor who sees "Full-Stack Development" here and "Angular Engineering" on
 * /services cannot tell what I actually specialise in, and that ambiguity is
 * what costs the enquiry. Node, Postgres and DevOps are still real — they are
 * `supportingCapabilities` in services.ts, not headline offers.
 */
export const serviceOfferings: ServiceOffering[] = [
  {
    id: "angular",
    number: "01",
    title: "Angular Engineering",
    description: "Angular with Signals and zoneless change detection, plus server-side rendering (SSR) and hydration for public pages.",
    stack: ["Angular 17–22", "Signals", "RxJS"],
    icon: "code",
    href: "/services/angular-development",
  },
  {
    id: "architecture",
    number: "02",
    title: "Frontend Architecture",
    description: "Component architecture and state flow, with Vitest and Playwright checks and WCAG 2.1 AA accessibility targets.",
    stack: ["Architecture", "Design systems", "TypeScript"],
    icon: "layers",
    href: "/services/frontend-architecture",
  },
  {
    id: "performance",
    number: "03",
    title: "Performance Optimization",
    description: "Core Web Vitals: loading (LCP), interaction (INP) and layout stability (CLS), alongside API, rendering and bundle profiling.",
    stack: ["Core Web Vitals", "Rendering", "Bundles"],
    icon: "shield",
    href: "/services/angular-performance-optimization",
  },
  {
    id: "mobile",
    number: "04",
    title: "Ionic / Cross-platform Mobile",
    description: "iOS and Android from one Angular + Ionic codebase, including store builds and native APIs.",
    stack: ["Ionic", "Capacitor", "Angular"],
    icon: "phone",
    href: "/services/ionic-development",
  },
];
