import { HomePage } from "@/components/HomePage";
import { defaultSeo, hero } from "@/content/profile";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: defaultSeo.title,
  description:
    "Rabin R is an Angular Developer and Frontend Software Engineer in Chennai, India, specializing in Angular, TypeScript, React, Next.js, performance and scalable frontend architecture for enterprise and government web applications.",
  path: "/",
  keywords: defaultSeo.keywords,
});

export default function Page() {
  /* The hero poster is painted behind the headline and is only discoverable
     once the (client) hero component's markup is parsed. Hoisting it into the
     head lets the preload scanner start it with the document. */
  const poster = hero.reel?.poster;
  return (
    <>
      {poster ? (
        <link
          rel="preload"
          as="image"
          href={poster}
          /* Mirrors the <img>'s srcset/sizes exactly (both read the same fields
             on hero.reel). Preloading the bare href while the img resolved a
             narrower candidate would download two files instead of one. */
          imageSrcSet={hero.reel?.posterSrcSet}
          imageSizes={hero.reel?.posterSizes}
          fetchPriority="high"
        />
      ) : null}
      <HomePage />
    </>
  );
}
