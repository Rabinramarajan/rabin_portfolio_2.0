import { proofMetrics } from "@/content/profile";
import Link from "next/link";
import { projects } from "@/content/projects";

/**
 * The four numbers, directly under the hero.
 *
 * They already existed on the site — buried inside case studies and the
 * experience timeline, which is to say behind a click a first-time visitor
 * has no reason to make yet. Stating them where the fold is makes the rest of
 * the page an explanation of the numbers rather than a claim without one.
 */
export function ProofBar() {
  const fiji = projects.find((project) => project.slug === "fiji-immigration-internal")!;
  const decision = fiji.decisions![0];
  return (
    <section className="proofbar" aria-label="Delivery record">
      <div className="shell">
        <ul className="proofbar__list">
          {proofMetrics.map((metric) => (
            <li className="proofbar__item" key={metric.label}>
              <strong className="proofbar__value">{metric.value}</strong>
              <span className="proofbar__label">{metric.label}</span>
            </li>
          ))}
        </ul>
        <div className="proofbar__evidence">
          <p className="proofbar__context">Government, pension and mobile delivery: Fiji Immigration · PRIMS · VNPF blo mi</p>
          <h2 className="proofbar__heading">Behind the ~40% reduction in API consumption</h2>
          <p>{decision.problem} {decision.decision}</p>
          <p>{decision.tradeoff}</p>
          <p className="proofbar__context">Reported project outcomes: approximately 40% lower API consumption and 50% frontend performance improvement on Fiji Immigration workflows serving 10,000+ users. These are project-level estimates, not Core Web Vitals scores; the public case study does not include raw benchmark logs.</p>
          <div className="proofbar__links">
            <Link href={`/work/${fiji.slug}`}>Read the Fiji Immigration case study ({fiji.year})</Link>
            <Link href="/insights/rxjs-reduce-api-calls">Explore the shared RxJS stream implementation</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
