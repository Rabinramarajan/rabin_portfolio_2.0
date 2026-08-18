import { ContactPage } from "@/components/ContactPage";
import { services } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Contact Rabin R for Angular development, frontend engineering, consulting, performance optimization and product work. Replies usually within one business day.",
  path: "/contact",
  keywords: ["Hire Angular developer", "Contact frontend engineer Chennai"],
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const { intent } = await searchParams;
  const matched = services.find((s) => s.id === intent);
  return <ContactPage defaultProjectType={matched?.title} />;
}
