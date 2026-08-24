import { pageMetadata } from "@/lib/seo";
import { ContactPage } from "@/components/ContactPage";
import "./contact.css";

export const metadata = pageMetadata({
  title: "Contact — Frontend Angular Consultant",
  description:
    "Get in touch with Rabin R for frontend engineering, Angular development, consulting, collaboration, and selected opportunities.",
  path: "/contact",
  keywords: [
    "Contact Rabin R",
    "Angular consultant",
    "Frontend engineer Chennai",
    "Hire Angular developer",
    "Frontend consulting",
  ],
});

export default function Page() {
  return <ContactPage />;
}
