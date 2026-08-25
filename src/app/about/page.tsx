import { AboutSection } from "@/components/about/AboutSection";
import { pageMetadata } from "@/lib/seo";
import { about } from "@/content/about";

export const metadata = pageMetadata({
  title: `About – ${about.heading}`,
  description:
    "Learn about Rabin R, an Angular developer and frontend software engineer specializing in scalable web architecture, performance optimization, and product engineering.",
  path: "/about",
  keywords: ["about", "Rabin R", "Angular developer", "frontend engineer", "biography"],
});

export default function AboutPage() {
  return <AboutSection />;
}
