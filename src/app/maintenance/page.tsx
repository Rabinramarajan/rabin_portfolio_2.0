import { defaultSeo } from "@/content/profile";
import { pageMetadata } from "@/lib/seo";
import { MaintenancePage } from "@/components/MaintenancePage";

/* Never indexable: while the flag is off this URL redirects home, and while it
   is on the screen is served (via rewrite) at the real URLs instead. Either
   way, /maintenance itself should not appear in search results. */
export const metadata = {
  ...pageMetadata({
    title: "Under Maintenance",
    description:
      "We're making things better. The site will be back soon with an even better experience.",
    path: "/maintenance",
    keywords: defaultSeo.keywords,
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <MaintenancePage />;
}
