import { ContactSection } from "@/components/ContactSection";
import { ContactMotionEnhancer } from "@/components/ContactMotionEnhancer";
import { ContactPageHero } from "@/components/contact/ContactPageHero";
import { ContactInformation } from "@/components/contact/ContactInformation";
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
      <ContactInformation />
      <ContactSection />
      <ContactMotionEnhancer />
    </>
  );
}
