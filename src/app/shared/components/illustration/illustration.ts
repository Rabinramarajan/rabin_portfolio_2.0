import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ColorVariant } from '../../../core/models/color-variant.model';

export type IllustrationShape = 'blob' | 'star' | 'squiggle' | 'circle';

/** Decorative SVG shapes. Always hidden from assistive technology. */
@Component({
  selector: 'app-illustration',
  templateUrl: './illustration.html',
  styleUrl: './illustration.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[class]': "'shape--' + color()",
  },
})
export class Illustration {
  readonly shape = input.required<IllustrationShape>();
  readonly color = input<ColorVariant>('sage');
}
