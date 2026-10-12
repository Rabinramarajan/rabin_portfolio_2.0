import { Project } from '../core/models/project.model';

export const PROJECTS: Project[] = [
  {
    id: 'fiji-immigration-internal',
    title: 'Fiji Immigration Internal Management System',
    description:
      'Enterprise immigration platform for government officers handling applications, documents, assessments and workflow-driven case processing.',
    imageUrl: '/images/projects/fiji-internal.webp',
    imageAlt: 'Fiji Immigration officer workflow dashboard',
    technologies: ['Angular', 'TypeScript', 'RxJS', 'Sails.js', 'Tailwind CSS'],
    category: 'Government',
    year: '2024',
    featured: true,
  },
  {
    id: 'fiji-immigration-external',
    title: 'Fiji Immigration Citizen Portal',
    description:
      'Citizen-facing portal for visa and permit applications, document submission, appointments, payments and status tracking.',
    imageUrl: '/images/projects/fiji-external.webp',
    imageAlt: 'Fiji Immigration citizen portal home screen',
    technologies: ['Angular', 'TypeScript', 'RxJS', 'Sails.js', 'Tailwind CSS'],
    category: 'Government',
    year: '2024',
    featured: true,
  },
  {
    id: 'galaxy-sofas',
    title: 'Galaxy Sofas',
    description:
      'SEO-focused furniture e-commerce experience featuring sofa collections, chairs, bedroom accessories and product discovery journeys.',
    imageUrl: '/images/projects/galaxy-sofas.webp',
    imageAlt: 'Galaxy Sofas landing page',
    technologies: ['Angular', 'TypeScript', 'SCSS'],
    category: 'Product',
    year: '2026',
    featured: true,
  },
  {
    id: 'prims-member-portal',
    title: 'PRIMS Member Portal',
    description:
      'Self-service pension platform giving members digital access to contributions, balances, statements and claims.',
    technologies: ['Angular', 'TypeScript', 'RxJS'],
    category: 'Enterprise',
    year: '2023',
    featured: false,
  },
  {
    id: 'vnpf-blo-mi',
    title: 'VNPF blo mi Member App',
    description:
      'Provident fund mobile app for iOS and Android with balances, contributions, loans, biometric login and offline support.',
    technologies: ['Ionic', 'Angular', 'Capacitor'],
    category: 'Mobile',
    year: '2023',
    featured: false,
  },
  {
    id: 'insuremet',
    title: 'InsureMet',
    description:
      'Insurance administration platform covering products, policies, claims, finance and operational dashboards.',
    technologies: ['Angular', 'TypeScript', 'RxJS'],
    category: 'Enterprise',
    year: '2025',
    featured: false,
  },
  {
    id: 'zellavora-ai-resume-builder',
    title: 'Zellavora AI Resume Builder',
    description:
      'AI resume platform combining guided data entry, AI content generation, live editing, templates and PDF export.',
    technologies: ['Angular', 'TypeScript', 'Signals'],
    category: 'Product',
    year: '2026',
    featured: false,
  },
  {
    id: 'zellavora-control-center',
    title: 'Zellavora Control Center',
    description:
      'SaaS administration platform for managing products, users, roles, permissions, content and configuration.',
    technologies: ['Angular', 'TypeScript', 'Signals'],
    category: 'Product',
    year: '2026',
    featured: false,
  },
  {
    id: 'ui-component-architecture',
    title: 'Enterprise UI Component Architecture',
    description:
      'Reusable Angular UI foundation for forms, inputs, layouts, tables, dialogs and navigation across enterprise apps.',
    technologies: ['Angular', 'TypeScript', 'SCSS'],
    category: 'Enterprise',
    year: '2026',
    featured: false,
  },
];
