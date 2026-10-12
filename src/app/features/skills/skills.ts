import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SKILL_GROUPS } from '../../data/skills.data';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { SkillBadge } from '../../shared/components/skill-badge/skill-badge';
import { Reveal } from '../../shared/directives/reveal';

/** The group where most of the depth is; its badges are highlighted. */
const PRIMARY_GROUP_ID = 'frontend';

@Component({
  selector: 'app-skills',
  imports: [SectionHeading, SkillBadge, Reveal],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Skills {
  protected readonly groups = SKILL_GROUPS;
  protected readonly primaryGroupId = PRIMARY_GROUP_ID;
}
