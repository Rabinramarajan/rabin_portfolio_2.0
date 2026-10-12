import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from '../../shared/components/button/button';
import { StickyNote } from '../../shared/components/sticky-note/sticky-note';

/** Shown for unknown URLs (served as /404.html with a 404 status) and unknown slugs. */
@Component({
  selector: 'app-not-found',
  imports: [Button, StickyNote],
  template: `
    <section class="page-section container not-found">
      <p class="not-found__code" aria-hidden="true">404</p>
      <h1 class="not-found__title">This page wandered off.</h1>
      <p class="not-found__text">The link may be old, or the page may have moved. These are good places to pick things up again.</p>
      <div class="not-found__actions">
        <app-button label="Back to home" link="/" icon="arrow-right" />
        <app-button label="Selected work" link="/work" variant="secondary" />
        <app-button label="Insights" link="/insights" variant="ghost" />
      </div>
      <app-sticky-note class="not-found__note" color="sage" [rotation]="3" text="even good routers get lost sometimes" />
    </section>
  `,
  styles: `
    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-6);
      text-align: center;
    }

    .not-found__code {
      font: 700 clamp(5rem, 3rem + 10vw, 10rem) / 1 var(--font-display);
      color: var(--coral);
      -webkit-text-stroke: 3px var(--ink);
    }

    .not-found__title {
      font-size: var(--text-3xl);
    }

    .not-found__text {
      max-width: 34rem;
      color: var(--color-text-muted);
    }

    .not-found__actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--space-4);
    }

    .not-found__note {
      margin-top: var(--space-8);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {}
