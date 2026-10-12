import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

/** The approved R monogram with the wordmark, linking home. */
@Component({
  selector: 'app-logo',
  imports: [RouterLink],
  template: `
    <a class="logo" routerLink="/" (click)="navigate.emit()">
      <img class="logo__mark" src="/images/logo.webp" alt="" width="44" height="44" />
      <span class="logo__word">{{ name() }}</span>
    </a>
  `,
  styleUrl: './logo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Logo {
  readonly name = input('Rabin R');
  readonly navigate = output();
}
