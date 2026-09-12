import { LegalDocument } from "@/components/LegalDocument";
import { privacy } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: privacy.title,
  description: privacy.description,
  path: privacy.path,
  keywords: ["privacy policy", "data protection", "Rabin R"],
});

export default function Page() {
  return <LegalDocument doc={privacy} />;
}
