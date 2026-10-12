import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import type { Project } from '../../../data/types';
import { SkillBadge } from '../skill-badge/skill-badge';
import { Icon } from '../icon/icon';

export type ProjectCardVariant = 'feature' | 'compact';

/**
 * An editorial project card framed as an app window. The whole card links to
 * the case study (stretched title link); the live URL is a separate link so
 * anchors never nest.
 */
@Component({
  selector: 'app-project-card',
  imports: [NgOptimizedImage, RouterLink, SkillBadge, Icon],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': "'card card--' + variant()",
  },
})
export class ProjectCard {
  readonly project = input.required<Project>();
  readonly variant = input<ProjectCardVariant>('compact');
  /** Mark the first above-the-fold card's image as the LCP candidate. */
  readonly priority = input(false);
  /** Title level, so the card nests correctly under the page's headings. */
  readonly headingLevel = input<2 | 3>(3);
}
