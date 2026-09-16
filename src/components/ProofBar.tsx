import { proofMetrics } from "@/content/profile";
import Link from "next/link";
import { projects } from "@/content/projects";
import { homeCaseStudy } from "@/content/home-case-study";
import { ProjectCover } from "@/components/ProjectCover";

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
              <span className="proofbar__source">{metric.source}</span>
            </li>
          ))}
        </ul>

        <div className="proofbar__ledger">
          <p className="proofbar__evidence-note">
            Every figure above was measured on shipped work. On Fiji Immigration, sharing and
            caching reference lookups in one RxJS stream removed duplicate panel requests and
            cut roughly 40% of the frontend&rsquo;s API traffic.{" "}
            <Link href={`/work/${homeCaseStudy.projectSlug}`}>
              Read the Fiji Immigration engineering decisions
            </Link>
            .
          </p>
          <p className="proofbar__clients">
            Shipped on government, pension and mobile platforms for Fiji Immigration, PRIMS
            and VNPF blo mi.
          </p>
        </div>

        <p className="proofbar__engagement">
          <span>Project-based delivery, monthly retainers and dedicated engineering.</span>
          <Link href="/pricing">See pricing and engagement options</Link>
        </p>
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
        <article className="casestudy">
          <div className="casestudy__meta">
            <p className="casestudy__client">Fiji Immigration</p>
            <p className="casestudy__kind">Internal case-management platform, {fiji.year}</p>
          </div>

          <div className="casestudy__body">
            <h2 id="fiji-engineering-title" className="casestudy__heading">{homeCaseStudy.title}</h2>
            <ul className="casestudy__outcomes" aria-label="Reported Fiji Immigration outcomes">
              <li id="fiji-api-result">
                <a href="#fiji-api-result">
                  <span className="casestudy__figure">~40%</span>
                  <span className="casestudy__claim">Lower API consumption after reworking how the frontend handles data.</span>
                </a>
              </li>
              <li id="fiji-performance-result">
                <a href="#fiji-performance-result">
                  <span className="casestudy__figure">~50%</span>
                  <span className="casestudy__claim">Frontend performance gained through rendering and workflow optimisation.</span>
                </a>
              </li>
              <li id="fiji-users-result">
                <a href="#fiji-users-result">
                  <span className="casestudy__figure">10,000+</span>
                  <span className="casestudy__claim">Active users served by the platform in daily casework.</span>
                </a>
              </li>
            </ul>
            {homeCaseStudy.sections.map((section) => (
              <div className="casestudy__detail" key={section.title}>
                <h3>{section.title}</h3>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            ))}
          </div>

          {/* The delivery record, kept out of the argument: a reader deciding
              whether this experience transfers wants the role and the stack,
              not another paragraph. */}
          <aside className="casestudy__spec" aria-label="Project details">
            <div className="casestudy__spec-group">
              <h3>My role</h3>
              <p>{fiji.role}</p>
            </div>

            {fiji.stack?.length ? (
              <div className="casestudy__spec-group">
                <h3>Stack</h3>
                <dl className="casestudy__stack">
                  {fiji.stack.map((layer) => (
                    <div key={layer.layer}>
                      <dt>{layer.layer}</dt>
                      <dd>{layer.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            {fiji.responsibilities?.length ? (
              <div className="casestudy__spec-group">
                <h3>What I owned</h3>
                <ul className="casestudy__scope">
                  {fiji.responsibilities.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ) : null}
          </aside>

          <figure className="casestudy__shot">
            <ProjectCover project={fiji} sizes="(min-width: 1280px) 1360px, 100vw" />
            <figcaption>The officer workflow screen the notes describe: several panels composed into one case view.</figcaption>
          </figure>

          <nav className="casestudy__links" aria-label="Further reading on this work">
            <Link href={`/work/${fiji.slug}`}>Read the full Fiji Immigration case study ({fiji.year})</Link>
            <Link href="/insights/rxjs-reduce-api-calls">How the shared RxJS stream cuts duplicate API calls</Link>
            <Link href="/contact">Hire a remote Angular developer for government or enterprise systems</Link>
          </nav>
        </article>
      </div>
    </section>
  );
}
