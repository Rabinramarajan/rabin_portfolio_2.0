import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCover } from "@/components/ProjectCover";
import { CaseChapter } from "@/components/work/CaseChapter";
import { CaseGallery } from "@/components/work/CaseGallery";
import { FeatureRail } from "@/components/work/FeatureRail";
import { ShareCase } from "@/components/work/ShareCase";
import {
  IconBolt,
  IconBriefcase,
  IconCalendar,
  IconCheck,
  IconClock,
  IconCode,
  IconGrid,
  IconImage,
  IconLayers,
  IconMonitor,
  IconSpark,
  IconUsers,
  PROCESS_ICONS,
} from "@/components/work/case-icons";
import {
  galleryFrames,
  getNextProject,
  getPreviousProject,
  getProject,
  projects,
  relatedProjects,
} from "@/content/projects";
import { processSteps } from "@/content/process";
import type { Project, ProjectChallenge, ProjectFeature } from "@/content/types";
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

/** The five movements of the delivery process, paired with their rail icon. */
const SOLUTION_STEPS = processSteps.slice(0, 5).map((step, i) => ({
  number: step.number,
  label: step.label,
  purpose: step.purpose,
  Icon: PROCESS_ICONS[i] ?? IconSpark,
}));

/**
 * A case study, told as a numbered sequence of chapters.
 *
 * The chapter list is built from the project record rather than hardcoded: a
 * project with no evidenced metrics and no gallery simply has fewer chapters,
 * and the numbering derives from that one array, so it can never skip or
 * repeat. That is what keeps the no-fabrication rule structural — an absent
 * fact removes a card, a strip cell or a whole chapter instead of inviting
 * filler to stand in for it.
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

  const challenges = challengeCards(project);
  const features = featureCards(project);
  const hasEngineering = Boolean(
    project.architecture || project.stack?.length || project.responsibilities?.length || project.decisions?.length,
  );
  const hasOutcome = project.results.length > 0 || (project.metrics?.length ?? 0) > 0;

  /* The chapters that will actually render, in order — the single source for
     both the numbering and the presence of each section below. */
  const chapters = [
    ...(challenges.length ? ["challenge"] : []),
    "solution",
    ...(features.length ? ["features"] : []),
    ...(hasEngineering ? ["engineering"] : []),
    ...(hasOutcome ? ["outcome"] : []),
    ...(frames.length ? ["gallery"] : []),
  ];

  /* The hero is chapter 01, so every other chapter is offset by one. */
  const no = (id: string) => String(chapters.indexOf(id) + 2).padStart(2, "0");

  /* The delivery strip. Each cell is dropped, not defaulted, when the record
     has nothing to put in it. */
  const strip = [
    project.timeline ? { Icon: IconClock, value: project.timeline, label: "Timeline" } : null,
    project.platform?.length
      ? { Icon: IconMonitor, value: project.platform.join(" · "), label: "Platform" }
      : null,
    project.status ? { Icon: IconCheck, value: project.status, label: "Status" } : null,
    project.team ? { Icon: IconUsers, value: project.team, label: "Collaboration" } : null,
  ].filter((cell): cell is StripCell => cell !== null);

  return (
    <article className="wd">
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

      <div className="shell wd__shell">
        <nav className="wd__back" aria-label="Breadcrumb">
          <Link href="/work">
            <svg viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
              <path d="M19 6H2M6.5 1.5 2 6l4.5 4.5" />
            </svg>
            Back to Work
          </Link>
        </nav>

        {/* --- 01 / SELECTED WORK ------------------------------------- */}
        <header className="wd__hero">
          <div className="wd__hero-copy">
            <p className="wd__eyebrow">
              <span className="wd__eyebrow-no">01</span>
              <span className="wd__eyebrow-slash" aria-hidden>
                /
              </span>
              <span className="wd__eyebrow-label">Selected work</span>
            </p>

            <h1 className="wd__title">{project.title}</h1>
            <p className="wd__tagline">{project.tagline}</p>
            <p className="wd__intro">{project.overview}</p>

            <dl className="wd__meta">
              <Meta Icon={IconBriefcase} label="Role" value={project.role} />
              <Meta Icon={IconMonitor} label="Type" value={project.category} />
              <Meta Icon={IconCalendar} label="Year" value={project.year} />
              <Meta Icon={IconLayers} label="Stack" value={project.technologies.join(" · ")} wide />
            </dl>

            {project.liveUrl ? (
              <a className="wd__live" href={project.liveUrl} target="_blank" rel="noreferrer noopener">
                Visit live product
                <svg viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
                  <path d="M1 6h17M13.5 1.5 18 6l-4.5 4.5" />
                </svg>
              </a>
            ) : null}
          </div>

          <figure className="wd__shot">
            <ProjectCover project={project} priority sizes="(min-width: 1080px) 52vw, 100vw" />
          </figure>
        </header>

        {strip.length ? (
          <dl className="wd__strip" data-cells={strip.length}>
            {strip.map((cell) => (
              <div className="wd__strip-cell" key={cell.label}>
                <cell.Icon className="wd__strip-icon" />
                <div>
                  <dd className="wd__strip-value">{cell.value}</dd>
                  <dt className="wd__strip-label">{cell.label}</dt>
                </div>
              </div>
            ))}
          </dl>
        ) : null}

        {/* --- 02 / THE CHALLENGE ------------------------------------- */}
        {challenges.length ? (
          <CaseChapter
            id="challenge"
            no={no("challenge")}
            label="The challenge"
            title="What made this hard."
            lede={project.problem}
            icon={<IconBolt className="wd__eyebrow-glyph" />}
          >
            <ul className="wd__cards">
              {challenges.map((c, i) => (
                <li className="wd__card" key={c.title}>
                  <div className="wd__card-top">
                    <span className="wd__card-no">{String(i + 1).padStart(2, "0")}</span>
                    <CardIcon at={i} />
                  </div>
                  <p className="wd__card-title">{c.title}</p>
                  {c.description ? <p className="wd__card-body">{c.description}</p> : null}
                </li>
              ))}
            </ul>
          </CaseChapter>
        ) : null}

        {/* --- 03 / THE SOLUTION -------------------------------------- */}
        <CaseChapter
          id="solution"
          no={no("solution")}
          label="The solution"
          title="From requirements to a shipped product."
          lede={project.solution}
          link={{ href: "/process", text: "Explore the process" }}
          icon={<IconSpark className="wd__eyebrow-glyph" />}
        >
          <ol className="wd__flow">
            {SOLUTION_STEPS.map((step) => (
              <li className="wd__flow-step" key={step.number}>
                <span className="wd__flow-dot" aria-hidden>
                  <step.Icon className="wd__flow-icon" />
                </span>
                <span className="wd__flow-no">{step.number}</span>
                <span className="wd__flow-label">{step.label}</span>
                <span className="wd__flow-body">{step.purpose}</span>
              </li>
            ))}
          </ol>
        </CaseChapter>

        {/* --- 04 / KEY FEATURES -------------------------------------- */}
        {features.length ? (
          <CaseChapter
            id="features"
            no={no("features")}
            label="Key features"
            title="What the product does."
            icon={<IconGrid className="wd__eyebrow-glyph" />}
          >
            <FeatureRail features={features} />
          </CaseChapter>
        ) : null}

        {/* --- 05 / ENGINEERING --------------------------------------- */}
        {hasEngineering ? (
          <CaseChapter
            id="engineering"
            no={no("engineering")}
            label="Engineering"
            title="How it was built."
            lede={project.architecture}
            icon={<IconCode className="wd__eyebrow-glyph" />}
          >
            {project.stack?.length ? (
              <dl className="wd__stack">
                {project.stack.map((row) => (
                  <div className="wd__stack-row" key={row.layer}>
                    <dt>{row.layer}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {project.responsibilities?.length ? (
              <div className="wd__group">
                <h3 className="wd__sub">My contribution</h3>
                <ul className="wd__bullets">
                  {project.responsibilities.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {project.decisions?.length ? (
              <div className="wd__group">
                <h3 className="wd__sub">Decisions that shaped the product</h3>
                <div className="wd__decisions">
                  {project.decisions.map((d) => (
                    <div className="wd__decision" key={d.decision}>
                      <p className="wd__decision-q">{d.problem}</p>
                      <p className="wd__decision-a">{d.decision}</p>
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
              </div>
            ) : null}

            <ul className="wd__tech" aria-label="Technologies used on this project">
              {project.technologies.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </CaseChapter>
        ) : null}

        {/* --- 06 / OUTCOME ------------------------------------------- */}
        {hasOutcome ? (
          <CaseChapter
            id="outcome"
            no={no("outcome")}
            label="Outcome"
            title="What it changed."
            icon={<IconCheck className="wd__eyebrow-glyph" />}
          >
            {/* Numbers only where the record carries an evidenced one. Every
                other project falls back to the qualitative outcome lines
                rather than manufacturing a percentage. */}
            {project.metrics?.length ? (
              <ul className="wd__metrics">
                {project.metrics.map((m) => (
                  <li key={m.label}>
                    <p className="wd__metric-value">{m.value}</p>
                    <p className="wd__metric-label">{m.label}</p>
                    {m.note ? <p className="wd__metric-note">{m.note}</p> : null}
                  </li>
                ))}
              </ul>
            ) : null}

            {project.results.length ? (
              <ol className="wd__results">
                {project.results.map((r, i) => (
                  <li key={r}>
                    <span className="wd__results-no" aria-hidden>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{r}</span>
                  </li>
                ))}
              </ol>
            ) : null}
          </CaseChapter>
        ) : null}

        {/* --- 07 / PROJECT GALLERY ----------------------------------- */}
        {frames.length ? (
          <CaseChapter
            id="gallery"
            no={no("gallery")}
            label="Project gallery"
            title="The product, on screen."
            icon={<IconImage className="wd__eyebrow-glyph" />}
          >
            <CaseGallery frames={frames} />
          </CaseChapter>
        ) : null}

        <ShareCase url={url} title={project.title} />

        {related.length ? (
          <section className="wd__related-wrap" aria-labelledby="wd-related">
            <h2 className="wd__sub" id="wd-related">
              You may also want to see
            </h2>
            <ul className="wd__related">
              {related.map((p) => (
                <RelatedCard key={p.slug} project={p} />
              ))}
            </ul>
          </section>
        ) : null}

        <section className="wd__next" aria-labelledby="wd-next">
          <h2 className="sr-only" id="wd-next">
            Continue
          </h2>
          <nav className="wd__pager" aria-label="Case studies">
            {previous && previous.slug !== project.slug ? (
              <Link className="wd__pager-link" href={"/work/" + previous.slug} rel="prev">
                <span className="wd__pager-k">Previous project</span>
                <span className="wd__pager-title">{previous.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && next.slug !== project.slug ? (
              <Link className="wd__pager-link wd__pager-link--next" href={"/work/" + next.slug} rel="next">
                <span className="wd__pager-k">Next project</span>
                <span className="wd__pager-title">{next.title}</span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </section>

        <section className="wd__cta" aria-labelledby="wd-cta">
          <h2 className="wd__cta-title" id="wd-cta">
            Have a similar challenge?
          </h2>
          <p className="wd__cta-body">Let&apos;s build something production-ready.</p>
          <div className="wd__cta-actions">
            <Link className="wd__cta-btn wd__cta-btn--solid" href="/contact">
              Start a conversation
            </Link>
            <Link className="wd__cta-btn" href="/work">
              View all work
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}

type IconComponent = (props: { className?: string }) => React.ReactElement;
type StripCell = { Icon: IconComponent; value: string; label: string };

/**
 * The challenge cards. A project that names its pressures gets one card each;
 * one that only carries the single `challenge` sentence gets that sentence as
 * a single card, rather than having it cut into three to fill the row.
 */
function challengeCards(project: Project): ProjectChallenge[] {
  if (project.challenges?.length) return project.challenges;
  if (project.challenge) return [{ title: "Engineering challenge", description: project.challenge }];
  return [];
}

/**
 * The key-feature cards. Written-out features are used as they are; otherwise
 * the `features` strings become title-only cards, illustrated by whatever
 * gallery frames the project actually shipped — never by a stand-in image.
 */
function featureCards(project: Project): ProjectFeature[] {
  if (project.keyFeatures?.length) return project.keyFeatures;
  return project.features.map((title, i) => ({
    title,
    description: "",
    image: project.gallery[i],
  }));
}

/** The card icons cycle, so a project with any number of cards stays varied. */
function CardIcon({ at }: { at: number }) {
  const Icon = [IconLayers, IconBolt, IconGrid, IconCode][at % 4];
  return <Icon className="wd__card-icon" />;
}

function Meta({
  Icon,
  label,
  value,
  wide,
}: {
  Icon: IconComponent;
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={"wd__meta-cell" + (wide ? " wd__meta-cell--wide" : "")}>
      <Icon className="wd__meta-icon" />
      <div>
        <dt>{label}</dt>
        <dd>{value}</dd>
      </div>
    </div>
  );
}

function RelatedCard({ project: p }: { project: Project }) {
  return (
    <li>
      <Link href={"/work/" + p.slug} className="wd__related-card">
        <span className="wd__related-shot" aria-hidden>
          <ProjectCover project={p} sizes="(min-width: 900px) 30vw, 100vw" decorative />
        </span>
        <span className="wd__related-cat">{p.category}</span>
        <span className="wd__related-title">{p.title}</span>
        <span className="wd__related-tag">{p.tagline}</span>
      </Link>
    </li>
  );
}
