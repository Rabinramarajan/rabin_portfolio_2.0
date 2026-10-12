import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { FilterOption, projectFilters, projects } from '../../../data/projects';
import { useGsap } from '../../../core/motion/gsap';
import { ProjectCard } from '../../../shared/components/project-card/project-card';

export type ProjectFilterId = FilterOption['id'];

/**
 * Filterable software gallery. The selected filter is the only state; the
 * visible list and the live-region count are derived from it.
 */
@Component({
  selector: 'app-project-gallery',
  imports: [ProjectCard],
  templateUrl: './project-gallery.html',
  styleUrl: './project-gallery.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectGallery {
  /** Cap the number of cards (home page teaser). Omit to show everything. */
  readonly limit = input<number>();
  /** Lead with a large editorial card for the first project. */
  readonly leadFeature = input(true);
  /** Load the lead card's image eagerly (it is the LCP element on /work). */
  readonly prioritizeLead = input(false);
  readonly cardHeadingLevel = input<2 | 3>(3);

  protected readonly filters = projectFilters();
  readonly activeFilter = signal<ProjectFilterId>('all');
  /** Set once the visitor filters; only then do re-rendered cards animate in with CSS. */
  protected readonly hasFiltered = signal(false);

  readonly visibleProjects = computed(() => {
    const filter = this.activeFilter();
    const matching = filter === 'all' ? projects : projects.filter((project) => project.filter === filter);
    const limit = this.limit();
    return limit ? matching.slice(0, limit) : matching;
  });

  protected readonly summary = computed(() => {
    const count = this.visibleProjects().length;
    const label = this.filters.find((f) => f.id === this.activeFilter())?.label ?? 'All';
    return `Showing ${count} ${count === 1 ? 'project' : 'projects'}${label === 'All' ? '' : ` in ${label}`}`;
  });

  constructor() {
    useGsap(({ gsap, root }) => {
      gsap.from(root.querySelectorAll('.gallery__item'), {
        autoAlpha: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: root.querySelector('.gallery__grid'), start: 'top 82%' },
      });
    });
  }

  selectFilter(id: ProjectFilterId): void {
    this.activeFilter.set(id);
    this.hasFiltered.set(true);
  }
}
