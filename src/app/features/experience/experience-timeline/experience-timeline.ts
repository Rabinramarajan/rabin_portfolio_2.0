import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { experience, formatRoleDates } from '../../../data/experience';
import { useGsap } from '../../../core/motion/gsap';
import { SkillBadge } from '../../../shared/components/skill-badge/skill-badge';

function initials(company: string): string {
  return company
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

/** Vertical career timeline. The connector fills as the reader scrolls through it. */
@Component({
  selector: 'app-experience-timeline',
  imports: [SkillBadge],
  templateUrl: './experience-timeline.html',
  styleUrl: './experience-timeline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceTimeline {
  /** Heading level for each role title, so the timeline nests under any page heading. */
  readonly headingLevel = input<2 | 3>(3);

  protected readonly roles = experience.map((role) => ({
    ...role,
    dates: formatRoleDates(role),
    initials: initials(role.company),
    current: role.end === null,
  }));

  constructor() {
    useGsap(({ gsap, root }) => {
      gsap.fromTo(
        root.querySelector('.timeline__progress'),
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top 70%', end: 'bottom 60%', scrub: 0.4 },
        },
      );

      for (const item of root.querySelectorAll('.timeline__item')) {
        gsap.from(item, {
          autoAlpha: 0,
          y: 30,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 82%' },
        });
      }
    });
  }
}
