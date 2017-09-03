import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardBalanceComponent } from './award-balance.component';

describe('AwardBalanceComponent', () => {
  let component: AwardBalanceComponent;
  let fixture: ComponentFixture<AwardBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
