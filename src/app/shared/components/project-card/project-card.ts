import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Project } from '../../../core/models/project.model';
import { SkillBadge } from '../skill-badge/skill-badge';
import { Illustration } from '../illustration/illustration';

@Component({
  selector: 'app-project-card',
  imports: [NgOptimizedImage, SkillBadge, Illustration],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCard {
  readonly project = input.required<Project>();
}
