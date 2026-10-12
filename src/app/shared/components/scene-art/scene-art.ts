import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

/** A scene from the hero illustration, framed as a taped, slightly tilted print. */
export interface SceneArt {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const SCENES = {
  contact: {
    src: '/media/art/contact.webp',
    alt: 'A "Coffee + Code + Ideas" mug beside Angular and TypeScript books and headphones',
    width: 496,
    height: 420,
  },
  services: {
    src: '/media/art/services.webp',
    alt: 'A code window describing a developer object, with Angular and TypeScript logos',
    width: 560,
    height: 420,
  },
  process: {
    src: '/media/art/process.webp',
    alt: 'Sticky notes reading "Turning ideas into interactive experiences" and "Build, Design, Improve, Repeat"',
    width: 480,
    height: 450,
  },
  pricing: {
    src: '/media/art/pricing.webp',
    alt: 'A sticky note checklist: better UI, cleaner code, happy users',
    width: 300,
    height: 240,
  },
  resume: {
    src: '/media/art/resume.webp',
    alt: 'A notebook labelled "Ideas, Projects, Goals" with sticky notes and a pen pot on the desk',
    width: 680,
    height: 294,
  },
  cat: {
    src: '/media/art/cat.webp',
    alt: 'A cat asleep on the desk next to a pen pot',
    width: 360,
    height: 250,
  },
} satisfies Record<string, SceneArt>;

@Component({
  selector: 'app-scene-art',
  imports: [NgOptimizedImage],
  template: `
    <figure class="scene" [style.--tilt.deg]="tilt()">
      <img
        [ngSrc]="scene().src"
        [alt]="scene().alt"
        [width]="scene().width"
        [height]="scene().height"
        [priority]="priority()"
        sizes="(min-width: 1080px) 26rem, 90vw"
      />
    </figure>
  `,
  styleUrl: './scene-art.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SceneArtComponent {
  readonly scene = input.required<SceneArt>();
  /** Tilt in degrees; small values look most natural. */
  readonly tilt = input(-2);
  /** Mark above-the-fold art as the LCP candidate. */
  readonly priority = input(false);
}
