import { ContactPageHero } from "@/components/contact/ContactPageHero";
import { ContactProjectInquiry } from "@/components/contact/ContactProjectInquiry";
import { ContactChannelsNew as ContactChannels } from "@/components/contact/ContactChannelsNew";
import { ContactFinalCTA } from "@/components/contact/ContactFinalCTA";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Rabin R | Premium Engineering & Digital Products",
  description:
    "Let's build something useful. Have a product, platform, or frontend challenge? Reach out to discuss your next project. Available for select engagements.",
  path: "/contact",
  keywords: ["contact", "hire", "frontend engineer", "product development", "consulting", "angular"],
});

export default function ContactPage() {
  return (
    <>
      <ContactPageHero />
      <ContactProjectInquiry />
      <ContactChannels />
      <ContactFinalCTA />
    </>
  );
}
