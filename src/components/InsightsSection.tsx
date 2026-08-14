import Link from "next/link";
import { insights } from "@/content/insights";
import { SectionKicker } from "@/components/ui";

export function InsightsSection() {
  return (
    <section id="insights" className="section">
      <div className="shell">
        <SectionKicker index="09" label="Insights" />
        <h2 className="sec-title">Notes from the work.</h2>
        <p className="sec-lede">Short engineering positions — not a blog farm.</p>
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
