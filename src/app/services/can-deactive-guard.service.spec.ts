import { TestBed, inject } from '@angular/core/testing';

import { CanDeactivateGuard } from './can-deactive-guard.service';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanDeactivateGuard]
    });
  });

  it('should be created', inject([CanDeactivateGuard], (service: CanDeactivateGuard) => {
    expect(service).toBeTruthy();
  }));
});
