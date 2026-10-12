import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-skill-badge',
  template: '{{ label() }}',
  styleUrl: './skill-badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-highlighted]': 'highlighted()',
  },
})
export class SkillBadge {
  readonly label = input.required<string>();
  readonly highlighted = input(false);
}
