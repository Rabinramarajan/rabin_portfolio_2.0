/**
 * Engagement Models — how we can work together
 * Used in Services section and across the portfolio
 */

export interface EngagementModel {
  id: string;
  title: string;
  description: string;
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
    scope: "Fixed scope, fixed timeline",
    timeline: "1-12 weeks",
    idealFor: "Teams building a specific feature or product",
    featured: false,
  },
  {
    id: "retainer",
    title: "Retainer",
    description: "Ongoing partnership for product development.",
    scope: "Flexible scope, ongoing",
    timeline: "Month to month or longer",
    idealFor: "Products needing consistent engineering",
    featured: true,
  },
  {
    id: "contract",
    title: "Contract",
    description: "Dedicated engineering support for your team.",
    scope: "Embedded, full-time equivalent",
    timeline: "Scoped per engagement",
    idealFor: "Teams needing senior expertise embedded",
    featured: false,
  },
];

