import { DestroyRef, Directive, ElementRef, afterNextRender, inject, signal } from '@angular/core';

/**
 * Fades an element up the first time it scrolls into view.
 * The animation itself lives in CSS, so reduced-motion settings apply automatically.
 */
@Directive({
  selector: '[appReveal]',
  host: {
    class: 'reveal',
    '[class.is-visible]': 'isVisible()',
  },
})
export class Reveal {
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
