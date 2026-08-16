import { StackTechIcon } from "@/components/StackTechIcon";

/**
 * Brand marks for the About section's "Tools & Technologies" tiles and every
 * other technology chip in the app. Renders through tech-stack-icons (MIT);
 * unmapped ids degrade to a two-letter mark instead of an empty tile.
 */
export function TechIcon({
  id,
  label,
  className,
}: {
  id: string;
  label: string;
  className?: string;
}) {
  return <StackTechIcon id={id} label={label} className={className} />;
}