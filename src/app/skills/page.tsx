import { SkillsSection } from "@/components/SkillsSection";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Skills & Technologies",
  description:
    "Rabin R's frontend technology stack — Angular, TypeScript, Signals, RxJS, React, Next.js, Ionic, Capacitor, Node.js, PostgreSQL and the testing and tooling around them.",
  path: "/skills",
  keywords: ["Angular Signals", "Zoneless Angular", "TypeScript developer", "RxJS", "Ionic Capacitor"],
});

export default function Page() {
  return <SkillsSection headingLevel="h1" />;
}
