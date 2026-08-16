import { profile } from "@/content/profile";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

/**
 * Answers are factual restatements of what the rest of the site already shows
 * (services, work, skills, experience). Nothing here is a claim the portfolio
 * doesn't back — FAQ structured data must mirror visible, truthful content.
 */
export const faqs: FaqItem[] = [
  {
    id: "specialisation",
    question: "What does Rabin R specialise in?",
    answer:
      "Rabin R is a Frontend Software Engineer specialising in Angular and modern frontend architecture — TypeScript, RxJS, Signals, zoneless change detection and SSR — with a focus on performance, accessibility and product quality.",
  },
  {
    id: "experience",
    question: "How much experience does Rabin have?",
    answer: `${profile.yearsExperienceLabel} years of frontend engineering experience, delivered across government, pension, insurance and mobile products used in three countries.`,
  },
  {
    id: "location",
    question: "Where is Rabin based, and does he work remotely?",
    answer: `Rabin is based in ${profile.location}, and works remotely with teams worldwide across overlapping hours.`,
  },
  {
    id: "availability",
    question: "Is Rabin available for Angular development projects?",
    answer: `${profile.availability.label}. ${profile.availability.responseTime} after an enquiry through the contact page.`,
  },
  {
    id: "react",
    question: "Does Rabin work with React and Next.js?",
    answer:
      "Yes. Angular is the primary stack, and React with Next.js is used for product and marketing frontends — this portfolio is built with Next.js and React.",
  },
  {
    id: "angular-versions",
    question: "Which Angular versions does Rabin work with?",
    answer:
      "Angular 17 through 22, including standalone components, Signals, zoneless change detection and server-side rendering, as well as upgrades from older Angular versions.",
  },
  {
    id: "performance",
    question: "Can Rabin help with Angular performance optimisation?",
    answer:
      "Yes. Performance optimisation is a named service — bundle and change-detection profiling, render and network work, and Core Web Vitals. On the Fiji immigration platforms this reduced API consumption by 40% and improved performance by 50%.",
  },
  {
    id: "mobile",
    question: "Does Rabin build mobile applications?",
    answer:
      "Yes — cross-platform iOS and Android apps with Ionic, Angular and Capacitor. The VNPF 'blo mi' member app was shipped to both app stores.",
  },
  {
    id: "contact",
    question: "How can I contact Rabin?",
    answer: `Through the contact form on this site, by email at ${profile.email}, or by phone at ${profile.phone} (${profile.phoneHours}).`,
  },
];
