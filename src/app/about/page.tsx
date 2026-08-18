import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/pages/Breadcrumbs";
import { AboutSection } from "@/components/about/AboutSection";
import { profile } from "@/content/profile";
import { about } from "@/content/about";

export const metadata = pageMetadata({
  title: "About Us",
  description: `${about.positioning} ${profile.name} is a ${profile.headlineRole} based in ${profile.locationShort}.`,
  path: "/about",
  keywords: ["Rabin R", "About Rabin R", "Angular developer Chennai", "Frontend software engineer"],
});

export default function Page() {
  return (
    <article>
      <div className="shell">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "About Us", path: "/about" }]} />
      </div>
      <AboutSection />
    </article>
  );
}
