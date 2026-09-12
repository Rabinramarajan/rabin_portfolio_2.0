import Link from "next/link";
import { PageSectionHead } from "@/components/pages/PageSectionHead";
import type { ServicePageContent } from "@/content/service-pages";

/**
 * The prose body of a service detail page.
 *
 * These routes used to be a deliverables list and a list of links, which is
 * thin for a page meant to answer "should I hire this person for this" — and
 * gives an AI search surface nothing quotable. This renders the written part:
 * the problem, the approach, how an engagement runs, and the questions that
 * come up first.
 *
 * The FAQ block is deliberately plain markup with no FAQPage schema: Google
 * retired FAQ rich results for sites like this one, and a second FAQPage entity
 * would compete with the one on the homepage. Server-rendered question and
 * answer text is what actually gets extracted, and that is what this emits.
 *
 * `startIndex` continues the numbered section rail the page already started,
 * so the numbering does not restart halfway down.
 */
export function ServiceNarrative({
  content,
  startIndex = 3,
}: {
  content: ServicePageContent;
  startIndex?: number;
}) {
  const n = (offset: number) => String(startIndex + offset).padStart(2, "0");

  return (
    <>
      <section style={{ marginTop: "2.5rem" }}>
        <PageSectionHead index={n(0)} label="Context" title={content.problem.title} />
        {content.problem.paragraphs.map((p, i) => (
          <p className="muted" key={i} style={{ marginTop: "1rem", maxWidth: "42rem" }}>
            {p}
          </p>
        ))}
      </section>

      <section style={{ marginTop: "2.5rem" }}>
        <PageSectionHead index={n(1)} label="Method" title={content.approach.title} />
        {content.approach.paragraphs.map((p, i) => (
          <p className="muted" key={i} style={{ marginTop: "1rem", maxWidth: "42rem" }}>
            {p}
          </p>
        ))}
      </section>

      <section style={{ marginTop: "2.5rem" }}>
        <PageSectionHead index={n(2)} label="Engagement" title={content.engagement.title} />
        {content.engagement.paragraphs.map((p, i) => (
          <p className="muted" key={i} style={{ marginTop: "1rem", maxWidth: "42rem" }}>
            {p}
          </p>
        ))}
      </section>

      <section style={{ marginTop: "2.5rem" }}>
        <PageSectionHead index={n(3)} label="Questions" title="Common questions" />
        <dl className="svc-faq">
          {content.faqs.map((faq) => (
            <div className="svc-faq__item" key={faq.question}>
              <dt className="svc-faq__q">{faq.question}</dt>
              <dd className="svc-faq__a">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      {content.furtherReading?.length ? (
        <section style={{ marginTop: "2.5rem" }}>
          <PageSectionHead index={n(4)} label="Further reading" title="The arguments in full" />
          <ul className="svc-reading">
            {content.furtherReading.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
                {" — "}
                {item.note}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
