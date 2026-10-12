import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Hero } from './components/hero/hero';
import { AboutSection } from '../about/about-section/about-section';
import { ExperienceTimeline } from '../experience/experience-timeline/experience-timeline';
import { ServicesGrid } from '../services/services-grid/services-grid';
import { ProjectGallery } from '../projects/project-gallery/project-gallery';
import { SkillsToolkit } from '../skills/skills-toolkit/skills-toolkit';
import { ProcessStepper } from '../process/process-stepper/process-stepper';
import { ArticleCard } from '../insights/article-card/article-card';
import { FaqSection } from '../faq/faq-section/faq-section';
import { ContactSection } from '../contact/contact-section/contact-section';
import { latestInsights } from '../insights/insight-utils';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { Button } from '../../shared/components/button/button';

/** Number of articles previewed on the home page. */
const INSIGHT_PREVIEW_COUNT = 3;
/** Number of projects in the home gallery (one feature card plus a grid). */
const PROJECT_PREVIEW_COUNT = 5;

@Component({
  selector: 'app-home',
  imports: [
    Hero,
    AboutSection,
    ExperienceTimeline,
    ServicesGrid,
    ProjectGallery,
    SkillsToolkit,
    ProcessStepper,
    ArticleCard,
    FaqSection,
    ContactSection,
    SectionHeading,
    Button,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly insights = latestInsights().slice(0, INSIGHT_PREVIEW_COUNT);
  protected readonly projectLimit = PROJECT_PREVIEW_COUNT;
}
