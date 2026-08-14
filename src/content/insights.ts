import type { Insight } from '@/content/types';

export const insights: Insight[] = [
  {
    id: 'signals',
    number: '01',
    title: 'Signals before ceremony',
    dek: 'Most UI state does not need a store. Start in the template, promote only what the product actually shares.',
  },
  {
    id: 'vitals',
    number: '02',
    title: 'Performance is a product requirement',
    dek: 'If Core Web Vitals are optional, they lose. Treat load, input delay and layout shift as part of the spec.',
  },
  {
    id: 'quiet-ui',
    number: '03',
    title: 'Quiet interfaces age better',
    dek: 'Motion should explain hierarchy, not decorate it. One accent, one rhythm, and copy that can stand without animation.',
  },
];
