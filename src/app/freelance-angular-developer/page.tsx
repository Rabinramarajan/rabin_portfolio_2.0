import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { ServiceJsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/pages/Breadcrumbs";
import { PageHero } from "@/components/pages/PageHero";
import { PageSectionHead } from "@/components/pages/PageSectionHead";
import { PageCta } from "@/components/pages/PageCta";
import { profile } from "@/content/profile";
import { engagementModels } from "@/content/engagement-models";
import { projects } from "@/content/projects";

const relatedProjects = projects.slice(0, 3);

export const metadata = pageMetadata({
  title: "Freelance Angular Developer",
  description: `Hire Rabin R as a freelance Angular developer in ${profile.locationShort} — contract and remote engagements for enterprise Angular applications, legacy migrations and frontend architecture.`,
  path: "/freelance-angular-developer",
  keywords: [
    "Freelance Angular developer",
    "Hire Angular developer",
    "Angular contractor",
    "Remote Angular developer",
    "Angular developer Chennai",
  ],
});

export default function Page() {
  return (
    <article className="section">
      <div className="shell">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Freelance Angular Developer", path: "/freelance-angular-developer" },
          ]}
        />
      </div>
      <ServiceJsonLd
        name="Freelance Angular Developer"
        description={`Contract and remote Angular development engagements with ${profile.name}, based in ${profile.locationShort}.`}
        path="/freelance-angular-developer"
      />
      <PageHero
        index="FL"
        label="FREELANCE / ANGULAR"
        title={["Freelance Angular", "Developer"]}
        lede={`${profile.name} works as an independent Angular developer on contract and remote engagements, based in ${profile.locationShort}. ${profile.availability.label}.`}
      />

      <div className="shell" style={{ marginTop: "2rem" }}>
        <PageSectionHead index="01" label="How it works" title="Engagement models" />
        <ul className="muted" style={{ marginTop: "0.75rem", display: "grid", gap: "0.75rem" }}>
          {engagementModels.map((m) => (
            <li key={m.id}>
              <strong>{m.title}</strong> — {m.description} {m.idealFor ? `Ideal for ${m.idealFor.toLowerCase()}.` : ""}
            </li>
          ))}
        </ul>

        <div style={{ marginTop: "2.5rem" }}>
          <PageSectionHead index="02" label="Why freelance Angular" title="What a freelance engagement covers" />
          <p className="muted" style={{ marginTop: "0.75rem" }}>
            New Angular builds, legacy version upgrades, and standalone/signals migrations for teams that need a
            senior Angular owner without a full-time hire. See the{" "}
            <Link href="/services/angular-development">Angular Development service page</Link> for the technical
            scope, or the <Link href="/pricing">pricing page</Link> for how engagements are structured.
          </p>
        </div>

        <div style={{ marginTop: "2.5rem" }}>
          <PageSectionHead index="03" label="Evidence" title="Recent Angular engagements" />
          <ul className="muted" style={{ marginTop: "0.75rem", display: "grid", gap: "0.5rem" }}>
            {relatedProjects.map((p) => (
              <li key={p.slug}>
                <Link href={"/work/" + p.slug}>{p.title}</Link> — {p.tagline}
              </li>
            ))}
          </ul>
          <p className="muted" style={{ marginTop: "0.75rem" }}>
            See the full <Link href="/work">work archive</Link>.
          </p>
        </div>
      </div>

      <PageCta
        kicker="FREELANCE ANGULAR"
        headline={["HAVE AN ANGULAR", "PROJECT IN MIND?"]}
        lede={profile.availability.responseTime + "."}
        actions={[
          { label: "Start a Conversation", href: "/contact?intent=angular" },
          { label: "Angular Development Service", href: "/services/angular-development", variant: "line" },
        ]}
      />
    </article>
  );
}
