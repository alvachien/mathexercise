import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaListComponent } from './formula-list.component';

describe('FormulaListComponent', () => {
  let component: FormulaListComponent;
  let fixture: ComponentFixture<FormulaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
