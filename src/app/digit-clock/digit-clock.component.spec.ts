import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitClockComponent } from './digit-clock.component';

describe('DigitClockComponent', () => {
  let component: DigitClockComponent;
  let fixture: ComponentFixture<DigitClockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitClockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitClockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
