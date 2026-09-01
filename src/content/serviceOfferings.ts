import type { ServiceOffering } from "@/content/types";

/** The four core services featured on the homepage carousel. */
export const serviceOfferings: ServiceOffering[] = [
  {
    id: "frontend",
    number: "01",
    title: "Frontend Engineering",
    description: "Production interfaces from design to ship — typed, testable, and built to survive the third release.",
    stack: ["Angular", "React", "TypeScript"],
    icon: "code",
    href: "/services/web-application-development",
  },
  {
    id: "fullstack",
    number: "02",
    title: "Full-Stack Development",
    description: "Complete product delivery from API to UI. Node.js, Angular, and React built for real scale.",
    stack: ["Node.js", "APIs", "PostgreSQL"],
    icon: "layers",
    href: "/services/angular-development",
  },
  {
    id: "mobile",
    number: "03",
    title: "Mobile Applications",
    description: "iOS and Android from one codebase. Ionic, Capacitor, and native APIs for seamless experiences.",
    stack: ["Ionic", "Capacitor", "PWA"],
    icon: "phone",
    href: "/services/mobile-app-development",
  },
  {
    id: "performance",
    number: "04",
    title: "Performance & Architecture",
    description: "Scalable systems measured against Core Web Vitals. Optimized for real users, real traffic.",
    stack: ["Core Web Vitals", "Architecture", "Optimization"],
    icon: "shield",
    href: "/services",
  },
];
