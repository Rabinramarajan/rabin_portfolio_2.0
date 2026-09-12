import { LegalDocument } from "@/components/LegalDocument";
import { terms } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: terms.title,
  description: terms.description,
  path: terms.path,
  keywords: ["terms of use", "website terms", "Rabin R"],
});

export default function Page() {
  return <LegalDocument doc={terms} />;
}
