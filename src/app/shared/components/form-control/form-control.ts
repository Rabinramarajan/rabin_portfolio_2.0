import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';

export type FormControlType = 'text' | 'email' | 'textarea';

/**
 * A labelled Signal Forms input that shows validation errors once the user
 * has interacted with the field, and wires up the matching ARIA attributes.
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

  protected readonly errorId = computed(() => `${this.controlId()}-error`);

  protected readonly visibleErrors = computed(() => {
    const state = this.field()();
    return state.touched() ? state.errors() : [];
  });

  protected readonly hasErrors = computed(() => this.visibleErrors().length > 0);
}
