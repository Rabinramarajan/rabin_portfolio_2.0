import type { ServiceOfferingIcon } from "@/content/types";

/**
 * The full offer list on /services — the eight `serviceOfferings` cards with
 * the per-service capability bullets that page shows. Kept separate from
 * `serviceOfferings` (the home grid, three stack chips per card) and from
 * `services` (the long-form JSON-LD source).
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
    id: "web",
    number: "01",
    title: "Web Development",
    description:
      "High-performance websites and web applications built with modern technologies for exceptional user experiences.",
    capabilities: [
      "Custom Web Development",
      "Frontend Engineering",
      "Backend Development",
      "API Development",
    ],
    icon: "code",
    href: "/services/web-application-development",
  },
  {
    id: "fullstack",
    number: "02",
    title: "Full-Stack Development",
    description:
      "End-to-end product engineering across modern stacks, APIs, and architectures that scale with the business.",
    capabilities: ["Product Architecture", "Typed Data Models", "Auth & Integrations", "Deployment Pipelines"],
    icon: "layers",
    href: "/services/web-application-development",
  },
  {
    id: "mobile",
    number: "03",
    title: "Mobile Development",
    description:
      "Native and cross-platform mobile applications that deliver smooth performance and delightful user experiences.",
    capabilities: ["Android Development", "iOS Development", "Cross Platform Apps", "App Performance"],
    icon: "phone",
    href: "/services/mobile-app-development",
  },
  {
    id: "cloud",
    number: "04",
    title: "Cloud & DevOps",
    description:
      "CI/CD pipelines, cloud deployment and infrastructure that let a team ship faster and scale without drama.",
    capabilities: ["CI/CD Pipelines", "Containerised Builds", "Cloud Deployment", "Monitoring & Alerts"],
    icon: "cloud",
    href: "/services",
  },
  {
    id: "design",
    number: "05",
    title: "UI/UX Design",
    description:
      "Clean, intuitive and conversion-focused designs that create meaningful connections between brands and users.",
    capabilities: ["User Research", "UI Design", "UX Design", "Design Systems"],
    icon: "pen",
    href: "/services/angular-development",
  },
  {
    id: "backend",
    number: "06",
    title: "Backend & API Development",
    description:
      "Robust RESTful services and backend systems built for performance, reliability and long-term maintenance.",
    capabilities: ["REST API Design", "Database Modelling", "Service Integration", "Security Hardening"],
    icon: "server",
    href: "/services",
  },
  {
    id: "performance",
    number: "07",
    title: "Performance & Optimization",
    description:
      "Faster loads and calmer runtime through profiling, splitting and budgets — measured against Core Web Vitals.",
    capabilities: ["Core Web Vitals", "Bundle Reduction", "Runtime Profiling", "Technical SEO"],
    icon: "shield",
    href: "/services",
  },
  {
    id: "support",
    number: "08",
    title: "Maintenance & Support",
    description:
      "Ongoing support, feature updates and performance monitoring that keep a shipped product ahead of its backlog.",
    capabilities: ["Feature Updates", "Bug Triage", "Dependency Upgrades", "Uptime Monitoring"],
    icon: "support",
    href: "/services",
  },
];

export type ServiceStat = {
  id: string;
  value: string;
  label: string;
  icon: ServiceOfferingIcon;
};

export const serviceStats: ServiceStat[] = [
  { id: "projects", value: "15+", label: "Projects Delivered", icon: "layers" },
  { id: "years", value: "5+", label: "Years of Experience", icon: "code" },
  { id: "clients", value: "20+", label: "Happy Clients", icon: "support" },
  { id: "satisfaction", value: "98%", label: "Client Satisfaction", icon: "shield" },
];

/** Orbit labels around the hero emblem, positioned by the CSS module. */
export const orbitLabels = ["Strategy", "Development", "Experience", "Performance"] as const;
