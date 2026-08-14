import type { Metadata } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { PageLoader } from "@/components/PageLoader";
import { ChatLauncher } from "@/components/ChatLauncher";
import { Toaster } from "@/components/Toaster";
import { defaultSeo, profile, SITE_URL } from "@/content/profile";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const tight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: defaultSeo.title, template: "%s | Rabin R" },
  description: defaultSeo.description,
  keywords: defaultSeo.keywords,
  authors: [{ name: profile.name, url: SITE_URL }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: profile.name,
    title: defaultSeo.title,
    description: defaultSeo.description,
  },
  twitter: { card: "summary_large_image", title: defaultSeo.title, description: defaultSeo.description },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={[inter.variable, tight.variable, mono.variable].join(" ")}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <JsonLd />
        <PageLoader />
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <ChatLauncher />
        <Toaster />
      </body>
    </html>
  );
}
