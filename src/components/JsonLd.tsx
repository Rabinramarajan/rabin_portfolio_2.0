import { profile, SITE_URL, defaultSeo } from '@/content/profile';
import { services } from '@/content/services';
import { projects } from '@/content/projects';

export function JsonLd() {
  const data = [
    { '@context': 'https://schema.org', '@type': 'Person', name: profile.name, jobTitle: profile.headlineRole, email: profile.email, url: SITE_URL, address: { '@type': 'PostalAddress', addressLocality: 'Chennai', addressCountry: 'IN' } },
    { '@context': 'https://schema.org', '@type': 'WebSite', name: profile.name, url: SITE_URL, description: defaultSeo.description },
    { '@context': 'https://schema.org', '@type': 'ProfessionalService', name: profile.name + ' Frontend Engineering', url: SITE_URL, areaServed: 'Worldwide', serviceType: services.map((s) => s.title) },
    ...projects.map((project) => ({ '@context': 'https://schema.org', '@type': 'CreativeWork', name: project.title, description: project.tagline, url: SITE_URL + '/work/' + project.slug })),
  ];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
