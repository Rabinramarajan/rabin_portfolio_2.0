import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { getServiceRoute, serviceRoutes } from '../../../data/service-routes';
import { isLinkLive } from '../../../data/insights';
import { FaqItem } from '../../../data/faq';
import { Button } from '../../../shared/components/button/button';
import { SkillBadge } from '../../../shared/components/skill-badge/skill-badge';
import { Icon } from '../../../shared/components/icon/icon';
import { FaqSection } from '../../faq/faq-section/faq-section';
import { NotFound } from '../../not-found/not-found';

/** One of the four indexed service landing pages. */
@Component({
  selector: 'app-service-detail',
  imports: [NgOptimizedImage, RouterLink, Button, SkillBadge, Icon, FaqSection, NotFound],
  templateUrl: './service-detail.html',
  styleUrl: './service-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceDetail {
  /** Bound from the :slug route parameter. */
  readonly slug = input.required<string>();

  protected readonly route = computed(() => getServiceRoute(this.slug()));

  protected readonly narrative = computed(() => {
    const page = this.route()?.page;
    return page ? [page.problem, page.approach, page.engagement] : [];
  });

  protected readonly faqs = computed<FaqItem[]>(() =>
    (this.route()?.page.faqs ?? []).map((faq, i) => ({ id: `${this.slug()}-${i}`, ...faq })),
  );

  /** Further reading, minus any article that is not live yet. */
  protected readonly reading = computed(() => (this.route()?.page.furtherReading ?? []).filter((link) => isLinkLive(link.href)));

  protected readonly otherServices = computed(() => serviceRoutes.filter((r) => r.slug !== this.slug()));
}
