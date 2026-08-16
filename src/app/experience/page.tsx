import { ExperiencePage } from "@/components/pages/ExperiencePage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Experience",
  description:
    "Rabin R's frontend engineering experience — from first builds in 2021 to Angular architecture and AI-driven analytics in 2026, across government, pension and insurance products in three countries.",
  path: "/experience",
  keywords: ["Angular developer experience", "Frontend engineer India", "Senior Angular developer"],
});

export default function Page() {
  return <ExperiencePage />;
}
