import Link from "next/link";
import type { LegalDocument as LegalDocumentContent } from "@/content/legal";
import { SectionKicker } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

/** Long-form date for the visible stamp; the machine-readable value stays ISO. */
function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Renders a legal document from content. Both /privacy and /terms use this, so
 * the two pages cannot drift apart in structure or heading level.
 */
export function LegalDocument({ doc }: { doc: LegalDocumentContent }) {
  return (
    <article className="section">
      <div className="shell" style={{ maxWidth: "42rem" }}>
        <BreadcrumbJsonLd
          trail={[
            { name: "Home", path: "/" },
            { name: doc.title, path: doc.path },
          ]}
        />

        <nav className="crumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-current="page">{doc.title}</li>
          </ol>
        </nav>

        <SectionKicker index="—" label="Legal" />
        <h1 className="sec-title">{doc.title}</h1>
        <p className="sec-lede">{doc.lede}</p>
        <p className="legal__meta">
          Last reviewed{" "}
          <time dateTime={doc.effective}>{formatDate(doc.effective)}</time>
        </p>

        {doc.sections.map((section) => (
          <section key={section.heading} className="legal__body" style={{ marginTop: "2.5rem" }}>
            <h2 className="legal__section-title">{section.heading}</h2>
            {section.paragraphs?.map((paragraph, i) => (
              <p key={i} style={{ marginTop: "1rem" }}>
                {paragraph}
              </p>
            ))}
            {section.bullets?.length ? (
              <ul className="legal__list">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <p style={{ marginTop: "2.5rem" }}>
          <Link className="btn btn--line" href="/contact">
            <span className="btn__label">Ask a question →</span>
          </Link>
        </p>
      </div>
    </article>
  );
}
