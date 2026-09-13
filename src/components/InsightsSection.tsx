import Link from "next/link";
import { publishedInsights } from "@/content/insights";
import { sections } from "@/content/sections";
import { SectionKicker } from "@/components/ui";
import type { SectionHeadingLevel } from "@/components/ui";

/**
 * `showIntro` is on for the /insights route and off for the homepage teaser,
 * where the surrounding page already carries the context and a second framing
 * paragraph would just repeat it.
 */
export function InsightsSection({
  headingLevel = "h2",
  showIntro = false,
}: { headingLevel?: SectionHeadingLevel; showIntro?: boolean } = {}) {
  const Heading = headingLevel;
  const intro = sections.insights;
  // Scheduled pieces are not live yet, so the listing must not advertise them.
  const items = publishedInsights();
  return (
    <section id="insights" className="section">
      <div className="shell">
        <SectionKicker index={intro.index} label={intro.label} />
        <Heading className="sec-title">{intro.title[0].text}</Heading>
        <p className="sec-lede">{intro.lede}</p>
        {showIntro ? (
          <>
            <p className="ins-intro">
              These are engineering notes rather than tutorials. Each one argues a position I
              arrived at on a specific production system — a government case management
              platform, a pension member portal, a cross-platform member app — and says what
              the decision cost as well as what it bought.
            </p>
            <p className="ins-intro">
              The recurring subjects are Angular architecture and state, where the useful
              question is usually when Signals are enough and a store is overhead rather than
              which library to adopt; rendering and network performance, where load behaviour
              belongs in the feature spec rather than in a later optimisation phase; and
              restraint in interfaces for software people are required to use every day rather
              than choose to.
            </p>
            <p className="ins-intro">
              I write one of these when a problem turns out to have a general shape worth
              naming. That means there are fewer of them than a publishing schedule would
              produce, and each is drawn from work that actually shipped, with the projects
              that produced it named.
            </p>
          </>
        ) : null}
        <div style={{ marginTop: "1.5rem" }}>
          {items.map((item) => (
            <Link className="ins-row" href={"/insights/" + item.id} key={item.id}>
              <span className="mono faint">{item.number}</span>
              <span>
                <strong style={{ display: "block", fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: 500 }}>
                  {item.title}
                </strong>
                <span className="muted">{item.dek}</span>
                {item.datePublished ? (
                  <time className="ins-row__date" dateTime={item.datePublished}>
                    {new Date(item.datePublished + "T00:00:00Z").toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      timeZone: "UTC",
                    })}
                  </time>
                ) : null}
              </span>
              <span aria-hidden>→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
