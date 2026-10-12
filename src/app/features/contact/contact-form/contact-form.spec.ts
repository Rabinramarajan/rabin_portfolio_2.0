import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ContactService } from '../../../core/contact/contact.service';
import { ContactResponse } from '../../../core/contact/contact.model';
import { ContactForm } from './contact-form';

describe('ContactForm', () => {
  let send: ReturnType<typeof vi.fn>;

  async function create(response: ContactResponse = { ok: true }) {
    send = vi.fn(() => of(response));
    TestBed.configureTestingModule({
      imports: [ContactForm],
      providers: [{ provide: ContactService, useValue: { send } }],
    });
    const fixture = TestBed.createComponent(ContactForm);
    await fixture.whenStable();
    return fixture;
  }

  function fill(form: ContactForm['contactForm']) {
    form.name().value.set('Ada Lovelace');
    form.email().value.set('ada@example.com');
    form.subject().value.set('New project');
    form.message().value.set('I would like to talk about an Angular rebuild.');
  }

  function submit(fixture: Awaited<ReturnType<typeof create>>) {
    (fixture.nativeElement as HTMLElement).querySelector('form')!.dispatchEvent(new Event('submit'));
  }

  it('starts invalid, with every field required', async () => {
    const { componentInstance } = await create();
    const form = componentInstance.contactForm;
    expect(form().valid()).toBe(false);
    expect(form.name().required()).toBe(true);
    expect(form.message().required()).toBe(true);
  });

  it('rejects a bad email and a short message', async () => {
    const { componentInstance } = await create();
    const form = componentInstance.contactForm;
    fill(form);
    form.email().value.set('not-an-email');
    form.message().value.set('too short');
    expect(form.email().valid()).toBe(false);
    expect(form.message().valid()).toBe(false);
  });

  it('does not send an invalid form', async () => {
    const fixture = await create();
    submit(fixture);
    await fixture.whenStable();
    expect(send).not.toHaveBeenCalled();
    expect(fixture.componentInstance.status()).toBe('idle');
  });

  it('sends a valid form, with the spam-trap fields, and shows success', async () => {
    const fixture = await create();
    fill(fixture.componentInstance.contactForm);
    submit(fixture);
    await fixture.whenStable();
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ email: 'ada@example.com', website: '' }));
    expect(fixture.componentInstance.status()).toBe('sent');
  });

  it('shows the server error when sending fails', async () => {
    const fixture = await create({ ok: false, error: 'Too many messages.' });
    fill(fixture.componentInstance.contactForm);
    submit(fixture);
    await fixture.whenStable();
    expect(fixture.componentInstance.status()).toBe('error');
    expect(fixture.componentInstance.errorMessage()).toBe('Too many messages.');
  });
});
