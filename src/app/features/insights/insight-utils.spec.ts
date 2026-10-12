import { formatBraceCode } from './insight-utils';

describe('formatBraceCode', () => {
  it('re-flows a one-line class into indented lines', () => {
    const out = formatBraceCode(
      'export class FilterPanelComponent { readonly open = signal(false); toggle(): void { this.open.update((value) => !value); } }',
    );
    expect(out).toBe(
      [
        'export class FilterPanelComponent {',
        '  readonly open = signal(false);',
        '  toggle(): void {',
        '    this.open.update((value) => !value);',
        '  }',
        '}',
      ].join('\n'),
    );
  });

  it('leaves braces and semicolons inside strings alone', () => {
    expect(formatBraceCode("const s = '{ a; b }';")).toBe("const s = '{ a; b }';");
  });

  it('keeps small inline objects on one line', () => {
    expect(formatBraceCode("@Injectable({ providedIn: 'root' }) export class A { }")).toContain(
      "@Injectable({ providedIn: 'root' })",
    );
  });

  it('does not touch code that already has line breaks', () => {
    expect(formatBraceCode('a {\n  b;\n}')).toBe('a {\n  b;\n}');
  });
});
