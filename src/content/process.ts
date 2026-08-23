import type { ProcessStep } from '@/content/types';

export const processIntro = {
  index: '06',
  label: 'My Process',
  headingLines: ['A clear process.', 'Real results.'],
  lede: 'I follow a proven, iterative process that turns ideas into scalable digital products. Transparent, collaborative and focused on impact at every step.',
  ctaHeading: 'Ready to build?',
  ctaLede: "Let’s move from concept to deployment with a clear, high-trust delivery path.",
} as const;

export const processPrinciples = [
  {
    title: 'Goal Focused',
    body: 'Each stage is tied to business outcomes, not vanity deliverables.',
  },
  {
    title: 'Connected Decisions',
    body: 'Discovery, strategy and design decisions remain visible throughout delivery.',
  },
  {
    title: 'Quality Built In',
    body: 'Reliability, performance and accessibility are part of the workflow, not a final checklist.',
  },
  {
    title: 'Transparent Progress',
    body: 'You always know what is happening now, what is next and why it matters.',
  },
  {
    title: 'Scale Ready',
    body: 'Architecture and implementation are prepared for growth from the first release.',
  },
] as const;

export const processSteps: ProcessStep[] = [
  {
    id: 'discover',
    number: '01',
    label: 'Discovery',
    title: 'Understand before building',
    purpose: 'Understand the product, users, business goals and constraints.',
    description:
      'Every strong product starts with understanding. I learn how the business makes money, who the product is for, and what the real constraints are — before a single line of code is written.',
    happens: ['Stakeholder conversations', 'Product and competitor review', 'Constraint mapping'],
    deliverables: ['Research', 'Requirements', 'User flows'],
    output: 'Research notes · Requirement set · Flow diagrams',
    outcome: 'A shared, written understanding of what is actually being built and why.',
    visual: 'discover',
  },
  {
    id: 'define',
    number: '02',
    label: 'Strategy',
    title: 'Turn insight into direction',
    purpose: 'Turn ambiguity into a clear technical direction.',
    description:
      'Findings become strategy. Scope, architecture and rollout sequencing are defined to reduce risk early and keep execution focused.',
    happens: ['Scope and milestone mapping', 'Architecture strategy', 'Delivery sequencing'],
    deliverables: ['Scope model', 'Architecture blueprint', 'Execution roadmap'],
    output: 'Delivery strategy · System map · Priority roadmap',
    outcome: 'A clear technical direction before development begins.',
    visual: 'define',
  },
  {
    id: 'design',
    number: '03',
    label: 'Design',
    title: 'Design the experience',
    purpose: 'Translate requirements into intuitive interfaces.',
    description:
      'Structure becomes something people can use. Layout, hierarchy, states and motion are decided as one system, so the interface stays consistent as the product grows.',
    happens: ['Layout and hierarchy', 'Component and state design', 'Responsive behaviour'],
    deliverables: ['UX', 'UI', 'Design system', 'Responsive behaviour'],
    output: 'UI direction · Component library · Motion direction',
    outcome: 'An interface system that scales instead of being redrawn every sprint.',
    visual: 'design',
  },
  {
    id: 'build',
    number: '04',
    label: 'Development',
    title: 'Engineer with production discipline',
    purpose: 'Turn the system into production-ready software.',
    description:
      'Design becomes a real application — typed, componentised and built on modern architecture. Integration and state are handled early so features compose instead of collide.',
    happens: ['Component implementation', 'State and data flow', 'API integration'],
    deliverables: ['Components', 'Integration', 'State', 'API', 'Responsive UI'],
    output: 'Type-safe code · API integration · Production architecture',
    outcome: 'Working software you can review, not a prototype you have to imagine.',
    visual: 'build',
  },
  {
    id: 'test',
    number: '05',
    label: 'Testing',
    title: 'Make it reliable',
    purpose: 'Validate quality, performance and accessibility.',
    description:
      'The product is verified against real devices, real browsers and the journeys that matter. Performance and accessibility are treated as requirements, not afterthoughts.',
    happens: ['End-to-end journeys', 'Performance budgets', 'Accessibility audit'],
    deliverables: ['Testing', 'Performance', 'Accessibility', 'Cross-browser validation'],
    output: 'Playwright E2E · Core Web Vitals · WCAG checks',
    outcome: 'Confidence that the product holds up outside your own machine.',
    visual: 'test',
  },
  {
    id: 'launch',
    number: '06',
    label: 'Deployment',
    title: 'Deploy with confidence',
    purpose: 'Ship a stable, production-ready product.',
    description:
      'Deployment is a controlled step, not an event. Environments, monitoring and search visibility are configured before release so launch day is uneventful.',
    happens: ['Environment configuration', 'Deployment pipeline', 'Monitoring and SEO'],
    deliverables: ['Deployment', 'Monitoring', 'SEO', 'Production readiness'],
    output: 'Deployment pipeline · Monitoring stack · Release instrumentation',
    outcome: 'A live product with the instrumentation to prove it is healthy.',
    visual: 'launch',
  },
];
