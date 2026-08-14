import { redirect } from "next/navigation";

export const metadata = {
  title: "About",
  description: "Senior Frontend Engineer Rabin R, Angular specialist based in Chennai.",
};

export default function Page() {
  redirect("/#about");
}
