import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsTrendComponent } from './us-trend.component';

describe('UsTrendComponent', () => {
  let component: UsTrendComponent;
  let fixture: ComponentFixture<UsTrendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsTrendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
