import dynamic from "next/dynamic";
import { Breadcrumbs } from "@/components/pages/Breadcrumbs";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactIntro } from "@/components/contact/ContactIntro";
import { ContactForm } from "@/components/contact/ContactForm";
import { AvailabilityPanel } from "@/components/contact/AvailabilityPanel";
import { ContactChannels } from "@/components/contact/ContactChannels";
import { ContactCta } from "@/components/contact/ContactCta";
import { inquiryFromIntent } from "@/content/contact";
import type { InquiryType } from "@/types/contact";

const ContactWorkflow = dynamic(
  () => import("@/components/contact/ContactWorkflow").then((mod) => ({ default: mod.ContactWorkflow })),
  { loading: () => <div className="cp-flow cp-flow--slot" aria-hidden /> },
);

export function ContactPage({ intent }: { intent?: string }) {
  const inquiryType: InquiryType | undefined = inquiryFromIntent(intent);

  return (
    <article className="cp">
      <div className="shell">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]} />
      </div>
      <ContactHero />
      <section id="contact-intro" className="cp-split" aria-labelledby="contact-intro-title">
        <div className="shell cp-split__grid">
          <ContactIntro />
          <div id="contact-form" className="cp-split__form">
            <ContactForm key={inquiryType ?? "open"} defaultInquiryType={inquiryType} />
          </div>
        </div>
      </section>
      <ContactWorkflow />
      <AvailabilityPanel />
      <ContactChannels />
      <ContactCta />
    </article>
  );
}
