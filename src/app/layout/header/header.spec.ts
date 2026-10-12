import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Component } from '@angular/core';
import { Header } from './header';

@Component({ template: '' })
class Blank {}

describe('Header', () => {
  async function create() {
    TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([{ path: '**', component: Blank }])],
    });
    const fixture = TestBed.createComponent(Header);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const toggle = el.querySelector<HTMLButtonElement>('button[aria-controls="primary-nav"]')!;
    return { fixture, el, toggle };
  }

  it('renders the primary navigation', async () => {
    const { el } = await create();
    const labels = Array.from(el.querySelectorAll('#primary-nav a')).map((a) => a.textContent?.trim());
    expect(labels).toEqual(['Work', 'Services', 'Insights', 'About', 'Résumé', "Let's work together"]);
  });

  it('toggles the mobile menu and reflects it in aria-expanded', async () => {
    const { fixture, toggle } = await create();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    toggle.click();
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
  });

  it('closes on Escape and returns focus to the toggle', async () => {
    const { fixture, toggle } = await create();
    toggle.click();
    await fixture.whenStable();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(toggle);
  });

  it('closes after navigation', async () => {
    const { fixture, toggle } = await create();
    toggle.click();
    await fixture.whenStable();
    await TestBed.inject(Router).navigateByUrl('/work');
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });
});
