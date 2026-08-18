import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { ServiceJsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/pages/Breadcrumbs";
import { PageHero } from "@/components/pages/PageHero";
import { PageSectionHead } from "@/components/pages/PageSectionHead";
import { PageCta } from "@/components/pages/PageCta";
import { services } from "@/content/services";
import { projects } from "@/content/projects";

const service = services.find((s) => s.id === "angular")!;
const relatedProjects = projects.filter((p) =>
  ["fiji-immigration-internal", "fiji-immigration-external", "prims-member-portal", "insuremet"].includes(p.slug),
);

export const metadata = pageMetadata({
  title: "Angular Development Services",
  description:
    "Enterprise Angular development from Rabin R — signals, standalone APIs and Angular 17–22 architecture for government, insurance and pension platforms that hold up under real traffic.",
  path: "/services/angular-development",
  keywords: [
    "Angular development services",
    "Angular developer",
    "Enterprise Angular development",
    "Angular consultant Chennai",
    "Angular migration",
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
            { name: "Angular Development", path: "/services/angular-development" },
          ]}
        />
      </div>
      <ServiceJsonLd
        name="Angular Development Services"
        description={service.proposition}
        path="/services/angular-development"
      />
      <PageHero
        index="02"
        label="SERVICES / ANGULAR"
        title={["Angular Development", "Services"]}
        lede={service.proposition}
      />

      <div className="shell" style={{ marginTop: "2rem" }}>
        <PageSectionHead index="01" label="What's delivered" title="Deliverables" />
        <ul className="muted" style={{ marginTop: "0.75rem", display: "grid", gap: "0.5rem" }}>
          {service.deliverables.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>

        <p className="case-meta" style={{ marginTop: "1.5rem" }}>
          <span>Stack</span>
          <span>{service.technologies.join(" / ")}</span>
        </p>
        <p className="muted" style={{ marginTop: "0.75rem" }}>
          Ideal for: {service.idealFor}
        </p>

        <div style={{ marginTop: "2.5rem" }}>
          <PageSectionHead index="02" label="Evidence" title="Angular work in production" />
          <ul className="muted" style={{ marginTop: "0.75rem", display: "grid", gap: "0.5rem" }}>
            {relatedProjects.map((p) => (
              <li key={p.slug}>
                <Link href={"/work/" + p.slug}>{p.title}</Link> — {p.tagline}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <PageCta
        kicker="02 / ANGULAR"
        headline={["NEED ANGULAR", "DONE RIGHT?"]}
        lede="Whether it's a new application, a legacy migration, or a stalled Angular codebase, let's talk about where it stands and where it needs to go."
        actions={[
          { label: "Start a Conversation", href: "/contact?intent=angular" },
          { label: "See All Services", href: "/services", variant: "line" },
        ]}
      />
    </article>
  );
}
