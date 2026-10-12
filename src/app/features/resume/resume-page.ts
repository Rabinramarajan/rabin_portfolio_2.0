import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  resumeAchievements,
  resumeAdditional,
  resumeContact,
  resumeEducation,
  resumeExperience,
  resumeLinks,
  resumeProjects,
  resumeSkillGroups,
  resumeSummary,
  resumeTitles,
} from '../../data/resume';
import { profile } from '../../data/profile';
import { Button } from '../../shared/components/button/button';
import { SceneArtComponent, SCENES } from '../../shared/components/scene-art/scene-art';

/** A printable résumé. Print styles strip the site chrome. */
@Component({
  selector: 'app-resume-page',
  imports: [SceneArtComponent, Button],
  templateUrl: './resume-page.html',
  styleUrl: './resume-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumePage {
  protected readonly scenes = SCENES;
  protected readonly name = profile.name;
  protected readonly titles = resumeTitles.join(' | ');
  protected readonly contact = resumeContact;
  protected readonly tel = 'tel:' + resumeContact.phone.replace(/\s/g, '');
  protected readonly links = resumeLinks;
  protected readonly summary = resumeSummary;
  protected readonly skills = resumeSkillGroups;
  protected readonly experience = resumeExperience;
  protected readonly projects = resumeProjects;
  protected readonly achievements = resumeAchievements;
  protected readonly education = resumeEducation;
  protected readonly additional = resumeAdditional;

  protected print(): void {
    window.print();
  }
}
