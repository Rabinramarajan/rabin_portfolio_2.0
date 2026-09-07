import { ServicesPage } from "@/components/pages/ServicesPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Angular & Frontend Development Services",
  description:
    "Frontend engineering and Angular development services — React, Next.js, UI engineering, performance optimization and design systems.",
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
