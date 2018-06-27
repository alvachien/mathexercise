import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintableQuizGeneratorComponent } from './printable-quiz-generator.component';

describe('PrintableQuizGeneratorComponent', () => {
  let component: PrintableQuizGeneratorComponent;
  let fixture: ComponentFixture<PrintableQuizGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintableQuizGeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintableQuizGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
