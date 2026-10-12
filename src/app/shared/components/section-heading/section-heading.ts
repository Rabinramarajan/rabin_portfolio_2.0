import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-heading',
  templateUrl: './section-heading.html',
  styleUrl: './section-heading.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-centered]': "align() === 'center'",
  },
})
export class SectionHeading {
  readonly eyebrow = input<string>();
  readonly title = input.required<string>();
  readonly description = input<string>();
  readonly align = input<'start' | 'center'>('start');
  /** Pages use a level-1 heading; sections inside a page use level 2. */
  readonly level = input<1 | 2>(2);
}
