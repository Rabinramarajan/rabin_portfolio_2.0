import { ServicesPage } from "@/components/pages/ServicesPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Angular & Frontend Engineering Services",
  description:
    "Four services: Angular engineering, frontend architecture, performance optimization and Ionic cross-platform mobile — for enterprise and government products.",
  path: "/services",
  keywords: [
    "Angular development services",
    "Angular consultant",
    "Frontend architecture",
    "Angular performance optimization",
    "Ionic Angular developer",
    "Enterprise Angular architecture",
  ],
});

export default function Page() {
  return <ServicesPage />;
}
