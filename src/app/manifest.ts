import type { MetadataRoute } from "next";
import { profile, defaultSeo } from "@/content/profile";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: defaultSeo.title,
    short_name: profile.name,
    description: defaultSeo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0b",
    theme_color: "#0a0a0b",
    lang: "en",
    icons: [
      { src: "/logo-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/logo-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/logo-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
