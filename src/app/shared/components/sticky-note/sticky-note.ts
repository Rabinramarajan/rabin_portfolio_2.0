import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ColorVariant } from '../../../core/models/color-variant.model';

/**
 * A tilted paper note. Pass `text` for a short handwritten line, or project
 * richer content.
 */
@Component({
  selector: 'app-sticky-note',
  template: `
    @if (text(); as value) {
      <p class="note__text">{{ value }}</p>
    }
    <ng-content />
  `,
  styleUrl: './sticky-note.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': "'note note--' + color()",
    '[style.--note-rotation.deg]': 'rotation()',
  },
})
export class StickyNote {
  readonly text = input<string>();
  readonly color = input<ColorVariant>('yellow');
  /** Tilt in degrees; small values (-4 to 4) look most natural. */
  readonly rotation = input(0);
}
