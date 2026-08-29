import Link from "next/link";
import { ProjectCover } from "@/components/ProjectCover";
import type { Project } from "@/content/types";
import { cn } from "@/lib/cn";

function LaunchIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M6 3.5H3.5v9h9V10" />
      <path d="M9.5 3.5H12.5V6.5M12.5 3.5 7.5 8.5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M0 6h17M12.5 1.5 17 6l-4.5 4.5" />
    </svg>
  );
}

/**
 * One project, as a card.
 *
 * The card carries identity only — index, cover, title, category, one line of
 * copy and the affordance into the case study. Everything else belongs to the
 * case study; a card that restates it stops being scannable.
 *
 * The whole card is one link, and every hover move (border warming to the
 * accent, cover easing behind a fixed mask, the "View Case Study" arrow
 * stepping right) is driven from a single `:hover, :focus-within` rule so the
 * keyboard path is identical and reduced motion can drop all of it at once.
 */
export function ProjectCard({
  project: p,
  headingLevel: Heading = "h3",
  priority,
  className,
}: {
  project: Project;
  headingLevel?: "h2" | "h3";
  priority?: boolean;
  className?: string;
}) {
  return (
    <article className={cn("pcard", className)} data-motion="work-card">
      <Link
        href={`/work/${p.slug}`}
        className="pcard__link"
        data-cursor="project"
        data-cursor-label="VIEW PROJECT →"
      >
        <span className="pcard__frame" data-motion="card-frame">
          <span className="pcard__shot" data-motion="card-image">
            <ProjectCover
              project={p}
              sizes="(min-width: 1180px) 33vw, (min-width: 720px) 50vw, 100vw"
              priority={priority}
              decorative
            />
          </span>
          <span className="pcard__veil" data-motion="card-overlay" aria-hidden />
          <span className="pcard__no" aria-hidden>
            {p.number}
          </span>
          <span className="pcard__launch" aria-hidden>
            <LaunchIcon />
          </span>
        </span>

        <span className="pcard__body">
          <Heading className="pcard__title">{p.title}</Heading>
          <span className="pcard__cat">{p.category}</span>
          <span className="pcard__tagline">{p.overview}</span>
          <span className="pcard__cta" aria-hidden>
            View Case Study
            <ArrowIcon />
          </span>
        </span>
      </Link>
    </article>
  );
}
