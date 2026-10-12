import { IMAGE_CONFIG, IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { Provider, isDevMode } from '@angular/core';

/**
 * Widths of the resized copies scripts/postbuild.mjs writes next to every
 * /media/*.webp file (e.g. cover.w768.webp). Keep the two lists in sync.
 */
export const IMAGE_BREAKPOINTS = [480, 768, 1080, 1600];

/** Maps NgOptimizedImage srcset entries onto the pre-generated variants. */
export function mediaImageLoader({ src, width }: ImageLoaderConfig): string {
  const resizable = src.startsWith('/media/') && src.endsWith('.webp');
  if (isDevMode() || !resizable || !width || !IMAGE_BREAKPOINTS.includes(width)) return src;
  return src.replace(/\.webp$/, `.w${width}.webp`);
}

export function provideMediaImages(): Provider[] {
  return [
    { provide: IMAGE_LOADER, useValue: mediaImageLoader },
    { provide: IMAGE_CONFIG, useValue: { breakpoints: IMAGE_BREAKPOINTS } },
  ];
}
