import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { By }              from '@angular/platform-browser';
// import { DebugElement }    from '@angular/core';
import { AdditionExerciseComponent } from './addition-exercise.component';

describe('AdditionExerciseComponent', () => {
  let component: AdditionExerciseComponent;
  let fixture: ComponentFixture<AdditionExerciseComponent>;
  // let de:      DebugElement;
  // let el:      HTMLElement;
  // userServiceStub = {
  //   isLoggedIn: true,
  //   user: { name: 'Test User'}
  // };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionExerciseComponent ],
      // providers:    [ {provide: UserService, useValue: userServiceStub } ]
    })
    .compileComponents();

    // // UserService from the root injector
    // userService = TestBed.get(UserService);

    // query for the title <h1> by CSS element selector
    // de = fixture.debugElement.query(By.css('h1'));
    // el = de.nativeElement;
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
