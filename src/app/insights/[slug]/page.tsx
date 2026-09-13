import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { insights, isPublished } from "@/content/insights";
import { InsightArticle } from "@/components/insights/InsightArticle";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return insights.map((i) => ({ slug: i.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = insights.find((i) => i.id === slug);
  if (!item) return { title: "Not found", robots: { index: false, follow: false } };
  const meta = pageMetadata({
    title: item.seoTitle ?? item.title ?? "Insight",
    description:
      item.seoDescription ??
      item.dek ??
      "An engineering position from Rabin R's shipped Angular and frontend work.",
    path: "/insights/" + item.id,
    type: "article",
    // The route ships its own opengraph-image; inheriting would double the tags.
    inheritOgImage: false,
  });
  // A stub with only a title and a dek is thin content — keep it crawlable but
  // out of the index until `body` is written. See Insight.body in types.ts.
  return isPublished(item) ? meta : { ...meta, robots: { index: false, follow: true } };
}

/**
 * One article.
 *
 * The route's own job is metadata, schema and the 404 — everything visual
 * lives in `InsightArticle`, which the layout is complex enough to deserve.
 */
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = insights.find((i) => i.id === slug);
  if (!item) notFound();

  // Written but dated ahead: the route renders (so the link is previewable)
  // but it is unlisted, out of the sitemap and noindex until the date lands.
  const live = isPublished(item);

  return (
    <>
      {/* Article schema only once the post has a body — a stub is thin
          content and is already kept out of the index. */}
      {live ? (
        <ArticleJsonLd
          headline={item.title ?? "Insight"}
          description={item.dek ?? ""}
          path={"/insights/" + item.id}
          datePublished={item.datePublished}
          dateModified={item.dateModified}
        />
      ) : null}
      <BreadcrumbJsonLd
        trail={[
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
          { name: item.title ?? "Insight", path: "/insights/" + item.id },
        ]}
      />
      <InsightArticle item={item} />
    </>
  );
}
