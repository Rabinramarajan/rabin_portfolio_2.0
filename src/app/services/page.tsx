import { ServicesPage } from "@/components/pages/ServicesPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Angular & Frontend Development Services",
  description:
    "Frontend engineering, Angular development, React and Next.js, UI engineering, performance optimization, Ionic mobile apps and design systems — from problem to production.",
  path: "/services",
  keywords: [
    "Angular development services",
    "Frontend development services",
    "Angular consulting",
    "React development",
    "Next.js development",
    "Web performance optimization",
    "Design system development",
  ],
});

export default function Page() {
  return <ServicesPage />;
}
