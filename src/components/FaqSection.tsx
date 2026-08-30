import { faqs } from "@/content/faq";
import { accentIndex, sections, titleLines } from "@/content/sections";
import { SectionKicker, itemHeadingLevel, type SectionHeadingLevel } from "@/components/ui";
import { TextReveal } from "@/components/motion";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { FaqOrbit } from "@/components/faq/FaqOrbit";

/**
 * Split FAQ: a sticky editorial rail (eyebrow, headline, orbit) beside a
 * numbered disclosure list.
 *
 * The answers are still rendered into the initial HTML on the server — the
 * accordion only collapses them visually — so the FAQPage structured data and
 * AI-search crawlers keep seeing every answer, which is why this section
 * exists in the first place.
 */
export function FaqSection({ headingLevel = "h2" }: { headingLevel?: SectionHeadingLevel } = {}) {
  const intro = sections.faq;
  const itemLevel = itemHeadingLevel(headingLevel);

  return (
    <section id="faq" className="section faqx" aria-labelledby="faq-title">
      <div className="shell faqx__grid">
        <div className="faqx__rail">
          <div className="faqx__rail-top">
            <SectionKicker index={intro.index} label={intro.label} />
            <TextReveal
              as={headingLevel}
              className="faqx__title"
              lines={titleLines(intro)}
              accentIndex={accentIndex(intro)}
            />
            <span className="faqx__rule" aria-hidden />
            <p className="faqx__lede" id="faq-title-lede">
              {intro.lede}
            </p>
          </div>

          <FaqOrbit className="faqx__orbit" />
        </div>

        <div className="faqx__panel-col">
          {/* The visually hidden heading anchors aria-labelledby without
              duplicating the animated display headline. */}
          <span className="sr-only" id="faq-title">
            Frequently asked questions
          </span>
          <FaqAccordion items={faqs} headingLevel={itemLevel} />
        </div>
      </div>
    </section>
  );
}
