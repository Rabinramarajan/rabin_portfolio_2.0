import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

/** A thin reading-progress bar under the header. Purely decorative. */
@Component({
  selector: 'app-scroll-progress',
  template: '<span class="bar" [style.transform]="transform()"></span>',
  styleUrl: './scroll-progress.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '(window:scroll)': 'measure()',
    '(window:resize)': 'measure()',
  },
})
export class ScrollProgress {
  private readonly progress = signal(0);
  protected readonly transform = computed(() => `scaleX(${this.progress()})`);

  protected measure(): void {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const max = scrollHeight - clientHeight;
    this.progress.set(max > 0 ? Math.min(1, scrollTop / max) : 0);
  }
}
