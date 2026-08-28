import { Hero } from "@/components/Hero";
import { ServicesHorizontalScroll } from "@/components/ServicesHorizontalScroll";
import { WorkSection } from "@/components/WorkSection";
import { FaqSection } from "@/components/FaqSection";
import { FaqJsonLd } from "@/components/JsonLd";

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

export function HomePage() {
  return (
    <>
      <Hero />
      <ServicesHorizontalScroll id="services" />
      <WorkSection id="work" limit={4} />
      <JourneySection />
      <SkillsSection />
      <ProcessSection />
      <FaqSection />
      <FaqJsonLd />
    </>
  );
}
