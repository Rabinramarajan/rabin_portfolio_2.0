import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/about/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { WorkSection } from "@/components/WorkSection";

/*
 * Below-the-fold sections are code-split so their JS (framer-motion driven
 * animations, the journey/particles canvas, pricing/contact widgets) isn't
 * parsed/executed as part of the critical initial bundle. `ssr: true` keeps
 * the HTML present for SEO/no-JS; only the client hydration chunk is deferred.
 */
const JourneySection = dynamic(() => import("@/components/journey").then((m) => m.JourneySection), {
  loading: () => <div style={{ minHeight: "600px" }} aria-hidden />,
});
const SkillsSection = dynamic(() => import("@/components/SkillsSection").then((m) => m.SkillsSection), {
  loading: () => <div style={{ minHeight: "400px" }} aria-hidden />,
});
const ProcessSection = dynamic(() => import("@/components/ProcessSection").then((m) => m.ProcessSection), {
  loading: () => <div style={{ minHeight: "400px" }} aria-hidden />,
});
const PricingSection = dynamic(() => import("@/components/PricingSection").then((m) => m.PricingSection), {
  loading: () => <div style={{ minHeight: "400px" }} aria-hidden />,
});
const ContactSection = dynamic(() => import("@/components/ContactSection").then((m) => m.ContactSection), {
  loading: () => <div style={{ minHeight: "300px" }} aria-hidden />,
});

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
