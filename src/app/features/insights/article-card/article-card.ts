import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import type { Insight } from '../../../data/types';
import { insightDate, insightReadMinutes } from '../../../data/insights';
import { Icon } from '../../../shared/components/icon/icon';

/** Editorial card for one article: cover, topic, title, dek, date and reading time. */
@Component({
  selector: 'app-article-card',
  imports: [NgOptimizedImage, RouterLink, Icon],
  templateUrl: './article-card.html',
  styleUrl: './article-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleCard {
  readonly insight = input.required<Insight>();
  /** Heading level for the title, so the card nests correctly in any page. */
  readonly headingLevel = input<2 | 3>(3);

  protected readonly date = computed(() => {
    const iso = this.insight().datePublished;
    return iso ? { iso, label: insightDate(iso) } : null;
  });
  protected readonly minutes = computed(() => insightReadMinutes(this.insight()));
}
