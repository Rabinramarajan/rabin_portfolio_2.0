import { processIntro, processSteps } from "@/content/process";
import { SectionKicker, Btn, itemHeadingLevel } from "@/components/ui";
import type { SectionHeadingLevel } from "@/components/ui";
import { ProcessOrbital } from "@/components/process/ProcessOrbital";
import { ProcessJourney } from "@/components/process/ProcessJourney";
import { ProcessPrinciples } from "@/components/process/ProcessPrinciples";
import { LineReveal } from "@/components/process/LineReveal";

/**
 * Server component. Only the orbital, the journey, the principles and the
 * headline reveals are client-side — the copy, structure and CTA are rendered
 * on the server.
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
              {processIntro.headingLines.map((line, i) => (
                <span key={line}>
                  {i > 0 && <br />}
                  {i === 1 ? <span className="pr__display-accent">{line}</span> : line}
                </span>
              ))}
            </Heading>
            <p className="pr__lede">{processIntro.lede}</p>
            <div className="pr__intro-actions">
              <Btn href="/#contact">Let&apos;s work together</Btn>
            </div>
          </div>
          <div className="pr__intro-visual">
            <ProcessOrbital steps={processSteps} />
          </div>
        </header>
      </div>

      <div className="shell">
        <ProcessJourney steps={processSteps} />
      </div>

      <div className="shell">
        <ProcessPrinciples />
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
