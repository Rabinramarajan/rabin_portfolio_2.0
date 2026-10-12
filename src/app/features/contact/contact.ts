import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { email, form, minLength, required, submit } from '@angular/forms/signals';
import { PROFILE } from '../../data/profile.data';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { FormControl } from '../../shared/components/form-control/form-control';
import { Button } from '../../shared/components/button/button';
import { StickyNote } from '../../shared/components/sticky-note/sticky-note';
import { SocialLinks } from '../../shared/components/social-links/social-links';

interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

const MIN_MESSAGE_LENGTH = 20;

const EMPTY_MESSAGE: ContactMessage = { name: '', email: '', message: '' };

@Component({
  selector: 'app-contact',
  imports: [SectionHeading, FormControl, Button, StickyNote, SocialLinks],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  protected readonly profile = PROFILE;
  protected readonly sent = signal(false);

  private readonly model = signal<ContactMessage>({ ...EMPTY_MESSAGE });

  protected readonly contactForm = form(this.model, (path) => {
    required(path.name, { message: 'Please tell me your name.' });
    required(path.email, { message: 'Please add your email so I can reply.' });
    email(path.email, { message: 'That email address doesn’t look right.' });
    required(path.message, { message: 'Please write a short message.' });
    minLength(path.message, MIN_MESSAGE_LENGTH, {
      message: `A few more words, please (at least ${MIN_MESSAGE_LENGTH} characters).`,
    });
  });

  protected onSubmit(event: Event): void {
    event.preventDefault();

    // There is no backend: a valid form opens the visitor's email app with the message filled in.
    submit(this.contactForm, async () => {
      window.location.href = this.buildMailtoLink(this.model());
      this.sent.set(true);
      return undefined;
    });
  }

  protected startOver(): void {
    this.model.set({ ...EMPTY_MESSAGE });
    this.contactForm().reset();
    this.sent.set(false);
  }

  private buildMailtoLink({ name, email, message }: ContactMessage): string {
    const subject = encodeURIComponent(`Project enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    return `mailto:${this.profile.email}?subject=${subject}&body=${body}`;
  }
}
