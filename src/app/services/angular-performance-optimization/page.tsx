import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { ServiceJsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/pages/Breadcrumbs";
import { PageHero } from "@/components/pages/PageHero";
import { PageSectionHead } from "@/components/pages/PageSectionHead";
import { PageCta } from "@/components/pages/PageCta";
import { ServiceNarrative } from "@/components/pages/ServiceNarrative";
import { servicePages } from "@/content/service-pages";
import { services } from "@/content/services";
import { projects } from "@/content/projects";

const service = services.find((s) => s.id === "performance")!;
/* The evidence for this page is the one case study with measured numbers
   attached, so it leads. The other two are named because the same work was
   done there without an outcome figure ever being captured. */
const evidence = projects.filter((p) =>
  ["fiji-immigration-internal", "prims-member-portal", "insuremet"].includes(p.slug),
);

const page = servicePages.performance;

export const metadata = pageMetadata({
  title: "Angular Performance Optimization Consultant",
  description:
    "Angular performance consulting — Core Web Vitals, change detection, bundle size and API waterfalls, diagnosed by measurement before anything is changed.",
  path: "/services/angular-performance-optimization",
  inheritOgImage: false,
  keywords: [
    "Angular performance optimization",
    "Angular performance consultant",
    "Core Web Vitals",
    "Frontend performance audit",
    "Angular change detection",
    "Bundle size optimization",
  ],
});

export default function Page() {
  return (
    <article className="section">
      <div className="shell">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            {
              name: "Angular Performance Optimization",
              path: "/services/angular-performance-optimization",
            },
          ]}
        />
      </div>
      <ServiceJsonLd
        name="Angular Performance Optimization"
        description={service.proposition}
        path="/services/angular-performance-optimization"
      />
      <PageHero
        index="03"
        label="SERVICES / PERFORMANCE"
        title={["Angular Performance", "Optimization"]}
        lede={service.proposition}
      />

      <div className="shell" style={{ marginTop: "2rem" }}>
        <p className="svc-answer" style={{ maxWidth: "44rem", marginBottom: "1.25rem", fontSize: "1.05rem", lineHeight: 1.65 }}>{page.answer}</p>
        {page.intro.map((p, i) => (
          <p className="muted" key={i} style={{ maxWidth: "42rem", marginBottom: "1rem" }}>
            {p}
          </p>
        ))}

        <PageSectionHead index="01" label="What's delivered" title="Deliverables" />
        <ul className="muted" style={{ marginTop: "0.75rem", display: "grid", gap: "0.5rem" }}>
          {service.deliverables.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>

        <p className="case-meta" style={{ marginTop: "1.5rem" }}>
          <span>Measured with</span>
          <span>{service.technologies.join(" / ")}</span>
        </p>
        <p className="muted" style={{ marginTop: "0.75rem" }}>
          Ideal for: {service.idealFor}
        </p>

        <div style={{ marginTop: "2.5rem" }}>
          <PageSectionHead index="02" label="Evidence" title="Where this work was done" />
          <ul className="muted" style={{ marginTop: "0.75rem", display: "grid", gap: "0.5rem" }}>
            {evidence.map((p) => (
              <li key={p.slug}>
                <Link href={"/work/" + p.slug}>{p.title}</Link> — {p.tagline}
              </li>
            ))}
          </ul>
        </div>

        <ServiceNarrative content={page} startIndex={3} />
      </div>

      <PageCta
        location="service"
        kicker="03 / PERFORMANCE"
        headline={["SOMETHING", "FEELING HEAVY?"]}
        lede="Send me the screen that is slow and what you have already tried. A scoped investigation says which of the four usual causes you actually have before anyone writes a fix."
        actions={[
          { label: "Discuss a performance project", href: "/contact?intent=performance" },
          { label: "See All Services", href: "/services", variant: "line" },
        ]}
      />
    </article>
  );
}
