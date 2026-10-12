import { SkillGroup } from '../core/models/skill.model';

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    note: 'Where the depth is.',
    skills: ['Angular', 'TypeScript', 'JavaScript', 'Signals', 'RxJS', 'HTML5', 'CSS3', 'Sass', 'Tailwind CSS', 'React', 'Next.js'],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    note: 'One codebase, both stores.',
    skills: ['Ionic', 'Capacitor', 'Flutter', 'Android', 'iOS', 'PWA'],
  },
  {
    id: 'backend',
    label: 'Backend & data',
    note: 'Enough to own an integration end to end.',
    skills: ['Node.js', 'Express.js', 'REST APIs', 'GraphQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Firebase', 'Supabase'],
  },
  {
    id: 'design',
    label: 'Design',
    note: 'I work in the design file, not just from it.',
    skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator'],
  },
  {
    id: 'quality',
    label: 'Quality & tooling',
    note: 'Proof the product still works next month.',
    skills: ['Playwright', 'ESLint', 'Prettier', 'WCAG', 'Git', 'GitHub', 'Postman'],
  },
];
