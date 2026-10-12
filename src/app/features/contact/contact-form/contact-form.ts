import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { email, form, maxLength, minLength, required, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { CONTACT_LIMITS, ContactMessage } from '../../../core/contact/contact.model';
import { ContactService } from '../../../core/contact/contact.service';
import { profile } from '../../../data/profile';
import { FormControl } from '../../../shared/components/form-control/form-control';
import { Button } from '../../../shared/components/button/button';
import { registerContactDraftTool } from './webmcp';

export type ContactStatus = 'idle' | 'sent' | 'error';

const EMPTY: ContactMessage = { name: '', email: '', subject: '', message: '' };

@Component({
  selector: 'app-contact-form',
  imports: [FormControl, Button],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactForm {
  private readonly contact = inject(ContactService);

  protected readonly directEmail = profile.email;
  protected readonly limits = CONTACT_LIMITS;

  readonly status = signal<ContactStatus>('idle');
  readonly errorMessage = signal('');

  /** Honeypot value: real visitors never see or fill it. */
  protected readonly website = signal('');
  /** When the form was rendered; the server rejects instant submissions. */
  private startedAt = Date.now();

  private readonly model = signal<ContactMessage>({ ...EMPTY });

  readonly contactForm = form(this.model, (path) => {
    const { name, subject, message } = CONTACT_LIMITS;
    required(path.name, { message: 'Please tell me your name.' });
    minLength(path.name, name.min, { message: `Your name needs at least ${name.min} characters.` });
    maxLength(path.name, name.max, { message: `Please keep your name under ${name.max} characters.` });

    required(path.email, { message: 'Please add your email so I can reply.' });
    email(path.email, { message: 'That email address doesn’t look right.' });

    required(path.subject, { message: 'Please add a short subject.' });
    minLength(path.subject, subject.min, { message: `A few more characters, please (at least ${subject.min}).` });
    maxLength(path.subject, subject.max, { message: `Please keep the subject under ${subject.max} characters.` });

    required(path.message, { message: 'Please write a short message.' });
    minLength(path.message, message.min, {
      message: `A few more words, please (at least ${message.min} characters).`,
    });
    maxLength(path.message, message.max, { message: `Please keep it under ${message.max} characters.` });
  });

  constructor() {
    // In-browser AI agents can fill the form; only the visitor can send it
    registerContactDraftTool((draft) => {
      this.status.set('idle');
      this.model.set(draft);
    });
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.errorMessage.set('');

    await submit(this.contactForm, async () => {
      const response = await firstValueFrom(
        this.contact.send({ ...this.model(), website: this.website(), startedAt: this.startedAt }),
      );

      if (response.ok) {
        this.status.set('sent');
      } else {
        this.status.set('error');
        this.errorMessage.set(response.error);
      }
      return undefined;
    });
  }

  protected onHoneypot(event: Event): void {
    this.website.set((event.target as HTMLInputElement).value);
  }

  protected startOver(): void {
    this.model.set({ ...EMPTY });
    this.contactForm().reset();
    this.status.set('idle');
    this.startedAt = Date.now();
  }
}
