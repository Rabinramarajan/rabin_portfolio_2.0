import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContactSection } from './contact-section/contact-section';
import { FaqSection } from '../faq/faq-section/faq-section';

@Component({
  selector: 'app-contact-page',
  imports: [ContactSection, FaqSection],
  template: `
    <section class="page-section container">
      <app-contact-section [headingLevel]="1" />
    </section>
    <section class="page-section page-section--band" aria-labelledby="contact-faq-title">
      <div class="container">
        <h2 id="contact-faq-title" class="faq-title">Before you write</h2>
        <app-faq-section />
      </div>
    </section>
  `,
  styles: `
    .faq-title {
      margin-bottom: var(--space-8);
      font-size: var(--text-3xl);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPage {}
