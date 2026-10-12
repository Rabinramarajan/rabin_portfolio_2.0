import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PRINCIPLES, PROFILE } from '../../../../data/profile.data';
import { ColorVariant } from '../../../../core/models/color-variant.model';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';
import { StickyNote } from '../../../../shared/components/sticky-note/sticky-note';
import { Reveal } from '../../../../shared/directives/reveal';

/** Note colours and tilts cycle so the board looks hand-placed rather than gridded. */
const NOTE_COLORS: ColorVariant[] = ['yellow', 'sage', 'coral', 'yellow'];
const NOTE_ROTATIONS = [-3, 2, -1.5, 3];

@Component({
  selector: 'app-introduction',
  imports: [SectionHeading, StickyNote, Reveal],
  templateUrl: './introduction.html',
  styleUrl: './introduction.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Introduction {
  protected readonly stats = PROFILE.stats;
  protected readonly principles = PRINCIPLES.map((principle, index) => ({
    ...principle,
    color: NOTE_COLORS[index % NOTE_COLORS.length],
    rotation: NOTE_ROTATIONS[index % NOTE_ROTATIONS.length],
  }));
}
