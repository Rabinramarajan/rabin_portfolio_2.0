import { CONTACT_LIMITS, looksAutomated, validateContact } from './contact.model';

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  subject: 'A new project',
  message: 'I would like to talk about an Angular rebuild.',
};

describe('validateContact', () => {
  it('accepts a complete, well-formed message', () => {
    expect(validateContact(valid)).toEqual({});
  });

  it('reports each invalid field', () => {
    const errors = validateContact({ name: 'A', email: 'nope', subject: 'x', message: 'short' });
    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name', 'subject']);
  });

  it('trims before measuring length', () => {
    expect(validateContact({ ...valid, name: '  A  ' }).name).toBeDefined();
  });

  it('rejects messages over the limit', () => {
    const message = 'x'.repeat(CONTACT_LIMITS.message.max + 1);
    expect(validateContact({ ...valid, message }).message).toBeDefined();
  });
});

describe('looksAutomated', () => {
  const now = 1_000_000;

  it('flags a filled honeypot', () => {
    expect(looksAutomated({ website: 'spam.example', startedAt: 0 }, now)).toBe(true);
  });

  it('flags submissions faster than a person could type', () => {
    expect(looksAutomated({ website: '', startedAt: now - 500 }, now)).toBe(true);
  });

  it('flags a missing timestamp', () => {
    expect(looksAutomated({ website: '', startedAt: Number.NaN }, now)).toBe(true);
  });

  it('lets a normal submission through', () => {
    expect(looksAutomated({ website: '', startedAt: now - 60_000 }, now)).toBe(false);
  });
});
