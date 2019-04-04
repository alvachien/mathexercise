import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintableQuizSectionComponent } from './printable-quiz-section.component';

describe('PrintableQuizSectionComponent', () => {
  let component: PrintableQuizSectionComponent;
  let fixture: ComponentFixture<PrintableQuizSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintableQuizSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintableQuizSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
