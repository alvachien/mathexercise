import { TestBed, inject } from '@angular/core/testing';

import { PgService } from './pg.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';

describe('PgService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PgService],
      imports: [HttpClientModule],
    });
  });

  it('should create PgService', inject([PgService], (service: PgService) => {
      expect(service).toBeTruthy();
  }));
});

