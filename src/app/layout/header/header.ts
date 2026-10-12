import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { navigation } from '../../data/profile';
import { Logo } from '../../shared/components/logo/logo';
import { Icon } from '../../shared/components/icon/icon';
import { ScrollProgress } from '../../shared/components/scroll-progress/scroll-progress';

/** Scrolled past this many pixels, the header gains its "lifted" style. */
const SCROLLED_OFFSET = 8;

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Logo, Icon, ScrollProgress],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-scrolled]': 'scrolled()',
    '(window:scroll)': 'onScroll()',
    '(document:keydown.escape)': 'closeMenu(true)',
  },
})
export class Header {
  protected readonly navItems = navigation;
  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);

  private readonly toggle = viewChild.required<ElementRef<HTMLButtonElement>>('toggle');
  private readonly navLinks = viewChildren<ElementRef<HTMLAnchorElement>>('navLink');

  constructor() {
    // Any navigation (link, back button) closes the mobile menu
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.menuOpen.set(false));

    // Move focus into the menu when it opens, so keyboard users land on the first link
    afterRenderEffect(() => {
      if (this.menuOpen()) this.navLinks()[0]?.nativeElement.focus();
    });
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  /** Closes the menu; on Escape, focus returns to the toggle that opened it. */
  protected closeMenu(restoreFocus = false): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    if (restoreFocus) this.toggle().nativeElement.focus();
  }

  protected onScroll(): void {
    this.scrolled.set(window.scrollY > SCROLLED_OFFSET);
  }
}
