"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/cn";

/* A tiny SVG data-URI placeholder — a flat tone block in the image's aspect
   ratio. next/image paints it instantly (zero layout shift) and swaps in the
   real frame once loaded; the fade-in class then eases blur → sharp. */
function tonePlaceholder(color: string, width: number, height: number): `data:image/svg+xml,${string}` {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${color}"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * `next/image` with the performance defaults forced and a blur-up tone
 * placeholder. Guarantees loading="lazy" + decoding="async" (except for
 * `priority` LCP images, where preloading wins) and a placeholder that paints
 * before the network responds, so images never cause layout shift.
 */
export function SmartImage({
  blurColor = "#101014",
  className,
  onLoad,
  alt,
  ...rest
}: ImageProps & { blurColor?: string }) {
  const [loaded, setLoaded] = useState(false);
  const width = typeof rest.width === "number" ? rest.width : 0;
  const height = typeof rest.height === "number" ? rest.height : 0;
  const placeholder: ImageProps["placeholder"] =
    rest.placeholder ?? (width > 0 && height > 0 ? tonePlaceholder(blurColor, width, height) : undefined);

  return (
    <Image
      {...rest}
      alt={alt}
      className={cn("smart-image", loaded && "is-loaded", className)}
      loading={rest.priority ? undefined : (rest.loading ?? "lazy")}
      decoding={rest.decoding ?? "async"}
      placeholder={placeholder}
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
    />
  );
}