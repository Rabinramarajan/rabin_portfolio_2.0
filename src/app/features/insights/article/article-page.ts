import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { insightDate, insightReadMinutes, isLinkLive } from '../../../data/insights';
import { profile } from '../../../data/profile';
import { Button } from '../../../shared/components/button/button';
import { Icon } from '../../../shared/components/icon/icon';
import { SoftwareWindow } from '../../../shared/components/software-window/software-window';
import { NotFound } from '../../not-found/not-found';
import { ArticleCard } from '../article-card/article-card';
import { getInsight, latestInsights, toArticleBlocks } from '../insight-utils';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Reusable long-form article layout: header, cover, body blocks, takeaways and next reads. */
@Component({
  selector: 'app-article-page',
  imports: [NgOptimizedImage, RouterLink, Button, Icon, SoftwareWindow, NotFound, ArticleCard],
  templateUrl: './article-page.html',
  styleUrl: './article-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlePage {
  /** Bound from the :slug route parameter. */
  readonly slug = input.required<string>();

  protected readonly author = profile;
  protected readonly insight = computed(() => getInsight(this.slug()));

  protected readonly blocks = computed(() =>
    toArticleBlocks(this.insight()?.body).map((block) =>
      block.kind === 'heading' ? { ...block, id: slugify(block.text) } : block,
    ),
  );

  protected readonly toc = computed(() =>
    this.blocks().flatMap((block) => (block.kind === 'heading' && 'id' in block ? [{ id: block.id, text: block.text }] : [])),
  );

  protected readonly meta = computed(() => {
    const insight = this.insight();
    if (!insight) return null;
    const published = insight.datePublished;
    const modified = insight.dateModified && insight.dateModified !== published ? insight.dateModified : undefined;
    return {
      published: published ? { iso: published, label: insightDate(published) } : null,
      modified: modified ? { iso: modified, label: insightDate(modified) } : null,
      minutes: insightReadMinutes(insight),
    };
  });

  protected readonly related = computed(() => (this.insight()?.related ?? []).filter((link) => isLinkLive(link.href)));

  protected readonly moreArticles = computed(() => latestInsights().filter((i) => i.id !== this.slug()).slice(0, 2));

  protected isExternal(href: string): boolean {
    return /^https?:\/\//.test(href);
  }

  protected isLive(href: string): boolean {
    return isLinkLive(href);
  }
}
