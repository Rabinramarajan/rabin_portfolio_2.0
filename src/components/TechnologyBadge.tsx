import { StackTechIcon } from "@/components/StackTechIcon";
import { cn } from "@/lib/cn";

/**
 * One technology, as a brand-marked chip.
 *
 * The same chip markup was written out by hand in the services page and again
 * on the case study page, which meant the brand mark, the spacing and the
 * fallback behaviour had to be kept in sync by memory. It renders an <li>
 * because every call site lists technologies.
 */
export function TechnologyBadge({
  label,
  id,
  className,
}: {
  label: string;
  id?: string;
  className?: string;
}) {
  return (
    <li className={cn("techbadge", className)}>
      <StackTechIcon id={id} label={label} className="techbadge__icon" />
      <span>{label}</span>
    </li>
  );
}
