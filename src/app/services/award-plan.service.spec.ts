import { TestBed, inject } from '@angular/core/testing';

import { AwardPlanService } from './award-plan.service';
import { AuthService } from './auth.service';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpClientModule } from '@angular/common/http';

describe('AwardPlanService', () => {
  let authServiceStub: any;
  let authService: any;

  beforeEach(() => {
    authServiceStub = {
    };

    TestBed.configureTestingModule({
      providers: [
        AwardPlanService,
        { provide: AuthService, useValue: authServiceStub },
      ],
      imports: [ HttpClientModule ],
    });

    authService = TestBed.get(AuthService);
  });

  it('should be created', inject([AuthService, HttpClientModule, AwardPlanService], (service: AwardPlanService) => {
    expect(service).toBeTruthy();
  }));
});
