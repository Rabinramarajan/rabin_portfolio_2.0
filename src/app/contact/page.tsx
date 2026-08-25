import { ContactPageHero } from "@/components/contact/ContactPageHero";
import { ContactProjectInquiry } from "@/components/contact/ContactProjectInquiry";
import { ContactAvailability } from "@/components/contact/ContactAvailability";
import { ContactChannelsNew as ContactChannels } from "@/components/contact/ContactChannelsNew";
import { ContactFinalCTA } from "@/components/contact/ContactFinalCTA";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Rabin R | Angular & Frontend Engineering",
  description:
    "Have a product or frontend challenge in mind? Contact Rabin R for Angular development, frontend engineering, consulting, and digital product work. Available for select projects.",
  path: "/contact",
  keywords: ["contact", "hire", "angular developer", "frontend engineer", "freelance", "consulting"],
});

export default function ContactPage() {
  return (
    <>
      <ContactPageHero />
      <ContactProjectInquiry />
      <ContactAvailability />
      <ContactChannels />
      <ContactFinalCTA />
    </>
  );
}
