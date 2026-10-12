import { ChangeDetectionStrategy, Component, ElementRef, input, linkedSignal, viewChildren } from '@angular/core';
import { FaqItem, faqs } from '../../../data/faq';
import { Icon } from '../../../shared/components/icon/icon';

/**
 * Accessible accordion (WAI-ARIA accordion pattern). Several answers can be
 * open at once; the open set is the only state.
 */
@Component({
  selector: 'app-faq-section',
  imports: [Icon],
  templateUrl: './faq-section.html',
  styleUrl: './faq-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqSection {
  /** Questions to show; defaults to the site-wide FAQ. */
  readonly items = input<FaqItem[]>(faqs);
  /** Open answers. Resets to "first answer open" if the question set changes. */
  readonly expanded = linkedSignal<ReadonlySet<string>>(() => new Set(this.items().slice(0, 1).map((item) => item.id)));

  private readonly triggers = viewChildren<ElementRef<HTMLButtonElement>>('trigger');

  isOpen(id: string): boolean {
    return this.expanded().has(id);
  }

  toggle(id: string): void {
    this.expanded.update((open) => {
      const next = new Set(open);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  /** Up/Down/Home/End move focus between questions. */
  protected onKeydown(event: KeyboardEvent, index: number): void {
    const last = this.items().length - 1;
    const next =
      event.key === 'ArrowDown' ? (index === last ? 0 : index + 1)
      : event.key === 'ArrowUp' ? (index === 0 ? last : index - 1)
      : event.key === 'Home' ? 0
      : event.key === 'End' ? last
      : null;

    if (next === null) return;
    event.preventDefault();
    this.triggers()[next]?.nativeElement.focus();
  }
}
