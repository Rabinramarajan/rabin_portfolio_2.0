"use client";

import { getCareerTimeline } from "@/content/experience";
import { profile } from "@/content/profile";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { TextReveal } from "@/components/motion";
import { PageHero } from "./PageHero";
import { PageCta } from "./PageCta";
import { PageSectionHead } from "./PageSectionHead";
import { CareerTraceHero } from "@/components/experience/CareerTraceHero";
import { CareerTrace } from "@/components/experience/CareerTrace";
import { TechnologyEvolution } from "@/components/experience/StackEvolution";
import { CapabilityEvolution } from "@/components/experience/CapabilityEvolution";
import { MilestoneTrace } from "@/components/experience/MilestoneTrace";
import { CurrentChapter } from "@/components/experience/CurrentChapter";
import { EngineeringMap } from "@/components/experience/EngineeringMap";
import { NextChapter } from "@/components/experience/NextChapter";
import { ExperienceNav } from "@/components/experience/ExperienceNav";

/**
 * EXPERIENCE — one continuous career signal.
 *
 * The page reads as a single unbroken trace. The hero shows the whole signal
 * with every year on it; the journey follows it as a zigzag of panels around a
 * line that draws itself; the stack reads as frequency bands; milestones spike
 * up from a baseline; the current chapter is the live end of the trace. Each
 * section keeps its own reveal gesture so the page never settles into one
 * repeated fade-up.
 */
export function ExperiencePage() {
  const reduce = useReducedMotionSafe();
  const roles = getCareerTimeline();

  return (
    <>
      <ExperienceNav />

      <PageHero
        index="04"
        label="Experience"
        title={["THE EVOLUTION", "OF AN", "ENGINEER."]}
        lede="From first builds in 2021 to Angular architecture and AI-driven analytics in 2026 — a career measured in what it taught, not in how long it ran."
        visual={<CareerTraceHero reduce={reduce} />}
        meta={[
          { label: "Experience", value: profile.yearsExperienceLabel + " years" },
          { label: "Discipline", value: "Frontend engineering" },
          { label: "Core stack", value: "Angular · TypeScript" },
          { label: "Also building with", value: "React · Next.js" },
        ]}
        className="xhero"
      />

      {/* ---------- the journey ---------- */}
      <section className="pf-section xsec" id="journey">
        <div className="shell">
          <PageSectionHead index="01" label="The journey" />
          <TextReveal
            lines={["EVERY ROLE CHANGED", "HOW I BUILD."]}
            as="h2"
            className="xsec__statement"
            accentIndex={1}
          />
          <p className="xsec__lede">
            Five stages, in order. Each one is a real engagement — the labels describe what changed, not a title
            anyone handed out.
          </p>

          <CareerTrace roles={roles} />
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
            lede="Two engagements running concurrently in 2026 — consulting on Angular architecture, and building the interface for an AI-driven analytics product."
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

      {/* ---------- closing statement ---------- */}
      <section className="pf-section xsec xsec--quote">
        <div className="shell">
          <TextReveal
            lines={["THE EXPERIENCE ISN'T", "IN THE YEARS. IT'S IN", "WHAT THEY TAUGHT", "ME TO BUILD."]}
            as="p"
            className="xquote"
            accentIndex={3}
            lineDuration={0.7}
          />
        </div>
      </section>

      {/* ---------- next chapter ---------- */}
      <section className="pf-section xsec xsec--next">
        <div className="shell">
          <NextChapter />
        </div>
      </section>

      <PageCta
        kicker="04 / EXPERIENCE"
        headline={["THE STORY", "CONTINUES."]}
        lede="The work is the argument. Let's make the next one count."
        actions={[
          { label: "View Selected Work", href: "/work", variant: "line" },
          { label: "Let's Work Together", href: "/contact" },
        ]}
      />
    </>
  );
}