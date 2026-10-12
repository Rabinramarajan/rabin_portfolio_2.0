import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'lg';

/**
 * Renders a router link when `link` is set, an external anchor when `href`
 * is set, and a native <button> otherwise — so every call-to-action shares
 * one look without losing the right semantics.
 */
@Component({
  selector: 'app-button',
  imports: [RouterLink],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  readonly label = input.required<string>();
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly link = input<string>();
  readonly href = input<string>();

  protected readonly classes = computed(() => `btn btn--${this.variant()} btn--${this.size()}`);
  protected readonly isExternal = computed(() => this.href()?.startsWith('http') ?? false);
}
