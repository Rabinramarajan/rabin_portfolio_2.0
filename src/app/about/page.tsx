import { AboutSection } from "@/components/about/AboutSection";
import { AboutStory } from "@/components/about/AboutStory";
import { pageMetadata } from "@/lib/seo";
import { ProfilePageJsonLd } from "@/components/JsonLd";

export const metadata = pageMetadata({
  title: "About Rabin R",
  description:
    "Frontend Angular consultant in Chennai — 4+ years across government, pension, insurance and healthcare platforms in three countries.",
  path: "/about",
  keywords: ["about", "Rabin R", "Angular developer", "frontend engineer", "biography"],
});

export default function AboutPage() {
  return (
    <>
      <ProfilePageJsonLd />
      <AboutSection />
      <AboutStory />
    </>
  );
}
