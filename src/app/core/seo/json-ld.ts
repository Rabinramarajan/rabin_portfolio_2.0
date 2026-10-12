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
    image: absoluteUrl('/media/about/about-portrait.webp'),
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
