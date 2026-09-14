import { LegalDocument } from "@/components/LegalDocument";
import { privacy } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

/* Route-scoped stylesheet. Imported here, not from globals.css, so only
   the routes that render this file download it. */
import "@/app/css/pages/legal.css";

export const metadata = pageMetadata({
  title: privacy.title,
  description: privacy.description,
  path: privacy.path,
  keywords: ["privacy policy", "data protection", "Rabin R"],
});

export default function Page() {
  return <LegalDocument doc={privacy} />;
}
