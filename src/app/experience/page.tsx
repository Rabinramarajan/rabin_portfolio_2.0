import { ExperiencePage } from "@/components/pages/ExperiencePage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Experience — Angular & Frontend Roles",
  description:
    "Rabin R's frontend engineering experience — from 2021 to Angular architecture in 2026, across government, pension and insurance in three countries.",
  path: "/experience",
  keywords: ["Angular developer experience", "Frontend engineer India", "Senior Angular developer"],
});

export default function Page() {
  return <ExperiencePage />;
}
