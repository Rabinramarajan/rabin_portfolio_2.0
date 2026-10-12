import { SITE_URL, profile } from '../../data/profile';
import { absoluteUrl } from './seo.service';

/** Structured data built only from facts the page visibly shows. */

export function personJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: profile.name,
    jobTitle: profile.role,
    url: SITE_URL + '/',
    image: absoluteUrl('/media/about/about-selfie.webp'),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Chennai',
      addressRegion: 'Tamil Nadu',
      addressCountry: 'IN',
    },
    knowsAbout: ['Angular', 'TypeScript', 'RxJS', 'Angular Signals', 'Ionic', 'Frontend architecture', 'Web performance'],
    sameAs: profile.socials.filter((s) => s.id === 'github' || s.id === 'linkedin').map((s) => s.href),
  };
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL + '/',
    name: profile.name,
    inLanguage: 'en-IN',
    publisher: { '@id': `${SITE_URL}/#person` },
  };
}

/** BreadcrumbList for a page, e.g. Home › Work › PRIMS Member Portal. */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** /about as a ProfilePage whose main entity is the site's Person. */
export function profilePageJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: absoluteUrl('/about'),
    mainEntity: personJsonLd(),
  };
}

/** One service landing page, offered by the site's Person. */
export function serviceJsonLd(input: {
  name: string;
  description: string;
  path: string;
  image?: string;
  serviceType: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    serviceType: input.serviceType,
    description: input.description,
    url: absoluteUrl(input.path),
    image: input.image ? absoluteUrl(input.image) : undefined,
    areaServed: 'Worldwide',
    provider: { '@id': `${SITE_URL}/#person` },
  };
}

/** A case study page: the project as a CreativeWork Rabin built. */
export function caseStudyJsonLd(input: {
  name: string;
  description: string;
  path: string;
  image?: string;
  year: string;
  technologies: string[];
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    image: input.image ? absoluteUrl(input.image) : undefined,
    dateCreated: input.year,
    keywords: input.technologies.join(', '),
    creator: { '@id': `${SITE_URL}/#person` },
  };
}
