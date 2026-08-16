import { InsightsSection } from "@/components/InsightsSection";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Insights",
  description:
    "Engineering notes from Rabin R on Angular architecture, Signals, rendering performance and quiet interfaces — positions taken from shipped production work.",
  path: "/insights",
  keywords: ["Angular architecture", "Frontend performance notes"],
});

export default function Page() {
  return <InsightsSection headingLevel="h1" />;
}
