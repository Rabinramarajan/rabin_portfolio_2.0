/**
 * Engagement Models — how we can work together
 * Used in Services section and across the portfolio
 */

export interface EngagementModel {
  id: string;
  title: string;
  /** Long form, used on /services and the freelance landing page. */
  description: string;
  /** One-line form, used by the homepage engagement section. */
  summary: string;
  scope?: string;
  timeline?: string;
  idealFor?: string;
  featured?: boolean;
}

export const engagementModels: EngagementModel[] = [
  {
    id: "project",
    title: "Project",
    description: "Defined scope, timeline, and deliverables.",
    summary: "A defined product, shipped on a timeline.",
    scope: "Fixed scope, fixed timeline",
    timeline: "1-12 weeks",
    idealFor: "Teams building a specific feature or product",
    featured: false,
  },
  {
    id: "retainer",
    title: "Retainer",
    description: "Ongoing partnership for product development.",
    summary: "Ongoing care after launch.",
    scope: "Flexible scope, ongoing",
    timeline: "Month to month or longer",
    idealFor: "Products needing consistent engineering",
    featured: true,
  },
  {
    id: "contract",
    title: "Contract",
    description: "Dedicated engineering support for your team.",
    summary: "Embedded frontend engineering inside your team.",
    scope: "Embedded, full-time equivalent",
    timeline: "Scoped per engagement",
    idealFor: "Teams needing senior expertise embedded",
    featured: false,
  },
];

