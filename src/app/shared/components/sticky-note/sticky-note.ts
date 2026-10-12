import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ColorVariant } from '../../../core/models/color-variant.model';

/** A tilted paper note. Content is projected, so it can hold any markup. */
@Component({
  selector: 'app-sticky-note',
  template: '<ng-content />',
  styleUrl: './sticky-note.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': "'note note--' + color()",
    '[style.--note-rotation.deg]': 'rotation()',
  },
})
export class StickyNote {
  readonly color = input<ColorVariant>('yellow');
  /** Tilt in degrees; small values (-4 to 4) look most natural. */
  readonly rotation = input(0);
}
