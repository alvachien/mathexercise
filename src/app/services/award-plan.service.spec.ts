import { TestBed, inject } from '@angular/core/testing';

import { AwardPlanService } from './award-plan.service';

describe('AwardPlanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AwardPlanService]
    });
  });

  it('should be created', inject([AwardPlanService], (service: AwardPlanService) => {
    expect(service).toBeTruthy();
  }));
});
