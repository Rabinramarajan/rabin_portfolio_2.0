import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { PROFILE } from '../../../../data/profile.data';
import { Button } from '../../../../shared/components/button/button';
import { StickyNote } from '../../../../shared/components/sticky-note/sticky-note';
import { Illustration } from '../../../../shared/components/illustration/illustration';

@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage, Button, StickyNote, Illustration],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  protected readonly profile = PROFILE;
}
