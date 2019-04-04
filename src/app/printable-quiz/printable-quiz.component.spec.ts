import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintableQuizComponent } from './printable-quiz.component';

describe('PrintableQuizComponent', () => {
  let component: PrintableQuizComponent;
  let fixture: ComponentFixture<PrintableQuizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintableQuizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintableQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
