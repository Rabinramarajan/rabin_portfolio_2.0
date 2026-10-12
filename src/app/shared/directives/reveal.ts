import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input, signal } from '@angular/core';

/**
 * up (default): fades up. peel: lifts off the page like a sticky note.
 * stamp: lands with a small overshoot. mask: wipes in from the left.
 */
export type RevealVariant = 'up' | 'peel' | 'stamp' | 'mask';

/**
 * Reveals an element the first time it scrolls into view. Use `appReveal` for the default
 * fade-up, or `appReveal="peel"` (or stamp, mask) for a named effect. The animations live
 * in CSS, so reduced-motion settings apply automatically.
 */
@Directive({
  selector: '[appReveal]',
  host: {
    class: 'reveal',
    '[attr.data-reveal]': 'variant()',
    '[class.is-visible]': 'isVisible()',
  },
})
export class Reveal {
  /** Bare `appReveal` gives an empty string, which falls back to the default effect. */
  readonly variant = input<RevealVariant, RevealVariant | ''>('up', {
    alias: 'appReveal',
    transform: (value) => value || 'up',
  });

  protected readonly isVisible = signal(false);

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          this.isVisible.set(true);
          observer.disconnect();
        },
        { threshold: 0.15 },
      );

      observer.observe(element);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
