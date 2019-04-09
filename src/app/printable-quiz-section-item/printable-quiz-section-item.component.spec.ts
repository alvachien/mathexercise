import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintableQuizSectionItemComponent } from './printable-quiz-section-item.component';

describe('PrintableQuizSectionItemComponent', () => {
  let component: PrintableQuizSectionItemComponent;
  let fixture: ComponentFixture<PrintableQuizSectionItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintableQuizSectionItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintableQuizSectionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
