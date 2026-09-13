import type { Insight } from "@/content/types";

/**
 * The image shown for an article in the listing.
 *
 * An article can carry its own `cover`; until it does, it gets the generated
 * plate for its topic (see scripts/generate-insight-placeholders.mjs). The
 * two are deliberately the same shape, so authoring a real cover is a
 * one-line content change with no component to touch.
 *
 * `placeholder` says which of the two came back. A placeholder is decoration
 * — it carries no information the title does not — so the caller renders it
 * with an empty alt and hides it from assistive tech; a real cover gets its
 * authored alt text.
 */
export type InsightCover = {
  src: string;
  alt: string;
  width: number;
  height: number;
  placeholder: boolean;
};

const PLACEHOLDERS: Record<string, string> = {
  Architecture: "/insights/topic-architecture.svg",
  Performance: "/insights/topic-performance.svg",
  Design: "/insights/topic-design.svg",
  Accessibility: "/insights/topic-accessibility.svg",
  Mobile: "/insights/topic-mobile.svg",
  Practice: "/insights/topic-practice.svg",
};

export function insightCover(item: Insight): InsightCover {
  if (item.cover) return { ...item.cover, placeholder: false };
  return {
    src: PLACEHOLDERS[item.topic ?? ""] ?? PLACEHOLDERS.Architecture,
    alt: "",
    /* The generated plates are all authored at this size. */
    width: 1600,
    height: 900,
    placeholder: true,
  };
}
