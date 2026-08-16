import { profile, SITE_URL, defaultSeo, hero } from "@/content/profile";
import { services } from "@/content/services";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import { faqs } from "@/content/faq";
import { absoluteUrl } from "@/lib/seo";

/** JSON-LD must never be able to close the script tag it lives in. */
function ld(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}

const PERSON_ID = SITE_URL + "/#person";
const SITE_ID = SITE_URL + "/#website";
const SERVICE_ID = SITE_URL + "/#service";

/** Everything Rabin is shown to work with, deduped across the skill matrix. */
const knowsAbout = Array.from(
  new Set([
    "Angular",
    "Frontend Architecture",
    "Web Performance",
    "Web Accessibility",
    "Design Systems",
    ...skillGroups.flatMap((g) => g.items),
  ]),
);

/** Only real, verified profiles — never invent a sameAs. */
const sameAs = profile.socials
  .filter((s) => s.id === "github" || s.id === "linkedin")
  .map((s) => s.href);

export function JsonLd() {
  const graph = [
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: profile.name,
      alternateName: profile.shortName,
      jobTitle: profile.headlineRole,
      description: hero.description,
      email: "mailto:" + profile.email,
      telephone: profile.phone,
      url: SITE_URL + "/",
      image: absoluteUrl(hero.portrait.src),
      address: {
        "@type": "PostalAddress",
        addressLocality: "Chennai",
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
      },
      knowsAbout,
      knowsLanguage: ["en"],
      sameAs,
    },
    {
      "@type": "WebSite",
      "@id": SITE_ID,
      name: profile.name,
      url: SITE_URL + "/",
      description: defaultSeo.description,
      inLanguage: "en",
      publisher: { "@id": PERSON_ID },
      about: { "@id": PERSON_ID },
    },
    {
      "@type": "ProfessionalService",
      "@id": SERVICE_ID,
      name: profile.name + " — Angular & Frontend Engineering",
      url: absoluteUrl("/services"),
      description:
        "Angular development, frontend engineering, React and Next.js, UI engineering, performance optimisation, Ionic mobile apps and design systems.",
      provider: { "@id": PERSON_ID },
      areaServed: [{ "@type": "Country", name: "India" }, "Worldwide"],
      availableLanguage: "en",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Chennai",
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Frontend engineering services",
        itemListElement: services.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.title, description: s.proposition },
        })),
      },
    },
    {
      "@type": "ItemList",
      "@id": absoluteUrl("/work") + "#list",
      name: "Selected work",
      itemListElement: projects.map((project, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl("/work/" + project.slug),
        name: project.title,
      })),
    },
    {
      "@type": "FAQPage",
      "@id": SITE_URL + "/#faq",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={ld({ "@context": "https://schema.org", "@graph": graph })}
    />
  );
}

/** Breadcrumb trail for deep routes. Render only where breadcrumbs are visible. */
export function BreadcrumbJsonLd({ trail }: { trail: { name: string; path: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={ld(data)} />;
}

/** Case-study level schema, emitted from the project route. */
export function ProjectJsonLd({
  name,
  description,
  path,
  image,
  year,
  technologies,
}: {
  name: string;
  description: string;
  path: string;
  image: string;
  year: string;
  technologies: string[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    url: absoluteUrl(path),
    image: absoluteUrl(image),
    dateCreated: year,
    keywords: technologies.join(", "),
    inLanguage: "en",
    creator: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
    isPartOf: { "@id": SITE_ID },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={ld(data)} />;
}
