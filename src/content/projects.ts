import type { Project, ProjectFilter } from '@/content/types';
import { media } from '@/lib/media';
const img = (src: string, alt: string, width = 1600, height = 1000) => ({ src, alt, width, height });
export const projects: Project[] = [
  {
    slug: 'fiji-immigration-internal',
    number: '01',
    title: 'Fiji Immigration Internal Management System',
    tagline: 'The system immigration officers run a country borders on.',
    category: 'Government Platform',
    year: '2024',
    role: 'Frontend Angular Developer',
    platform: ['Enterprise Web'],
    stack: [
      { layer: 'Frontend', value: 'Angular (standalone components)' },
      { layer: 'State', value: 'RxJS' },
      { layer: 'Styling', value: 'Tailwind CSS' },
      { layer: 'API', value: 'Sails.js' },
      { layer: 'Access', value: 'Role-based routing & UI guards' },
    ],
    metrics: [
      { value: '~40%', label: 'Lower API consumption', note: 'Measured against the pre-optimisation frontend data flow.' },
      { value: '~50%', label: 'Frontend performance gain', note: 'From optimised rendering and workflow handling.' },
      { value: '10,000+', label: 'Active users', note: 'Fiji Government immigration case management, across three countries.' },
    ],
    /* Written in the first person and scoped deliberately. This was a team
       delivery; claiming the platform would be a claim a reference check
       would contradict, and the specific list is the more useful answer to a
       hiring manager anyway. */
    responsibilities: [
      'Frontend architecture for the officer-facing application',
      'Data flow optimisation across the case workflow panels',
      'Reusable component library shared by the assessment screens',
      'API integration against the Sails.js services',
      'Role-based UI rendering and route guards',
      'Performance work on rendering and network behaviour',
    ],
    decisions: [
      {
        problem:
          'Several panels on a single case screen each requested the same reference data independently, so opening one record produced the same lookup calls repeatedly.',
        decision:
          'Moved the reference lookups behind a shared RxJS stream with caching, so the panels subscribe to one in-flight request instead of issuing their own.',
        why:
          'The duplication was structural, not accidental: each panel was written to be self-sufficient. Caching at the data layer fixed every panel at once and left them independent.',
        tradeoff:
          'Cached reference data can go stale within a session, so the cache is invalidated on the workflow events that can change it rather than held for the lifetime of the page.',
        result: 'Approximately 40% lower API consumption on the case workflow screens.',
      },
    ],
    technologies: ['Angular', 'TypeScript', 'Sails.js', 'RxJS', 'Tailwind CSS'],
    featured: true,
    layout: 'large',
    filter: 'systems',
    cover: img(media('projects/fiji-immigration-internal/hero.png'), 'Fiji Immigration officer workflow dashboard', 1370, 769),
    gallery: [
      img(media('projects/fiji-immigration-internal/hero.png'), 'Fiji Immigration officer workflow list', 1370, 769)
    ],
    problem:
      'Immigration operations needed a centralized system where officers could assess applications, verify documents and move cases through complex workflows without losing context.',
    solution:
      'A workflow-driven Angular platform with role-based access control, structured case management, document verification, automated routing and operational reporting.',
    overview:
      'Enterprise immigration management platform for government officers handling applications, documents, assessments and workflow-driven case processing.',
    challenge:
      'Every application carries legal and operational importance, while multiple departments may interact with the same record at different stages of the process.',
    architecture:
      'Angular with standalone component architecture, RxJS for reactive data flows, Tailwind CSS for the interface layer and a Sails.js API, with role-based access integrated into routing and UI rendering.',
    features: [
      'Application assessment',
      'Document verification',
      'Case workflow management',
      'Role-based access control',
      'Automated case routing',
      'Operational reporting'
    ],
    results: [
      'API consumption reduced by approximately 40% through improved frontend data handling.',
      'Frontend performance improved by approximately 50% through optimized rendering and application workflows.',
      'Designed to support high-volume government workflows across multiple operational teams.'
    ],
    related: [
      {
        label: 'Angular performance optimization',
        href: '/services/angular-performance-optimization',
        note: 'The service this project is the evidence for.',
      },
      {
        label: 'The same request, five times',
        href: '/insights/rxjs-reduce-api-calls',
        note: 'The shared-stream decision above, written out with the code and the trade-off.',
      },
      {
        label: 'Angular Signals state management',
        href: '/insights/angular-signals-state-management',
        note: 'The state-precision argument the same work rests on.',
      },
      {
        label: 'Performance as a product requirement',
        href: '/insights/angular-performance-core-web-vitals',
        note: 'Why the 40% mattered operationally, not just as a number.',
      },
    ],
    seo: {
      title:
        'Fiji Immigration Internal Management System',
      description:
        'Enterprise Angular platform for Fiji immigration officers — application assessment, document verification, workflow automation and reporting.'
    }
  },

  {
    slug: 'fiji-immigration-external',
    number: '02',
    title: 'Fiji Immigration Citizen Portal',
    tagline: 'Visa and permit applications, without the queue.',
    category: 'Citizen Portal',
    year: '2024',
    role: 'Frontend Angular Developer',
    platform: ['Public Web'],
    stack: [
      { layer: 'Frontend', value: 'Angular' },
      { layer: 'State', value: 'RxJS' },
      { layer: 'Styling', value: 'Tailwind CSS' },
      { layer: 'API', value: 'Sails.js' },
    ],
    /* No measured outcome was ever captured for this deployment, and an
       invented conversion figure would be worth less than nothing here. What
       can be stated precisely is the shape of what was built. */
    metrics: [
      { value: '7', label: 'Citizen-facing workflows', note: 'Applications, guided forms, uploads, appointments, payments, tracking and responsive delivery.' },
      { value: 'Multi-step', label: 'Application journey', note: 'One guided flow carries an applicant from submission through documents, appointment and payment.' },
      { value: 'Public web', label: 'Delivery target', note: 'Built to stay usable for first-time applicants on mixed devices and slower networks.' },
    ],
    responsibilities: [
      'Frontend implementation of the guided application flows',
      'Document upload and validation interfaces',
      'Appointment scheduling and payment integration on the client side',
      'Responsive behaviour across phone, tablet and desktop',
      'Application status tracking views',
    ],
    decisions: [
      {
        problem:
          'A first-time applicant abandoning a long immigration form loses everything typed so far, and the form cannot be shortened — the questions are statutory.',
        decision:
          'Split the submission into a guided multi-step journey with per-step validation, so each step is short, correctable and complete before the next one opens.',
        why:
          'The length was not negotiable, but the cost of an error was. Validating at each step keeps a mistake local instead of surfacing it at the end.',
        tradeoff:
          'More screens to build and test than one long form, and the step state has to survive navigation.',
      },
    ],
    technologies: ['Angular', 'TypeScript', 'Sails.js', 'RxJS', 'Tailwind CSS'],
    featured: true,
    layout: 'medium',
    filter: 'web',
    cover: img(media('projects/fiji-immigration-external/hero.png'), 'Fiji Immigration citizen portal', 1366, 768),
    gallery: [
      img(media('projects/fiji-immigration-external/hero.png'), 'Fiji Immigration citizen portal welcome screen', 1366, 768)
    ],
    problem:
      'Applicants needed a way to submit and track immigration applications remotely without depending on physical office visits or assistance from a training desk.',
    solution:
      'A public-facing Angular portal designed around guided application flows, document uploads, appointment scheduling, payments and application tracking.',
    overview:
      'Citizen-facing immigration portal for visa and permit applications, document submission, appointments, payments and application status tracking.',
    challenge:
      'The experience had to remain understandable for first-time applicants while continuing to work reliably across different devices and slower network conditions.',
    architecture:
      'Angular and RxJS form the frontend foundation, with Tailwind CSS providing the responsive UI system and Sails.js supporting API communication and application workflows.',
    features: [
      'Online immigration applications',
      'Guided application forms',
      'Document uploads',
      'Appointment scheduling',
      'Payment integration',
      'Application tracking',
      'Responsive citizen experience'
    ],
    results: [
      'Reduced dependency on in-person application assistance.',
      'Created a self-service digital journey for immigration applicants.',
      'Unified application, document and tracking experiences into one citizen-facing portal.'
    ],
    related: [
      {
        label: 'Frontend architecture',
        href: '/services/frontend-architecture',
        note: 'Component architecture and data flow for public-facing platforms.',
      },
      {
        label: 'Forms that carry consequences',
        href: '/insights/accessible-angular-forms',
        note: 'The validation and error-recovery thinking behind the guided flow.',
      },
    ],
    seo: {
      title:
        'Fiji Immigration Citizen Portal',
      description:
        'Public Angular portal for Fiji immigration applications — guided forms, document uploads, appointments, payments and application tracking.'
    }
  },

  {
    slug: 'prims-member-portal',
    number: '03',
    title: 'PRIMS Member Portal',
    tagline: 'A pension account members can actually understand.',
    category: 'Pension Platform',
    year: '2023',
    role: 'Frontend Angular Developer',
    platform: ['Enterprise Web'],
    stack: [
      { layer: 'Frontend', value: 'Angular' },
      { layer: 'UI system', value: 'Angular Material' },
      { layer: 'State', value: 'RxJS' },
      { layer: 'API', value: 'Sails.js' },
    ],
    technologies: [
      'Angular',
      'TypeScript',
      'Sails.js',
      'RxJS',
      'Angular Material'
    ],
    metrics: [
      { value: '7', label: 'Member workflows', note: 'Dashboard, contributions, balances, transactions, statements, claims and beneficiaries.' },
      { value: 'Multi-stream', label: 'Account data', note: 'Contribution, balance, transaction and claim streams composed into one member view.' },
      { value: 'Enterprise web', label: 'Delivery target', note: 'Angular Material component system for consistency across the member screens.' },
    ],
    responsibilities: [
      'Member dashboard and account views in Angular',
      'Reactive composition of the contribution, balance and transaction streams',
      'Statement and claims workflow interfaces',
      'Angular Material component usage and interface consistency',
      'API integration against the Sails.js services',
    ],
    decisions: [
      {
        problem:
          'A pension member reads a balance once and acts on it. Dense financial tables are accurate and still leave the member calling the office to have them explained.',
        decision:
          'Led the member view with the few figures that answer the common questions, and kept the full transaction detail one level down rather than on the landing screen.',
        why:
          'The portal existed to reduce staff-assisted queries. Density on the first screen would have preserved exactly the calls it was meant to remove.',
        tradeoff:
          'A member who wants the full ledger takes one extra step to reach it.',
      },
    ],
    featured: true,
    layout: 'medium',
    filter: 'platforms',
    cover: img(media('projects/prims-member-portal/hero.png'), 'PRIMS pension member transactions', 1919, 911),
    gallery: [
      img(media('projects/prims-member-portal/hero.png'), 'PRIMS pension contribution and transaction history', 1919, 911)
    ],
    problem:
      'Members depended heavily on staff to understand contributions, balances, statements and pension-related information that should have been available through self-service.',
    solution:
      'A member-facing Angular portal that transformed pension information into clear dashboards, account views, transaction histories, statements and claims workflows.',
    overview:
      'Self-service pension platform allowing members to access contributions, balances, statements, claims and account information digitally.',
    challenge:
      'Financial information needs to be accurate and easy to understand. The interface had to prioritize clarity over information density while handling multiple account data streams.',
    architecture:
      'Angular with Angular Material for consistent enterprise UI components, RxJS for reactive account data streams and Sails.js APIs for backend communication.',
    features: [
      'Member dashboard',
      'Contribution history',
      'Pension balances',
      'Transaction history',
      'Statements',
      'Claims management',
      'Beneficiary information'
    ],
    results: [
      'Created a centralized self-service experience for pension members.',
      'Reduced dependency on manual staff assistance for common account information.',
      'Improved visibility into contributions, balances and pension transactions.'
    ],
    related: [
      {
        label: 'Angular engineering',
        href: '/services/angular-development',
        note: 'Enterprise Angular work of the kind this portal required.',
      },
      {
        label: 'Angular Signals state management',
        href: '/insights/angular-signals-state-management',
        note: 'The two pieces of PRIMS state that earned promotion, and why nothing else did.',
      },
      {
        label: 'Quiet interfaces age better',
        href: '/insights/enterprise-ui-design-restraint',
        note: 'The restraint argument behind leading with figures instead of tables.',
      },
    ],
    seo: {
      title:
        'PRIMS Pension Member Portal',
      description:
        'Self-service pension portal in Angular, Angular Material and RxJS — member contributions, balances, statements, claims and account details.'
    }
  },

  {
    slug: 'vnpf-blo-mi',
    number: '04',
    title: 'VNPF blo mi Member Mobile App',
    tagline: 'A provident fund in your pocket, across iOS and Android.',
    category: 'Mobile Application',
    year: '2023',
    role: 'Frontend Angular Developer',
    platform: ['iOS', 'Android'],
    stack: [
      { layer: 'App shell', value: 'Ionic + Angular' },
      { layer: 'Native bridge', value: 'Capacitor' },
      { layer: 'State', value: 'RxJS' },
      { layer: 'Language', value: 'TypeScript' },
    ],
    technologies: [
      'Ionic',
      'Angular',
      'TypeScript',
      'Capacitor',
      'RxJS'
    ],
    featured: true,
    layout: 'full',
    filter: 'web',
    cover: img(media('projects/vnpf-blo-mi/hero.png'), 'VNPF blo mi mobile application screens', 1200, 900),
    gallery: [
      img(media('projects/vnpf-blo-mi/hero.png'), 'VNPF blo mi mobile application screens', 1200, 900)
    ],
    problem:
      'VNPF members needed convenient mobile access to their provident fund information without relying on desktop portals or physical offices.',
    solution:
      'A cross-platform Ionic and Angular mobile application using Capacitor to provide native capabilities, secure authentication and a consistent experience across iOS and Android.',
    overview:
      'Mobile provident fund application providing members with access to balances, contributions, loans and account information from their phones.',
    challenge:
      'The application needed to combine financial information, mobile usability and native device capabilities while maintaining a consistent experience across two operating systems.',
    architecture:
      'Ionic and Angular provide the application foundation, Capacitor bridges native device capabilities and RxJS manages asynchronous application and account data flows.',
    features: [
      'Member dashboard',
      'Account balances',
      'Contribution history',
      'Loan information',
      'Biometric authentication',
      'Native device integration',
      'Cross-platform mobile experience'
    ],
    results: [
      'Delivered a unified mobile experience for iOS and Android.',
      'Brought provident fund information closer to members through mobile self-service.',
      'Integrated native mobile capabilities through Capacitor.'
    ],
    seo: {
      title:
        'VNPF blo mi Member Mobile App',
      description:
        'Cross-platform provident fund app built with Ionic, Angular and Capacitor — balances, contributions, loans and secure mobile access.'
    }
  },

  {
    slug: 'insuremet',
    number: '05',
    title: 'InsureMet',
    tagline: 'Policies, claims and finance for an insurer, in one console.',
    category: 'Enterprise Platform',
    year: '2025',
    role: 'Frontend Angular Developer',
    platform: ['Enterprise Web'],
    stack: [
      { layer: 'Frontend', value: 'Angular (modular architecture)' },
      { layer: 'State', value: 'RxJS' },
      { layer: 'Data views', value: 'Structured tables & dashboards' },
      { layer: 'Styling', value: 'Tailwind CSS' },
    ],
    technologies: [
      'Angular',
      'TypeScript',
      'RxJS',
      'Chart Libraries',
      'Tailwind CSS'
    ],
    featured: true,
    layout: 'large',
    filter: 'platforms',
    cover: img(media('projects/insuremet/hero.png'), 'InsureMet insurance administration dashboard', 1366, 768),
    gallery: [
      img(media('projects/insuremet/hero.png'), 'InsureMet enterprise dashboard', 1366, 768)
    ],
    problem:
      'Insurance operations were distributed across different processes and systems, making it harder for teams to manage policies, claims, products and financial information from one place.',
    solution:
      'A centralized Angular administration console bringing core insurance operations into a structured modular experience with dashboards, data tables and department-specific workflows.',
    overview:
      'Enterprise insurance administration platform supporting products, policies, claims, finance and operational dashboards.',
    challenge:
      'Different departments required different workflows while still depending on shared business data and consistent enterprise UI patterns.',
    architecture:
      'Angular-based modular frontend architecture with reusable components, reactive RxJS data flows, structured data tables and dashboard visualizations.',
    features: [
      'Insurance products',
      'Policy management',
      'Claims management',
      'Finance module',
      'Operational dashboard',
      'Data tables',
      'Reporting visualizations'
    ],
    results: [
      'Unified multiple insurance operations into a centralized administration experience.',
      'Created reusable frontend patterns across department-specific modules.',
      'Improved visibility of operational information through dashboards and structured data views.'
    ],
    seo: {
      title:
        'InsureMet Insurance Administration',
      description:
        'Angular insurance administration platform bringing products, policies, claims, finance and reporting dashboards into one modular console.'
    }
  },

  {
    slug: 'galaxy-sofas',
    number: '06',
    title: 'Galaxy Sofas',
    tagline: 'A furniture storefront designed to make choosing a sofa feel simple.',
    category: 'E-Commerce',
    year: '2026',
    role: 'Frontend Angular Developer',
    platform: ['Web'],
    stack: [
      { layer: 'Frontend', value: 'Angular (standalone components)' },
      { layer: 'Rendering', value: 'Server-side rendering' },
      { layer: 'State', value: 'RxJS' },
      { layer: 'Styling', value: 'Tailwind CSS' },
    ],
    technologies: [
      'Angular',
      'TypeScript',
      'SSR',
      'Tailwind CSS',
      'RxJS'
    ],
    featured: true,
    layout: 'large',
    filter: 'marketplaces',
    cover: img(media('projects/galaxy-sofas/gallery-02.webp'), 'Galaxy Sofas landing page showcase', 1905, 941),
    gallery: [
      img(media('projects/galaxy-sofas/gallery-01.webp'), 'Galaxy Sofas responsive home layout', 1905, 946),
      img(media('projects/galaxy-sofas/gallery-02.webp'), 'Galaxy Sofas landing page showcase', 1905, 941),
      img(media('projects/galaxy-sofas/gallery-03.webp'), 'Galaxy Sofas product grid and filter navigation', 1905, 943),
      img(media('projects/galaxy-sofas/gallery-04.webp'), 'Galaxy Sofas interactive product details sheet', 1905, 945),
      img(media('projects/galaxy-sofas/gallery-05.webp'), 'Galaxy Sofas seamless shopping cart flow', 1904, 944),
      img(media('projects/galaxy-sofas/gallery-06.webp'), 'Galaxy Sofas modular custom sofa configurator interface', 1904, 940),
      img(media('projects/galaxy-sofas/gallery-07.webp'), 'Galaxy Sofas content-driven about and brand values section', 1904, 945),
    ],
    problem:
      'A furniture business needed a modern digital storefront that could showcase products clearly while remaining fast, responsive and search-engine friendly.',
    solution:
      'A modern Angular storefront focused on product discovery, responsive layouts, SEO, server-side rendering and a premium furniture shopping experience.',
    overview:
      'SEO-focused furniture e-commerce experience featuring sofa collections, chairs, bedroom accessories and product discovery journeys.',
    challenge:
      'Furniture is highly visual, so the experience needed to balance large product imagery with fast loading, responsive layouts and search-friendly content.',
    architecture:
      'Angular with server-side rendering, reusable standalone components, responsive Tailwind CSS layouts and structured product content designed for SEO and performance.',
    features: [
      'Furniture catalog',
      'Product discovery',
      'Sofa collections',
      'Chair collections',
      'Bedroom accessories',
      'Responsive design',
      'SEO optimization',
      'Server-side rendering'
    ],
    results: [
      'Created a modern digital storefront for a local furniture business.',
      'Structured product content for improved search visibility.',
      'Built a responsive experience optimized for desktop and mobile users.'
    ],
    seo: {
      title:
        'Galaxy Sofas — Angular SSR Storefront',
      description:
        'Angular SSR furniture storefront — sofa collections, chairs and bedroom accessories with responsive design and a performance-focused frontend.'
    }
  },

  {
    slug: 'zellavora-ai-resume-builder',
    number: '07',
    title: 'Zellavora AI Resume Builder',
    tagline: 'Guided input in. ATS-friendly resume out.',
    category: 'AI Product',
    year: '2026',
    role: 'Founder & Frontend Engineer',
    platform: ['Web'],
    stack: [
      { layer: 'Frontend', value: 'Angular (standalone components)' },
      { layer: 'Reactivity', value: 'Signals / Zoneless' },
      { layer: 'Styling', value: 'Tailwind CSS' },
      { layer: 'AI', value: 'Assisted content generation' },
    ],
    technologies: [
      'Angular',
      'TypeScript',
      'Signals',
      'Zoneless Angular',
      'Tailwind CSS',
      'AI Integration'
    ],
    featured: true,
    layout: 'medium',
    filter: 'web',
    gallery: [],
    problem:
      'Traditional resume builders either start users with a blank page or lock them into rigid templates without helping them structure their experience effectively.',
    solution:
      'An AI-assisted resume builder that guides users through structured input, generates professional content, provides a live editing experience and exports an ATS-friendly resume.',
    overview:
      'AI-powered resume creation platform combining guided data entry, AI content generation, live resume editing, templates and PDF export.',
    challenge:
      'The product needed to feel simple for first-time users while supporting complex resume editing, real-time preview updates and structured professional content.',
    architecture:
      'Modern Angular architecture using standalone components, Signals and Zoneless patterns with Tailwind CSS for the UI system and AI services for assisted content generation.',
    features: [
      'Guided resume creation',
      'AI content generation',
      'Live resume preview',
      'Inline editing',
      'Resume templates',
      'ATS-friendly structure',
      'PDF export',
      'Real-time updates'
    ],
    results: [
      'Created an end-to-end AI-assisted resume creation workflow.',
      'Combined structured form input with live visual editing.',
      'Built a modern Angular architecture around Signals and Zoneless application patterns.'
    ],
    seo: {
      title:
        'Zellavora AI Resume Builder',
      description:
        'AI resume builder in modern Angular with Signals and zoneless patterns — guided input, live editing, ATS-friendly output and PDF export.'
    }
  },

  {
    slug: 'zellavora-control-center',
    number: '08',
    title: 'Zellavora Control Center',
    tagline: 'One control plane for products, projects and operations.',
    category: 'SaaS Admin Platform',
    year: '2026',
    role: 'Founder & Full-Stack Engineer',
    platform: ['Enterprise Web'],
    stack: [
      { layer: 'Frontend', value: 'Angular 22 — Signals, Zoneless' },
      { layer: 'Styling', value: 'Tailwind CSS' },
      { layer: 'API', value: 'NestJS' },
      { layer: 'Database', value: 'PostgreSQL + Prisma' },
      { layer: 'Storage', value: 'Supabase Storage' },
    ],
    technologies: [
      'Angular',
      'TypeScript',
      'Signals',
      'Zoneless Angular',
      'Tailwind CSS',
      'NestJS',
      'PostgreSQL',
      'Prisma',
      'Supabase'
    ],
    featured: true,
    layout: 'large',
    filter: 'dashboards',
    gallery: [],
    problem:
      'Multiple products and applications need a common operational layer for managing content, users, permissions, projects, configuration and system activity.',
    solution:
      'A centralized control platform designed to manage multiple Zellavora products and applications through one secure administration environment and API-driven content architecture.',
    overview:
      'Centralized SaaS administration platform for managing products, projects, users, roles, permissions, content, configuration and operational activity.',
    challenge:
      'The platform needs to support multiple applications while keeping permissions, data ownership, auditability and API contracts consistent across the ecosystem.',
    architecture:
      'Angular 22 with standalone components, Signals and Zoneless architecture on the frontend, Tailwind CSS for the design system, NestJS APIs, PostgreSQL with Prisma and Supabase Storage for managed assets.',
    features: [
      'Centralized dashboard',
      'User management',
      'Role management',
      'Permission management',
      'Content management',
      'Project management',
      'System configuration',
      'Audit logs',
      'Activity monitoring',
      'API-driven application content'
    ],
    results: [
      'Established a centralized operational architecture for multiple applications.',
      'Separated administration and content management from consuming applications.',
      'Created a scalable foundation for future Zellavora products and services.'
    ],
    seo: {
      title:
        'Zellavora Control Center — Angular SaaS',
      description:
        'Angular SaaS control platform for products, projects, users, roles, permissions, content and configuration across a multi-app ecosystem.'
    }
  },

  {
    slug: 'ui-component-architecture',
    number: '09',
    title: 'Enterprise UI Component Architecture',
    tagline: 'Build once. Reuse everywhere.',
    category: 'Design System',
    year: '2026',
    role: 'Frontend Architect & Angular Developer',
    platform: ['Angular applications'],
    stack: [
      { layer: 'Components', value: 'Standalone Angular components' },
      { layer: 'Reactivity', value: 'Signals' },
      { layer: 'Primitives', value: 'Angular CDK' },
      { layer: 'Styling', value: 'Tailwind CSS design tokens' },
    ],
    technologies: [
      'Angular',
      'TypeScript',
      'Signals',
      'Standalone Components',
      'Tailwind CSS',
      'Angular CDK'
    ],
    featured: true,
    layout: 'medium',
    filter: 'systems',
    gallery: [],
    problem:
      'Large applications often develop duplicated UI patterns, inconsistent interactions and difficult-to-maintain components as multiple teams build features independently.',
    solution:
      'A reusable Angular component architecture focused on consistency, composability, accessibility, scalable APIs and predictable design patterns across enterprise applications.',
    overview:
      'Reusable Angular UI architecture designed to provide a shared foundation for forms, inputs, layouts, tables, dialogs, navigation and other enterprise application patterns.',
    challenge:
      'Reusable components must remain flexible enough for different business requirements without becoming overly complex or tightly coupled to individual applications.',
    architecture:
      'Standalone Angular components with reusable APIs, Signals for reactive state, Angular CDK capabilities where required and Tailwind CSS for consistent design tokens and styling patterns.',
    features: [
      'Reusable Angular components',
      'Form controls',
      'Input components',
      'Buttons and actions',
      'Tables and data views',
      'Dialogs and overlays',
      'Layout components',
      'Navigation patterns',
      'Design tokens',
      'Accessibility patterns'
    ],
    results: [
      'Created reusable UI foundations for enterprise Angular applications.',
      'Reduced duplication by standardizing frequently used interface patterns.',
      'Established a scalable approach for maintaining consistent application experiences.'
    ],
    seo: {
      title:
        'Angular UI Component Architecture',
      description:
        'Reusable Angular UI component architecture with standalone components, Signals, Tailwind CSS and CDK patterns for enterprise interfaces.'
    }
  }
];
export function getProject(slug: string) { return projects.find((p) => p.slug === slug); }
export function getNextProject(slug: string) { const n = projects.findIndex((p) => p.slug === slug); if (n === -1) return undefined; return projects[(n + 1) % projects.length]; }
export function getPreviousProject(slug: string) {
  const n = projects.findIndex((p) => p.slug === slug);
  if (n === -1) return undefined;
  return projects[(n - 1 + projects.length) % projects.length];
}

/**
 * Case studies worth reading next to this one, most related first.
 *
 * Relatedness is scored from the project record itself rather than a
 * hand-maintained list, so adding a project cannot leave a stale cross-link
 * behind: sharing the `filter` bucket is the strongest signal, then each
 * shared technology, then the same category. Selection is by `slug`, never by
 * array position, so the ordering of `projects` is free to change.
 */
export function relatedProjects(slug: string, limit = 3): Project[] {
  const current = getProject(slug);
  if (!current) return [];
  const tech = new Set(current.technologies.map((t) => t.toLowerCase()));
  return projects
    .filter((p) => p.slug !== current.slug)
    .map((p) => {
      let score = 0;
      if (p.filter === current.filter) score += 4;
      if (p.category === current.category) score += 2;
      score += p.technologies.filter((t) => tech.has(t.toLowerCase())).length;
      return { p, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.p.number.localeCompare(b.p.number))
    .slice(0, limit)
    .map((entry) => entry.p);
}

/**
 * Gallery frames that are not already shown as the cover. Several projects
 * ship a single gallery image identical to `cover`, which rendered the same
 * screenshot twice on the case study page.
 */
export function galleryFrames(project: Project) {
  return project.gallery.filter((frame) => frame.src !== project.cover?.src);
}

/**
 * Human labels for the filter buckets. This is the ONE place a bucket is
 * named — the work section, the work page explorer and any future surface all
 * read it from here, so a renamed category cannot disagree with itself.
 */
export const FILTER_LABEL: Record<ProjectFilter, string> = {
  web: 'Web Applications',
  dashboards: 'Dashboards',
  platforms: 'Platforms',
  marketplaces: 'Marketplaces',
  systems: 'Systems',
};

export interface FilterOption {
  id: ProjectFilter | 'all';
  label: string;
  count: number;
}

/**
 * The filter row, generated from the project records.
 *
 * Buckets with no projects never appear, and every count is `projects.length`
 * arithmetic rather than a maintained number — so a filter can never advertise
 * results it cannot show, and the counts can never drift from the catalogue.
 */
export function projectFilters(source: Project[] = projects): FilterOption[] {
  const order: ProjectFilter[] = ['web', 'dashboards', 'platforms', 'marketplaces', 'systems'];
  const present = order.filter((id) => source.some((p) => p.filter === id));
  return [
    { id: 'all', label: 'All', count: source.length },
    ...present.map((id) => ({
      id,
      label: FILTER_LABEL[id],
      count: source.filter((p) => p.filter === id).length,
    })),
  ];
}
