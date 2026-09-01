import type { Credentials, HeroContent, NavItem, Profile, SeoContent } from "@/content/types";
import { media } from "@/lib/media";

export const SITE_URL = "https://www.rabinr.in";

export const profile: Profile = {
  name: "Rabin R",
  shortName: "Rabin",
  monogram: "RR",
  role: "Frontend Software Engineer",
  headlineRole: "Frontend Software Engineer",
  location: "Chennai, Tamil Nadu, India",
  locationShort: "Chennai, India",
  email: "hello@rabinr.in",
  phone: "+91 97893 76992",
  phoneHours: "Mon - Sat, 10AM - 8PM",
  yearsExperienceLabel: "4+", // CALCULATED from experience.ts via calculateExperienceYears()
  availability: {
    status: "available",
    label: "Available for select projects",
    responseTime: "Usually responds within 1 business day",
  },
  focus: "Angular · TypeScript · Product Engineering",
  socials: [
    { id: "github", label: "GitHub", href: "https://github.com/Rabinramarajan" },
    { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/rabinr" },
    { id: "email", label: "Email", href: "mailto:hello@rabinr.in" },
    { id: "website", label: "Website", href: SITE_URL },
  ],
  resumePath: "/resume",
};

/**
 * THE canonical credibility figures for the whole site.
 *
 * `projects` and `clients` are listed in `needsReview` because neither number
 * can be verified from the repository — projects.ts ships 9 case studies, and
 * there is no client record anywhere in the content layer. The conservative
 * end of the figures that already existed in the codebase is used here rather
 * than inventing a new one; confirm or correct them before launch.
 */
export const credentials: Credentials = {
  years: profile.yearsExperienceLabel,
  projects: "20+",
  clients: "15+",
  commitment: { value: "100%", label: "Focus on Quality" },
  needsReview: ["projects", "clients"],
};

export const navigation: NavItem[] = [
  { href: "/services", label: "Service" },
  { href: "/work", label: "Work" },
  { href: "/experience", label: "Experience" },
  { href: "/#skills", label: "Skills", sectionId: "skills" },
  { href: "/#process", label: "Process", sectionId: "process" },
  { href: "/about", label: "About" },
];

export const sidebarNavigation: NavItem[] = [
  { href: "/#", label: "Hero", sectionId: "hero" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

/**
 * Footer navigation. These lived as literal arrays inside Footer.tsx, which
 * meant the site had two competing definitions of its own link structure —
 * the footer is the only internal link some of these routes get.
 *
 * Every href below must resolve to a page that exists under src/app or to an
 * anchor rendered on the homepage; the footer never links to a stub.
 *
 * `explore`:   the site's own sections and pages, one destination per label.
 * `resources`: secondary destinations that are not part of the main journey.
 */
export const footerNavigation: { explore: NavItem[]; resources: NavItem[] } = {
  explore: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/work", label: "Work" },
    { href: "/experience", label: "Experience" },
    { href: "/skills", label: "Skills" },
    { href: "/process", label: "Process" },
    { href: "/contact", label: "Contact" },
  ],
  resources: [
    { href: profile.resumePath, label: "Résumé" },
    { href: "/insights", label: "Insights" },
    { href: "/#faq", label: "FAQs" },
  ],
};

/**
 * Hero content — uses profile data for role, location, name
 * Only unique hero narrative content is stored here
 * Components should derive role/location from profile.ts instead of repeating
 */
export const hero: HeroContent = {
  name: profile.name,
  role: profile.role,
  availability: profile.availability.label,
  headline: "I Engineer High-Performance Digital Products.",
  headlineLines: ["I Engineer High-Performance", "Digital Products built", "for real users."],
  displayLines: [
    { text: "I Engineer" },
    { text: "High-Performance", accent: true },
    { text: "Digital Products", accent: true },
  ],
  disciplines: ["Frontend Engineer", "Angular Specialist", "Product Engineering"],
  quote: {
    lines: ["Code is my craft.", "Impact is my goal."],
    signature: profile.shortName,
  },
  reel: { src: media("hero/home-reel.mp4"), poster: media("hero/home-poster.webp") },
  description:
    "Frontend Software Engineer specializing in Angular, TypeScript & modern web architecture — building scalable products used by real users.",
  primaryCta: { label: "View My Work", href: "/work" },
  secondaryCta: { label: "Hire / Let's Talk", href: "/contact" },
  metadata: [
    { label: "Experience", value: profile.yearsExperienceLabel + " years" },
    { label: "Projects", value: credentials.projects },
    { label: "Active Users", value: "10K+" },
    { label: "Clients", value: credentials.clients },
  ],
  portrait: { src: media("profile/rabin-hero.webp"), alt: "Portrait of Rabin R", width: 640, height: 800 },
  midground: {
    src: media("projects/fiji-immigration-internal/hero.png"),
    alt: "Fiji Immigration officer workflow interface",
    width: 1600,
    height: 1000,
  },
};

export const defaultSeo: SeoContent = {
  title: "Rabin R | Angular Developer & Frontend Software Engineer",
  description:
    "Senior Frontend Angular Consultant in Chennai. Engineering fast, scalable, accessible digital products with Angular, React and TypeScript.",
  keywords: [
    "Angular developer",
    "Frontend software engineer",
    "React developer",
    "Next.js",
    "Freelance software engineer",
    "Chennai",
  ],
};

