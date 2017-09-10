import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { LogLevel, UserAuthInfo, PrimarySchoolMathQuiz, QuizCreateResultJSON } from '../model';
import { AuthService } from './auth.service';

@Injectable()
export class QuizService {

  constructor(private _http: HttpClient,
    private _authService: AuthService) {
  }

  public saveDB(objQuiz: PrimarySchoolMathQuiz): Observable<QuizCreateResultJSON> {
    const apiurl = environment.APIBaseUrl + 'quiz';

    const result: any = {};
    result.quizType = objQuiz.QuizType;
    result.basicInfo = objQuiz.BasicInfo;
    result.submitDate = new Date();
    result.attendUser = 'test';

    result.failLogs = [];
    for (const fl of objQuiz.FailedItems) {
      const flog: any = {};
      flog.quizFailIndex = fl.QuizIndex;
      flog.expected = fl.storeToString();
      flog.inputted = fl.getInputtedForumla();
      result.failLogs.push(flog);
    }

    result.sections = [];
    for (const qs of objQuiz.ElderRuns()) {
      const qsect: any = {};
      qsect.sectionID = qs.SectionNumber;
      qsect.timeSpent = qs.TimeSpent;
      qsect.totalItems = qs.ItemsCount;
      qsect.failedItems = qs.ItemsFailed;
      result.sections.push(qsect);
    }
    const data = JSON && JSON.stringify(result);

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    return this._http.post(apiurl, data, { headers: headers, withCredentials: true})
      .map((response: HttpResponse<any>) => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log('AC Math Exercise [Debug]:' + response);
        }

        const cr: QuizCreateResultJSON = <QuizCreateResultJSON><any>response;
        return cr;
      });
  }
}
