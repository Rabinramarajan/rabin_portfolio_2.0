import { ChangeDetectionStrategy, Component, ElementRef, computed, signal, viewChildren } from '@angular/core';
import type { ScrollTrigger as ScrollTriggerInstance } from 'gsap/ScrollTrigger';
import { processSteps } from '../../../data/process';
import { prefersReducedMotion, useGsap } from '../../../core/motion/gsap';
import { ProcessGlyph } from '../process-glyph/process-glyph';

/**
 * Discover → Evolve as a pinned stage on desktop: the rail and the detail panel stay
 * in view while the reader scrolls, and scrolling moves the active step. On phones the
 * stage is static and the rail becomes a swipeable row. Keyboard: arrows, Home, End.
 */
@Component({
  selector: 'app-process-stepper',
  imports: [ProcessGlyph],
  templateUrl: './process-stepper.html',
  styleUrl: './process-stepper.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessStepper {
  protected readonly steps = processSteps;
  readonly selectedIndex = signal(0);
  /** 0–1 through the pinned track, drives the rail's progress line on desktop. */
  readonly progress = signal(0);
  readonly selected = computed(() => this.steps[this.selectedIndex()]);

  private readonly stepButtons = viewChildren<ElementRef<HTMLButtonElement>>('step');
  /** Only set while the desktop pin is active. */
  private pin?: ScrollTriggerInstance;

  constructor() {
    useGsap(({ gsap, ScrollTrigger, root }) => {
      const timeline = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 75%' } });
      timeline
        .from(root.querySelector('.rail__line'), { scaleY: 0, duration: 0.9, ease: 'power2.inOut' })
        .from(root.querySelectorAll('.rail__item'), { autoAlpha: 0, y: 16, stagger: 0.07, duration: 0.45 }, '-=0.6')
        .from(root.querySelector('.panel'), { autoAlpha: 0, y: 24, duration: 0.6, ease: 'power3.out' }, '-=0.2');

      const track = root.querySelector<HTMLElement>('.process__track');
      if (!track) return;

      gsap.matchMedia().add('(min-width: 1080px)', () => {
        const count = this.steps.length;
        this.pin = ScrollTrigger.create({
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            this.progress.set(self.progress);
            this.selectedIndex.set(Math.min(count - 1, Math.floor(self.progress * count)));
          },
        });
        return () => {
          this.pin?.kill();
          this.pin = undefined;
        };
      });
    });
  }

  select(index: number): void {
    this.selectedIndex.set(index);

    // On desktop, bring the pinned track to this step's share of the scroll distance
    if (this.pin) {
      const share = (index + 0.5) / this.steps.length;
      const top = this.pin.start + share * (this.pin.end - this.pin.start);
      window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }
  }

  protected onKeydown(event: KeyboardEvent, index: number): void {
    const last = this.steps.length - 1;
    const next =
      event.key === 'ArrowRight' || event.key === 'ArrowDown' ? Math.min(last, index + 1)
      : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? Math.max(0, index - 1)
      : event.key === 'Home' ? 0
      : event.key === 'End' ? last
      : null;

    if (next === null) return;
    event.preventDefault();
    this.select(next);
    this.stepButtons()[next]?.nativeElement.focus({ preventScroll: true });
  }
}
