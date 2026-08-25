import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/pages/Breadcrumbs";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactIntro } from "@/components/contact/ContactIntro";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactFormIntent } from "@/components/contact/ContactFormIntent";
import { AvailabilityPanel } from "@/components/contact/AvailabilityPanel";
import { ContactChannels } from "@/components/contact/ContactChannels";
import { ContactCta } from "@/components/contact/ContactCta";
import { ContactProcessBridge } from "@/components/contact/ContactProcessBridge";
import { ContactLazyVideo, ContactReveal } from "@/components/contact/ContactMedia";
import { contactCopy } from "@/content/contact";

const ContactWorkflow = dynamic(
  () => import("@/components/contact/ContactWorkflow").then((mod) => ({ default: mod.ContactWorkflow })),
  { loading: () => <div className="cp-flow cp-flow--slot" aria-hidden /> },
);

export function ContactPage() {
  return (
    <article className="cp">
      <div className="shell">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Contact", path: "/#contact" }]} />
      </div>
      <ContactHero />
      <section id="contact-intro" className="cp-talk" aria-labelledby="contact-intro-title">
        <div className="shell">
          <ContactIntro />
        </div>
      </section>
      <section className="cp-compose" aria-labelledby="contact-form-title">
        <div className="shell cp-compose__grid">
          <div id="contact-form" className="cp-compose__form">
            {/* Suspense is required: ContactFormIntent reads searchParams,
                which would otherwise opt this route out of prerendering. */}
            <Suspense fallback={<ContactForm />}>
              <ContactFormIntent />
            </Suspense>
          </div>
          <ContactReveal className="cp-compose__visual" delay={0.08}>
            <div className="cp-frame cp-frame--flow">
              <span className="cp-frame__glow cp-frame__glow--quiet" aria-hidden />
              <ContactLazyVideo src={contactCopy.media.messageFlow.src} />
            </div>
          </ContactReveal>
        </div>
      </section>
      <AvailabilityPanel />
      <ContactProcessBridge />
      <ContactWorkflow />
      <ContactChannels />
      <ContactCta />
    </article>
  );
}
