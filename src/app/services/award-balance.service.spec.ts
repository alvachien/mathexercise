import { TestBed, inject } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AwardBalanceService } from './award-balance.service';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpClientModule } from '@angular/common/http';

describe('AwardBalanceService', () => {
  let authServiceStub: any;
  let authService: any;

  beforeEach(() => {
    authServiceStub = {
    };

    TestBed.configureTestingModule({
      providers: [
        AwardBalanceService,
        { provide: AuthService, useValue: authServiceStub },
      ],
      imports: [ HttpClientModule ],
    });

    authService = TestBed.get(AuthService);
  });

  it('should be created', inject([AuthService, HttpClientModule, AwardBalanceService], (service: AwardBalanceService) => {
    expect(service).toBeTruthy();
  }));
});
