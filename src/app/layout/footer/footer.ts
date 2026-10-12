import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { footerNavigation, profile } from '../../data/profile';
import type { NavItem } from '../../data/types';
import { SocialLinks } from '../../shared/components/social-links/social-links';
import { Logo } from '../../shared/components/logo/logo';

interface FooterLink {
  label: string;
  path: string;
  fragment?: string;
}

/** "/#skills" → path "/" + fragment "skills", so routerLink scrolls to the section. */
function toFooterLink(item: NavItem): FooterLink {
  const [path, fragment] = item.href.split('#');
  return { label: item.label, path: path || '/', fragment: fragment || undefined };
}

@Component({
  selector: 'app-footer',
  imports: [RouterLink, SocialLinks, Logo],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected readonly profile = profile;
  protected readonly links = footerNavigation.map(toFooterLink);
  protected readonly socials = profile.socials.filter((s) => s.id !== 'website');
  protected readonly legal: FooterLink[] = [
    { label: 'Résumé', path: '/resume' },
    { label: 'Contact', path: '/contact' },
    { label: 'Privacy', path: '/privacy' },
    { label: 'Terms', path: '/terms' },
  ];
  protected readonly year = new Date().getFullYear();
}
