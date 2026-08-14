import type { HeroContent, NavItem, Profile, SeoContent } from "@/content/types";

export const SITE_URL = "https://www.rabinr.in";

export const profile: Profile = {
  name: "Rabin R",
  shortName: "Rabin",
  monogram: "RR",
  role: "Frontend Software Engineer",
  headlineRole: "Frontend Software Engineer",
  location: "Chennai, Tamil Nadu, India",
  locationShort: "Chennai, India",
  email: "rabinr2607@gmail.com",
  yearsExperienceLabel: "4+", // CALCULATED from experience.ts via calculateExperienceYears()
  availability: {
    status: "available",
    label: "Available for select projects",
    responseTime: "Usually responds within 1 business day",
  },
  focus: "Angular · TypeScript · Product Engineering",
  socials: [
    { id: "github", label: "GitHub", href: "https://github.com/rabinr" },
    { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/rabinr" },
    { id: "email", label: "Email", href: "mailto:rabinr2607@gmail.com" },
    { id: "website", label: "Website", href: SITE_URL },
  ],
  resumePath: "/resume",
};

export const navigation: NavItem[] = [
  { href: "/#about", label: "About", sectionId: "about" },
  { href: "/#services", label: "Services", sectionId: "services" },
  { href: "/work", label: "Work", sectionId: "work" },
  { href: "/#experience", label: "Experience", sectionId: "experience" },
  { href: "/#skills", label: "Skills", sectionId: "skills" },
  { href: "/#process", label: "Process", sectionId: "process" },
  { href: "/#contact", label: "Contact", sectionId: "contact" },
];

/**
 * Hero content — uses profile data for role, location, name
 * Only unique hero narrative content is stored here
 * Components should derive role/location from profile.ts instead of repeating
 */
export const hero: HeroContent = {
  name: profile.name,
  role: profile.role,
  availability: profile.availability.label,
  headline: "I engineer digital products that scale, perform and feel effortless.",
  headlineLines: ["I engineer digital products", "that scale, perform", "and feel effortless."],
  description:
    "Frontend engineer specializing in Angular and modern web application architecture, with a strong focus on performance, usability and product quality.",
  primaryCta: { label: "Let's Work Together", href: "/contact" },
  secondaryCta: { label: "View Selected Work", href: "/work" },
  metadata: [
    { label: "Role", value: profile.role },
    { label: "Location", value: profile.locationShort },
    { label: "Experience", value: profile.yearsExperienceLabel + " years" },
    { label: "Availability", value: "Select projects" },
  ],
  portrait: { src: "/media/working/hero-portrait-640.webp", alt: "Portrait of Rabin R", width: 640, height: 800 },
  midground: {
    src: "/media/fiji_internal_application/image3.png",
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

