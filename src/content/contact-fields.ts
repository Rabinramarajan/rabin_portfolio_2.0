/**
 * THE canonical option lists for the enquiry form.
 *
 * Both the client form and the server validator read these, so a value can
 * never be offered in the UI that the API would then reject. Adding an option
 * here is all that is needed to surface it in the form.
 */

export const PROJECT_TYPES = [
  "Web Application",
  "Website",
  "Angular Development",
  "Mobile Application",
  "UI/UX Development",
  "Dashboard / Admin Portal",
  "API / Backend Integration",
  "Performance Optimization",
  "Consulting",
  "Other",
] as const;

export const CONTACT_ROLES = [
  "Founder / Owner",
  "Product Manager",
  "CTO / Engineering Lead",
  "Designer",
  "Developer",
  "Agency",
  "Other",
] as const;

export const PROJECT_STAGES = [
  "Idea / Planning",
  "Design Ready",
  "Development Started",
  "Existing Product",
  "Redesign / Modernization",
  "Production / Maintenance",
] as const;

export const TECHNOLOGIES = [
  "Angular",
  "TypeScript",
  "Ionic",
  "Flutter",
  "React",
  "Next.js",
  "Node.js",
  "NestJS",
  "REST API",
  "PostgreSQL",
  "UI/UX",
  "Other",
] as const;

export const TIMELINES = ["ASAP", "1–2 weeks", "1 month", "1–3 months", "3–6 months", "Flexible"] as const;

export const BUDGET_RANGES = [
  "Under ₹50K",
  "₹50K – ₹1L",
  "₹1L – ₹3L",
  "₹3L – ₹5L",
  "₹5L+",
  "Let's discuss",
] as const;

export const ENGAGEMENTS = [
  "Fixed Project",
  "Hourly Consulting",
  "Monthly Retainer",
  "Long-term Contract",
  "Full-time Opportunity",
] as const;

export const REFERRAL_SOURCES = ["LinkedIn", "GitHub", "Google", "Referral", "Portfolio", "Other"] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];
export type ContactRole = (typeof CONTACT_ROLES)[number];
export type ProjectStage = (typeof PROJECT_STAGES)[number];
export type Technology = (typeof TECHNOLOGIES)[number];
export type Timeline = (typeof TIMELINES)[number];
export type BudgetRange = (typeof BUDGET_RANGES)[number];
export type Engagement = (typeof ENGAGEMENTS)[number];
export type ReferralSource = (typeof REFERRAL_SOURCES)[number];

/** Upload limits, shared by the form's `accept` attribute and the API guard. */
export const ATTACHMENT = {
  maxBytes: 5 * 1024 * 1024,
  maxLabel: "5 MB",
  extensions: [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg", ".zip"],
  mimeTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
    "application/zip",
    "application/x-zip-compressed",
  ],
} as const;
