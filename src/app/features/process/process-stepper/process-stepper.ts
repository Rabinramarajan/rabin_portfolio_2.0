import { ChangeDetectionStrategy, Component, ElementRef, computed, signal, viewChildren } from '@angular/core';
import { processSteps } from '../../../data/process';
import { useGsap } from '../../../core/motion/gsap';
import { ProcessGlyph } from '../process-glyph/process-glyph';

/**
 * Discover → Evolve as a stepper: a horizontal rail on desktop, a vertical one
 * on mobile, both driving a single detail panel. Keyboard: arrows, Home, End.
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
  readonly selected = computed(() => this.steps[this.selectedIndex()]);

  private readonly stepButtons = viewChildren<ElementRef<HTMLButtonElement>>('step');

  constructor() {
    useGsap(({ gsap, root }) => {
      const timeline = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 75%' } });
      timeline
        .from(root.querySelector('.rail__line'), { scale: 0, duration: 0.9, ease: 'power2.inOut' })
        .from(root.querySelectorAll('.rail__item'), { autoAlpha: 0, y: 16, stagger: 0.07, duration: 0.45 }, '-=0.6')
        .from(root.querySelector('.panel'), { autoAlpha: 0, y: 24, duration: 0.6, ease: 'power3.out' }, '-=0.2');
    });
  }

  select(index: number): void {
    this.selectedIndex.set(index);
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
    this.stepButtons()[next]?.nativeElement.focus();
  }
}
