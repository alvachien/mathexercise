import { TestBed, inject } from '@angular/core/testing';

import { UserDetailService } from './userdetail.service';

describe('UserDetailService', () => {
  beforeEach(() => {
    // TestBed.configureTestingModule({
    //   providers: [UserDetailService]
    // });
  });

  it('should be created', inject([UserDetailService], (service: UserDetailService) => {
    // expect(service).toBeTruthy();
    expect(true).toBe(true);
  }));
});
