import { credentials } from "@/content/profile";
import type { ServiceOfferingIcon } from "@/content/types";

/**
 * The offer list on /services — one card per marketed service, with the
 * capability bullets that page shows.
 *
 * This was eight cards, and /services then repeated itself with seven more
 * further down: cloud, DevOps, UI/UX and backend presented at the same weight
 * as the Angular work. It read as an agency menu written by one person, and
 * it made the specialism invisible. The four here mirror `services` in
 * services.ts exactly; everything else is `supportingCapabilities`.
 */
export type ServiceHighlight = {
  id: string;
  number: string;
  title: string;
  description: string;
  capabilities: string[];
  icon: ServiceOfferingIcon;
  href: string;
};

export const serviceHighlights: ServiceHighlight[] = [
  {
    id: "angular",
    number: "01",
    title: "Angular Engineering",
    description:
      "Enterprise Angular applications with signals, standalone APIs and architecture that survives real teams and real traffic.",
    capabilities: [
      "Angular 17–22",
      "Signals",
      "RxJS",
      "Standalone architecture",
      "Migration / modernization",
    ],
    icon: "code",
    href: "/services/angular-development",
  },
  {
    id: "architecture",
    number: "02",
    title: "Frontend Architecture",
    description:
      "Component architecture, design systems and data flow designed once, so the third release costs what the first one did.",
    capabilities: ["Component architecture", "Design systems", "State and data flow", "Maintainability"],
    icon: "layers",
    href: "/services/web-application-development",
  },
  {
    id: "performance",
    number: "03",
    title: "Performance Optimization",
    description:
      "Faster loads and calmer runtime through profiling, splitting and budgets — measured against Core Web Vitals, not guessed.",
    capabilities: ["Core Web Vitals", "Rendering", "API / network optimization", "Bundle optimization"],
    icon: "shield",
    href: "/services/web-application-development",
  },
  {
    id: "mobile",
    number: "04",
    title: "Ionic / Cross-platform Mobile",
    description:
      "iOS and Android from one Angular + Ionic codebase, including store builds, native APIs and offline-aware behaviour.",
    capabilities: ["Angular + Ionic", "Capacitor", "iOS / Android", "Native integrations"],
    icon: "phone",
    href: "/services/mobile-app-development",
  },
];

export type ServiceStat = {
  id: string;
  value: string;
  label: string;
  icon: ServiceOfferingIcon;
};

/* Read from `credentials` rather than restated. These four tiles used to say
   5+ years, 15+ projects and 98% client satisfaction while the rest of the
   site said 4+ and 20+ — three contradictions and one unverifiable number on
   a page whose job is to be believed. */
export const serviceStats: ServiceStat[] = [
  { id: "years", value: credentials.years, label: "Years shipping production software", icon: "code" },
  { id: "projects", value: credentials.projects, label: "Projects delivered", icon: "layers" },
  { id: "users", value: credentials.users, label: "Users served", icon: "support" },
  { id: "countries", value: credentials.countries, label: "Countries served", icon: "shield" },
];

/** Orbit labels around the hero emblem, positioned by the CSS module. */
export const orbitLabels = ["Angular", "Architecture", "Performance", "Mobile"] as const;
