import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const { intent } = await searchParams;
  const anchor = intent ? `?intent=${intent}` : "";
  redirect(`/#contact${anchor}`);
}
