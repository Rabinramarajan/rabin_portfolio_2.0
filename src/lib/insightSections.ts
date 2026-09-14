import type { InsightBlock } from "@/content/types";

/**
 * A numbered section of an article: one `heading` block, its anchor, and the
 * slot number the design shows beside it.
 */
export type InsightSection = {
  id: string;
  text: string;
  /**
   * "01", "02" — zero-padded so the rail's numbers stay optically aligned.
   *
   * `null` on an article that numbers its own headings ("1. Define the
   * problem…"). Those numbers are the author's, they are part of the argument
   * — a checklist that starts at 0 means it — and rendering a second set
   * beside them gives every section two different numbers.
   */
  number: string | null;
};

/** A heading that already carries its own leading number: "3. ", "3) ". */
const SELF_NUMBERED = /^\d+\s*[.)]\s+/;

/** Stable anchor for a heading, so sections are linkable and citable. */
function insightHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * The article's headings, in order.
 *
 * Derived here rather than authored anywhere so the contents rail, the
 * numbers rendered beside each heading and the anchors they scroll to are all
 * computed from the same pass over the same blocks — a heading cannot appear
 * in one and not the other.
 *
 * Duplicate heading text is disambiguated with a numeric suffix: two sections
 * called "The deliverable" would otherwise share an id, and every link to the
 * second would land on the first.
 */
export function insightSections(blocks: InsightBlock[] = []): InsightSection[] {
  const seen = new Map<string, number>();
  const sections: InsightSection[] = [];
  const headings = blocks.filter(
    (b): b is { type: "heading"; text: string } => typeof b !== "string" && b.type === "heading",
  );
  /* Decided once for the whole article, not per heading: a piece whose steps
     are numbered usually has one or two closing sections that are not, and
     numbering only those would read as an error. */
  const selfNumbered = headings.some((h) => SELF_NUMBERED.test(h.text));

  for (const heading of headings) {
    const base = insightHeadingId(heading.text) || "section";
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    sections.push({
      id: count === 1 ? base : `${base}-${count}`,
      text: heading.text,
      number: selfNumbered ? null : String(sections.length + 1).padStart(2, "0"),
    });
  }

  return sections;
}
