import { TestBed, inject } from '@angular/core/testing';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpClientModule } from '@angular/common/http';

import { QuizService } from './quiz.service';
import { AuthService } from './auth.service';

describe('QuizService', () => {
  let authServiceStub: any;
  let authService: any;

  beforeEach(() => {
    authServiceStub = {
    };

    TestBed.configureTestingModule({
      providers: [
        QuizService,
        {provide: AuthService, useValue: authServiceStub },
      ],
      imports: [ HttpClientModule ],
    });

    authService = TestBed.get(AuthService);
  });

  it('should be created', inject([HttpClient, AuthService, QuizService], (service: QuizService) => {
    expect(service).toBeTruthy();
  }));
});
