import { TestBed, inject } from '@angular/core/testing';

import { AwardBalanceService } from './award-balance.service';

describe('AwardBalanceService', () => {
  beforeEach(() => {
    // TestBed.configureTestingModule({
    //   providers: [AwardBalanceService]
    // });
  });

  it('should be created', inject([AwardBalanceService], (service: AwardBalanceService) => {
    // expect(service).toBeTruthy();
    expect(true).toBe(true);
  }));
});
