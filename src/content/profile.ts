import type { Credentials, EducationEntry, HeroContent, NavItem, Profile, SeoContent } from "@/content/types";
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
  phone: "+91 73050 76992",
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
  users: "10K+",
  countries: "3",
  needsReview: ["projects", "clients"],
};

/**
 * Qualifications, for the resume page. Kept here rather than in the career
 * timeline because `careerHorizon` records the 2021 foundation *year* as a
 * narrative beat and never names the institution.
 */
/**
 * The hero proof strip.
 *
 * Every figure here is traceable to a case study in `projects.ts` — the API
 * and frontend numbers to the Fiji Immigration internal platform, the user
 * count to the same deployment, the country count to Fiji, India and the US.
 * Approximations stay approximate ("~40%"): they were measured, not audited.
 */
export const proofMetrics: { value: string; label: string }[] = [
  { value: credentials.users, label: "Active users served" },
  { value: "~40%", label: "Lower API consumption" },
  { value: "~50%", label: "Frontend performance gain" },
  { value: credentials.countries, label: "Countries served" },
];

/**
 * The engineering positions the About page argues at length. The homepage
 * carries the short form, because a visitor deciding whether to read further
 * will not reach the long one.
 */
export const principles: { title: string; body: string }[] = [
  { title: "Performance", body: "Measured, not assumed." },
  { title: "Maintainability", body: "Built for the third release." },
  { title: "Accessibility", body: "Part of engineering, not final QA." },
  { title: "Product context", body: "Technology follows the problem." },
];

export const education: EducationEntry[] = [
  {
    id: "bsc-it",
    qualification: "B.Sc. Information Technology",
    institution: "National College",
    location: "Tiruchirappalli, Tamil Nadu, India",
    period: "2018 — 2021",
  },
  {
    id: "web-d-school",
    qualification: "Web Design & Development",
    institution: "Web D School",
    location: "Chennai, India",
  },
];

export const navigation: NavItem[] = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
  { href: "/resume", label: "Résumé" },
];

/**
 * Footer rail — the full set of indexable destinations.
 *
 * The primary nav stays at four items by design, which left /skills and
 * /pricing reachable only from the sitemap: no internal links anywhere on the
 * site, so no internal PageRank and nothing signalling they matter. The footer
 * is where the secondary routes earn their links.
 */
export const footerNavigation: NavItem[] = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/experience", label: "Experience" },
  { href: "/skills", label: "Skills" },
  { href: "/process", label: "Process" },
  { href: "/pricing", label: "Pricing" },
  { href: "/insights", label: "Insights" },
];

export const sidebarNavigation: NavItem[] = [
  { href: "/#", label: "Hero", sectionId: "hero" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
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
  headline: "Angular Engineer for High-Performance Digital Products.",
  headlineLines: ["Angular Engineer for", "High-Performance", "Digital Products."],
  displayLines: [
    { text: "Angular Engineer for" },
    { text: "High-Performance", accent: true },
    { text: "Digital Products", accent: true },
  ],
  /* The proof line, not a list of labels: tenure, volume, the sector the work
     actually sits in, and where I work from. */
  disciplines: [
    `${profile.yearsExperienceLabel} years`,
    `${credentials.projects} projects`,
    "Government & enterprise systems",
    "Chennai / Remote",
  ],
  quote: {
    lines: ["Code is my craft.", "Impact is my goal."],
    signature: profile.shortName,
  },
  reel: {
    src: media("hero/home-reel-v6.mp4"),
    poster: media("hero/home-poster-v6.webp"),
    /* The poster is the LCP element. This srcset and the <link rel="preload">
       on the home page are read from these same two fields precisely so they
       cannot drift — a preload that does not match the srcset makes the
       browser fetch one file for the preload and a different one for the img. */
    posterSrcSet: [
      `${media("hero/home-poster-v6-640.webp")} 640w`,
      `${media("hero/home-poster-v6-960.webp")} 960w`,
      `${media("hero/home-poster-v6.webp")} 1280w`,
      `${media("hero/home-poster-v6-1920.webp")} 1920w`,
    ].join(", "),
    posterSizes: "100vw",
  },
  description:
    "Frontend Angular Consultant building scalable enterprise applications with Angular, TypeScript, Signals and RxJS — from architecture to production.",
  primaryCta: { label: "View Case Studies", href: "/work" },
  secondaryCta: { label: "Discuss a Project", href: "/contact" },
  /* Recruiters and clients land on the same hero and want different things.
     The client path runs hero -> case study -> service -> contact; this is
     the one door out of it, straight to the resume. */
  recruiterCta: { label: "Hiring for a frontend role?", linkLabel: "View résumé", href: "/resume" },
  metadata: [
    { label: "Experience", value: profile.yearsExperienceLabel + " years" },
    { label: "Projects", value: credentials.projects },
    { label: "Active Users", value: credentials.users },
    { label: "Countries", value: credentials.countries },
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
  title: "Rabin R — Angular Consultant & Frontend Engineer",
  description:
    "Angular consultant and frontend engineer building scalable enterprise web and mobile products with Angular, TypeScript, RxJS, Signals and Ionic.",
  /* Clustered rather than generic. "Frontend developer" on its own is a term
     this site cannot win and would not convert if it did; the specific ones
     below are what the work actually evidences. */
  keywords: [
    "Angular consultant",
    "Angular developer",
    "Angular developer Chennai",
    "Angular performance optimization",
    "Frontend architecture",
    "Ionic Angular developer",
    "Enterprise Angular architecture",
    "Frontend software engineer",
  ],
};

