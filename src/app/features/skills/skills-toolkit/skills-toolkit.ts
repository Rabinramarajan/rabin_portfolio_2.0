import { ChangeDetectionStrategy, Component, ElementRef, computed, signal, viewChildren } from '@angular/core';
import { ECO_CATEGORIES, EcoTech, techsIn } from '../../../data/ecosystem';
import { useGsap } from '../../../core/motion/gsap';
import { SoftwareWindow } from '../../../shared/components/software-window/software-window';

const DEPTH_LABELS: Record<EcoTech['depth'], string> = {
  1: 'Working knowledge',
  2: 'Comfortable',
  3: 'Strong',
  4: 'Daily, in production',
};

/** Sticker tilts, cycled so neighbouring stickers lean different ways. */
const TILTS = [-4, 3, -2, 5, -5, 2, -3, 4];

/**
 * "Developer's toolkit": category tabs over a desk of skill stickers, with a
 * detail panel for the selected technology. Works with mouse, touch and keyboard.
 */
@Component({
  selector: 'app-skills-toolkit',
  imports: [SoftwareWindow],
  templateUrl: './skills-toolkit.html',
  styleUrl: './skills-toolkit.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsToolkit {
  protected readonly categories = ECO_CATEGORIES;
  protected readonly depthLabels = DEPTH_LABELS;
  protected readonly depthSteps = [1, 2, 3, 4] as const;

  readonly selectedCategoryId = signal(ECO_CATEGORIES[0].id);
  /** null means "the first technology in the category". */
  private readonly selectedTechId = signal<string | null>(null);
  /** Re-rendered stickers animate in with CSS only after the visitor interacts. */
  protected readonly interacted = signal(false);

  readonly category = computed(
    () => this.categories.find((c) => c.id === this.selectedCategoryId()) ?? this.categories[0],
  );

  readonly techs = computed(() =>
    techsIn(this.selectedCategoryId()).map((tech, i) => ({ ...tech, tilt: TILTS[i % TILTS.length] })),
  );

  readonly selectedTech = computed(() => {
    const techs = this.techs();
    return techs.find((t) => t.id === this.selectedTechId()) ?? techs[0];
  });

  private readonly tabs = viewChildren<ElementRef<HTMLButtonElement>>('tab');

  constructor() {
    useGsap(({ gsap, root }) => {
      gsap.from(root.querySelectorAll('.desk__stickers li'), {
        autoAlpha: 0,
        scale: 0.6,
        rotate: () => gsap.utils.random(-20, 20),
        duration: 0.6,
        ease: 'back.out(1.8)',
        stagger: 0.05,
        scrollTrigger: { trigger: root.querySelector('.desk'), start: 'top 80%' },
      });
    });
  }

  selectCategory(id: string): void {
    this.selectedCategoryId.set(id);
    this.selectedTechId.set(null);
    this.interacted.set(true);
  }

  selectTech(id: string): void {
    this.selectedTechId.set(id);
    this.interacted.set(true);
  }

  /** Roving focus across the tab list (WAI-ARIA tabs pattern, automatic activation). */
  protected onTabKeydown(event: KeyboardEvent, index: number): void {
    const last = this.categories.length - 1;
    const next =
      event.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : event.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
      : event.key === 'Home' ? 0
      : event.key === 'End' ? last
      : null;

    if (next === null) return;
    event.preventDefault();
    this.selectCategory(this.categories[next].id);
    this.tabs()[next]?.nativeElement.focus();
  }
}
