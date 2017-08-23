import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { AuthService } from '../auth.service';
import {
  QuizTypeEnum, PrimarySchoolMathQuizItem, QuizTypeEnum2UIString,
  AdditionQuizItem, SubtractionQuizItem, MultiplicationQuizItem, DivisionQuizItem
} from '../model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-user-statistics',
  templateUrl: './user-statistics.component.html',
  styleUrls: ['./user-statistics.component.scss']
})
export class UserStatisticsComponent implements OnInit {
  // StatisticQuizItemAmountByType
  // StatisticQuizItemAmountByDate
  // StatisticQuizAmountByDate
  // StatisticQuizAmountByType
  // AttendedUser

  listUsers: string[] = [];
  isUserLoaded: boolean = false;
  curUser: string = '';

  viewQuizAmountByDate: any[] = [700, 400];
  showXAxisQuizAmountByDate = true;
  showYAxisQuizAmountByDate = true;
  gradientQuizAmountByDate = false;
  showLegendQuizAmountByDate = true;
  showXAxisLabelQuizAmountByDate = true;
  xAxisLabelQuizAmountByDate = 'Date';
  showYAxisLabelQuizAmountByDate = true;
  yAxisLabelQuizAmountByDate = 'Amount';  
  colorSchemeQuizAmountByDate = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  dataQuizAmountByDate: any[] = [];

  dataQuizAmountByType: any[] = [];
  viewQuizAmountByType: any[] = [700, 400];
  colorQuizAmountByTypeScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C']
  };

  constructor(private _http: Http,
    private _authService: AuthService) {
    // Object.assign(this, {single});
    this.isUserLoaded = false;
    this.curUser = '';
  }

  ngOnInit() {
    if (!this.isUserLoaded) {
      this.fetchAllUsers();
    }
  }

  public onUserChanged(evnt: any) {
    if (this.curUser !== undefined && this.curUser !== null && this.curUser.length > 0) {
      this.fetchQuizAmountByDate(this.curUser);
      this.fetchQuizAmountByType(this.curUser);
    }
  }

  public onQuizAmountByDateSelect(evnt: any) {

  }

  public onQuizAmountByTypeSelect(evnt: any) {

  }

  private fetchAllUsers() {
    this.isUserLoaded = true;

    let apiurl = environment.APIBaseUrl + 'AttendedUser';

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
            this.listUsers.push(si);
          }
        }
      });
  }

  private fetchQuizAmountByDate(usr: string) {
    let apiurl = environment.APIBaseUrl + 'StatisticQuizAmountByDate/' + usr;

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
    let options = new RequestOptions({ headers: headers }); // Create a request option
    this._http.get(apiurl, options)
      .map((response: Response) => {
        return response.json();
      })
      .subscribe(x => {
        if (x instanceof Array && x.length > 0) {
          this.dataQuizAmountByDate = [];

          for (let si of x) {
            let ent: any = {
              name: si.quizDate,
              value: Number(si.amount)
            };

            this.dataQuizAmountByDate.push(ent);
          }
        }
      });
  }
  
  private fetchQuizAmountByType(usr: string) {
    let apiurl = environment.APIBaseUrl + 'StatisticQuizAmountByType/' + usr;

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
          this.dataQuizAmountByType = [];
          for (let si of x) {
            console.log(si);
            let ent: any = {
              name: '{{' + QuizTypeEnum2UIString(si.quizType) + ' | translate}}',
              value: Number(si.amount)
            };

            this.dataQuizAmountByType.push(ent);
          }
        }
      });
  }

  private fetchQuizItemAmountByDate(usr: string) {
    let apiurl = environment.APIBaseUrl + 'StatisticQuizItemAmountByDate/' + usr;

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
          }
        }
      });
  }
  
  private fetchQuizItemAmountByType(usr: string) {
    let apiurl = environment.APIBaseUrl + 'StatisticQuizItemAmountByType/' + usr;

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
          }
        }
      });
  }
}
