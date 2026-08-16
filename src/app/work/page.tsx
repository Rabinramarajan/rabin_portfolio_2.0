import { WorkPage } from "@/components/pages/WorkPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Selected Work",
  description:
    "Selected Angular and enterprise work by Rabin R — Fiji immigration platforms, the PRIMS pension portal, the VNPF mobile app and insurance consoles built for production.",
  path: "/work",
  keywords: ["Angular projects", "Enterprise Angular", "Government web platform", "Ionic app case study"],
});

export default function Page() {
  return <WorkPage />;
}
