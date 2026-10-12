import { TestBed } from '@angular/core/testing';
import { FaqSection } from './faq-section';

const ITEMS = [
  { id: 'a', question: 'First?', answer: 'One.' },
  { id: 'b', question: 'Second?', answer: 'Two.' },
];

describe('FaqSection', () => {
  async function create() {
    TestBed.configureTestingModule({ imports: [FaqSection] });
    const fixture = TestBed.createComponent(FaqSection);
    fixture.componentRef.setInput('items', ITEMS);
    await fixture.whenStable();
    return fixture;
  }

  it('opens the first answer by default', async () => {
    const { componentInstance } = await create();
    expect(componentInstance.isOpen('a')).toBe(true);
    expect(componentInstance.isOpen('b')).toBe(false);
  });

  it('toggles answers independently', async () => {
    const { componentInstance } = await create();
    componentInstance.toggle('b');
    componentInstance.toggle('a');
    expect(componentInstance.isOpen('a')).toBe(false);
    expect(componentInstance.isOpen('b')).toBe(true);
  });

  it('reflects state in aria-expanded and inert', async () => {
    const fixture = await create();
    const el = fixture.nativeElement as HTMLElement;
    const [first, second] = Array.from(el.querySelectorAll('button'));
    expect(first.getAttribute('aria-expanded')).toBe('true');
    expect(second.getAttribute('aria-expanded')).toBe('false');
    expect(el.querySelector('#faq-panel-b')?.hasAttribute('inert')).toBe(true);

    second.click();
    await fixture.whenStable();
    expect(second.getAttribute('aria-expanded')).toBe('true');
    expect(el.querySelector('#faq-panel-b')?.hasAttribute('inert')).toBe(false);
  });
});
