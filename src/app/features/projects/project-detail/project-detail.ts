import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { galleryFrames, getNextProject, getProject, relatedProjects } from '../../../data/projects';
import { Button } from '../../../shared/components/button/button';
import { SkillBadge } from '../../../shared/components/skill-badge/skill-badge';
import { SoftwareWindow } from '../../../shared/components/software-window/software-window';
import { ProjectCard } from '../../../shared/components/project-card/project-card';
import { Icon } from '../../../shared/components/icon/icon';
import { Reveal } from '../../../shared/directives/reveal';
import { NotFound } from '../../not-found/not-found';

/** Case study layout. Every section is optional and only renders when the record has it. */
@Component({
  selector: 'app-project-detail',
  imports: [NgOptimizedImage, RouterLink, Button, SkillBadge, SoftwareWindow, ProjectCard, Icon, Reveal, NotFound],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetail {
  /** Bound from the :slug route parameter. */
  readonly slug = input.required<string>();

  protected readonly project = computed(() => getProject(this.slug()));
  protected readonly gallery = computed(() => {
    const project = this.project();
    return project ? galleryFrames(project) : [];
  });
  protected readonly related = computed(() => relatedProjects(this.slug(), 2));
  protected readonly next = computed(() => getNextProject(this.slug()));

  /** The delivery strip: only fields the record actually has. */
  protected readonly facts = computed(() => {
    const p = this.project();
    if (!p) return [];
    return [
      { label: 'Role', value: p.role },
      { label: 'Year', value: p.year },
      { label: 'Client', value: p.client },
      { label: 'Platform', value: p.platform?.join(' · ') },
      { label: 'Timeline', value: p.timeline },
      { label: 'Team', value: p.team },
      { label: 'Status', value: p.status },
    ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));
  });

  protected readonly features = computed(() => {
    const p = this.project();
    if (!p) return [];
    return p.keyFeatures?.length ? p.keyFeatures : p.features.map((title) => ({ title, description: '' }));
  });
}
