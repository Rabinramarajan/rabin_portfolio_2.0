import type { AboutContent } from '@/content/types';
import { credentials } from '@/content/profile';

/**
 * About content
 * NOTE: Years experience (4+) is calculated from experience.ts
 * Components should import calculateExperienceYears() to get dynamic value
 */
export const about: AboutContent = {
  label: 'About',
  heading: 'I build digital experiences that are fast, scalable and built to last.',
  // `*…*` marks the accented runs — see TextReveal.
  headingLines: ['I build digital experiences', 'that are *fast, scalable* and', '*built to last.*'],
  positioning: 'Engineering digital products that are fast, scalable, accessible and thoughtfully designed.',
  paragraphs: [
    'I am Rabin R, a Frontend Angular Consultant with 4+ years of experience building high-performance web and mobile applications. I specialize in Angular (Zoneless + Signals), clean architecture, and creating seamless user experiences.',
    'I help startups and enterprises turn ideas into scalable products with modern, maintainable and future-ready code.',
    'From high-consequence government case management to modern AI-driven analytics dashboards, I care deeply about the details users feel — speed, clarity, accessibility, fluid interaction, long-term scalability, and pixel precision.',
  ],
  philosophy: 'Code is not just what I write,',
  philosophyLines: ["it's how I solve problems and ", 'create impact.'],
  industries: [
    'Government case management',
    'Pension and member portals',
    'Insurance administration',
    'Hybrid mobile (iOS / Android)',
    'AI-assisted product interfaces',
  ],
  workingStyle:
    'Embedded, senior, and accountable for the frontend. I prefer a clear architecture, a tight feedback loop, and shipping work that still makes sense a year later.',
  principles: [
    { id: 'precision', title: 'Precision', body: 'Every spacing value, interaction pattern, and component hierarchy should have a clear architectural reason.' },
    { id: 'performance', title: 'Performance', body: 'Interfaces should feel immediate — measured against Core Web Vitals, not just visual polish.' },
    { id: 'accessibility', title: 'Accessibility', body: 'Products have to work for the people who use them, including keyboard, screen readers and varied devices.' },
    { id: 'scalability', title: 'Scalability', body: 'Architecture should still make sense after the third release, not only the first demo.' },
  ],
  milestones: [
    { year: '2021', title: 'B.Sc. IT Graduate', body: 'Core computer science and web technology foundations.' },
    { year: '2023', title: 'Frontend Developer', body: 'PRIMS Pension Portal and VNPF Ionic cross-platform mobile apps.' },
    { year: '2024', title: 'Senior Angular Engineer', body: 'Fiji Government Immigration Platforms serving 10,000+ users.' },
    { year: '2026', title: 'Frontend Developer Consultant', body: 'RSTACK Solutions — interactive frontend for a web-based analytics application, integrating REST APIs with AI/ML models.' },
  ],
  // Values come from `credentials` in profile.ts — the one canonical source.
  // Only the per-section wording (label/note/icon) lives here.
  metrics: [
    { value: credentials.years, label: 'Years Experience', icon: 'experience', note: 'Building modern web applications' },
    { value: credentials.projects, label: 'Projects Completed', icon: 'projects', note: 'From ideas to successful products' },
    { value: credentials.commitment.value, label: credentials.commitment.label, icon: 'commitment', note: 'Committed to quality and excellence' },
    { value: credentials.clients, label: 'Happy Clients', icon: 'clients', note: 'Startups, agencies and enterprises' },
  ],
  // Composed treatment: the cut-out portrait ships with its own glow rings,
  // monogram badge and signature, so the section renders it as a single layer.
  portrait: { src: '/media/about/about-portrait.webp', alt: 'Rabin R, Frontend Angular Consultant', width: 1100, height: 1202 },
  hero: {
    headline: ['THE ENGINEER', 'BEHIND THE', 'INTERFACE.'],
    statement:
      'I am Rabin R, a Senior Frontend Engineer who treats the interface as seriously as the architecture — building fast, scalable, accessible products for government and enterprise clients.',
  },
  capabilities: [
    { number: '01', title: 'Product Interfaces', description: 'Interfaces that are pixel-precise, accessible, and measured against how they feel in real hands — not just how they look in a mockup.' },
    { number: '02', title: 'Enterprise Applications', description: 'High-consequence platforms — immigration case management, pension portals — that thousands of people depend on every working day.' },
    { number: '03', title: 'Mobile Experiences', description: 'iOS and Android from one Angular + Ionic codebase, with biometrics, offline behaviour and store releases.' },
    { number: '04', title: 'Design Systems', description: 'Token-driven component systems that keep a product coherent across teams, screens and the third release.' },
  ],
  quote: ["THE BEST INTERFACES", "DON'T ASK FOR ATTENTION.", "THEY JUST WORK."],
  cta: { headline: ["LET'S BUILD", 'SOMETHING WORTH', 'SHIPPING.'], label: 'Start a Conversation', href: '/contact' },
  whatIDo: [
    { title: 'Build', body: 'I build responsive, accessible and high-performance applications.' },
    { title: 'Optimize', body: 'I optimize for performance, scalability and best practices.' },
    { title: 'Deliver', body: 'I deliver products that create real business impact.' },
  ],
  tools: [
    { id: 'angular', label: 'Angular' },
    { id: 'typescript', label: 'TypeScript' },
    { id: 'rxjs', label: 'RxJS' },
    { id: 'tailwind', label: 'Tailwind CSS' },
    { id: 'nx', label: 'Nx' },
    { id: 'node', label: 'Node.js' },
    { id: 'postgres', label: 'PostgreSQL' },
    { id: 'supabase', label: 'Supabase' },
    { id: 'git', label: 'Git' },
  ],
  values: [
    { title: 'User First', body: 'I design and build with empathy for real users.' },
    { title: 'Clean Code', body: 'I write clean, maintainable and testable code.' },
    { title: 'Continuous Growth', body: 'I learn, adapt and improve every single day.' },
    { title: 'Collaboration', body: 'I believe great products are built together.' },
    { title: 'Ownership', body: 'I take full ownership and deliver with commitment.' },
  ],
  highlights: [
    'Passionate about solving complex problems with simple and elegant solutions.',
    'Focused on performance, accessibility and pixel-perfect implementation.',
    'Constantly learning, exploring and turning ideas into real-world products.',
  ],
};
