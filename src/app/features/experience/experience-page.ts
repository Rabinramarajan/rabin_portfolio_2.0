import { ChangeDetectionStrategy, Component } from '@angular/core';
import { capabilityEvolution, careerMilestones } from '../../data/experience';
import { education } from '../../data/profile';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { Button } from '../../shared/components/button/button';
import { Reveal } from '../../shared/directives/reveal';
import { ExperienceTimeline } from './experience-timeline/experience-timeline';

@Component({
  selector: 'app-experience-page',
  imports: [SectionHeading, Button, Reveal, ExperienceTimeline],
  templateUrl: './experience-page.html',
  styleUrl: './experience-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperiencePage {
  protected readonly milestones = careerMilestones;
  protected readonly capabilities = capabilityEvolution;
  protected readonly education = education;
}
