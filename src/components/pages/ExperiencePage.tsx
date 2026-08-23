"use client";

import { profile } from "@/content/profile";
import { TextReveal } from "@/components/motion";
import { PageCta } from "./PageCta";
import { PageSectionHead } from "./PageSectionHead";
import { ExperienceHero } from "@/components/experience/ExperienceHero";
import { CareerTimeline } from "@/components/experience/CareerTimeline";
import { TechnologyEvolution } from "@/components/experience/StackEvolution";
import { CapabilityEvolution } from "@/components/experience/CapabilityEvolution";
import { MilestoneTrace } from "@/components/experience/MilestoneTrace";
import { CurrentChapter } from "@/components/experience/CurrentChapter";
import { EngineeringMap } from "@/components/experience/EngineeringMap";
import { NextChapter } from "@/components/experience/NextChapter";
import { ExperienceNav } from "@/components/experience/ExperienceNav";

/**
 * EXPERIENCE — one continuous career line.
 *
 * The line starts in the hero, becomes the timeline rail, and leaves the page
 * pointing at the CTA. Every section between those two points is typography
 * and rules; there are no cards anywhere on this page on purpose, because the
 * timeline is meant to be the design rather than a frame around it.
 */
export function ExperiencePage() {
  return (
    <>
      <ExperienceNav />

      <ExperienceHero />

      {/* ---------- the journey ---------- */}
      <section className="pf-section xsec" id="journey">
        <div className="shell">
          <PageSectionHead index="01" label="The journey" />
          <TextReveal
            lines={["EVERY CHAPTER CHANGED", "HOW I BUILD."]}
            as="h2"
            className="xsec__statement"
            accentIndex={1}
          />
          <p className="xsec__lede">
            Six chapters, in order. Each one is a real engagement or a real turning point — the
            labels describe what changed, not a title anyone handed out.
          </p>

          <CareerTimeline />
        </div>
      </section>

      {/* ---------- the stack evolved ---------- */}
      <section className="pf-section xsec" id="stack">
        <div className="shell">
          <PageSectionHead
            index="02"
            label="The stack evolved"
            title="The toolkit changed with the problems."
            lede="Not a proficiency chart. Each stream starts the year the technology verifiably entered the work."
          />
          <TechnologyEvolution />
        </div>
      </section>

      {/* ---------- what changed ---------- */}
      <section className="pf-section xsec" id="capabilities">
        <div className="shell">
          <PageSectionHead
            index="03"
            label="What changed"
            title="The work itself evolved."
            lede="Years are a weak measure. This is what the responsibility actually became."
          />
          <CapabilityEvolution />
        </div>
      </section>

      {/* ---------- milestones ---------- */}
      <section className="pf-section xsec" id="milestones">
        <div className="shell">
          <PageSectionHead
            index="04"
            label="Milestones"
            title="The turning points."
            lede="Dated, real, and each one changed what came after it."
          />
          <MilestoneTrace />
        </div>
      </section>

      {/* ---------- current chapter ---------- */}
      <section className="pf-section xsec xsec--current" id="current">
        <div className="shell">
          <PageSectionHead
            index="05"
            label="Current chapter"
            title="Where the work is now."
            lede={`${profile.yearsExperienceLabel} years of shipping — currently Frontend Developer Consultant at RSTACK Solutions, building the interface for an AI-driven analytics product.`}
          />
          <CurrentChapter />
        </div>
      </section>

      {/* ---------- the engineering map ---------- */}
      <section className="pf-section xsec" id="map">
        <div className="shell">
          <PageSectionHead
            index="06"
            label="The engineering map"
            title="How the pieces relate."
            lede="The shape of the toolkit today — frontend at the centre, everything else earned around it."
          />
          <EngineeringMap />
        </div>
      </section>

      {/* ---------- next chapter ---------- */}
      <section className="pf-section xsec xsec--next">
        <div className="shell">
          <NextChapter />
        </div>
      </section>

      <PageCta
        kicker="05 / EXPERIENCE"
        headline={["THE NEXT CHAPTER", "IS STILL BEING", "BUILT."]}
        lede="The work is the argument. Let's make the next one count."
        actions={[
          { label: "View Selected Work", href: "/work", variant: "line" },
          { label: "Let's Work Together", href: "/contact" },
        ]}
      />
    </>
  );
}
