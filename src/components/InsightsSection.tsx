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
          <p className="ins-intro">
            Positions I have arrived at from shipped work rather than from reading about
            it — state management that stayed maintainable across a pension portal and an
            immigration case system, performance treated as a spec item instead of a
            later phase, and why restrained interfaces survive repeated daily use better
            than expressive ones. Each one is a working argument, with the projects that
            produced it named.
          </p>
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
