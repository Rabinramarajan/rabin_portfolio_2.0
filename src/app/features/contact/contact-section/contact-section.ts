import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { contactInfo } from '../../../data/contact';
import { profile } from '../../../data/profile';
import { useGsap } from '../../../core/motion/gsap';
import { SectionHeading } from '../../../shared/components/section-heading/section-heading';
import { StickyNote } from '../../../shared/components/sticky-note/sticky-note';
import { SocialLinks } from '../../../shared/components/social-links/social-links';
import { LocationMap } from '../../../shared/components/location-map/location-map';
import { SoftwareWindow } from '../../../shared/components/software-window/software-window';
import { ContactForm } from '../contact-form/contact-form';
import { SceneArtComponent, SCENES } from '../../../shared/components/scene-art/scene-art';

/** Contact intro, direct details and the form. Used on the home page and /contact. */
@Component({
  selector: 'app-contact-section',
  imports: [SceneArtComponent, SectionHeading, StickyNote, SocialLinks, SoftwareWindow, ContactForm, LocationMap],
  templateUrl: './contact-section.html',
  styleUrl: './contact-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactSection {
  /** 1 on the /contact page, 2 inside the home page. */
  readonly headingLevel = input<1 | 2>(2);

  protected readonly info = contactInfo;
  protected readonly scene = SCENES.contact;
  protected readonly socials = profile.socials.filter((s) => s.id === 'github' || s.id === 'linkedin');

  constructor() {
    useGsap(({ gsap, root }) => {
      gsap
        .timeline({ scrollTrigger: { trigger: root, start: 'top 75%' } })
        .from(root.querySelectorAll('.contact__intro > :not(app-sticky-note, app-scene-art)'), { autoAlpha: 0, y: 24, stagger: 0.08, duration: 0.6 })
        .from(root.querySelector('.contact__art'), { autoAlpha: 0, y: 30, duration: 0.7, ease: 'back.out(1.7)' }, '-=0.4')
        .from(root.querySelector('.contact__panel'), { autoAlpha: 0, y: 40, duration: 0.7, ease: 'power3.out' }, '-=0.6');
    });
  }
}
