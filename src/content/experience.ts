import type {
  CapabilityStep,
  CareerMilestone,
  EngineeringMapBranch,
  ExperienceRole,
  StackTrack,
} from '@/content/types';

/**
 * SINGLE SOURCE OF TRUTH for the Experience page.
 *
 * Every value below is drawn from the verified career record. Nothing here is
 * inferred, rounded up, or filled in for narrative convenience — the `source`
 * and `evidence` fields exist so each claim can be traced back to the role it
 * came from. Components must read from this file rather than restating career
 * content inside JSX.
 */

export const experience: ExperienceRole[] = [
  {
    id: 'rstack',
    company: 'RSTACK Solutions Private Limited',
    role: 'Frontend Developer Consultant',
    type: 'Contract',
    start: '2026',
    end: null,
    location: 'Remote',
    description:
      'Designing and developing an interactive front-end interface and experience for a web-based analytics application using modern frontend technologies.',
    responsibilities: [
      'Integrating REST APIs with AI/ML models to generate predictions and power intelligent decision-making.',
      'Delivering production-grade work on a structured schedule with milestone-based timesheets and code reviews.',
    ],
    impact: [],
    technologies: ['Angular', 'TypeScript', 'RxJS', 'REST APIs', 'AI/ML integration'],
    milestone: 'Applied AI',
    chapter: 'EXTEND',
    visual: 'ecosystem',
  },
  {
    id: 'zellavora',
    company: 'Zellavora',
    role: 'Frontend Angular Developer',
    type: 'Freelance',
    start: '2026',
    end: null,
    location: 'Chennai, India',
    description:
      'Ship production-grade SPAs and hybrid mobile apps across multiple client projects using Angular, TypeScript, Ionic and REST APIs.',
    responsibilities: [
      'Build reusable component libraries and scalable architecture enabling faster delivery.',
      'Optimize performance through Angular Signals, lazy loading and smart API integration patterns.',
    ],
    impact: [],
    technologies: ['Angular', 'Signals', 'TypeScript', 'Ionic', 'REST APIs'],
    milestone: 'Consulting',
    chapter: 'CONSULT',
    visual: 'projects',
  },
  {
    id: 'itgalax',
    company: 'ITGalax Solutions Pvt Ltd',
    role: 'Frontend Angular Developer',
    type: 'Full time',
    start: '2022',
    end: '2026',
    location: 'Chennai, India',
    description:
      'Engineered government portals and pension management platforms serving 10,000+ active users across three countries.',
    responsibilities: [
      'Delivered cross-platform mobile apps (iOS/Android) with biometric auth, offline capabilities and enterprise-grade architecture.',
      'Led adoption of Angular Signals and standalone components across teams.',
    ],
    impact: [
      'Reduced API consumption by 40% and improved performance by 50% through frontend optimization and RxJS stream patterns.',
    ],
    technologies: ['Angular', 'TypeScript', 'RxJS', 'Ionic', 'Capacitor', 'Sails.js', 'Tailwind CSS'],
    milestone: 'Deeper engineering',
    chapter: 'BUILD',
    visual: 'enterprise',
  },
];

/** Narrative marker that opens the career timeline — the foundation before the first role. */
export const careerLead = {
  label: 'The beginning',
  chapter: 'BEGIN' as const,
  year: '2021',
  note: 'B.Sc IT — core computer science and web foundations.',
  visual: 'foundation' as const,
} as const;

/** Chronological career timeline (source is reverse-chronological). */
export function getCareerTimeline(): ExperienceRole[] {
  return [...experience].reverse();
}

export function formatRoleDates(role: ExperienceRole) {
  const end = role.end ?? 'Present';
  return role.start + ' — ' + end;
}

/**
 * Every engagement currently in progress. Two run concurrently as of 2026,
 * so the current chapter shows both rather than picking one and implying the
 * other has ended.
 */
export function getCurrentRoles(): ExperienceRole[] {
  const live = experience.filter((r) => r.end === null);
  return live.length ? live : [experience[0]];
}

/* ------------------------------------------------------------------
   THE STACK EVOLVED
   Each track enters at the first year it is verifiably in the record.
   `source` is the role id that evidences it — or `foundation` for the
   B.Sc IT years, or `toolkit` for the current working stack declared in
   the skills profile rather than in a client engagement.
------------------------------------------------------------------ */
export const stackEvolution: StackTrack[] = [
  { id: 'html', label: 'HTML5 / CSS3', enteredAt: '2021', source: 'foundation', active: true },
  { id: 'javascript', label: 'JavaScript', enteredAt: '2021', source: 'foundation', active: true },
  { id: 'angular', label: 'Angular', enteredAt: '2022', source: 'itgalax', active: true },
  { id: 'typescript', label: 'TypeScript', enteredAt: '2022', source: 'itgalax', active: true },
  { id: 'rxjs', label: 'RxJS', enteredAt: '2022', source: 'itgalax', active: true },
  { id: 'rest', label: 'REST APIs', enteredAt: '2022', source: 'itgalax', active: true },
  { id: 'ionic', label: 'Ionic / Capacitor', enteredAt: '2022', source: 'itgalax', active: true },
  { id: 'sails', label: 'Sails.js', enteredAt: '2022', source: 'itgalax', active: false },
  { id: 'tailwind', label: 'Tailwind CSS', enteredAt: '2022', source: 'itgalax', active: true },
  { id: 'signals', label: 'Angular Signals', enteredAt: '2026', source: 'zellavora', active: true },
  { id: 'react', label: 'React / Next.js', enteredAt: '2026', source: 'toolkit', active: true },
  { id: 'aiml', label: 'AI/ML integration', enteredAt: '2026', source: 'rstack', active: true },
];

/** Ordered columns of the stack evolution stream. */
export const stackYears = ['2021', '2022', '2026'] as const;

export const stackSourceLabel: Record<string, string> = {
  foundation: 'B.Sc IT',
  toolkit: 'Working stack',
  itgalax: 'ITGalax',
  zellavora: 'Zellavora',
  rstack: 'RSTACK',
};

/* ------------------------------------------------------------------
   WHAT CHANGED — how the work itself evolved, not how long it lasted.
------------------------------------------------------------------ */
export const capabilityEvolution: CapabilityStep[] = [
  {
    number: '01',
    key: 'BUILD',
    title: 'Building interfaces',
    description:
      'The first professional years were about making screens real — turning designs into Angular components that behaved correctly on every device they shipped to.',
    evidence: 'ITGalax · 2022 · Angular, TypeScript',
    from: 'left',
  },
  {
    number: '02',
    key: 'SYSTEMS',
    title: 'Building systems',
    description:
      'Screens became architecture. Reusable component libraries and a scalable structure meant the next feature cost less than the last one.',
    evidence: 'Reusable component libraries · scalable architecture',
    from: 'bottom',
  },
  {
    number: '03',
    key: 'PRODUCT',
    title: 'Solving product problems',
    description:
      'Government case management and pension platforms are not demos. Biometric auth, offline behaviour and cross-platform releases are product decisions before they are technical ones.',
    evidence: 'Government portals · pension platforms · iOS + Android',
    from: 'right',
  },
  {
    number: '04',
    key: 'ENGINEERING',
    title: 'Engineering at scale',
    description:
      'Measured work on platforms real people depend on every working day — where a stream pattern or a lazy-loaded route shows up directly in what users feel.',
    evidence: '10,000+ active users · 3 countries · −40% API consumption',
    from: 'bottom',
  },
];

/* ------------------------------------------------------------------
   MILESTONES — real, dated turning points only.
------------------------------------------------------------------ */
export const careerMilestones: CareerMilestone[] = [
  {
    id: 'graduate',
    year: '2021',
    event: 'B.Sc. IT graduate',
    why: 'Core computer science and web technology foundations — the base everything after this was built on.',
  },
  {
    id: 'first-role',
    year: '2022',
    event: 'First professional role',
    why: 'Joined ITGalax Solutions as a Frontend Angular Developer — production code, real users, real release cycles.',
  },
  {
    id: 'portals',
    year: '2023',
    event: 'PRIMS pension portal and VNPF mobile apps',
    why: 'Shipping a portal and an Ionic cross-platform app in the same period forced one architecture to serve both web and mobile.',
  },
  {
    id: 'fiji',
    year: '2024',
    event: 'Fiji Government immigration platforms',
    why: 'High-consequence government case management serving 10,000+ users — the point where correctness mattered more than velocity.',
  },
  {
    id: 'consulting',
    year: '2026',
    event: 'Independent consulting and applied AI/ML',
    why: 'Applied AI/ML study at IIT Patna alongside Angular consulting — the toolkit widened from interfaces to intelligent product surfaces.',
  },
];

/* ------------------------------------------------------------------
   THE ENGINEERING MAP — technologies actually represented in the profile.
------------------------------------------------------------------ */
export const engineeringMap: EngineeringMapBranch[] = [
  { id: 'frontend', label: 'Frontend', items: ['Angular', 'React', 'Next.js', 'TypeScript'] },
  { id: 'mobile', label: 'Mobile', items: ['Ionic', 'Capacitor', 'PWA'] },
  { id: 'backend', label: 'Backend', items: ['Node.js', 'REST API', 'Sails.js'] },
  { id: 'architecture', label: 'Architecture', items: ['Signals', 'RxJS', 'SSR', 'Design Systems'] },
];

/* ------------------------------------------------------------------
   SECTION NAVIGATION — ids must match the rendered section anchors.
------------------------------------------------------------------ */
export const experienceSections = [
  { id: 'journey', label: 'Journey' },
  { id: 'stack', label: 'Stack' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'milestones', label: 'Milestones' },
  { id: 'current', label: 'Current' },
  { id: 'map', label: 'Map' },
] as const;
