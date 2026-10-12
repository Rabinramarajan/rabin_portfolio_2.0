import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { insightTopics } from '../../data/insights';
import type { InsightTopic } from '../../data/types';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { ArticleCard } from './article-card/article-card';
import { latestInsights } from './insight-utils';

type TopicFilter = InsightTopic | 'All';

@Component({
  selector: 'app-insights-page',
  imports: [SectionHeading, ArticleCard],
  templateUrl: './insights-page.html',
  styleUrl: './insights-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsightsPage {
  private readonly all = latestInsights();

  protected readonly topics: TopicFilter[] = ['All', ...insightTopics()];
  readonly activeTopic = signal<TopicFilter>('All');

  readonly visible = computed(() => {
    const topic = this.activeTopic();
    return topic === 'All' ? this.all : this.all.filter((insight) => insight.topic === topic);
  });

  protected readonly summary = computed(() => {
    const count = this.visible().length;
    return `Showing ${count} ${count === 1 ? 'article' : 'articles'}`;
  });

  selectTopic(topic: TopicFilter): void {
    this.activeTopic.set(topic);
  }
}
