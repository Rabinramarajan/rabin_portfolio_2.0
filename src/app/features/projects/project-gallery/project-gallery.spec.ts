import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { projects } from '../../../data/projects';
import { ProjectGallery } from './project-gallery';

describe('ProjectGallery', () => {
  function create(limit?: number) {
    TestBed.configureTestingModule({ imports: [ProjectGallery], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(ProjectGallery);
    if (limit !== undefined) fixture.componentRef.setInput('limit', limit);
    fixture.detectChanges();
    return fixture;
  }

  it('shows every project by default', () => {
    const { componentInstance } = create();
    expect(componentInstance.visibleProjects().length).toBe(projects.length);
  });

  it('derives the visible list from the selected filter', () => {
    const { componentInstance } = create();
    componentInstance.selectFilter('platforms');
    const visible = componentInstance.visibleProjects();
    expect(visible.length).toBeGreaterThan(0);
    expect(visible.every((p) => p.filter === 'platforms')).toBe(true);
  });

  it('applies the limit after filtering', () => {
    const { componentInstance } = create(2);
    expect(componentInstance.visibleProjects().length).toBe(2);
  });

  it('marks the pressed filter button', async () => {
    const fixture = create();
    fixture.componentInstance.selectFilter('marketplaces');
    await fixture.whenStable();
    const pressed = fixture.nativeElement.querySelector('[aria-pressed="true"]') as HTMLElement;
    expect(pressed.textContent).toContain('Marketplaces');
  });
});
