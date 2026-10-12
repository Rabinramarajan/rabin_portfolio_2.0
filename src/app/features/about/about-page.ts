import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { about } from '../../data/about';
import { profile } from '../../data/profile';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { Button } from '../../shared/components/button/button';
import { SocialLinks } from '../../shared/components/social-links/social-links';
import { StickyNote } from '../../shared/components/sticky-note/sticky-note';
import { Reveal } from '../../shared/directives/reveal';

@Component({
  selector: 'app-about-page',
  imports: [NgOptimizedImage, SectionHeading, Button, SocialLinks, StickyNote, Reveal],
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPage {
  protected readonly about = about;
  protected readonly socials = profile.socials.filter((s) => s.id !== 'website');
}
