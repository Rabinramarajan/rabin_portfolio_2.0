import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { about } from '../../../data/about';
import { ColorVariant } from '../../../core/models/color-variant.model';
import { SectionHeading } from '../../../shared/components/section-heading/section-heading';
import { StickyNote } from '../../../shared/components/sticky-note/sticky-note';
import { Button } from '../../../shared/components/button/button';
import { Reveal } from '../../../shared/directives/reveal';

/** Card colours cycle through the accents so no two neighbours match. */
const PRINCIPLE_COLORS: ColorVariant[] = ['yellow', 'sage', 'coral', 'yellow'];
const PRINCIPLE_TILTS = [-2, 1.5, -1, 2];

@Component({
  selector: 'app-about-section',
  imports: [NgOptimizedImage, SectionHeading, StickyNote, Button, Reveal],
  templateUrl: './about-section.html',
  styleUrl: './about-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutSection {
  protected readonly about = about;
  protected readonly principles = about.principles.map((principle, i) => ({
    ...principle,
    color: PRINCIPLE_COLORS[i % PRINCIPLE_COLORS.length],
    rotation: PRINCIPLE_TILTS[i % PRINCIPLE_TILTS.length],
  }));
}
