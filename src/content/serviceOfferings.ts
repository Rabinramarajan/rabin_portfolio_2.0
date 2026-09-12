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
    description: "Enterprise Angular with signals, standalone APIs and architecture that survives real teams.",
    stack: ["Angular 17–22", "Signals", "RxJS"],
    icon: "code",
    href: "/services/angular-development",
  },
  {
    id: "architecture",
    number: "02",
    title: "Frontend Architecture",
    description: "Component architecture, design systems and data flow designed for the third release, not the first demo.",
    stack: ["Architecture", "Design systems", "TypeScript"],
    icon: "layers",
    href: "/services/web-application-development",
  },
  {
    id: "performance",
    number: "03",
    title: "Performance Optimization",
    description: "Core Web Vitals, rendering, network and bundle work — measured against real devices, not guessed.",
    stack: ["Core Web Vitals", "Rendering", "Bundles"],
    icon: "shield",
    href: "/services/web-application-development",
  },
  {
    id: "mobile",
    number: "04",
    title: "Ionic / Cross-platform Mobile",
    description: "iOS and Android from one Angular + Ionic codebase, including store builds and native APIs.",
    stack: ["Ionic", "Capacitor", "Angular"],
    icon: "phone",
    href: "/services/mobile-app-development",
  },
];
