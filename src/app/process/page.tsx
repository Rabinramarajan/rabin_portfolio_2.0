import { ProcessSection } from "@/components/ProcessSection";
import { pageMetadata } from "@/lib/seo";

/* Route-scoped stylesheet. Imported here, not from globals.css, so only
   the routes that render this file download it. */
import "@/app/css/pages/process-cinematic.css";

export const metadata = pageMetadata({
  title: "Process — How an Engagement Runs",
  description:
    "How Rabin R runs an engagement — discover, define, design, build, test, launch and evolve — so frontend work stays predictable from first call to production.",
  path: "/process",
  keywords: ["Frontend development process", "Angular project workflow"],
});

export default function Page() {
  return <ProcessSection headingLevel="h1" />;
}
