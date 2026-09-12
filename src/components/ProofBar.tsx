import { proofMetrics } from "@/content/profile";

/**
 * The four numbers, directly under the hero.
 *
 * They already existed on the site — buried inside case studies and the
 * experience timeline, which is to say behind a click a first-time visitor
 * has no reason to make yet. Stating them where the fold is makes the rest of
 * the page an explanation of the numbers rather than a claim without one.
 */
export function ProofBar() {
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
      </div>
    </section>
  );
}
