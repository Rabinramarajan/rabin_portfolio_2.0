import Image from "next/image";
import { insightCover } from "@/lib/insightCover";
import type { Insight } from "@/content/types";

/**
 * The image for an article, wherever the listing shows one.
 *
 * Two rendering paths on purpose. A real cover goes through next/image and
 * gets AVIF/WebP at the requested width. A generated placeholder is an SVG —
 * already a few hundred bytes, and vector at any size — so it goes out as a
 * plain <img>: running it through the optimizer would rasterise it, cost a
 * transform, and require turning on SVG handling in next.config for files
 * that are ours anyway.
 *
 * Either way the intrinsic size is on the element, so the card's image box is
 * reserved before the file lands.
 */
export function InsightCover({
  item,
  sizes,
  priority,
  quality,
  className = "inh-cover",
}: {
  item: Insight;
  sizes: string;
  priority?: boolean;
  quality?: number;
  className?: string;
}) {
  const cover = insightCover(item);

  if (cover.placeholder) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- vector placeholder; see above.
      <img
        className={className}
        src={cover.src}
        alt=""
        aria-hidden
        width={cover.width}
        height={cover.height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }

  return (
    <Image
      className={className}
      src={cover.src}
      alt={cover.alt}
      width={cover.width}
      height={cover.height}
      sizes={sizes}
      priority={priority}
      quality={quality}
    />
  );
}
