import { Signal, afterRenderEffect, signal } from '@angular/core';

/**
 * Tracks which section heading the reader is in. A heading becomes active once
 * it scrolls into the band just below the sticky header, and stays active until
 * the next one arrives. Uses IntersectionObserver, so nothing runs on scroll.
 * Browser-only (afterRenderEffect never runs during prerender).
 */
export function useScrollSpy(ids: () => string[], topOffsetPx = 120): Signal<string | null> {
  const active = signal<string | null>(null);

  afterRenderEffect((onCleanup) => {
    const headings = ids()
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!headings.length || typeof IntersectionObserver === 'undefined') return;

    // Before the first heading is reached, nothing is highlighted
    active.set(null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).map((e) => e.target.id);
        if (visible.length) {
          // The topmost heading in the band wins
          const order = ids();
          active.set(visible.sort((a, b) => order.indexOf(a) - order.indexOf(b))[0]);
          return;
        }
        // Scrolled back above the first heading
        if (headings[0].getBoundingClientRect().top > topOffsetPx) active.set(null);
      },
      // A band from just under the header down to 40% of the viewport
      { rootMargin: `-${topOffsetPx}px 0px -60% 0px` },
    );

    headings.forEach((heading) => observer.observe(heading));
    onCleanup(() => observer.disconnect());
  });

  return active.asReadonly();
}
