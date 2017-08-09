import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumlaExerciseComponent } from './forumla-exercise.component';

describe('ForumlaExerciseComponent', () => {
  let component: ForumlaExerciseComponent;
  let fixture: ComponentFixture<ForumlaExerciseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumlaExerciseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumlaExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
