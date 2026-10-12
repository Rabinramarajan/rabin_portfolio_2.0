import { ChangeDetectionStrategy, Component } from '@angular/core';
import { secondaryServices } from '../../data/services';
import { engagementModels } from '../../data/engagement-models';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { Button } from '../../shared/components/button/button';
import { SkillBadge } from '../../shared/components/skill-badge/skill-badge';
import { ServicesGrid } from './services-grid/services-grid';

@Component({
  selector: 'app-services-page',
  imports: [SectionHeading, Button, SkillBadge, ServicesGrid],
  templateUrl: './services-page.html',
  styleUrl: './services-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesPage {
  protected readonly secondary = secondaryServices;
  protected readonly engagements = engagementModels;
}
