import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NAV_ITEMS, PROFILE } from '../../data/profile.data';
import { SocialLinks } from '../../shared/components/social-links/social-links';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, SocialLinks],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected readonly profile = PROFILE;
  protected readonly navItems = NAV_ITEMS;
  protected readonly year = new Date().getFullYear();
}
