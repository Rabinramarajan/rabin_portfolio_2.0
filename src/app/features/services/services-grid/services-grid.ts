import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { services } from '../../../data/services';
import { useGsap } from '../../../core/motion/gsap';
import { ServiceCard } from '../service-card/service-card';

@Component({
  selector: 'app-services-grid',
  imports: [ServiceCard],
  template: `
    <ul class="services-grid">
      @for (service of services; track service.id) {
        <li class="services-grid__item"><app-service-card [service]="service" [detailed]="detailed()" /></li>
      }
    </ul>
  `,
  styleUrl: './services-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.is-detailed]': 'detailed()' },
})
export class ServicesGrid {
  readonly detailed = input(false);
  protected readonly services = services;

  constructor() {
    useGsap(({ gsap, root }) => {
      gsap.from(root.querySelectorAll('.services-grid__item'), {
        autoAlpha: 0,
        y: 40,
        rotate: (i: number) => (i % 2 ? 2 : -2),
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: root, start: 'top 80%' },
      });
    });
  }
}
