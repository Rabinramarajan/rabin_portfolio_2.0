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

export { PERSON_ID };

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

/** Scoped Service schema for a dedicated `/services/*` landing page. */
export function ServiceJsonLd({
  name,
  description,
  path,
  areaServed = ["India", "Worldwide"],
}: {
  name: string;
  description: string;
  path: string;
  areaServed?: string[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": absoluteUrl(path) + "#service",
    name,
    description,
    url: absoluteUrl(path),
    provider: { "@id": PERSON_ID },
    areaServed,
    inLanguage: "en",
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
  /** Cover screenshot, when the case study has one. */
  image?: string;
  year: string;
  technologies: string[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    url: absoluteUrl(path),
    // Omit `image` rather than emit a URL for a screenshot that does not exist.
    ...(image ? { image: absoluteUrl(image) } : {}),
    dateCreated: year,
    keywords: technologies.join(", "),
    inLanguage: "en",
    creator: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
    isPartOf: { "@id": SITE_ID },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={ld(data)} />;
}

/**
 * FAQ schema, scoped to the one page that renders the questions.
 *
 * Google requires FAQ markup to describe content visible on the *same* page.
 * The FAQ block lives only in the homepage, so emitting this from the root
 * layout marked up every route — /work, /pricing, every case study — with
 * questions those pages never show. Render this from the homepage only.
 */
export function FaqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": SITE_URL + "/#faq",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={ld(data)} />;
}

/** The case-study index as an ItemList. Render where the list is visible. */
export function WorkListJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": absoluteUrl("/work") + "#list",
    name: "Selected work",
    itemListElement: projects.map((project, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl("/work/" + project.slug),
      name: project.title,
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={ld(data)} />;
}

/**
 * Article schema for a written insight post.
 *
 * Only call this for a post that actually has a body — a title-and-dek stub is
 * thin content and is already kept out of the index.
 */
export function ArticleJsonLd({
  headline,
  description,
  path,
  datePublished,
}: {
  headline: string;
  description: string;
  path: string;
  datePublished?: string;
}) {
  const url = absoluteUrl(path);
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": url + "#article",
    headline,
    description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: "en",
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    isPartOf: { "@id": SITE_ID },
    ...(datePublished ? { datePublished } : {}),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={ld(data)} />;
}
