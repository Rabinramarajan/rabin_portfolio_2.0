import type { Credentials, HeroContent, NavItem, Profile, SeoContent } from "@/content/types";

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
    { id: "email", label: "Email", href: "mailto:rabinr2607@gmail.com" },
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
  { href: "/#about", label: "About Us", sectionId: "about" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/experience", label: "Experience" },
  { href: "/#skills", label: "Skills", sectionId: "skills" },
  { href: "/#process", label: "Process", sectionId: "process" },
  { href: "/contact", label: "Contact Us" },
];

/**
 * Secondary navigation. These lived as literal arrays inside Footer.tsx, which
 * meant the site had two competing definitions of its own link structure —
 * the footer is the only internal link some of these routes get.
 *
 * `standalone`: real pages kept out of the primary nav.
 * `resources`:  the footer's "Resources" column.
 */
export const secondaryNavigation: { standalone: NavItem[]; resources: NavItem[] } = {
  standalone: [
    { href: "/skills", label: "Skills" },
    { href: "/process", label: "Process" },
    { href: "/insights", label: "Insights" },
  ],
  resources: [
    { href: "/work", label: "Case Studies" },
    { href: "/insights", label: "Articles" },
    { href: "/pricing", label: "Engagement Models" },
    { href: profile.resumePath, label: "Résumé" },
    { href: "/skills", label: "Tech Stack" },
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
  headline: "I engineer digital products that scale, perform and feel effortless.",
  headlineLines: ["I engineer digital products", "that scale, perform", "and feel effortless."],
  displayLines: [
    { text: "I Build" },
    { text: "Digital", accent: true },
    { text: "Experiences", accent: true },
  ],
  disciplines: ["Frontend Engineer", "Angular Specialist", "Product Engineering"],
  quote: {
    lines: ["Code is my craft.", "Impact is my goal."],
    signature: profile.shortName,
  },
  reel: { src: "/media/hero/banner_v.mp4", poster: "/media/hero/banner-poster.webp" },
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

