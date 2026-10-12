import { TestBed } from '@angular/core/testing';
import { techsIn } from '../../../data/ecosystem';
import { SkillsToolkit } from './skills-toolkit';

describe('SkillsToolkit', () => {
  function create() {
    TestBed.configureTestingModule({ imports: [SkillsToolkit] });
    const fixture = TestBed.createComponent(SkillsToolkit);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('selects the first technology of the default category', () => {
    const toolkit = create();
    expect(toolkit.selectedTech().id).toBe(techsIn(toolkit.selectedCategoryId())[0].id);
  });

  it('selects a technology within the category', () => {
    const toolkit = create();
    const second = toolkit.techs()[1];
    toolkit.selectTech(second.id);
    expect(toolkit.selectedTech().id).toBe(second.id);
  });

  it('resets the technology when the category changes', () => {
    const toolkit = create();
    toolkit.selectTech(toolkit.techs()[1].id);
    toolkit.selectCategory('mobile');
    expect(toolkit.category().id).toBe('mobile');
    expect(toolkit.selectedTech().categoryId).toBe('mobile');
    expect(toolkit.selectedTech().id).toBe(techsIn('mobile')[0].id);
  });
});
