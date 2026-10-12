import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SocialLink } from '../../../core/models/profile.model';

@Component({
  selector: 'app-social-links',
  templateUrl: './social-links.html',
  styleUrl: './social-links.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialLinks {
  readonly links = input.required<SocialLink[]>();
}
