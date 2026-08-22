import Link from "next/link";
import { insights } from "@/content/insights";
import { sections } from "@/content/sections";
import { SectionKicker } from "@/components/ui";
import type { SectionHeadingLevel } from "@/components/ui";

export function InsightsSection({ headingLevel = "h2" }: { headingLevel?: SectionHeadingLevel } = {}) {
  const Heading = headingLevel;
  const intro = sections.insights;
  return (
    <section id="insights" className="section">
      <div className="shell">
        <SectionKicker index={intro.index} label={intro.label} />
        <Heading className="sec-title">{intro.title[0].text}</Heading>
        <p className="sec-lede">{intro.lede}</p>
        <div style={{ marginTop: "1.5rem" }}>
          {insights.map((item) => (
            <Link className="ins-row" href={"/insights/" + item.id} key={item.id}>
              <span className="mono faint">{item.number}</span>
              <span>
                <strong style={{ display: "block", fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: 500 }}>
                  {item.title}
                </strong>
                <span className="muted">{item.dek}</span>
              </span>
              <span aria-hidden>→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
