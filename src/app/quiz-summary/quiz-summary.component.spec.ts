import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizSummaryComponent } from './quiz-summary.component';

describe('QuizSummaryComponent', () => {
  let component: QuizSummaryComponent;
  let fixture: ComponentFixture<QuizSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
