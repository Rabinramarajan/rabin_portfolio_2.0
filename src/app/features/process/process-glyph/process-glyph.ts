import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { ProcessVisualId } from '../../../data/types';

/** A small hand-drawn doodle for each process stage. Decorative. */
@Component({
  selector: 'app-process-glyph',
  template: `
    <svg viewBox="0 0 64 64" focusable="false">
      @switch (stage()) {
        @case ('discover') {
          <circle class="fill-yellow" cx="27" cy="27" r="15" />
          <circle cx="27" cy="27" r="15" />
          <path d="M38 38l14 14" />
        }
        @case ('define') {
          <rect class="fill-sage" x="12" y="10" width="40" height="46" rx="4" />
          <path d="M20 22h24M20 32h24M20 42h14" />
          <path class="accent" d="M40 44l4 4 8-10" />
        }
        @case ('design') {
          <path class="fill-yellow" d="M14 50l6-18 24-24 12 12-24 24z" />
          <path d="M14 50l6-18 24-24 12 12-24 24zM38 14l12 12" />
          <path class="accent" d="M10 56h20" />
        }
        @case ('build') {
          <rect class="fill-sage" x="8" y="14" width="48" height="36" rx="5" />
          <path d="M22 26l-7 6 7 6M42 26l7 6-7 6M35 23l-6 18" />
        }
        @case ('test') {
          <path class="fill-yellow" d="M32 8l20 8v14c0 14-9 22-20 26-11-4-20-12-20-26V16z" />
          <path d="M32 8l20 8v14c0 14-9 22-20 26-11-4-20-12-20-26V16z" />
          <path class="accent" d="M23 32l6 6 12-13" />
        }
        @case ('launch') {
          <path class="fill-coral" d="M32 6c10 8 14 20 10 34H22C18 26 22 14 32 6z" />
          <path d="M32 6c10 8 14 20 10 34H22C18 26 22 14 32 6zM22 40l-8 10 10-2M42 40l8 10-10-2M28 50l4 8 4-8" />
          <circle cx="32" cy="22" r="4" />
        }
        @case ('evolve') {
          <path class="fill-sage" d="M32 56c-2-18 4-30 18-38-1 16-8 30-18 38z" />
          <path d="M32 56c-2-18 4-30 18-38-1 16-8 30-18 38zM32 56c0-12-6-22-18-26 0 12 6 22 18 26z" />
          <path class="accent" d="M10 10a26 26 0 0 1 22-4M8 18l2-8 8 2" />
        }
      }
    </svg>
  `,
  styleUrl: './process-glyph.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
})
export class ProcessGlyph {
  readonly stage = input.required<ProcessVisualId>();
}
