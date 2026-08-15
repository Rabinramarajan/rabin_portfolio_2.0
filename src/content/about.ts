import type { AboutContent } from '@/content/types';

/**
 * About content
 * NOTE: Years experience (4+) is calculated from experience.ts
 * Components should import calculateExperienceYears() to get dynamic value
 */
export const about: AboutContent = {
  label: 'About',
  heading: 'I take the interface as seriously as the architecture.',
  headingLines: ['I take the interface', 'as seriously as the architecture.'],
  positioning: 'Engineering digital products that are fast, scalable, accessible and thoughtfully designed.',
  paragraphs: [
    'I am Rabin R, a Senior Frontend Engineer with 4+ years of experience engineering critical web and mobile systems for government and enterprise clients — including immigration platforms for Fiji and pension portals serving thousands of active users.',
    'I work at the intersection of interface design and frontend architecture. My focus is building digital products that are visually precise, technically sound, and designed for maximum performance under real-world conditions.',
    'From high-consequence government case management to modern AI-driven analytics dashboards, I care deeply about the details users feel — speed, clarity, accessibility, fluid interaction, long-term scalability, and pixel precision.',
  ],
  philosophy: 'Good frontend engineering is not just about making interfaces work. It is about making complexity feel simple.',
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
    { year: '2026', title: 'AI and Frontend Consultant', body: 'Applied AI/ML (IIT Patna) and Senior Angular Architecture Consultant.' },
  ],
  metrics: [
    { value: '4+', label: 'Years experience' }, // CALCULATED from experience.ts
    { value: '10K+', label: 'Users served' },
    { value: '3', label: 'Countries served' },
    { value: '100+', label: 'UI components built' },
  ],
  portrait: { src: '/media/working/about-portrait-900.webp', alt: 'Rabin at his desk, with an editor and an analytics dashboard on the monitors behind him', width: 900, height: 1125 },
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
};
