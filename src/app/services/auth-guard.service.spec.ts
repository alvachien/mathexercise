import { TestBed, inject } from '@angular/core/testing';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth.service';

import { AuthGuard } from './auth-guard.service';
import { Router, RouterModule } from '@angular/router';

describe('AuthGuard', () => {
  let authServiceStub: any;
  let authService: any;

  class RouterStub {
    navigateByUrl(url: string) { return url; }
  }

  beforeEach(() => {
    authServiceStub = {
    };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceStub },
        { provide: Router,      useClass: RouterStub }
      ],
      imports: [ HttpClientModule ],
    });

    authService = TestBed.get(AuthService);
  });

  it('should be created', inject([Router, AuthService, AuthGuard], (service: AuthGuard) => {
    // const spy = spyOn(router, 'navigateByUrl');

    expect(service).toBeTruthy();
  }));
});
