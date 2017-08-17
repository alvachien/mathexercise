import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth.service';
import { QuizTypeEnum, PrimarySchoolMathQuizItem, 
  AdditionQuizItem, SubtractionQuizItem, MultiplicationQuizItem, DivisionQuizItem } from '../model';

export class QuizFailureItem {
  public quiztype: QuizTypeEnum;
  public quizid: number;
  public quizfailidx: number;
  public submitdate: Date;
  public inputted: string;
  public quizitemstore: string;
  public qsInstance: PrimarySchoolMathQuizItem;
}

@Component({
  selector: 'app-failure-retest',
  templateUrl: './failure-retest.component.html',
  styleUrls: ['./failure-retest.component.scss']
})
export class FailureRetestComponent implements OnInit {

  constructor(private _http: Http,
    private _authService: AuthService) {
  }

  ngOnInit() {
    let usr = this._authService.authSubject.getValue().getUserId();
    let apiurl = environment.APIBaseUrl + 'quizfailure/' + usr;

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
    let options = new RequestOptions({ headers: headers }); // Create a request option
    this._http.get(apiurl, options)
      .map((response: Response) => {
        console.log(response);
        return response.json();
      })
      .subscribe(x => {
        if (x instanceof Array && x.length > 0) {
          for (let si of x) {
            console.log(si);
            let qi: QuizFailureItem = new QuizFailureItem();
            qi.quiztype = si.quizType;
            qi.quizid = si.quizID;
            qi.quizfailidx = si.quizFailIndex;
            qi.quizitemstore = si.expected;
            qi.inputted = si.inputted;
            qi.submitdate = new Date(si.submitDate);
            switch(qi.quiztype) {
              case QuizTypeEnum.add: qi.qsInstance = AdditionQuizItem.restoreFromString(si.expected); break;
              case QuizTypeEnum.sub: qi.qsInstance = SubtractionQuizItem.restoreFromString(si.expected); break;
              case QuizTypeEnum.multi: qi.qsInstance = MultiplicationQuizItem.restoreFromString(si.expected); break;
              case QuizTypeEnum.div: qi.qsInstance = DivisionQuizItem.restoreFromString(si.expected); break;
              default: break;
            }
            console.log(qi);
          }
        }
      });
  }

  public onQuizSubmit() {

  }
}
