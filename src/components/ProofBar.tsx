import { proofMetrics } from "@/content/profile";
import Link from "next/link";
import { projects } from "@/content/projects";
import { homeCaseStudy } from "@/content/home-case-study";

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
        <p className="proofbar__context proofbar__clients">Government, pension and mobile delivery: Fiji Immigration · PRIMS · VNPF blo mi</p>
      </div>
    </section>
  );
}

/** Visible, server-rendered detail after selected work, keeping the hero brief. */
export function HomeCaseStudy() {
  const fiji = projects.find((project) => project.slug === homeCaseStudy.projectSlug)!;
  return (
    <section id="fiji-engineering" className="section" aria-labelledby="fiji-engineering-title">
      <div className="shell">
        <article className="proofbar__evidence">
          <p className="proofbar__context">Engineering notes · Fiji Immigration · {fiji.year}</p>
          <h2 id="fiji-engineering-title" className="proofbar__heading">{homeCaseStudy.title}</h2>
          <ul className="proofbar__outcomes" aria-label="Reported Fiji Immigration outcomes">
            <li id="fiji-api-result"><a href="#fiji-api-result">Approximately 40% lower API consumption after improving frontend data handling.</a></li>
            <li id="fiji-performance-result"><a href="#fiji-performance-result">Approximately 50% frontend performance improvement through rendering and workflow optimization.</a></li>
            <li id="fiji-users-result"><a href="#fiji-users-result">10,000+ active users served by the Fiji Immigration case-management platform.</a></li>
          </ul>
          {homeCaseStudy.sections.map((section) => (
            <div className="proofbar__detail" key={section.title}>
              <h3>{section.title}</h3>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          ))}
          <div className="proofbar__links">
            <Link href={`/work/${fiji.slug}`}>Read the Fiji Immigration case study ({fiji.year})</Link>
            <Link href="/insights/rxjs-reduce-api-calls">Explore the shared RxJS stream implementation</Link>
            <Link href="/contact">Hire a remote Angular developer for government or enterprise systems</Link>
          </div>
        </article>
      </div>
    </section>
  );
}
