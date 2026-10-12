import { ChangeDetectionStrategy, Component } from '@angular/core';
import { pricingDisclaimer, pricingPlans } from '../../data/pricing';
import type { PricingPlan } from '../../data/types';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { Button } from '../../shared/components/button/button';
import { Icon } from '../../shared/components/icon/icon';

interface PlanGroup {
  id: PricingPlan['model'];
  title: string;
  plans: PricingPlan[];
}

const GROUPS: Omit<PlanGroup, 'plans'>[] = [
  { id: 'project', title: 'Project-based' },
  { id: 'retainer', title: 'After launch' },
  { id: 'contract', title: 'Dedicated engineering' },
];

@Component({
  selector: 'app-pricing-page',
  imports: [SectionHeading, Button, Icon],
  templateUrl: './pricing-page.html',
  styleUrl: './pricing-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingPage {
  protected readonly disclaimer = pricingDisclaimer;
  protected readonly groups: PlanGroup[] = GROUPS.map((group) => ({
    ...group,
    plans: pricingPlans.filter((plan) => plan.model === group.id),
  })).filter((group) => group.plans.length > 0);
}
