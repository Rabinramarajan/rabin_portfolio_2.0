import { WorkExplorer } from "@/components/work/WorkExplorer";
import { WorkOrbit } from "@/components/work/WorkOrbit";
import { WorkListJsonLd } from "@/components/JsonLd";
import { SectionKicker } from "@/components/ui";

/**
 * /work — the complete catalogue.
 *
 * One screen, one job: a stated headline, the category filter, and the grid.
 * There is no featured slab ahead of the grid any more — it duplicated the
 * first card at three times the height and pushed the catalogue itself below
 * the fold, which is the opposite of what a work index is for.
 *
 * The headline is a real `<h1>`; the second line carries the accent. The
 * orbital field beside it is decoration and says so in the markup.
 */
export function WorkPage() {
  return (
    <>
      <WorkListJsonLd />

      <section className="wpage" aria-labelledby="wpage-title">
        <div className="shell">
          <div className="wpage__hero">
            <div className="wpage__copy">
              <SectionKicker index="02" label="Selected Work" />
              <h1 className="wpage__title" id="wpage-title">
                <span className="wpage__line">Work that makes</span>
                <span className="wpage__line acc">an impact.</span>
              </h1>
              <p className="wpage__lede">
                A selection of products I have engineered for governments, startups and
                businesses across industries.
              </p>
              <p className="wpage__intro">
                Most of this is high-consequence software: immigration case management
                used by Fiji government officers, a pension member portal, an insurance
                administration console, and a member app shipped to both app stores for
                VNPF in Vanuatu. These are systems people have to use to do their job or
                access their money, not products they chose — which sets a different bar
                for performance, accessibility and how the interface behaves on the
                hundredth use rather than the first.
              </p>
              <p className="wpage__intro">
                Each case study covers what the system does, the architecture decisions
                that mattered, the stack, and the outcomes I measured. Where numbers are
                quoted — a 40% reduction in API consumption, roughly 50% faster frontend
                load on the Fiji internal platform — they are results from the work
                rather than estimates.
              </p>
            </div>
            <WorkOrbit />
          </div>

          <WorkExplorer />
        </div>
      </section>
    </>
  );
}
