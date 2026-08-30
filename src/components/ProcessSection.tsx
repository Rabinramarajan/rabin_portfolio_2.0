import { processIntro, processSteps } from "@/content/process";
import { SectionKicker, Btn } from "@/components/ui";
import type { SectionHeadingLevel } from "@/components/ui";
import { ProcessFlow } from "@/components/process/ProcessFlow";
import { ProcessPrinciples } from "@/components/process/ProcessPrinciples";
import { media } from "@/lib/media";

/**
 * Server component. Only the orbital, the journey, the principles and the
 * headline reveals are client-side — the copy, structure and CTA are rendered
 * on the server.
 */
export function ProcessSection({ headingLevel = "h2" }: { headingLevel?: SectionHeadingLevel } = {}) {
  const Heading = headingLevel;
  const isProcessPage = headingLevel === "h1";

  return (
    <section id="process" className="section pr" aria-labelledby="process-title">
      <div className="shell">
        {isProcessPage ? (
          /* Process Page: Cinematic split hero with hero image placement */
          <header className="pr__hero">
            <div className="pr__hero-copy">
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
                <Btn href="/contact">Let&apos;s work together</Btn>
              </div>
            </div>
            <div className="pr__hero-visual-frame">
              <img
                src={media("other/process/hero.png")}
                alt="Product engineering process environment"
                className="pr__hero-image"
              />
              <div className="pr__hero-visual-overlay" aria-hidden />
            </div>
          </header>
        ) : (
          /* Homepage: masthead above a full-width signal conduit, sized to sit
             inside one viewport on desktop without cropping the readout. */
          <div className="pr__fit">
            <header className="pr__masthead">
              <div className="pr__masthead-lead">
                <SectionKicker index={processIntro.index} label={processIntro.label} />
                <Heading className="pr__display" id="process-title">
                  {processIntro.headingLines.map((line, i) => (
                    <span key={line}>
                      {i > 0 && <br />}
                      {i === 1 ? <span className="pr__display-accent">{line}</span> : line}
                    </span>
                  ))}
                </Heading>
              </div>
              <div className="pr__masthead-aside">
                <p className="pr__lede">{processIntro.lede}</p>
                <div className="pr__intro-actions">
                  <Btn href="/contact">Let&apos;s work together</Btn>
                </div>
              </div>
            </header>
            <ProcessFlow steps={processSteps} fit />
          </div>
        )}
      </div>

      {isProcessPage && (
        /* Process Page: Prominent glassmorphic orbital command card */
        <div className="shell pr__orbital-shell">
          <div className="pr__orbital-card">
            <div className="pr__orbital-card-header">
              <h2 className="pr__orbital-card-title">Interactive Process Map</h2>
              <p className="pr__orbital-card-desc">
                Follow one idea along the conduit. Hover, tap or arrow through any stage to read what happens there, what
                you receive, and the outcome it locks in.
              </p>
            </div>
            <div className="pr__orbital-card-visual">
              <ProcessFlow steps={processSteps} />
            </div>
          </div>
        </div>
      )}

      {/* Sticky 01→07 deep-dive journey — retired in favour of the signal
          conduit above, which now carries the same per-stage detail. Left in
          place (component and styles intact) so it can be restored by
          uncommenting this block.
      <div className="shell">
        <ProcessJourney steps={processSteps} />
      </div>
      */}

      <div className="shell">
        <ProcessPrinciples />
      </div>

      <div className="shell pr__cta">
        <h3 className="pr__cta-title">{processIntro.ctaHeading}</h3>
        <p className="pr__cta-lede">{processIntro.ctaLede}</p>
        <div className="pr__cta-actions">
          <Btn href="/contact">Start a conversation</Btn>
          <Btn href="/work" variant="line">
            View selected work
          </Btn>
        </div>
      </div>
    </section>
  );
}
