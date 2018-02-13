import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { AdditionExerciseComponent } from './addition-exercise.component';
import { DSMaterialModule } from "../app.module";
import { DialogService } from '../services/dialog.service';
import { MatDialog } from '@angular/material';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, NgModule, Component, OnInit, NgZone, DebugElement } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DigitClockComponent } from '../digit-clock';
import { APP_BASE_HREF } from '@angular/common';

describe('AdditionExerciseComponent', () => {
  let component: AdditionExerciseComponent;
  let fixture: ComponentFixture<AdditionExerciseComponent>;
  // let de:      DebugElement;
  // let el:      HTMLElement;
  // userServiceStub = {
  //   isLoggedIn: true,
  //   user: { name: 'Test User'}
  // };
  class RouterStub {
    navigateByUrl(url: string) { return url; }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionExerciseComponent, DigitClockComponent ],
      providers:    [ 
        { provide: DialogService },
        { provide: Router, useClass: RouterStub },
        { provide: APP_BASE_HREF, useValue : '/' },
      ],
      imports: [
        BrowserModule,
        FormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        DSMaterialModule,
        RouterModule.forRoot(undefined),
        TranslateModule.forRoot()
      ]
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
