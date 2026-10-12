import { ChangeDetectionStrategy, Component } from '@angular/core';
import { processIntro, processPrinciples, processSteps } from '../../data/process';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { Button } from '../../shared/components/button/button';
import { Reveal } from '../../shared/directives/reveal';
import { ProcessGlyph } from './process-glyph/process-glyph';
import { SceneArtComponent, SCENES } from '../../shared/components/scene-art/scene-art';

/** Every stage written out in full (the home page shows the interactive stepper). */
@Component({
  selector: 'app-process-page',
  imports: [SceneArtComponent, SectionHeading, Button, Reveal, ProcessGlyph],
  templateUrl: './process-page.html',
  styleUrl: './process-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessPage {
  protected readonly scenes = SCENES;
  protected readonly intro = processIntro;
  protected readonly steps = processSteps;
  protected readonly principles = processPrinciples;
}
