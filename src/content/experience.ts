import type { ExperienceRole } from '@/content/types';

export const experience: ExperienceRole[] = [
  { id: 'rstack', company: 'RSTACK Solutions Private Limited', role: 'Frontend Developer Consultant', type: 'Contract', start: '2026', end: null, location: 'Remote', description: 'Designing and developing an interactive front-end interface and experience for a web-based analytics application using modern frontend technologies.', responsibilities: ['Integrating REST APIs with AI/ML models to generate predictions and power intelligent decision-making.', 'Delivering production-grade work on a structured schedule with milestone-based timesheets and code reviews.'], impact: [], technologies: ['Angular', 'TypeScript', 'RxJS', 'REST APIs', 'AI/ML integration'] },
  { id: 'zellavora', company: 'Zellavora', role: 'Frontend Angular Developer', type: 'Freelance', start: '2026', end: null, location: 'Chennai, India', description: 'Ship production-grade SPAs and hybrid mobile apps across multiple client projects using Angular, TypeScript, Ionic and REST APIs.', responsibilities: ['Build reusable component libraries and scalable architecture enabling faster delivery.', 'Optimize performance through Angular Signals, lazy loading and smart API integration patterns.'], impact: [], technologies: ['Angular', 'Signals', 'TypeScript', 'Ionic', 'REST APIs'] },
  { id: 'itgalax', company: 'ITGalax Solutions Pvt Ltd', role: 'Frontend Angular Developer', type: 'Full time', start: '2022', end: '2026', location: 'Chennai, India', description: 'Engineered government portals and pension management platforms serving 10,000+ active users across three countries.', responsibilities: ['Delivered cross-platform mobile apps (iOS/Android) with biometric auth, offline capabilities and enterprise-grade architecture.', 'Led adoption of Angular Signals and standalone components across teams.'], impact: ['Reduced API consumption by 40% and improved performance by 50% through frontend optimization and RxJS stream patterns.'], technologies: ['Angular', 'TypeScript', 'RxJS', 'Ionic', 'Capacitor', 'Sails.js', 'Tailwind CSS'] },
];

export function formatRoleDates(role: ExperienceRole) {
  const end = role.end ?? 'Present';
  return role.start + ' — ' + end;
}
