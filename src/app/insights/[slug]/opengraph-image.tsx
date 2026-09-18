import { insights } from "@/content/insights";
import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "Engineering note by Rabin R";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return insights.map((item) => ({ slug: item.id }));
}

/* The card carries the editorial headline rather than the SEO title: a feed
   is a place to read, and the search-shaped title is written for a SERP. */
export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = insights.find((entry) => entry.id === slug);
  return ogCard({
    eyebrow: "Insight",
    title: item?.title ?? "Insights",
    subtitle: item?.dek,
    footer: "Angular · Frontend Engineering",
  });
}
