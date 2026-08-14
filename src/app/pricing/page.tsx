import type { Metadata } from "next";
import { PricingSection } from "@/components/PricingSection";

export const metadata: Metadata = { title: "Pricing", description: "Indicative INR engagement models." };

export default function Page() {
  return <PricingSection />;
}
