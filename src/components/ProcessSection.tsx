import { processIntro, processSteps } from "@/content/process";
import { SectionKicker, Btn, itemHeadingLevel } from "@/components/ui";
import type { SectionHeadingLevel } from "@/components/ui";
import { ProcessJourney } from "@/components/process/ProcessJourney";
import { ProcessOverture } from "@/components/process/ProcessOverture";
import { ProcessTimeline } from "@/components/process/ProcessTimeline";
import { LineReveal } from "@/components/process/LineReveal";

/**
 * Server component. Only the journey, the overture and the headline reveals are
 * client-side — the copy, structure and CTA are rendered on the server.
 */
export function ProcessSection({ headingLevel = "h2" }: { headingLevel?: SectionHeadingLevel } = {}) {
  const Heading = headingLevel;
  const itemHeading = itemHeadingLevel(headingLevel);
  return (
    <section id="process" className="section pr" aria-labelledby="process-title">
      <div className="shell">
        <header className="pr__intro">
          <div className="pr__intro-copy">
            <SectionKicker index={processIntro.index} label={processIntro.label} />
            <Heading className="pr__display" id="process-title">
              <LineReveal lines={processIntro.headingLines} />
            </Heading>
            <p className="pr__lede">{processIntro.lede}</p>
          </div>
          <div className="pr__intro-visual">
            <ProcessOverture />
          </div>
        </header>

        {/* Decorative stage strip. The same seven stages are announced — with more
            detail — by the <ol> inside ProcessTimeline below, so exposing this as a
            second list made screen readers and crawlers walk the process twice.
            Kept as presentational markup so the visual design is unchanged. */}
        <div className="pr__index" aria-hidden>
          {processSteps.map((step) => (
            <div className="pr__index-item" key={step.id}>
              <span className="pr__index-num">{step.number}</span>
              <span className="pr__index-label">{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="shell">
        <ProcessTimeline steps={processSteps} itemHeading={itemHeading} />
      </div>

      <div className="shell">
        <ProcessJourney steps={processSteps} />
      </div>

      <div className="shell pr__close">
        <p className="pr__close-k">07 / Complete</p>
        <h3 className="pr__close-title">
          <LineReveal lines={processIntro.closingLines} />
        </h3>
        <p className="pr__close-sub">{processIntro.closingSecondary}</p>
      </div>

      <div className="shell pr__cta">
        <h3 className="pr__cta-title">{processIntro.ctaHeading}</h3>
        <p className="pr__cta-lede">{processIntro.ctaLede}</p>
        <div className="pr__cta-actions">
          <Btn href="/#contact">Start a conversation</Btn>
          <Btn href="/work" variant="line">
            View selected work
          </Btn>
        </div>
      </div>
    </section>
  );
}
