import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { LegalDocument } from '../../data/legal';
import { insightDate } from '../../data/insights';

/** Privacy and Terms share one layout; the document comes from route data. */
@Component({
  selector: 'app-legal-page',
  template: `
    @let doc = document();
    <article class="page-section container legal">
      <h1 class="legal__title">{{ doc.title }}</h1>
      <p class="legal__lede">{{ doc.lede }}</p>
      <p class="legal__date">Last reviewed <time [attr.datetime]="doc.effective">{{ effectiveLabel() }}</time></p>
      <div class="prose">
        @for (section of doc.sections; track section.heading) {
          <h2>{{ section.heading }}</h2>
          @for (paragraph of section.paragraphs ?? []; track $index) {
            <p>{{ paragraph }}</p>
          }
          @if (section.bullets?.length) {
            <ul>
              @for (bullet of section.bullets; track bullet) {
                <li>{{ bullet }}</li>
              }
            </ul>
          }
        }
      </div>
    </article>
  `,
  styles: `
    .legal {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .legal__title {
      font-size: var(--text-4xl);
    }

    .legal__lede {
      max-width: var(--prose-width);
      font-size: var(--text-xl);
      color: var(--color-text-muted);
    }

    .legal__date {
      font-size: var(--text-sm);
      font-weight: 700;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalPage {
  /** Bound from route data. */
  readonly document = input.required<LegalDocument>();
  protected readonly effectiveLabel = computed(() => insightDate(this.document().effective));
}
