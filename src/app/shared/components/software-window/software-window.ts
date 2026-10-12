import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type SoftwareWindowVariant = 'paper' | 'editor' | 'terminal';

/**
 * A desktop-app window frame (title bar with traffic lights) around projected
 * content. Used for code snippets, screenshots and detail panels.
 */
@Component({
  selector: 'app-software-window',
  templateUrl: './software-window.html',
  styleUrl: './software-window.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': "'window window--' + variant()",
  },
})
export class SoftwareWindow {
  readonly title = input<string>();
  readonly variant = input<SoftwareWindowVariant>('paper');
}
