import Link from "next/link";
import { featuredInsight, publishedInsights } from "@/content/insights";
import { sections } from "@/content/sections";
import { SectionKicker } from "@/components/ui";
import { InsightCard } from "@/components/insights/InsightCard";
import type { SectionHeadingLevel } from "@/components/ui";

/**
 * The insights teaser in the homepage stack.
 *
 * The full listing — filters, search, the figures and the whole set — lives
 * on /insights in `InsightsHub`. This one stays a server component and shows
 * the lead piece plus three more, because the homepage's job here is to prove
 * the writing exists and hand the reader to the index, not to be a second
 * index a scroll above the contact form.
 */
export function InsightsSection({
  headingLevel = "h2",
}: {
  headingLevel?: SectionHeadingLevel;
} = {}) {
  const Heading = headingLevel;
  const intro = sections.insights;
  // Scheduled pieces are not live yet, so the teaser must not advertise them.
  const items = publishedInsights();
  const featured = featuredInsight();
  /* Two followers, not three: the lead card takes two of the four columns,
     so a third would wrap onto a row of its own and leave the teaser looking
     like a listing that ran out. */
  const rest = items.filter((i) => i.id !== featured?.id).slice(0, 2);

  return (
    <section id="insights" className="section inh-teaser">
      <div className="shell">
        <div className="inh-teaser__head">
          <div>
            <SectionKicker index={intro.index} label={intro.label} />
            <Heading className="sec-title">{intro.title[0].text}</Heading>
            <p className="sec-lede">{intro.lede}</p>
          </div>
          <Link className="inh-teaser__all" href="/insights">
            All insights
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="inh-grid inh-grid--teaser">
          {(featured ? [featured, ...rest] : rest).map((item, i) => (
            <InsightCard item={item} key={item.id} headingLevel={headingLevel} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
