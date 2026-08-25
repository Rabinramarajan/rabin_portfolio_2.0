import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCover } from "@/components/ProjectCover";
import { TechnologyBadge } from "@/components/TechnologyBadge";
import { CaseGallery } from "@/components/work/CaseGallery";
import { CaseProgress, type CaseSection } from "@/components/work/CaseProgress";
import { ShareCase } from "@/components/work/ShareCase";
import {
  galleryFrames,
  getNextProject,
  getPreviousProject,
  getProject,
  projects,
  relatedProjects,
} from "@/content/projects";
import type { Project } from "@/content/types";
import { BreadcrumbJsonLd, ProjectJsonLd } from "@/components/JsonLd";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

/**
 * Every case study is prerendered from the project records, so a slug that is
 * not in that list is not a project. Closing dynamic params makes Next answer
 * those with a real 404 instead of rendering the not-found page under a 200 —
 * a soft 404 that search engines index as a live page.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Not found", robots: { index: false, follow: false } };
  return pageMetadata({
    title: project.seo.title,
    description: project.seo.description,
    path: "/work/" + project.slug,
    type: "article",
    keywords: project.technologies,
    inheritOgImage: false,
  });
}

/**
 * A case study, told as a guided story rather than a stack of fields.
 *
 * The chapter list is built from the project record, not hardcoded: a project
 * with no measured metrics and no gallery simply has fewer chapters, and the
 * progress rail, the anchors and the section numbering all derive from that
 * one array. That is what keeps the no-fabrication rule structural — an absent
 * fact removes a section instead of inviting filler to fill it.
 */
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const previous = getPreviousProject(slug);
  const next = getNextProject(slug);
  const related = relatedProjects(slug);
  const frames = galleryFrames(project);
  const url = absoluteUrl("/work/" + project.slug);
  const hasImpact = project.results.length > 0 || (project.metrics?.length ?? 0) > 0;

  const sections: CaseSection[] = [
    { id: "overview", label: "Snapshot" },
    { id: "problem", label: "The problem" },
    { id: "approach", label: "The approach" },
    { id: "engineering", label: "Engineering" },
    ...(hasImpact ? [{ id: "impact", label: "Impact" }] : []),
    ...(frames.length ? [{ id: "gallery", label: "Visual journey" }] : []),
    { id: "next", label: "Next project" },
  ];

  /** Chapter number for an anchor, so numbering can never skip or repeat. */
  const no = (id: string) => String(sections.findIndex((s) => s.id === id) + 1).padStart(2, "0");

  return (
    <article className="cs">
      <BreadcrumbJsonLd
        trail={[
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
          { name: project.title, path: "/work/" + project.slug },
        ]}
      />
      <ProjectJsonLd
        name={project.title}
        description={project.seo.description}
        path={"/work/" + project.slug}
        image={project.cover?.src}
        year={project.year}
        technologies={project.technologies}
      />

      <header className="cs__hero">
        <span className="cs__hero-glow" aria-hidden />
        <div className="shell">
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/work">Selected work</Link>
              </li>
              <li aria-current="page">{project.title}</li>
            </ol>
          </nav>

          <p className="cs__eyebrow">
            <span className="cs__eyebrow-no">{project.number}</span>
            <span className="cs__eyebrow-rule" aria-hidden />
            <span className="cs__eyebrow-cat">{project.category}</span>
          </p>

          <h1 className="cs__title">{project.title}</h1>
          <p className="cs__tagline">{project.tagline}</p>
          <p className="cs__intro">{project.overview}</p>

          <div className="cs__hero-actions">
            <a className="cs__scroll" href="#overview">
              <span>Scroll to explore</span>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M8 3v9M4.5 8.5 8 12l3.5-3.5" />
              </svg>
            </a>
            {project.liveUrl ? (
              <a
                className="cs__live"
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                Visit live product
              </a>
            ) : null}
          </div>
        </div>
      </header>

      <div className="shell">
        <figure className="cs__cover">
          <ProjectCover project={project} priority sizes="100vw" />
        </figure>
      </div>

      <div className="shell cs__layout">
        <aside className="cs__rail">
          <CaseProgress sections={sections} />
        </aside>

        <div className="cs__main">
          <Block id="overview" no={no("overview")} label="Project snapshot">
            <p className="cs__lead">{project.overview}</p>
            <dl className="cs__snap">
              <Fact label="Role" value={project.role} />
              <Fact label="Year" value={project.year} />
              <Fact label="Domain" value={project.category} />
              {project.platform?.length ? (
                <Fact label="Platform" value={project.platform.join(" · ")} />
              ) : null}
              {project.client ? <Fact label="Client" value={project.client} /> : null}
              <Fact label="Stack" value={project.technologies.join(" · ")} wide />
            </dl>
          </Block>

          <Block id="problem" no={no("problem")} label="The problem">
            <p className="cs__lead">{project.problem}</p>
            {project.challenge ? (
              <div className="cs__note">
                <p className="cs__note-k">Engineering challenge</p>
                <p>{project.challenge}</p>
              </div>
            ) : null}
          </Block>

          <Block id="approach" no={no("approach")} label="The approach">
            <p className="cs__lead">{project.solution}</p>
            <ul className="cs__features">
              {project.features.map((f) => (
                <li key={f}>
                  <span className="cs__feature-tick" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </Block>

          <Block id="engineering" no={no("engineering")} label="Engineering the product">
            {project.architecture ? <p className="cs__lead">{project.architecture}</p> : null}

            {project.stack?.length ? (
              <dl className="cs__stack">
                {project.stack.map((row) => (
                  <div className="cs__stack-row" key={row.layer}>
                    <dt>{row.layer}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {project.responsibilities?.length ? (
              <div className="cs__contrib">
                <h3 className="cs__sub">My contribution</h3>
                <ul className="cs__bullets">
                  {project.responsibilities.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {project.decisions?.length ? (
              <div className="cs__decisions">
                <h3 className="cs__sub">Decisions that shaped the product</h3>
                {project.decisions.map((d) => (
                  <div className="cs__decision" key={d.decision}>
                    <p className="cs__decision-q">{d.problem}</p>
                    <p className="cs__decision-a">{d.decision}</p>
                    <dl>
                      <div>
                        <dt>Why</dt>
                        <dd>{d.why}</dd>
                      </div>
                      {d.tradeoff ? (
                        <div>
                          <dt>Trade-off</dt>
                          <dd>{d.tradeoff}</dd>
                        </div>
                      ) : null}
                      {d.result ? (
                        <div>
                          <dt>Result</dt>
                          <dd>{d.result}</dd>
                        </div>
                      ) : null}
                    </dl>
                  </div>
                ))}
              </div>
            ) : null}

            <ul className="cs__tech" aria-label="Technologies used on this project">
              {project.technologies.map((t) => (
                <TechnologyBadge key={t} label={t} />
              ))}
            </ul>
          </Block>

          {hasImpact ? (
            <Block id="impact" no={no("impact")} label="Impact">
              {/* Numbers only where the record carries an evidenced one. Every
                  other project falls back to the qualitative outcome lines
                  rather than manufacturing a percentage. */}
              {project.metrics?.length ? (
                <ul className="cs__metrics">
                  {project.metrics.map((m) => (
                    <li key={m.label}>
                      <p className="cs__metric-value">{m.value}</p>
                      <p className="cs__metric-label">{m.label}</p>
                      {m.note ? <p className="cs__metric-note">{m.note}</p> : null}
                    </li>
                  ))}
                </ul>
              ) : null}

              {project.results.length ? (
                <ol className="cs__results">
                  {project.results.map((r, i) => (
                    <li key={r}>
                      <span className="cs__results-num" aria-hidden>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ol>
              ) : null}
            </Block>
          ) : null}

          {frames.length ? (
            <Block id="gallery" no={no("gallery")} label="Visual journey">
              <CaseGallery frames={frames} />
            </Block>
          ) : null}

          <ShareCase url={url} title={project.title} />
        </div>
      </div>

      {related.length ? (
        <section className="shell cs__related-wrap" aria-labelledby="cs-related">
          <h2 className="cs__block-title" id="cs-related">
            You may also want to see
          </h2>
          <ul className="cs__related">
            {related.map((p) => (
              <RelatedCard key={p.slug} project={p} />
            ))}
          </ul>
        </section>
      ) : null}

      <section className="shell cs__next" id="next" aria-labelledby="cs-next">
        <h2 className="sr-only" id="cs-next">
          Continue
        </h2>
        <nav className="cs__pager" aria-label="Case studies">
          {previous && previous.slug !== project.slug ? (
            <Link className="cs__pager-link" href={"/work/" + previous.slug} rel="prev">
              <span className="cs__pager-k">Previous project</span>
              <span className="cs__pager-title">{previous.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && next.slug !== project.slug ? (
            <Link className="cs__pager-link cs__pager-link--next" href={"/work/" + next.slug} rel="next">
              <span className="cs__pager-k">Next project</span>
              <span className="cs__pager-title">{next.title}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
        <p className="cs__back">
          <Link href="/work">Back to all work</Link>
        </p>
      </section>

      <section className="shell cs__cta" aria-labelledby="cs-cta">
        <h2 className="cs__cta-title" id="cs-cta">
          Have a similar challenge?
        </h2>
        <p className="cs__cta-body">Let&apos;s build something production-ready.</p>
        <div className="cs__cta-actions">
          <Link className="cs__cta-btn cs__cta-btn--solid" href="/contact">
            Start a conversation
          </Link>
          <Link className="cs__cta-btn" href="/work">
            View all work
          </Link>
        </div>
      </section>
    </article>
  );
}

function Fact({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={"cs__snap-cell" + (wide ? " cs__snap-cell--wide" : "")}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function RelatedCard({ project: p }: { project: Project }) {
  return (
    <li>
      <Link href={"/work/" + p.slug} className="cs__related-card">
        <span className="cs__related-shot" aria-hidden>
          <ProjectCover project={p} sizes="(min-width: 900px) 30vw, 100vw" decorative />
        </span>
        <span className="cs__related-cat">{p.category}</span>
        <span className="cs__related-title">{p.title}</span>
        <span className="cs__related-tag">{p.tagline}</span>
      </Link>
    </li>
  );
}

/** One numbered movement of the case study, anchored so the rail can reach it. */
function Block({
  id,
  no,
  label,
  children,
}: {
  id: string;
  no: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="cs__block" id={id} aria-labelledby={`cs-${id}`}>
      <h2 className="cs__block-title" id={`cs-${id}`}>
        <span className="cs__block-no" aria-hidden>
          {no}
        </span>
        {label}
      </h2>
      <div className="cs__block-body">{children}</div>
    </section>
  );
}
