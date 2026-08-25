import { pageMetadata } from "@/lib/seo";
import { PremiumContactHero } from "@/components/contact/PremiumContactHero";
import { PremiumContactForm } from "@/components/contact/PremiumContactForm";
import { PremiumContactCTA } from "@/components/contact/PremiumContactCTA";

export const metadata = pageMetadata({
  title: "Contact Rabin R | Let's Build Something Amazing",
  description:
    "Ready to collaborate? Reach out with your project ideas, challenges, or opportunities. Let's create something impactful together.",
  path: "/contact",
  keywords: ["contact", "hire", "freelance", "project inquiry", "consultation", "collaboration"],
});

export default function ContactPage() {
  return (
    <>
      <PremiumContactHero />
      <PremiumContactForm />
      <PremiumContactCTA />
    </>
  );
}
