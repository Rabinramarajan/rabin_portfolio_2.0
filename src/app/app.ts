import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  /**
   * With <base href="/">, "#main-content" resolves to "/#main-content" and would
   * navigate home from any inner page. Move focus in place instead.
   */
  protected skipToContent(event: Event): void {
    event.preventDefault();
    const main = document.getElementById('main-content');
    main?.focus();
    main?.scrollIntoView();
  }
}
