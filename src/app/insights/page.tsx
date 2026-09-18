import { InsightsHub } from "@/components/insights/InsightsHub";
import { pageMetadata } from "@/lib/seo";
import { BlogJsonLd } from "@/components/JsonLd";

export const metadata = pageMetadata({
  title: "Insights — Angular Engineering Notes",
  description:
    "Engineering notes from Rabin R on Angular architecture, Signals, rendering performance and quiet interfaces — positions taken from shipped production work.",
  path: "/insights",
  keywords: ["Angular architecture", "Frontend performance notes"],
});

export default function Page() {
  return (
    <>
      <BlogJsonLd />
      <InsightsHub
        intro={
          <>
            <p>
              These are engineering notes rather than tutorials. Each one argues a position I
              arrived at on a specific production system — a government case management
              platform, a pension member portal, a cross-platform member app — and says what
              the decision cost as well as what it bought.
            </p>
            <p>
              The recurring subjects are Angular architecture and state, where the useful
              question is usually when Signals are enough and a store is overhead rather than
              which library to adopt; rendering and network performance, where load behaviour
              belongs in the feature spec rather than in a later optimisation phase; and
              restraint in interfaces for software people are required to use every day rather
              than choose to.
            </p>
            <p>
              I write one of these when a problem turns out to have a general shape worth
              naming. That means there are fewer of them than a publishing schedule would
              produce, and each is drawn from work that actually shipped, with the projects
              that produced it named.
            </p>
          </>
        }
      />
    </>
  );
}
