import Link from "next/link";
import { projects } from "@/content/projects";
import type { Project } from "@/content/types";
import { ProjectCover } from "@/components/ProjectCover";
import { WorkOrbit } from "@/components/work/WorkOrbit";
import { cn } from "@/lib/cn";
import { SectionKicker, itemHeadingLevel } from "@/components/ui";
import { sections } from "@/content/sections";

/**
 * WORK — the selected-work hero.
 *
 * A statement header (kicker, two-line headline, lede, "View All Projects")
 * with the orbital field riding its right edge, and a row of project cards
 * beneath it. Each card is one link: numbered badge and launch glyph over the
 * cover, then title, category and one line of copy.
 *
 * There is no stage, filter rail or chapter index here any more — the block
 * states the work and hands off to `/work` for the catalogue.
 *
 * `headingLevel` drops to h2 when the block sits below another hero so the
 * document keeps exactly one h1. `limit` caps how many cards are shown.
 */
export function WorkSection({
  id = "work",
  headingLevel = "h2",
  index,
  limit = 3,
}: {
  id?: string;
  headingLevel?: "h1" | "h2";
  index?: string;
  limit?: number;
} = {}) {
  const Heading = headingLevel;
  const ItemHeading = itemHeadingLevel(headingLevel);
  const isPageHero = headingLevel === "h1";
  const intro = sections.work;

  // Featured first, then the rest, so the row leads with the strongest work.
  const list = [...projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured)).slice(0, limit);
  if (!list.length) return null;

  return (
    <section id={id} data-section="work" className={cn("wx", isPageHero && "wx--page")}>
      <span className="wx__aura" aria-hidden />

      <div className="shell wx__shell">
        <div className="wx__intro">
          <div className="wx__intro-copy">
            <SectionKicker index={index ?? intro.index} label={intro.label} className="wx__kicker" />

            <Heading className="wx__title">
              {intro.title.map((line, i) => (
                <span key={line.text}>
                  {line.newline ? <br /> : i > 0 ? " " : null}
                  {line.accent ? <span className="wx__title-accent">{line.text}</span> : line.text}
                </span>
              ))}
            </Heading>

            <p className="wx__lede">{intro.lede}</p>

            <Link className="wx__all" href="/work">
              <span className="wx__all-dot" aria-hidden />
              <span>View All Projects</span>
              <ArrowRight />
            </Link>
          </div>

          <div className="wx__orbit">
            <WorkOrbit />
          </div>
        </div>

        <ul className="wx__grid">
          {list.map((p, i) => (
            <li key={p.slug}>
              <WorkCard project={p} itemHeading={ItemHeading} priority={isPageHero && i === 0} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** One project card — the whole tile is a single link into the case study. */
function WorkCard({
  project: p,
  itemHeading: ItemHeading,
  priority,
}: {
  project: Project;
  itemHeading: "h2" | "h3";
  priority?: boolean;
}) {
  return (
    <article className="wcard">
      <Link
        href={`/work/${p.slug}`}
        className="wcard__link"
        data-cursor="project"
        data-cursor-label="VIEW PROJECT →"
      >
        <span className="wcard__frame">
          <span className="wcard__shot">
            <ProjectCover
              project={p}
              sizes="(min-width: 1100px) 33vw, (min-width: 720px) 50vw, 100vw"
              priority={priority}
              decorative
            />
          </span>
          <span className="wcard__veil" aria-hidden />
          <span className="wcard__no" aria-hidden>
            {p.number}
          </span>
          <span className="wcard__launch" aria-hidden>
            <LaunchIcon />
          </span>
        </span>

        <span className="wcard__body">
          <ItemHeading className="wcard__title">{p.title}</ItemHeading>
          <span className="wcard__cat">{p.category}</span>
          <span className="wcard__copy">{p.overview}</span>

          {p.metrics && p.metrics.length > 0 && (
            <span className="wcard__metrics">
              <span className="wcard__metrics-label">Impact</span>
              <span className="wcard__metrics-list">
                {p.metrics.map((m, idx) => (
                  <span key={idx} className="wcard__metric">
                    <span className="wcard__metric-value">{m.value}</span>
                    <span className="wcard__metric-label">{m.label}</span>
                  </span>
                ))}
              </span>
            </span>
          )}

          <span className="wcard__cta">
            <span className="wcard__cta-dot" aria-hidden />
            <span>View Case Study</span>
            <ArrowRight />
          </span>
        </span>
      </Link>
    </article>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M0 6h17M12.5 1.5 17 6l-4.5 4.5" />
    </svg>
  );
}

function LaunchIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M6 3.5H3.5v9h9V10" />
      <path d="M9.5 3.5H12.5V6.5M12.5 3.5 7.5 8.5" />
    </svg>
  );
}
