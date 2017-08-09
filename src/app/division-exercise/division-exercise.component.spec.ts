import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DivideExerciseComponent } from './divide-exercise.component';

describe('DivideExerciseComponent', () => {
  let component: DivideExerciseComponent;
  let fixture: ComponentFixture<DivideExerciseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DivideExerciseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivideExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
