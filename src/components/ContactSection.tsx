"use client";

import { profile } from "@/content/profile";
import { ContactForm } from "@/components/ContactForm";
import { SectionKicker } from "@/components/ui";
import { TextReveal } from "@/components/motion";
import { SectionDance, ParallaxLayers } from "@/components/parallel";

export function ContactSection() {
  return (
    <section id="contact" className="section">
      <SectionDance
        as="div"
        className="shell contact-grid"
        headerFrom="left"
        bg={
          <ParallaxLayers
            layers={[
              { speed: 0.2, className: "plx-grid" },
              { speed: 0.5, className: "plx-glow" },
            ]}
          />
        }
        header={
          <>
            <SectionKicker index="08" label="Contact" />
            <TextReveal
              lines={["Let's build something", "worth shipping."]}
              className="contact__heading"
              as="h2"
              accentIndex={1}
            />
            <p className="contact__lede">
              Tell me the product, the constraint, and the timeline. I reply within one business day.
            </p>
            <div className="contact__direct">
              <span className="contact__direct-label">Direct</span>
              <a className="contact__email" href={"mailto:" + profile.email}>
                {profile.email}
              </a>
              <span className="contact__meta">
                {profile.location} · {profile.availability.label}
              </span>
            </div>
          </>
        }
      >
        <ContactForm />
      </SectionDance>
    </section>
  );
}