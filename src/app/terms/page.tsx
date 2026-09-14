import { LegalDocument } from "@/components/LegalDocument";
import { terms } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

/* Route-scoped stylesheet. Imported here, not from globals.css, so only
   the routes that render this file download it. */
import "@/app/css/pages/legal.css";

export const metadata = pageMetadata({
  title: terms.title,
  description: terms.description,
  path: terms.path,
  keywords: ["terms of use", "website terms", "Rabin R"],
});

export default function Page() {
  return <LegalDocument doc={terms} />;
}
