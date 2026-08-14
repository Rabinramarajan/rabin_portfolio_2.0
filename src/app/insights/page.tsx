import type { Metadata } from "next";
import { InsightsSection } from "@/components/InsightsSection";

export const metadata: Metadata = {
  title: "Insights",
  description: "Engineering notes from Rabin R — signals, performance, and quiet interfaces.",
};

export default function Page() {
  return <InsightsSection />;
}
