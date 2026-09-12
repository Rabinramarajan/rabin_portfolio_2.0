/**
 * THE RESUME DOCUMENT — canonical text of the PDF that gets sent to recruiters.
 *
 * This is deliberately a separate source of truth from `experience.ts`, and the
 * two are not interchangeable:
 *
 *   experience.ts  narrates the career for the *site* — editorial voice, one
 *                  headline metric per role, written to be read on screen.
 *   resume.ts      is the *document* — ATS-oriented phrasing, full duty
 *                  bullets, and the section order a recruiter scans for.
 *
 * The hard facts (employers, titles, dates, locations, stack) must agree across
 * both. When a role changes, change it in both files.
 */

export interface ResumeRole {
  id: string;
  role: string;
  employer: string;
  location: string;
  period: string;
  bullets: string[];
}

export interface ResumeProject {
  id: string;
  name: string;
  stack: string;
  description: string;
}

export interface ResumeSkillGroup {
  id: string;
  label: string;
  items: string;
}

/** Headline titles, shown as one pipe-separated line under the name. */
export const resumeTitles = [
  "Frontend Angular Developer",
  "Angular Consultant",
  "Frontend Software Engineer",
];

/**
 * Contact details as printed on the resume.
 *
 * The email here is deliberately the personal address, not `profile.email`
 * (hello@rabinr.in). The site address routes through the contact form; a resume
 * that lands in an ATS needs the inbox that is checked directly.
 */
export const resumeContact = {
  location: "Chennai, Tamil Nadu, India",
  phone: "+91 9789376992",
  /* One identity everywhere. The résumé used to carry a Gmail address while
     the footer, FAQ and contact page carried hello@rabinr.in — a visitor who
     noticed both had to wonder which one was real. */
  email: "hello@rabinr.in",
};

/** Web presence line. Display text is what prints; href is what a click follows. */
export const resumeLinks = [
  { label: "linkedin.com/in/rabinr", href: "https://www.linkedin.com/in/rabinr" },
  { label: "rabinr.in", href: "https://www.rabinr.in" },
  { label: "github.com/Rabinramarajan", href: "https://github.com/Rabinramarajan" },
];

export const resumeSummary =
  "Frontend Angular Developer with 4+ years of experience building enterprise scale web and hybrid mobile applications using Angular (v13-v22), TypeScript, JavaScript, HTML5, CSS3, SCSS, Tailwind CSS, Angular Material, RxJS, Angular Signals, Ionic, and REST APIs. Skilled in scalable frontend architecture, reusable UI components, secure REST API integration, authentication, performance optimization, accessibility, and responsive design within Agile teams.";

/**
 * Resume skill taxonomy. Intentionally different from `skillGroups` in
 * skills.ts: that one is organised by discipline for the site's skills section,
 * this one is organised the way a hiring manager reads a resume.
 */
export const resumeSkillGroups: ResumeSkillGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    items:
      "Angular (v13-v22), TypeScript, JavaScript (ES6+), HTML5, CSS3, SCSS, Tailwind CSS, Bootstrap, Angular Material",
  },
  {
    id: "angular-core",
    label: "Angular Core",
    items:
      "Standalone Components, Angular Signals, RxJS, Reactive Forms, Template Driven Forms, Routing, Lazy Loading, Dependency Injection, Component Architecture",
  },
  {
    id: "backend",
    label: "Backend Integration",
    items:
      "REST APIs, HttpClient, JWT Authentication, Role Based Access Control (RBAC), JSON",
  },
  {
    id: "mobile-data",
    label: "Mobile & Databases",
    items: "Ionic Framework, Capacitor, PostgreSQL, MySQL",
  },
  {
    id: "tools",
    label: "Tools",
    items: "Git, GitHub, Visual Studio Code, Postman, Chrome DevTools, npm",
  },
  {
    id: "practices",
    label: "Practices",
    items:
      "Agile Scrum, SDLC, Code Review, Debugging, Performance Optimization, Cross Browser Compatibility, Responsive Design",
  },
];

export const resumeExperience: ResumeRole[] = [
  {
    id: "rstack",
    role: "Frontend Angular Consultant",
    employer: "RStack Solutions (Healthcare Product Company)",
    location: "Chennai, India",
    period: "June 2026 - Present",
    bullets: [
      "Develop enterprise healthcare applications using Angular 22, TypeScript, SCSS, and Angular Signals.",
      "Build reusable, scalable UI components following Angular best practices and standalone component patterns.",
      "Integrate REST APIs with secure JWT authentication and improve performance via lazy loading and optimised change detection.",
      "Perform code reviews, mentor junior developers, and collaborate with Product Owners, Designers, QA Engineers, and Backend Developers.",
    ],
  },
  {
    id: "itgalax",
    role: "Frontend Angular Developer",
    employer: "ITGalax Solutions Pvt. Ltd.",
    location: "Chennai, India",
    period: "June 2022 - January 2026",
    bullets: [
      "Developed enterprise web applications for Government, Immigration, and Pension Management systems.",
      "Built reusable Angular components used across multiple business modules and implemented responsive UI with Angular Material and Tailwind CSS.",
      "Integrated REST APIs and authentication workflows, and optimised loading time using lazy loading and modular architecture.",
      "Fixed production issues to improve stability, and participated in sprint planning, estimation, code reviews, and production deployments.",
    ],
  },
];

export const resumeProjects: ResumeProject[] = [
  {
    id: "fiji",
    name: "Fiji Immigration Management System",
    stack: "Angular, TypeScript, RxJS, Angular Signals, Tailwind CSS, REST APIs",
    description:
      "Enterprise immigration platform for permit processing, visa management, document verification, and workflow automation. Developed dynamic forms with complex validations and reusable components, integrated REST APIs with JWT authentication, and improved frontend performance in an Agile Scrum team.",
  },
  {
    id: "prims",
    name: "PRIMS - Pension & Retirement Information Management System",
    stack: "Angular, Angular Material, RxJS, REST APIs",
    description:
      "Enterprise pension platform for employee administration, retirement workflows, dashboards, and reporting. Built dashboard modules and reusable UI components, integrated backend APIs, and improved maintainability through modular architecture.",
  },
  {
    id: "vnpf",
    name: "VNPF Mobile Application",
    stack: "Ionic, Angular, Capacitor, REST APIs",
    description:
      "Cross platform Android and iOS mobile app. Developed responsive interfaces, integrated REST APIs, implemented secure authentication, and supported both app store releases.",
  },
];

export const resumeAchievements = [
  "Delivered multiple enterprise applications across Healthcare, Government, Immigration, and Pension Management domains.",
  "Built reusable Angular component libraries that improved development productivity across projects.",
  "Integrated secure REST APIs and authentication, and improved performance through lazy loading and Angular optimisation.",
  "Collaborated with cross functional Agile teams to deliver production ready, responsive software.",
];

export const resumeEducation = [
  {
    id: "bsc-it",
    qualification: "B.Sc. Information Technology",
    detail: "National College, Tiruchirappalli, Tamil Nadu, India | 2018 - 2021",
  },
  {
    id: "web-d-school",
    qualification: "Web Design & Development",
    detail: "Web D School, Chennai",
  },
];

export const resumeAdditional = [
  { label: "Languages", value: "English, Tamil" },
  { label: "Notice Period", value: "Immediate / As Per Requirement" },
  {
    label: "Soft Skills",
    value:
      "Problem Solving, Team Collaboration, Communication, Leadership, Critical Thinking, Adaptability, Time Management",
  },
];

/** Filename offered when the sheet is saved to PDF. */
export const resumeFileName = "Rabin_R_Frontend_Angular_Developer_Resume";
