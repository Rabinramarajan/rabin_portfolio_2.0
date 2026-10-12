import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';

export type FormControlType = 'text' | 'email' | 'textarea';

/**
 * A labelled Signal Forms input. Required and disabled state come from the
 * form schema, errors appear once the user has interacted with the field, and
 * the matching ARIA attributes are wired up.
 */
@Component({
  selector: 'app-form-control',
  imports: [FormField],
  templateUrl: './form-control.html',
  styleUrl: './form-control.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormControl {
  readonly field = input.required<FieldTree<string>>();
  readonly label = input.required<string>();
  readonly controlId = input.required<string>();
  readonly type = input<FormControlType>('text');
  readonly autocomplete = input<string>();
  readonly hint = input<string>();

  protected readonly state = computed(() => this.field()());
  protected readonly errorId = computed(() => `${this.controlId()}-error`);
  protected readonly hintId = computed(() => `${this.controlId()}-hint`);

  protected readonly visibleErrors = computed(() => {
    const state = this.state();
    return state.touched() ? state.errors() : [];
  });

  protected readonly hasErrors = computed(() => this.visibleErrors().length > 0);

  protected readonly describedBy = computed(() => {
    const ids = [this.hint() ? this.hintId() : null, this.hasErrors() ? this.errorId() : null];
    return ids.filter(Boolean).join(' ') || null;
  });
}
