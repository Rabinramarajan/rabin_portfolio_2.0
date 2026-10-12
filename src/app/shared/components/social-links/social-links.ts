import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { SocialLink } from '../../../data/types';
import { Icon, IconName } from '../icon/icon';

const ICONS: Record<SocialLink['id'], IconName> = {
  github: 'github',
  linkedin: 'linkedin',
  email: 'mail',
  website: 'globe',
};

@Component({
  selector: 'app-social-links',
  imports: [Icon],
  templateUrl: './social-links.html',
  styleUrl: './social-links.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialLinks {
  readonly links = input.required<SocialLink[]>();
  protected readonly icons = ICONS;
}
