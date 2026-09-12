import { about } from "@/content/about";
import { PageSectionHead } from "@/components/pages/PageSectionHead";

/**
 * The written half of /about.
 *
 * The route used to render only the intro band — a heading, one paragraph and
 * three one-line highlights — which is thin for the page that answers "who is
 * this person and why trust them". The biography, principles, industries and
 * milestones were all already authored in `about.ts` and simply never rendered
 * anywhere; this puts them on the page they belong to.
 */
export function AboutStory() {
  const { story, principles, industries, milestones, workingStyle } = about;

  return (
    <section className="section abt-story" aria-labelledby="about-story">
      <div className="shell" style={{ maxWidth: "46rem" }}>
        <h2 className="sr-only" id="about-story">
          Background and approach
        </h2>

        {story?.map((block, i) => (
          <section key={block.title} style={{ marginTop: i === 0 ? 0 : "2.75rem" }}>
            <PageSectionHead
              index={String(i + 1).padStart(2, "0")}
              label="Background"
              title={block.title}
            />
            {block.paragraphs.map((p, j) => (
              <p className="abt-story__p" key={j}>
                {p}
              </p>
            ))}
          </section>
        ))}

        <section style={{ marginTop: "2.75rem" }}>
          <PageSectionHead index="05" label="Principles" title="What I optimise for" />
          <dl className="abt-story__principles">
            {principles.map((principle) => (
              <div key={principle.id}>
                <dt>{principle.title}</dt>
                <dd>{principle.body}</dd>
              </div>
            ))}
          </dl>
          <p className="abt-story__p">{workingStyle}</p>
        </section>

        <section style={{ marginTop: "2.75rem" }}>
          <PageSectionHead index="06" label="Domains" title="Where I have worked" />
          <ul className="abt-story__list">
            {industries.map((industry) => (
              <li key={industry}>{industry}</li>
            ))}
          </ul>
        </section>

        <section style={{ marginTop: "2.75rem" }}>
          <PageSectionHead index="07" label="Timeline" title="The short version" />
          <ol className="abt-story__timeline">
            {milestones.map((milestone) => (
              <li key={milestone.year}>
                <span className="abt-story__year">{milestone.year}</span>
                <div>
                  <p className="abt-story__milestone-title">{milestone.title}</p>
                  <p className="abt-story__milestone-body">{milestone.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </section>
  );
}
