import { TestBed, inject } from '@angular/core/testing';

import { PgService } from './pg.service';

describe('PgService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PgService]
    });
  });

  it('should ...', inject([PgService], (service: PgService) => {
    expect(service).toBeTruthy();
  }));
});
