import { AboutSection } from "@/components/about/AboutSection";
import { pageMetadata } from "@/lib/seo";
import { about } from "@/content/about";

export const metadata = pageMetadata({
  title: `About – ${about.heading}`,
  description:
    "Frontend engineer and Angular developer specializing in scalable web architecture, performance, and product engineering.",
  path: "/about",
  keywords: ["about", "Rabin R", "Angular developer", "frontend engineer", "biography"],
});

export default function AboutPage() {
  return <AboutSection />;
}
