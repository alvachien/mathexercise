import { Component, OnInit } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import {
  QuizTypeEnum, PrimarySchoolMathQuizItem, QuizTypeEnum2UIString, LogLevel,
  AdditionQuizItem, SubtractionQuizItem, MultiplicationQuizItem, DivisionQuizItem
} from '../model';
import { environment } from '../../environments/environment';
import { QuizAttendUser, UserDetailService } from '../services/userdetail.service';

export interface quiztypeui {
  qtype: QuizTypeEnum;
  i18term: string;
  display: string;
}

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

  listUsers: QuizAttendUser[] = [];
  curUser = '';
  listqtype: quiztypeui[] = [];
  colorSchemeGeneral = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#BBBBBB', '#CCCCCC']
  };

  // Quiz amount by date
  viewQuizAmountByDate: any[] = [700, 400];
  showXAxisQuizAmountByDate = true;
  showYAxisQuizAmountByDate = true;
  gradientQuizAmountByDate = false;
  showLegendQuizAmountByDate = true;
  showXAxisLabelQuizAmountByDate = true;
  xAxisLabelQuizAmountByDate = 'Date';
  showYAxisLabelQuizAmountByDate = true;
  yAxisLabelQuizAmountByDate = 'Amount';
  dataQuizAmountByDate: any[] = [];

  // Quiz amount by type
  dataQuizAmountByType: any[] = [];
  viewQuizAmountByType: any[] = [700, 400];

  // Item amount by date
  viewItemAmountByDate: any[] = [700, 400];
  showXAxisItemAmountByDate = true;
  showYAxisItemAmountByDate = true;
  gradientItemAmountByDate = false;
  showLegendItemAmountByDate = true;
  showXAxisLabelItemAmountByDate = true;
  xAxisLabelItemAmountByDate = 'Date';
  showYAxisLabelItemAmountByDate = true;
  yAxisLabelItemAmountByDate = 'Amount';
  dataItemAmountByDate: any[] = [];

  // Item amount by type
  viewItemAmountByType: any[] = [700, 400];
  showXAxisItemAmountByType = true;
  showYAxisItemAmountByType = true;
  gradientItemAmountByType = false;
  showLegendItemAmountByType = true;
  showXAxisLabelItemAmountByType = true;
  xAxisLabelItemAmountByType = 'Type';
  showYAxisLabelItemAmountByType = true;
  yAxisLabelItemAmountByType = 'Amount';
  dataItemAmountByType: any[] = [];

  constructor(private _http: HttpClient,
    private _tranService: TranslateService,
    private _authService: AuthService,
    private _userDetailService: UserDetailService) {
    // Object.assign(this, {single});
    this.curUser = '';

    // Get Quiz type display string
    let arstrs: string[] = [];
    for (const fe in QuizTypeEnum) {
      if (isNaN(Number(fe))) {
      } else {
        const astr = QuizTypeEnum2UIString(Number(fe));
        arstrs.push(astr);

        const qtu = {
          qtype: Number(fe),
          i18term: astr,
          display: ''
        };
        this.listqtype.push(qtu);
      }
    }

    // Translate for quiz type
    this._tranService.get(arstrs).subscribe(x => {
      for (const tran in x) {
        for (const qtu of this.listqtype) {
          if (tran === qtu.i18term) {
            qtu.display = x[tran];
          }
        }
      }
    });

    // Other strings
    arstrs = ['Home.Amount', 'Home.Type', 'Home.Date', 'Home.CorrectedAmount', 'FailedAmount'];
    this._tranService.get(arstrs).subscribe(x => {
      this.xAxisLabelQuizAmountByDate = x['Home.Date'];
      this.yAxisLabelQuizAmountByDate = x['Home.Amount'];
      this.xAxisLabelItemAmountByDate = x['Home.Date'];
      this.yAxisLabelItemAmountByDate = x['Home.Amount'];
      this.xAxisLabelItemAmountByType = x['Home.Type'];
      this.yAxisLabelItemAmountByType = x['Home.Amount'];
    });

    // Attended user
    this._userDetailService.fetchAllUsers().subscribe((listUsrs) => {
      if (listUsrs !== null && listUsrs !== undefined  || listUsrs.length > 0) {
        this.listUsers = listUsrs;
      }
    });
  }

  ngOnInit() {
  }

  public onUserChanged(evnt: any) {
    if (this.curUser !== undefined && this.curUser !== null && this.curUser.length > 0) {
      this.fetchQuizAmountByDate(this.curUser);
      this.fetchQuizAmountByType(this.curUser);
      this.fetchQuizItemAmountByDate(this.curUser);
      this.fetchQuizItemAmountByType(this.curUser);
    }
  }

  public onQuizAmountByDateSelect(evnt: any) {

  }

  public onQuizAmountByTypeSelect(evnt: any) {

  }

  public onItemAmountByDateSelect(evnt: any) {

  }

  public onItemAmountByTypeSelect(evnt: any) {

  }

  private fetchQuizAmountByDate(usr: string) {
    const apiurl = environment.APIBaseUrl + 'StatisticQuizAmountByDate/' + usr;

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
              .append('Accept', 'application/json')
              .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
    this._http.get(apiurl, {
        headers: headers,
        withCredentials: true
      })
      .map((response: HttpResponse<any>) => {
        return <any>response;
      })
      .subscribe(x => {
        if (x instanceof Array && x.length > 0) {
          this.dataQuizAmountByDate = [];

          for (const si of x) {
            const ent: any = {
              name: si.quizDate,
              value: Number(si.amount)
            };

            this.dataQuizAmountByDate.push(ent);
          }
        }
      });
  }

  private fetchQuizAmountByType(usr: string) {
    const apiurl = environment.APIBaseUrl + 'StatisticQuizAmountByType/' + usr;

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
              .append('Accept', 'application/json')
              .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
    this._http.get(apiurl, {
        headers: headers,
        withCredentials: true
      })
      .map((response: HttpResponse<any>) => {
        return <any>response;
      })
      .subscribe(x => {
        if (x instanceof Array && x.length > 0) {
          this.dataQuizAmountByType = [];
          for (const si of x) {
            let name = '';
            for (const qtu of this.listqtype) {
              if (qtu.qtype === Number(si.quizType)) {
                name = qtu.display;
              }
            }
            const ent: any = {
              name: name,
              value: Number(si.amount)
            };

            this.dataQuizAmountByType.push(ent);
          }
        }
      });
  }

  private fetchQuizItemAmountByDate(usr: string) {
    const apiurl = environment.APIBaseUrl + 'StatisticQuizItemAmountByDate/' + usr;

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
              .append('Accept', 'application/json')
              .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
    this._http.get(apiurl, {
        headers: headers,
        withCredentials: true
      })
      .map((response: HttpResponse<any>) => {
        return <any>response;
      })
      .subscribe(x => {
        this.dataItemAmountByDate = [];
        if (x instanceof Array && x.length > 0) {
          for (const si of x) {
            const rst = {
              name: si.quizDate,
              series: [
                {
                  name: 'Success',
                  value: si.totalAmount - si.failedAmount
                },
                {
                  name: 'Failed',
                  value: si.failedAmount
                }
              ]
            };
            this.dataItemAmountByDate.push(rst);
          }
        }
      });
  }

  private fetchQuizItemAmountByType(usr: string) {
    const apiurl = environment.APIBaseUrl + 'StatisticQuizItemAmountByType/' + usr;

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
              .append('Accept', 'application/json')
              .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
    this._http.get(apiurl, {
        headers: headers,
        withCredentials: true
      })
      .map((response: HttpResponse<any>) => {
        return <any>response;
      })
      .subscribe(x => {
        this.dataItemAmountByType = [];
        if (x instanceof Array && x.length > 0) {
          for (const si of x) {
            let name = '';
            for (const qtu of this.listqtype) {
              if (qtu.qtype === Number(si.quizType)) {
                name = qtu.display;
              }
            }
            const rst = {
              name: name,
              series: [{
                  name: 'Success',
                  value: si.totalAmount - si.failedAmount
                }, {
                  name: 'Failed',
                  value: si.failedAmount
                }
              ]
            };
            this.dataItemAmountByType.push(rst);
          }
        }
      });
  }
}
