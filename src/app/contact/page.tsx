import { pageMetadata } from "@/lib/seo";
import { PremiumContactHero } from "@/components/contact/PremiumContactHero";
import { PremiumContactLayout } from "@/components/contact/PremiumContactLayout";
import { PremiumContactLeftColumn } from "@/components/contact/PremiumContactLeftColumn";
import { PremiumContactCenterVisual } from "@/components/contact/PremiumContactCenterVisual";
import { PremiumContactRightColumn } from "@/components/contact/PremiumContactRightColumn";

/* Route-scoped stylesheet. Imported here, not from globals.css, so only
   the routes that render this file download it. */
import "@/app/css/pages/contact-premium.css";
import "@/app/css/pages/contact-fields.css";

export const metadata = pageMetadata({
  title: "Contact — Angular Consulting Enquiries",
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
