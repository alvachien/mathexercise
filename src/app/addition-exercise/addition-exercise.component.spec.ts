import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionExerciseComponent } from './addition-exercise.component';

describe('AdditionExerciseComponent', () => {
  let component: AdditionExerciseComponent;
  let fixture: ComponentFixture<AdditionExerciseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionExerciseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
