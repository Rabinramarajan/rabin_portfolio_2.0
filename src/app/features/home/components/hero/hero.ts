import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { hero, profile, proofMetrics } from '../../../../data/profile';
import { useGsap } from '../../../../core/motion/gsap';
import { Button } from '../../../../shared/components/button/button';
import { SocialLinks } from '../../../../shared/components/social-links/social-links';

/** The H1, split into words so the entrance can stagger them. */
const HEADLINE: { text: string; highlight?: boolean }[] = [
  { text: 'Turning' },
  { text: 'ideas' },
  { text: 'into' },
  { text: 'interactive', highlight: true },
  { text: 'experiences.' },
];

@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage, RouterLink, Button, SocialLinks],
  host: {
    '(pointermove)': 'onPointerMove($event)',
    '(pointerleave)': 'onPointerMove(null)',
  },
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  protected readonly hero = hero;
  protected readonly profile = profile;
  protected readonly headline = HEADLINE;
  protected readonly metrics = proofMetrics;
  protected readonly socials = profile.socials.filter((s) => s.id === 'github' || s.id === 'linkedin');

  /** Pointer parallax for the illustration; set up on desktop only. */
  private parallax?: { x: (v: number) => void; y: (v: number) => void };

  constructor() {
    useGsap(({ gsap, root }) => {
      // Phones get the content immediately: the hero text is the LCP element,
      // and hiding it for an entrance costs seconds on a throttled CPU.
      if (!matchMedia('(min-width: 1080px)').matches) return;

      gsap
        .timeline({ defaults: { ease: 'power3.out', duration: 0.7 } })
        .from(root.querySelector('.hero__status'), { autoAlpha: 0, y: 12 })
        .from(root.querySelectorAll('.hero__word'), { yPercent: 110, stagger: 0.06, duration: 0.8 }, '-=0.4')
        .from(root.querySelectorAll('.hero__kicker, .hero__summary, .hero__actions, .hero__aside'), {
          autoAlpha: 0,
          y: 18,
          stagger: 0.08,
        }, '-=0.5')
        .from(root.querySelectorAll('.metric'), { autoAlpha: 0, y: 16, stagger: 0.06, duration: 0.5 }, '-=0.3')
        .from(root.querySelector('.hero__art'), { autoAlpha: 0, scale: 0.94, duration: 0.9 }, 0.2);

      if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const art = root.querySelector('.hero__art');
        this.parallax = {
          x: gsap.quickTo(art, 'x', { duration: 0.8, ease: 'power3.out' }),
          y: gsap.quickTo(art, 'y', { duration: 0.8, ease: 'power3.out' }),
        };
      }
    });
  }

  /** Drifts the illustration up to 10px toward the pointer; null recentres it. */
  protected onPointerMove(event: PointerEvent | null): void {
    if (!this.parallax) return;
    const box = (event?.currentTarget as HTMLElement | undefined)?.getBoundingClientRect();
    const dx = event && box ? (event.clientX - box.left) / box.width - 0.5 : 0;
    const dy = event && box ? (event.clientY - box.top) / box.height - 0.5 : 0;
    this.parallax.x(dx * 20);
    this.parallax.y(dy * 20);
  }
}
