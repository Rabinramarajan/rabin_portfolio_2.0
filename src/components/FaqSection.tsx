import { faqs } from "@/content/faq";
import { sections } from "@/content/sections";
import { SectionKicker, type SectionHeadingLevel } from "@/components/ui";

/**
 * Server-rendered, always-expanded answers.
 *
 * `<details>` would hide the text behind an interaction; plain markup keeps
 * every answer in the initial HTML, which is what both the FAQPage structured
 * data and AI-search crawlers need to see.
 */
export function FaqSection({ headingLevel = "h2" }: { headingLevel?: SectionHeadingLevel } = {}) {
  const Heading = headingLevel;
  const intro = sections.faq;

  return (
    <section id="faq" className="section" aria-labelledby="faq-title">
      <div className="shell">
        <SectionKicker index={intro.index} label={intro.label} />
        <Heading className="sec-title" id="faq-title">
          {intro.title[0].text}
        </Heading>
        <p className="sec-lede">{intro.lede}</p>

        <dl className="faq-list">
          {faqs.map((item) => (
            <div className="faq-item" key={item.id}>
              <dt className="faq-item__q">{item.question}</dt>
              <dd className="faq-item__a">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
