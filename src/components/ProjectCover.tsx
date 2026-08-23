import { SmartImage } from "@/components/SmartImage";
import { cn } from "@/lib/cn";
import type { Project } from "@/content/types";

/**
 * A project's cover frame.
 *
 * Four case studies ship without a captured screenshot. Rather than pointing
 * `cover` at a file that does not exist — which rendered a broken image on the
 * work grid, the case-study hero and the OG card — those projects omit `cover`
 * and get a typographic poster built from their own metadata instead. It keeps
 * the card rhythm and the brand tint, and needs no invented artwork.
 */
export function ProjectCover({
  project,
  sizes,
  priority,
  decorative,
  className,
}: {
  project: Project;
  sizes?: string;
  priority?: boolean;
  /** True when a sibling element already names the project (thumbnails). */
  decorative?: boolean;
  className?: string;
}) {
  const { cover } = project;
  if (cover) {
    return (
      <SmartImage
        src={cover.src}
        alt={decorative ? "" : cover.alt}
        width={cover.width}
        height={cover.height}
        sizes={sizes}
        priority={priority}
        className={className}
      />
    );
  }

  return (
    <span
      className={cn("project-poster", className)}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : `${project.title} — ${project.category}`}
      aria-hidden={decorative || undefined}
    >
      <span className="project-poster__no">{project.number}</span>
      <span className="project-poster__title">{project.title}</span>
      <span className="project-poster__meta">
        {project.category} · {project.year}
      </span>
    </span>
  );
}
