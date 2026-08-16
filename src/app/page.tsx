import { HomePage } from "@/components/HomePage";
import { defaultSeo } from "@/content/profile";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: defaultSeo.title,
  description:
    "Rabin R is an Angular Developer and Frontend Software Engineer in Chennai, India, specializing in Angular, TypeScript, React, Next.js, performance and scalable frontend architecture for enterprise and government web applications.",
  path: "/",
  keywords: defaultSeo.keywords,
});

export default function Page() {
  return <HomePage />;
}
