import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Service } from '../../../data/types';
import { serviceHref } from '../../../data/service-routes';
import { Icon, IconName } from '../../../shared/components/icon/icon';
import { SkillBadge } from '../../../shared/components/skill-badge/skill-badge';

const SERVICE_ICONS: Record<string, IconName> = {
  angular: 'code',
  frontend: 'layers',
  performance: 'gauge',
  ionic: 'phone',
};

@Component({
  selector: 'app-service-card',
  imports: [RouterLink, Icon, SkillBadge],
  templateUrl: './service-card.html',
  styleUrl: './service-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceCard {
  readonly service = input.required<Service>();
  /** The long proposition instead of the card summary, for the services page. */
  readonly detailed = input(false);

  protected readonly icon = computed(() => SERVICE_ICONS[this.service().id] ?? 'code');
  protected readonly href = computed(() => serviceHref(this.service().id));
}
