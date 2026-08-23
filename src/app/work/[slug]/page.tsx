import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCover } from "@/components/ProjectCover";
import { SmartImage } from "@/components/SmartImage";
import { TechnologyBadge } from "@/components/TechnologyBadge";
import {
  galleryFrames,
  getNextProject,
  getPreviousProject,
  getProject,
  projects,
  relatedProjects,
} from "@/content/projects";
import { Btn, SectionKicker } from "@/components/ui";
import { BreadcrumbJsonLd, ProjectJsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";

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

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const previous = getPreviousProject(slug);
  const next = getNextProject(slug);
  const related = relatedProjects(slug);
  const frames = galleryFrames(project);

  return (
    <article className="section cs">
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

        <header className="cs__head">
          <SectionKicker index={project.number} label={project.category} />
          <h1 className="sec-title">{project.title}</h1>
          <p className="sec-lede">{project.tagline}</p>

          {/* A definition list, not a row of bare spans: every value has a name,
              so a screen reader announces "Year, 2024" instead of a loose "2024". */}
          <dl className="cs__facts">
            <div className="cs__fact">
              <dt>Year</dt>
              <dd>{project.year}</dd>
            </div>
            <div className="cs__fact">
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div className="cs__fact">
              <dt>Domain</dt>
              <dd>{project.category}</dd>
            </div>
          </dl>

          {project.liveUrl ? (
            <p className="cs__live">
              <Btn href={project.liveUrl}>Live preview</Btn>
            </p>
          ) : null}
        </header>
      </div>

      <div className="shell">
        <div className="shot cs__cover">
          <ProjectCover project={project} priority sizes="100vw" />
        </div>
      </div>

      <div className="shell">
        <CaseBlock id="overview" label="Overview">
          <p className="cs__lead">{project.overview}</p>
        </CaseBlock>

        <CaseBlock id="problem" label="The problem">
          <div className="cs__split">
            <div>
              <p className="cs__sub">Business problem</p>
              <p className="muted">{project.problem}</p>
            </div>
            {project.challenge ? (
              <div>
                <p className="cs__sub">Engineering challenge</p>
                <p className="muted">{project.challenge}</p>
              </div>
            ) : null}
          </div>
        </CaseBlock>

        <CaseBlock id="solution" label="The solution">
          <p className="cs__lead">{project.solution}</p>
          <ul className="cs__features">
            {project.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </CaseBlock>

        {project.architecture ? (
          <CaseBlock id="architecture" label="Architecture">
            <p className="muted cs__prose">{project.architecture}</p>
            <ul className="cs__tech" aria-label="Technologies used on this project">
              {project.technologies.map((t) => (
                <TechnologyBadge key={t} label={t} />
              ))}
            </ul>
          </CaseBlock>
        ) : null}

        {/* `results` has been in the project records all along but was never
            rendered — the strongest evidence on the page was invisible. */}
        {project.results.length ? (
          <CaseBlock id="results" label="Results">
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
          </CaseBlock>
        ) : null}

        {frames.length ? (
          <CaseBlock id="gallery" label="Screens">
            <ul className="cs__gallery">
              {frames.map((frame) => (
                <li key={frame.src}>
                  <figure className="shot">
                    <SmartImage
                      src={frame.src}
                      alt={frame.alt}
                      width={frame.width}
                      height={frame.height}
                      sizes="(min-width: 900px) 50vw, 100vw"
                    />
                  </figure>
                </li>
              ))}
            </ul>
          </CaseBlock>
        ) : null}
      </div>

      {related.length ? (
        <div className="shell">
          <CaseBlock id="related" label="Related work">
            <ul className="cs__related">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link href={"/work/" + p.slug} className="cs__related-card">
                    <span className="cs__related-cat">{p.category}</span>
                    <span className="cs__related-title">{p.title}</span>
                    <span className="cs__related-tag muted">{p.tagline}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </CaseBlock>
        </div>
      ) : null}

      <div className="shell">
        <nav className="cs__pager" aria-label="Case studies">
          {previous && previous.slug !== project.slug ? (
            <Link className="cs__pager-link" href={"/work/" + previous.slug} rel="prev">
              <span className="cs__pager-k">Previous</span>
              <span className="cs__pager-title">{previous.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && next.slug !== project.slug ? (
            <Link className="cs__pager-link cs__pager-link--next" href={"/work/" + next.slug} rel="next">
              <span className="cs__pager-k">Next</span>
              <span className="cs__pager-title">{next.title}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </article>
  );
}

/** One titled movement of the case study, with a stable id so it can be linked. */
function CaseBlock({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="cs__block" id={id} aria-labelledby={`cs-${id}`}>
      <h2 className="cs__block-title" id={`cs-${id}`}>
        {label}
      </h2>
      <div className="cs__block-body">{children}</div>
    </section>
  );
}
