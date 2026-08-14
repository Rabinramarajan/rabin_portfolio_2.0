import type { Metadata } from "next";
import { SectionKicker } from "@/components/ui";
import { ServicesSection } from "@/components/ServicesSection";

export const metadata: Metadata = {
  title: "Services",
  description: "Angular, React, Next.js, Ionic, UI engineering, performance and API integration.",
};

export default function Page() {
  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <SectionKicker index="02" label="Services" />
          <h1 className="page-hero__title">Engineering that moves products forward.</h1>
          <p className="page-hero__lede">
            From complex frontend systems to polished digital experiences, each service is part of a journey from problem to production.
          </p>
        </div>
      </section>
      <ServicesSection />
    </>
  );
}