import { AboutSection } from "@/components/about/AboutSection";
import { AboutStory } from "@/components/about/AboutStory";
import { pageMetadata } from "@/lib/seo";
import { about } from "@/content/about";

export const metadata = pageMetadata({
  title: `About – ${about.heading}`,
  description:
    "Rabin R is a frontend Angular consultant in Chennai with 4+ years building government, pension, insurance and healthcare platforms across three countries — how he got here and how he works.",
  path: "/about",
  keywords: ["about", "Rabin R", "Angular developer", "frontend engineer", "biography"],
});

export default function AboutPage() {
  return (
    <>
      <AboutSection />
      <AboutStory />
    </>
  );
}
