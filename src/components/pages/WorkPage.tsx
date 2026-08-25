import Link from "next/link";
import { ProjectCover } from "@/components/ProjectCover";
import { WorkExplorer } from "@/components/work/WorkExplorer";
import { PageHero } from "@/components/pages/PageHero";
import { WorkListJsonLd } from "@/components/JsonLd";
import { PageCta } from "@/components/pages/PageCta";
import { SectionKicker } from "@/components/ui";
import { featuredProject, projectPlatforms, projects } from "@/content/projects";
import { profile } from "@/content/profile";

/**
 * /work — the complete catalogue.
 *
 * Deliberately not the homepage section. The homepage runs a curated,
 * cinematic reel of four; this page leads with one featured case study and
 * then hands over to the full filterable explorer. Every number on the page
 * (project count, domains, platforms) is computed from the project records,
 * so the page cannot advertise a catalogue it does not have.
 */
export function WorkPage() {
  const hero = featuredProject();

  return (
    <>
      <WorkListJsonLd />
      <PageHero
        index="01"
        label="Selected Work"
        title={["Products, platforms", "and systems I have", "helped ship."]}
        lede="Government platforms, pension systems, insurance consoles and mobile apps — each one built for people who depend on it at work."
        meta={[
          { label: "Case studies", value: String(projects.length) },
          { label: "Years", value: profile.yearsExperienceLabel },
          { label: "Platforms", value: projectPlatforms().join(" · ") },
        ]}
      />

      <section className="wfeat" aria-labelledby="wfeat-title">
        <div className="shell">
          <SectionKicker index={hero.number} label="Featured project" />

          <div className="wfeat__grid">
            {/* Decorative: the title and the CTA below are the links. A second
                link around the same destination only adds tab stops. */}
            <div className="wfeat__frame">
              <ProjectCover project={hero} sizes="(min-width: 1100px) 60vw, 100vw" priority decorative />
              <span className="wfeat__frame-scrim" aria-hidden />
            </div>

            <div className="wfeat__copy">
              <p className="wfeat__counter">
                {hero.number} <span aria-hidden>/</span> {String(projects.length).padStart(2, "0")}
              </p>
              <h2 className="wfeat__title" id="wfeat-title">
                <Link href={`/work/${hero.slug}`}>{hero.title}</Link>
              </h2>
              <p className="wfeat__cat">{hero.category}</p>
              <p className="wfeat__tagline">{hero.tagline}</p>
              <p className="wfeat__body">{hero.overview}</p>

              <dl className="wfeat__facts">
                <div>
                  <dt>Role</dt>
                  <dd>{hero.role}</dd>
                </div>
                <div>
                  <dt>Year</dt>
                  <dd>{hero.year}</dd>
                </div>
                {hero.platform?.length ? (
                  <div>
                    <dt>Platform</dt>
                    <dd>{hero.platform.join(" · ")}</dd>
                  </div>
                ) : null}
              </dl>

              <ul className="wfeat__stack">
                {hero.technologies.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>

              <Link className="wfeat__cta" href={`/work/${hero.slug}`}>
                <span>Explore case study</span>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <path d="M5 11 11 5M5.5 5H11v5.5" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="wall" aria-labelledby="wall-title">
        <div className="shell">
          <div className="wall__head">
            <SectionKicker index="02" label="Project explorer" />
            <h2 className="wall__title" id="wall-title">
              Every case study
            </h2>
          </div>
          <WorkExplorer exclude={[hero.slug]} />
        </div>
      </section>

      <PageCta
        kicker="Next step"
        headline={["Have a similar", "challenge?"]}
        lede="Let's build something production-ready."
        actions={[
          { label: "Start a conversation", href: "/contact" },
          { label: "Read the process", href: "/process", variant: "line" },
        ]}
      />
    </>
  );
}
