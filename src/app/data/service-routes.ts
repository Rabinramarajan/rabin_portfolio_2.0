import { ServicePageContent, servicePages } from './service-pages';
import { secondaryServices, services } from './services';
import type { Service } from './types';

/**
 * The four indexed service landing pages. Slugs, titles and descriptions are the
 * ones the live site already ranks with, so they must not change without a redirect.
 */
export interface ServiceRoute {
  slug: string;
  title: string;
  description: string;
  service: Service;
  /** Supporting capability named on the page, e.g. React beside frontend architecture. */
  related?: Service;
  page: ServicePageContent;
}

function byId(list: Service[], id: string): Service {
  const found = list.find((service) => service.id === id);
  if (!found) throw new Error(`[content] Unknown service id "${id}".`);
  return found;
}

export const serviceRoutes: ServiceRoute[] = [
  {
    slug: 'angular-development',
    title: 'Angular Development Consultant',
    description:
      'Enterprise Angular development — signals, standalone APIs and Angular 17–22 architecture for government, insurance and pension platforms.',
    service: byId(services, 'angular'),
    page: servicePages.angular,
  },
  {
    slug: 'frontend-architecture',
    title: 'Frontend Architecture',
    description:
      'Frontend architecture consulting — component architecture, design systems and state flow in Angular, React and Next.js, designed for the third release rather than the demo.',
    service: byId(services, 'frontend'),
    related: byId(secondaryServices, 'react'),
    page: servicePages.web,
  },
  {
    slug: 'angular-performance-optimization',
    title: 'Angular Performance Optimization Consultant',
    description:
      'Angular performance consulting — Core Web Vitals, change detection, bundle size and API waterfalls, diagnosed by measurement before anything is changed.',
    service: byId(services, 'performance'),
    page: servicePages.performance,
  },
  {
    slug: 'ionic-development',
    title: 'Ionic & Cross-platform Mobile Development',
    description:
      'Cross-platform mobile apps with Ionic, Angular and Capacitor — shipped to iOS and Android with biometric sign-in and offline behaviour.',
    service: byId(services, 'ionic'),
    page: servicePages.mobile,
  },
];

export function getServiceRoute(slug: string): ServiceRoute | undefined {
  return serviceRoutes.find((route) => route.slug === slug);
}

/** Link to a service's landing page, by service id. */
export function serviceHref(serviceId: string): string {
  const route = serviceRoutes.find((r) => r.service.id === serviceId);
  return route ? `/services/${route.slug}` : '/services';
}
