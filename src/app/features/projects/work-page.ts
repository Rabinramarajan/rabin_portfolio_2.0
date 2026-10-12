import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { Button } from '../../shared/components/button/button';
import { ProjectGallery } from './project-gallery/project-gallery';

@Component({
  selector: 'app-work-page',
  imports: [SectionHeading, Button, ProjectGallery],
  template: `
    <section class="page-section container">
      <app-section-heading
        [level]="1"
        eyebrow="Work"
        title="Selected work"
        description="Angular and enterprise work — Fiji immigration platforms, the PRIMS pension portal, the VNPF mobile app, insurance consoles and product launches."
        annotation="filter by what you're building"
      />
      <app-project-gallery [prioritizeLead]="true" [cardHeadingLevel]="2" />
      <aside class="work-cta">
        <p class="work-cta__text">Working on something similar?</p>
        <app-button label="Discuss a project" link="/contact" icon="arrow-right" />
      </aside>
    </section>
  `,
  styles: `
    .work-cta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: var(--space-4) var(--space-6);
      margin-top: var(--space-16);
    }

    .work-cta__text {
      font: 600 var(--text-xl) / 1.2 var(--font-display);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkPage {}
