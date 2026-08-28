import Link from "next/link";
import { ProjectCover } from "@/components/ProjectCover";
import type { Project } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * One project, as a card.
 *
 * The card carries identity only — number, frame, title, one line of copy and
 * the stack. The case study owns everything else; a card that restates the
 * case study stops being scannable.
 *
 * Interaction is a single coordinated move rather than a pile of effects: the
 * frame eases to 1.04 behind a fixed mask, the metadata row lifts in and the
 * "View case study" affordance slides up from under the title. All of it is
 * driven from one `:hover, :focus-within` rule in CSS so the keyboard path
 * gets the identical treatment, and all of it is suppressed under
 * `prefers-reduced-motion`.
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
          <span className="pcard__parallax" data-card-parallax>
            <span className="pcard__mouse" data-card-mouse>
              <span className="pcard__shot" data-motion="card-image">
                <ProjectCover
                  project={p}
                  sizes="(min-width: 1180px) 33vw, (min-width: 720px) 50vw, 100vw"
                  priority={priority}
                  decorative
                />
              </span>
            </span>
          </span>
          <span className="pcard__no" aria-hidden>
            {p.number}
          </span>
          <span className="pcard__veil" data-motion="card-overlay" aria-hidden />
          <span className="pcard__shine" aria-hidden />
        </span>

        <span className="pcard__body">
          <span className="pcard__meta">
            <span className="pcard__cat">{p.category}</span>
            <span className="pcard__dot" aria-hidden />
            <span>{p.year}</span>
          </span>

          <Heading className="pcard__title">
            {p.title}
            <span className="pcard__arrow" aria-hidden>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M5 11 11 5M5.5 5H11v5.5" />
              </svg>
            </span>
          </Heading>
          <span className="pcard__tagline">{p.tagline}</span>

          <span className="pcard__reveal">
            <span className="pcard__role">{p.role}</span>
            {p.platform?.length ? (
              <span className="pcard__platform">{p.platform.join(" · ")}</span>
            ) : null}
          </span>

          <span className="pcard__foot">
            <span className="pcard__stack">
              {p.technologies.slice(0, 3).map((t) => (
                <span className="pcard__tech" key={t}>
                  {t}
                </span>
              ))}
              {p.technologies.length > 3 ? (
                <span className="pcard__tech pcard__tech--more">{`+${p.technologies.length - 3}`}</span>
              ) : null}
            </span>
            <span className="pcard__cta" aria-hidden>
              View case study
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M5 11 11 5M5.5 5H11v5.5" />
              </svg>
            </span>
          </span>
        </span>
      </Link>
    </article>
  );
}
