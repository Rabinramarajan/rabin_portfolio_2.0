import { HomePage } from "@/components/HomePage";
import { defaultSeo } from "@/content/profile";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: defaultSeo.title,
  description: defaultSeo.description,
  path: "/",
  keywords: defaultSeo.keywords,
});

export default function Page() {
  /* The hero poster preload is NOT hoisted here any more.
     React hoists a matching <link rel="preload" as="image"> into the head on
     its own, from the poster <img fetchPriority="high" srcSet> in
     ScrollVideoPlayer — which is what the manual hoist that used to live here
     was working around. Keeping both emitted two preloads for the same srcset.
     If a future React/Next upgrade stops hoisting it, the check is
     `curl -s https://www.rabinr.in/ | grep -c 'rel="preload" as="image"'`
     against the poster: it must stay at 1, and reinstating this block is the
     fix if it ever reaches 0. */
  return <HomePage />;
}
