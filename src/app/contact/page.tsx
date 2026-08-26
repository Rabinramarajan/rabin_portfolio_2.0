import { pageMetadata } from "@/lib/seo";
import { PremiumContactHero } from "@/components/contact/PremiumContactHero";
import { PremiumContactLayout } from "@/components/contact/PremiumContactLayout";
import { PremiumContactLeftColumn } from "@/components/contact/PremiumContactLeftColumn";
import { PremiumContactCenterVisual } from "@/components/contact/PremiumContactCenterVisual";
import { PremiumContactRightColumn } from "@/components/contact/PremiumContactRightColumn";

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
      <div className="shell">
        <PremiumContactLayout
          left={<PremiumContactLeftColumn />}
          center={<PremiumContactCenterVisual />}
          right={<PremiumContactRightColumn />}
        />
      </div>
    </>
  );
}
