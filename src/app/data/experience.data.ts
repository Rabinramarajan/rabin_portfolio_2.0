import { ExperienceRole } from '../core/models/experience.model';

export const EXPERIENCE: ExperienceRole[] = [
  {
    id: 'rstack',
    company: 'RSTACK Solutions',
    role: 'Frontend Angular Consultant',
    employmentType: 'Contract',
    period: '2026 — Present',
    location: 'Chennai, India',
    description:
      'Developing enterprise healthcare applications using Angular 22, TypeScript, SCSS and Angular Signals.',
    highlights: [
      'Building reusable, scalable UI components with standalone component patterns.',
      'Integrating REST APIs with secure JWT authentication and lazy-loaded routes.',
      'Reviewing code and mentoring junior developers.',
    ],
    technologies: ['Angular 22', 'TypeScript', 'Signals', 'SCSS', 'RxJS'],
  },
  {
    id: 'itgalax',
    company: 'ITGalax Solutions',
    role: 'Frontend Angular Developer',
    employmentType: 'Full time',
    period: '2022 — 2026',
    location: 'Chennai, India',
    description:
      'Engineered government portals and pension platforms serving 10,000+ active users across three countries.',
    highlights: [
      'Reduced API consumption by ~40% and improved frontend performance by ~50% with shared RxJS streams.',
      'Delivered iOS and Android apps with biometric auth and offline support from one Angular + Ionic codebase.',
      'Led adoption of Angular Signals and standalone components across teams.',
    ],
    technologies: ['Angular', 'TypeScript', 'RxJS', 'Ionic', 'Capacitor', 'Tailwind CSS'],
  },
];
