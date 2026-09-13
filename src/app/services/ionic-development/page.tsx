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

const service = services.find((s) => s.id === "ionic")!;
const vnpf = projects.find((p) => p.slug === "vnpf-blo-mi")!;

const page = servicePages.mobile;

export const metadata = pageMetadata({
  title: "Ionic & Cross-platform Mobile Development",
  description:
    "Cross-platform mobile apps with Ionic, Angular and Capacitor — shipped to iOS and Android with biometric sign-in and offline behaviour.",
  path: "/services/ionic-development",
  inheritOgImage: false,
  keywords: [
    "Mobile app development",
    "Ionic development",
    "Ionic Angular developer",
    "Capacitor developer",
    "Angular mobile app",
    "Capacitor app development",
    "Cross-platform mobile app",
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
            { name: "Ionic Development", path: "/services/ionic-development" },
          ]}
        />
      </div>
      <ServiceJsonLd
        name="Ionic & Cross-platform Mobile Development"
        description={service.proposition}
        path="/services/ionic-development"
      />
      <PageHero
        index="04"
        label="SERVICES / MOBILE"
        title={["Ionic &", "Cross-platform Mobile"]}
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
          <span>Stack</span>
          <span>{service.technologies.join(" / ")}</span>
        </p>
        <p className="muted" style={{ marginTop: "0.75rem" }}>
          Ideal for: {service.idealFor}
        </p>

        <div style={{ marginTop: "2.5rem" }}>
          <PageSectionHead index="02" label="Evidence" title="Shipped to both app stores" />
          <p className="muted" style={{ marginTop: "0.75rem" }}>
            <Link href={"/work/" + vnpf.slug}>{vnpf.title}</Link> — {vnpf.tagline} Built with Ionic, Angular and
            Capacitor for the Vanuatu National Provident Fund, covering balances, contributions, loans and
            biometric sign-in.
          </p>
        </div>

        <ServiceNarrative content={page} startIndex={3} />
      </div>

      <PageCta
        location="service"
        kicker="04 / MOBILE"
        headline={["ONE CODEBASE,", "BOTH STORES."]}
        lede="If a product needs to live on a phone — member apps, field tools, or an internal utility — Ionic and Angular can get it to both stores from one codebase."
        actions={[
          { label: "Start a Conversation", href: "/contact?intent=ionic" },
          { label: "See All Services", href: "/services", variant: "line" },
        ]}
      />
    </article>
  );
}
