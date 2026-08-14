import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getNextProject, getProject, projects } from "@/content/projects";
import { Btn, SectionKicker } from "@/components/ui";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Not found" };
  return { title: project.seo.title, description: project.seo.description, alternates: { canonical: "/work/" + project.slug } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const next = getNextProject(slug);
  return (
    <article className="section">
      <div className="shell">
        <SectionKicker index={project.number} label={project.category} />
        <h1 className="sec-title">{project.title}</h1>
        <p className="sec-lede">{project.tagline}</p>
        <p className="case-meta">
          <span>{project.year}</span>
          <span>{project.role}</span>
          <span>{project.technologies.join(" / ")}</span>
        </p>
        <div className="shot">
          <Image src={project.cover.src} alt={project.cover.alt} width={project.cover.width} height={project.cover.height} priority sizes="100vw" />
        </div>
        <div className="case-split">
          <div>
            <p className="mono faint">Overview</p>
            <p style={{ marginTop: "0.5rem" }}>{project.overview}</p>
          </div>
          <div>
            <p className="mono faint">Challenge</p>
            <p className="muted" style={{ marginTop: "0.5rem" }}>
              {project.challenge || project.problem}
            </p>
            <p className="mono faint" style={{ marginTop: "1.1rem" }}>
              Solution
            </p>
            <p className="muted" style={{ marginTop: "0.5rem" }}>
              {project.solution}
            </p>
          </div>
        </div>
        {project.architecture ? (
          <div style={{ marginTop: "2rem" }}>
            <p className="mono faint">Architecture</p>
            <p className="muted" style={{ marginTop: "0.5rem" }}>
              {project.architecture}
            </p>
          </div>
        ) : null}
        <div style={{ marginTop: "2rem" }}>
          <p className="mono faint">Key features</p>
          <ul className="muted" style={{ marginTop: "0.6rem", display: "grid", gap: "0.35rem" }}>
            {project.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
        {next ? (
          <div style={{ marginTop: "3rem", paddingTop: "1.5rem", borderTop: "1px solid var(--color-line)" }}>
            <p className="muted">Next project</p>
            <Btn href={"/work/" + next.slug} variant="line">
              {next.title}
            </Btn>
          </div>
        ) : null}
      </div>
    </article>
  );
}
