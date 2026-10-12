import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EXPERIENCE } from '../../data/experience.data';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { SkillBadge } from '../../shared/components/skill-badge/skill-badge';
import { Reveal } from '../../shared/directives/reveal';

@Component({
  selector: 'app-experience',
  imports: [SectionHeading, SkillBadge, Reveal],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Experience {
  protected readonly roles = EXPERIENCE;
}
