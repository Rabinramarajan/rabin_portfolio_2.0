import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { ServiceJsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/pages/Breadcrumbs";
import { PageHero } from "@/components/pages/PageHero";
import { PageSectionHead } from "@/components/pages/PageSectionHead";
import { PageCta } from "@/components/pages/PageCta";
import { ServiceNarrative } from "@/components/pages/ServiceNarrative";
import { servicePages } from "@/content/service-pages";
import { secondaryServices, services } from "@/content/services";
import { projects } from "@/content/projects";

const frontend = services.find((s) => s.id === "frontend")!;
/* React/Next.js is a supporting capability, not a headline service — it lives
   in `secondaryServices` rather than in the marketed four. */
const react = secondaryServices.find((s) => s.id === "react")!;
const relatedProjects = projects.filter((p) =>
  ["insuremet", "zellavora-ai-resume-builder", "prims-member-portal"].includes(p.slug),
);

const page = servicePages.web;

export const metadata = pageMetadata({
  title: "Frontend Architecture",
  description:
    "Frontend architecture consulting — component architecture, design systems and state flow in Angular, React and Next.js, designed for the third release rather than the demo.",
  path: "/services/frontend-architecture",
  inheritOgImage: false,
  keywords: [
    "Web application development",
    "Custom web application development",
    "Frontend software engineer",
    "React developer",
    "Next.js development",
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
            { name: "Frontend Architecture", path: "/services/frontend-architecture" },
          ]}
        />
      </div>
      <ServiceJsonLd
        name="Frontend Architecture Consulting"
        description={frontend.proposition}
        path="/services/frontend-architecture"
      />
      <PageHero
        index="02"
        label="SERVICES / ARCHITECTURE"
        title={["Frontend", "Architecture"]}
        lede={frontend.proposition}
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
          {[...frontend.deliverables, ...react.deliverables].map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>

        <p className="case-meta" style={{ marginTop: "1.5rem" }}>
          <span>Stack</span>
          <span>{Array.from(new Set([...frontend.technologies, ...react.technologies])).join(" / ")}</span>
        </p>
        <p className="muted" style={{ marginTop: "0.75rem" }}>
          Ideal for: {frontend.idealFor} {react.idealFor}
        </p>

        <div style={{ marginTop: "2.5rem" }}>
          <PageSectionHead index="02" label="Evidence" title="Architecture work shipped" />
          <ul className="muted" style={{ marginTop: "0.75rem", display: "grid", gap: "0.5rem" }}>
            {relatedProjects.map((p) => (
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
        kicker="02 / FRONTEND ARCHITECTURE"
        headline={["ARCHITECTURE", "GETTING EXPENSIVE?"]}
        lede="From App Router architecture to typed data models and performance budgets, let's scope what a production-ready web application needs."
        actions={[
          { label: "Start a Conversation", href: "/contact?intent=frontend" },
          { label: "See All Services", href: "/services", variant: "line" },
        ]}
      />
    </article>
  );
}
