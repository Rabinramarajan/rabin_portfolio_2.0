import { Routes } from '@angular/router';

const SITE_NAME = 'Rabin R';

export const routes: Routes = [
  {
    path: '',
    title: `${SITE_NAME} — Frontend Angular Engineer`,
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'projects',
    title: `Projects · ${SITE_NAME}`,
    loadComponent: () => import('./features/projects/projects').then((m) => m.Projects),
  },
  {
    path: 'experience',
    title: `Experience · ${SITE_NAME}`,
    loadComponent: () => import('./features/experience/experience').then((m) => m.Experience),
  },
  {
    path: 'skills',
    title: `Skills · ${SITE_NAME}`,
    loadComponent: () => import('./features/skills/skills').then((m) => m.Skills),
  },
  {
    path: 'about',
    title: `About · ${SITE_NAME}`,
    loadComponent: () => import('./features/about/about').then((m) => m.About),
  },
  {
    path: 'contact',
    title: `Contact · ${SITE_NAME}`,
    loadComponent: () => import('./features/contact/contact').then((m) => m.Contact),
  },
  { path: '**', redirectTo: '' },
];
