import { NavItem, Principle, Profile } from '../core/models/profile.model';

export const PROFILE: Profile = {
  name: 'Rabin R',
  role: 'Frontend Angular Engineer',
  location: 'Chennai, India',
  email: 'hello@rabinr.in',
  availability: 'Available for select projects',
  summary:
    'I build fast, accessible web and mobile products with Angular, Signals and TypeScript — from government platforms serving 10,000+ users to focused product launches.',
  portraitUrl: '/images/portrait.webp',
  socials: [
    { platform: 'github', label: 'GitHub', url: 'https://github.com/Rabinramarajan' },
    { platform: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/rabinr' },
    { platform: 'email', label: 'Email', url: 'mailto:hello@rabinr.in' },
  ],
  stats: [
    { value: '4+', label: 'Years building with Angular' },
    { value: '10K+', label: 'Active users served' },
    { value: '~40%', label: 'Lower API consumption' },
    { value: '3', label: 'Countries served' },
  ],
};

export const PRINCIPLES: Principle[] = [
  { title: 'Performance', description: 'Measured, not assumed.' },
  { title: 'Maintainability', description: 'Built for the third release.' },
  { title: 'Accessibility', description: 'Part of engineering, not final QA.' },
  { title: 'Product context', description: 'Technology follows the problem.' },
];

export const NAV_ITEMS: NavItem[] = [
  { label: 'Projects', path: '/projects' },
  { label: 'Experience', path: '/experience' },
  { label: 'Skills', path: '/skills' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];
