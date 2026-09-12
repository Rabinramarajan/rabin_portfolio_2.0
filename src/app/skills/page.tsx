import { SkillsSection } from "@/components/SkillsSection";
import { SkillsNarrative } from "@/components/SkillsNarrative";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Skills & Technologies",
  description:
    "Rabin R's frontend stack and the honest depth behind it — expert Angular, TypeScript and Ionic, production React and Next.js, plus testing.",
  path: "/skills",
  keywords: ["Angular Signals", "Zoneless Angular", "TypeScript developer", "RxJS", "Ionic Capacitor"],
});

export default function Page() {
  return (
    <>
      <SkillsSection headingLevel="h1" />
      <SkillsNarrative />
    </>
  );
}
