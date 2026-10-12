import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROJECTS } from '../../data/projects.data';
import { Hero } from './components/hero/hero';
import { Introduction } from './components/introduction/introduction';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { ProjectCard } from '../../shared/components/project-card/project-card';
import { Button } from '../../shared/components/button/button';
import { Illustration } from '../../shared/components/illustration/illustration';

@Component({
  selector: 'app-home',
  imports: [Hero, Introduction, SectionHeading, ProjectCard, Button, Illustration],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly featuredProjects = PROJECTS.filter((project) => project.featured);
}
