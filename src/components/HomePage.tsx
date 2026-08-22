import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/about/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { WorkHero, WorkGrid } from "@/components/pages/WorkShowcase";
import { FaqSection } from "@/components/FaqSection";

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
import { PricingSection } from "@/components/PricingSection";
import { ContactSection } from "@/components/ContactSection";

export function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <ServicesSection id="services" index="02" />
      <WorkHero headingLevel="h2" kicker={{ index: "03", label: "Selected Work" }} />
      <WorkGrid id="work" limit={4} />
      <JourneySection />
      <SkillsSection />
      <ProcessSection />
      <PricingSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
