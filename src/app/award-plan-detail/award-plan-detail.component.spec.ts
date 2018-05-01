import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardPlanDetailComponent } from './award-plan-detail.component';

describe('AwardPlanDetailComponent', () => {
  let component: AwardPlanDetailComponent;
  let fixture: ComponentFixture<AwardPlanDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardPlanDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardPlanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
