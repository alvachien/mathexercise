import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizControlComponent } from './quiz-control.component';

describe('QuizControlComponent', () => {
  let component: QuizControlComponent;
  let fixture: ComponentFixture<QuizControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
