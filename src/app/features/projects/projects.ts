import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { PROJECTS } from '../../data/projects.data';
import { ProjectCategory } from '../../core/models/project.model';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { ProjectCard } from '../../shared/components/project-card/project-card';

type ProjectFilter = ProjectCategory | 'All';

const FILTERS: ProjectFilter[] = ['All', 'Government', 'Enterprise', 'Mobile', 'Product'];

@Component({
  selector: 'app-projects',
  imports: [SectionHeading, ProjectCard],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projects {
  protected readonly filters = FILTERS;
  protected readonly activeFilter = signal<ProjectFilter>('All');

  protected readonly visibleProjects = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'All') return PROJECTS;
    return PROJECTS.filter((project) => project.category === filter);
  });

  protected selectFilter(filter: ProjectFilter): void {
    this.activeFilter.set(filter);
  }
}
