import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { insights } from "@/content/insights";
import { SectionKicker } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return insights.map((i) => ({ slug: i.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = insights.find((i) => i.id === slug);
  if (!item) return { title: "Not found", robots: { index: false, follow: false } };
  return pageMetadata({
    title: item.title ?? "Insight",
    description:
      item.dek ??
      "An engineering position from Rabin R's shipped Angular and frontend work.",
    path: "/insights/" + item.id,
    type: "article",
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = insights.find((i) => i.id === slug);
  if (!item) notFound();
  return (
    <article className="section">
      <div className="shell" style={{ maxWidth: "42rem" }}>
        <BreadcrumbJsonLd
          trail={[
            { name: "Home", path: "/" },
            { name: "Insights", path: "/insights" },
            { name: item.title ?? "Insight", path: "/insights/" + item.id },
          ]}
        />
        <nav className="crumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/insights">Insights</Link>
            </li>
            <li aria-current="page">{item.title}</li>
          </ol>
        </nav>
        <SectionKicker index={item.number ?? "09"} label="Insight" />
        <h1 className="sec-title">{item.title}</h1>
        <p className="sec-lede">{item.dek}</p>
        <p className="muted" style={{ marginTop: "1.5rem" }}>
          This is a working position from shipped Angular and frontend work — not a metric claim, and not a client list.
        </p>
        <p style={{ marginTop: "2rem" }}>
          <Link className="btn btn--line" href="/insights">
            <span className="btn__label">All insights →</span>
          </Link>
        </p>
      </div>
    </article>
  );
}
