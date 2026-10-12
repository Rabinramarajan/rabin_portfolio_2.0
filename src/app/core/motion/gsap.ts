import { DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';

type Gsap = typeof import('gsap').gsap;
type ScrollTriggerStatic = typeof import('gsap/ScrollTrigger').ScrollTrigger;

export interface MotionKit {
  gsap: Gsap;
  ScrollTrigger: ScrollTriggerStatic;
  /** The component's host element; selectors in `setup` are scoped to it. */
  root: HTMLElement;
}

let loading: Promise<Omit<MotionKit, 'root'>> | undefined;

/** Loads GSAP and ScrollTrigger once, on demand, so neither sits in the initial bundle. */
function loadGsap(): Promise<Omit<MotionKit, 'root'>> {
  loading ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([core, st]) => {
    core.gsap.registerPlugin(st.ScrollTrigger);
    return { gsap: core.gsap, ScrollTrigger: st.ScrollTrigger };
  });
  return loading;
}

export function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Runs a GSAP setup for the calling component once it has rendered in the browser.
 *
 * - Never runs during prerender (afterNextRender is browser-only).
 * - Skipped entirely under prefers-reduced-motion: content is already visible
 *   because every animation uses `from` tweens on otherwise-static markup.
 * - Everything created inside `setup` lives in a gsap.context scoped to the host,
 *   and is reverted (tweens killed, ScrollTriggers removed, inline styles cleared)
 *   when the component is destroyed.
 *
 * Must be called from an injection context, e.g. a component constructor.
 */
export function useGsap(setup: (kit: MotionKit) => void): void {
  const root = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  const destroyRef = inject(DestroyRef);
  let destroyed = false;
  let revert: (() => void) | undefined;

  destroyRef.onDestroy(() => {
    destroyed = true;
    revert?.();
  });

  afterNextRender(() => {
    // No matchMedia (e.g. jsdom in unit tests) means no way to honour motion preferences: stay static
    if (typeof matchMedia !== 'function' || prefersReducedMotion()) return;

    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (destroyed) return;
      const ctx = gsap.context(() => setup({ gsap, ScrollTrigger, root }), root);
      revert = () => ctx.revert();
    });
  });
}
