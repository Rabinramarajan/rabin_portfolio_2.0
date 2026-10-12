import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'arrow-right'
  | 'arrow-up-right'
  | 'github'
  | 'linkedin'
  | 'mail'
  | 'globe'
  | 'menu'
  | 'close'
  | 'plus'
  | 'check'
  | 'code'
  | 'layers'
  | 'gauge'
  | 'phone';

/** Inline 24px stroke icons. Decorative by default: give the parent an accessible name. */
@Component({
  selector: 'app-icon',
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
})
export class Icon {
  readonly name = input.required<IconName>();
}
