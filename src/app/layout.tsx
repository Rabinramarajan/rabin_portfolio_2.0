import type { Metadata } from "next";
import Script from "next/script";
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
import { media } from "@/lib/media";
import "@/motion/motion.css";
import "./globals.css";

/* The weight set is matched to what the stylesheets actually ask for. It used
   to list 300, which no rule uses, and omit 800, which the hero headline and
   four other rules do use — so the heaviest type on the page was synthesised
   as faux bold from 700 rather than drawn. Dropping the variable font here is
   deliberate: it covers every weight from one file but measured 9 KB heavier
   on the homepage than these static cuts. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/* Media lives on the Vercel Blob CDN, a second origin whose connection would
   otherwise only be opened once the hero markup is parsed. Returns null when
   media is served from /public, where there is nothing to preconnect to. */
function mediaOrigin(): string | null {
  const sample = media("hero/home-poster.webp");
  return sample.startsWith("http") ? new URL(sample).origin : null;
}

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
    images: [
      {
        url: SITE_URL + "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Rabin R — Angular Developer & Frontend Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultSeo.title,
    description: defaultSeo.description,
    images: [SITE_URL + "/opengraph-image"],
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
  const origin = mediaOrigin();
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={[
        inter.variable,
        mono.variable,
      ].join(" ")}
    >
      <head>
        {origin ? (
          <>
            <link rel="preconnect" href={origin} crossOrigin="" />
            <link rel="dns-prefetch" href={origin} />
          </>
        ) : null}
      </head>
      <body suppressHydrationWarning>
        <JsonLd />
        <ProgressSync />
        <Navbar />
        <Sidebar />
        <main id="main">{children}</main>
        <Footer />
        <ChatLauncher />
        <Toaster />
        <CustomCursor />

        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
