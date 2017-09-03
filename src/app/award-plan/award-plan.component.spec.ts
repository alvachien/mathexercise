import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardPlanComponent } from './award-plan.component';

describe('AwardPlanComponent', () => {
  let component: AwardPlanComponent;
  let fixture: ComponentFixture<AwardPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
