import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtractionExerciseComponent } from './subtraction-exercise.component';

describe('SubtractionExerciseComponent', () => {
  let component: SubtractionExerciseComponent;
  let fixture: ComponentFixture<SubtractionExerciseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubtractionExerciseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtractionExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
