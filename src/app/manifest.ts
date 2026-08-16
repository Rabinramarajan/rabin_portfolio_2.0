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
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    ],
  };
}
