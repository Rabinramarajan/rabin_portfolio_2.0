import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { PRINCIPLES, PROFILE } from '../../data/profile.data';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { StickyNote } from '../../shared/components/sticky-note/sticky-note';
import { Button } from '../../shared/components/button/button';
import { SocialLinks } from '../../shared/components/social-links/social-links';
import { Illustration } from '../../shared/components/illustration/illustration';

@Component({
  selector: 'app-about',
  imports: [NgOptimizedImage, SectionHeading, StickyNote, Button, SocialLinks, Illustration],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  protected readonly profile = PROFILE;
  protected readonly principles = PRINCIPLES;
}
