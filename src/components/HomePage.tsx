import { Hero } from "@/components/Hero";
import { ProofBar } from "@/components/ProofBar";
import { ServicesHorizontalScroll } from "@/components/ServicesHorizontalScroll";
import { WorkSection } from "@/components/WorkSection";
import { PrinciplesSection } from "@/components/PrinciplesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { InsightsSection } from "@/components/InsightsSection";
import { FaqSection } from "@/components/FaqSection";
import { FaqJsonLd } from "@/components/JsonLd";
import { PageCta } from "@/components/pages/PageCta";

/*
 * These sections are imported statically on purpose.
 *
 * They used to be `next/dynamic` with small `loading` spacers. Each of those
 * created a streaming Suspense hole, so the shell — Navbar, empty <main>,
 * Footer — flushed first with the footer sitting ~270px down the viewport,
 * and the real sections then shoved it off-screen. That measured as a ~0.70
 * layout shift on roughly one load in three. The sections are all rendered on
 * every visit anyway, so deferring their chunks bought little and cost CLS.
 */
import { JourneySection } from "@/components/JourneySection";
import { SkillsSection } from "@/components/SkillsSection";
import { ProcessSection } from "@/components/ProcessSection";

/**
 * Work leads, services follow.
 *
 * The old order opened with the service menu. Both audiences that arrive here
 * — a hiring manager and a prospective client — ask what has actually been
 * built before they ask what is for sale, so the evidence now comes first and
 * the services read as a description of it.
 */
export function HomePage() {
  return (
    <>
      <Hero />
      <ProofBar />
      <WorkSection id="work" limit={3} />
      <ServicesHorizontalScroll id="services" />
      <PrinciplesSection />
      {/* Renders nothing until content/testimonials.ts has real quotes in it. */}
      <TestimonialsSection />
      <JourneySection />
      <InsightsSection />
      <SkillsSection />
      <ProcessSection />
      <FaqSection />
      <PageCta
        kicker="Next step"
        headline={["Have an Angular or", "frontend challenge?"]}
        lede="Tell me what you are building and where it is stuck. I will tell you whether I am the right person for it."
        actions={[
          { label: "Discuss your project", href: "/contact" },
          { label: "Read the case studies", href: "/work", variant: "line" },
        ]}
      />
      <FaqJsonLd />
    </>
  );
}
