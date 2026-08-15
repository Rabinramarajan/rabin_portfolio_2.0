import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { WorkSection } from "@/components/WorkSection";
import { JourneySection } from "@/components/journey";
import { SkillsSection } from "@/components/SkillsSection";
import { ProcessSection } from "@/components/ProcessSection";
import { PricingSection } from "@/components/PricingSection";
import { ContactSection } from "@/components/ContactSection";

export function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <ServicesSection />
      <WorkSection limit={4} />
      <JourneySection />
      <SkillsSection />
      <ProcessSection />
      <PricingSection />
      <ContactSection />
    </>
  );
}
