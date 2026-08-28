import type { Metadata } from "next";
import {
  Inter,
  JetBrains_Mono,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ProgressSync } from "@/components/ProgressSync";
import { ChatLauncher } from "@/components/ChatLauncher";
import { Toaster } from "@/components/Toaster";
import { CustomCursor } from "@/components/custom-cursor/CustomCursor";
import { defaultSeo, profile, SITE_URL } from "@/content/profile";
import "@/motion/motion.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: defaultSeo.title, template: "%s | Rabin R" },
  description: defaultSeo.description,
  keywords: defaultSeo.keywords,
  authors: [{ name: profile.name, url: SITE_URL }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL + "/",
    siteName: profile.name,
    title: defaultSeo.title,
    description: defaultSeo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultSeo.title,
    description: defaultSeo.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: { canonical: SITE_URL + "/" },
  manifest: "/manifest.webmanifest",
  category: "technology",
  creator: profile.name,
  publisher: profile.name,
  /*
   * Search Console / Bing tokens come from the environment so no placeholder
   * ever ships as a real-looking verification value.
   */
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? {
          other: {
            "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
          },
        }
      : {}),
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={[
        inter.variable,
        mono.variable,
      ].join(" ")}
    >
      <body>
        <JsonLd />
        <ProgressSync />
        <Navbar />
        <Sidebar />
        <main id="main">{children}</main>
        <Footer />
        <ChatLauncher />
        <Toaster />
        <CustomCursor />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
