import { ProcessSection } from "@/components/ProcessSection";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Process",
  description:
    "How Rabin R runs an engagement — discover, define, design, build, test, launch and evolve — so frontend work stays predictable from first call to production.",
  path: "/process",
  keywords: ["Frontend development process", "Angular project workflow"],
});

export default function Page() {
  return <ProcessSection headingLevel="h1" />;
}
