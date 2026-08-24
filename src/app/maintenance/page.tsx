import { defaultSeo } from "@/content/profile";
import { pageMetadata } from "@/lib/seo";
import { MaintenancePage } from "@/components/MaintenancePage";

export const metadata = pageMetadata({
  title: "Under Maintenance",
  description:
    "We're making things better. The site will be back soon with an even better experience.",
  path: "/maintenance",
  keywords: defaultSeo.keywords,
});

export default function Page() {
  return <MaintenancePage />;
}
