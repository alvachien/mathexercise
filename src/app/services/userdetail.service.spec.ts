import { TestBed, inject } from '@angular/core/testing';

import { UserDetailService } from './userdetail.service';
import { AuthService } from './auth.service';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpClientModule } from '@angular/common/http';

describe('UserDetailService', () => {
  let authServiceStub: any;
  let authService: any;

  beforeEach(() => {
    authServiceStub = {
    };

    TestBed.configureTestingModule({
      providers: [
        UserDetailService,
        { provide: AuthService, useValue: authServiceStub },
      ],
      imports: [ HttpClientModule ],
    });

    authService = TestBed.get(AuthService);
  });

  it('should be created', inject([AuthService, HttpClient, UserDetailService], (service: UserDetailService) => {
    expect(service).toBeTruthy();
  }));
});
