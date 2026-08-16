import { PricingSection } from "@/components/PricingSection";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Engagement Models & Pricing",
  description:
    "Indicative INR engagement models for Angular and frontend work with Rabin R — project, retainer and consulting shapes, and what each one includes.",
  path: "/pricing",
  keywords: ["Angular developer rates", "Frontend consulting engagement"],
});

export default function Page() {
  return <PricingSection headingLevel="h1" />;
}
