import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http';
import { DataSource } from '@angular/cdk/collections';
import { TranslateService } from '@ngx-translate/core';
import {
  QuizTypeEnum, PrimarySchoolMathQuizItem, QuizTypeEnum2UIString, LogLevel, APIQuizSection, APIQuizFailLog, APIQuiz,
  AdditionQuizItem, SubtractionQuizItem, MultiplicationQuizItem, DivisionQuizItem, DateFormat, QuizTypeUI, DateRangeUI,
  StatisticsDateRange, StatisticsDateRangeEnum, getAllStaticsDateRangeEnumStrings, getStatisticsDateRangeDate, GetAllQuizTypeUIStrings
} from '../model';
import { AuthService, QuizAttendUser, UserDetailService } from '../services';
import { environment } from '../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { map, merge, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-us-trend',
  templateUrl: './us-trend.component.html',
  styleUrls: ['./us-trend.component.scss']
})
export class UsTrendComponent implements OnInit {
  listUsers: QuizAttendUser[] = [];
  curUser = '';
  listRanges: DateRangeUI[] = [];
  curRange: StatisticsDateRangeEnum = StatisticsDateRangeEnum.CurrentMonth;
  listqtype: QuizTypeUI[] = [];

  // Trend of succeed rate
  dataTrendSucceedRate: any[] = [];

  // Trend of timespent
  dataTrendTimeSpent: any[] = [];
  colorSchemeGeneral = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#BBBBBB', '#CCCCCC', '#AA0000', '#00AA00', '#0000AA']
  };
  viewGraph: any[] = [700, 400];

  constructor(private _http: HttpClient,
    private _tranService: TranslateService,
    private _authService: AuthService,
    private _userDetailService: UserDetailService) {
    // Get Quiz type display string
    const arstrs: string[] = [];
    this.listqtype = GetAllQuizTypeUIStrings();
    this.listqtype.forEach(value => {
      arstrs.push(value.i18term);
    });

    // Translate for quiz type
    this._tranService.get(arstrs).subscribe(x => {
      for (const tran of x) {
        for (const qtu of this.listqtype) {
          if (tran === qtu.i18term) {
            qtu.display = x[tran];
          }
        }
      }
    });

    // Get date range display tring
    this.listRanges = getAllStaticsDateRangeEnumStrings();

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
      this.fetchTrendData();
    }
  }
  public onDateRangeChanged(event: any) {
    if (this.curUser !== undefined && this.curUser !== null && this.curUser.length > 0) {
      this.fetchTrendData();
    }
  }

  private fetchTrendData() {
    this.dataTrendSucceedRate = [];
    this.dataTrendTimeSpent = [];

    const apistattime = environment.APIBaseUrl + 'StatisticQuizTime';
    const apistatsrate = environment.APIBaseUrl + 'StatisticQuizRate';
    const { BeginDate: bgn,  EndDate: end }  = getStatisticsDateRangeDate(this.curRange);

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
              .append('Accept', 'application/json')
              .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
    let params = new HttpParams();
    params = params.set('usrid', this.curUser);
    params = params.set('dtBegin', bgn.format(DateFormat));
    params = params.set('dtEnd', end.format(DateFormat));

    forkJoin(
      this._http.get(apistatsrate, {
        headers: headers,
        params: params,
        withCredentials: true
      }),
      this._http.get(apistattime, {
        headers: headers,
        params: params,
        withCredentials: true
      }),
    ).subscribe(x => {
      if (x[0]) {
        // Succeed rate
        if (x[0] instanceof Array) {
          const sdata: any[] = <any[]>x[0];
          for (const si of sdata) {
            let typename = '';
            for (const qtu of this.listqtype) {
              if (qtu.qtype === <QuizTypeEnum>(+si.quizType)) {
                typename = qtu.display;
                break;
              }
            }

            const idx = this.dataTrendSucceedRate.findIndex((val) => {
              return val.name === typename;
            });
            if (idx === -1) {
              this.dataTrendSucceedRate.push({
                name: typename,
                series: [
                  {
                    name: si.quizID.toString(),
                    value: si.succeedRate,
                  },
                ]
              })
            } else  {
              this.dataTrendSucceedRate[idx].series.push({
                name: si.quizID.toString(),
                value: si.succeedRate,
              });
            }
          }
        }
      }

      if (x[1]) {
        // Timespent
        if (x[1] instanceof Array) {
          const sdata: any[] = <any[]>x[1];
          for (const si of sdata) {
            let typename = '';
            for (const qtu of this.listqtype) {
              if (qtu.qtype === <QuizTypeEnum>(+si.quizType)) {
                typename = qtu.display;
                break;
              }
            }

            const idx = this.dataTrendTimeSpent.findIndex((val) => {
              return val.name === typename;
            });
            if (idx === -1) {
              this.dataTrendTimeSpent.push({
                name: typename,
                series: [
                  {
                    name: si.quizID.toString(),
                    value: si.timeSpent,
                  },
                ]
              })
            } else  {
              this.dataTrendTimeSpent[idx].series.push({
                name: si.quizID.toString(),
                value: si.timeSpent,
              });
            }
          }
        }
      }
    });
  }
}
