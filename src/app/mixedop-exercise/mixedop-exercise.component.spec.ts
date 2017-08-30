import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MixedopExerciseComponent } from './mixedop-exercise.component';

describe('MixedopExerciseComponent', () => {
  let component: MixedopExerciseComponent;
  let fixture: ComponentFixture<MixedopExerciseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MixedopExerciseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MixedopExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
