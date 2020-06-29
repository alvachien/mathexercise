import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http';
import { DataSource } from '@angular/cdk/collections';
import {
  QuizTypeEnum, PrimarySchoolMathQuizItem, QuizTypeEnum2UIString, LogLevel, APIQuizSection, APIQuizFailLog, APIQuiz,
  AdditionQuizItem, SubtractionQuizItem, MultiplicationQuizItem, DivisionQuizItem, DateFormat, QuizTypeUI, DateRangeUI,
  StatisticsDateRange, StatisticsDateRangeEnum, getAllStaticsDateRangeEnumStrings, getStatisticsDateRangeDate, GetAllQuizTypeUIStrings,
} from '../model';
import { AuthService, QuizAttendUser, UserDetailService } from '../services';
import { environment } from '../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, BehaviorSubject, from, of, merge } from 'rxjs';
import { concatAll, every, last as lastValue, map, mergeAll } from 'rxjs/operators';
import * as moment from 'moment';
import { translate } from '@ngneat/transloco';
import { quantileSeq } from 'mathjs';

/**
 * Quiz data source
 */
export class QuizDataSource extends DataSource<APIQuiz> {
  constructor(private _parentComponent: UsNormalComponent,
    private _paginator: MatPaginator,
    private _sort: MatSort) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<APIQuiz[]> {
    const displayDataChanges = [
      this._parentComponent.listQuizSubject,
      this._paginator.page,
      this._sort.sortChange,
    ];

    const mgerst = merge(...displayDataChanges);

    return mgerst.pipe(map(() => {
      const data = this.getSortedData();

      // Grab the page's slice of data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return data.splice(startIndex, this._paginator.pageSize);
    }));
  }

  disconnect() { }

  /** Returns a sorted copy of the database data. */
  getSortedData(): APIQuiz[] {
    const data = this._parentComponent.Quizs.slice();
    if (!this._sort.active || this._sort.direction === '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'QuizID': [propertyA, propertyB] = [a.quizID, b.quizID]; break;
        case 'Date': [propertyA, propertyB] = [a.submitDate, b.submitDate]; break;
        case 'QuizType': [propertyA, propertyB] = [a.quizType, b.quizType]; break;
        case 'Score': [propertyA, propertyB] = [a.TotalScore, b.TotalScore]; break;
        case 'TimeSpent': [propertyA, propertyB] = [a.TotalAverageTime, b.TotalAverageTime]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}

@Component({
  selector: 'app-us-normal',
  templateUrl: './us-normal.component.html',
  styleUrls: ['./us-normal.component.scss']
})
export class UsNormalComponent implements OnInit, AfterViewInit {
  listUsers: QuizAttendUser[] = [];
  curUser = '';
  listRanges: DateRangeUI[] = [];
  curRange: StatisticsDateRangeEnum = StatisticsDateRangeEnum.CurrentMonth;
  listqtype: QuizTypeUI[] = [];
  colorSchemeGeneral = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#BBBBBB', '#CCCCCC', '#AA0000', '#00AA00', '#0000AA']
  };
  public listQuizSubject: BehaviorSubject<APIQuiz[]> = new BehaviorSubject<APIQuiz[]>([]);
  get Quizs(): APIQuiz[] {
    return this.listQuizSubject.value;
  }
  displayedColumns = ['QuizID', 'Date', 'QuizType', 'Score', 'TimeSpent'];
  dataSource: QuizDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  viewGraph: any[] = [700, 400];
  // Quiz amount by date
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

  // Item amount by date
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
    private _authService: AuthService,
    private _userDetailService: UserDetailService) {
    // Get Quiz type display string
    let arstrs: string[] = [];
    this.listqtype = GetAllQuizTypeUIStrings();
    this.listqtype.forEach(value => {
      arstrs.push(value.i18term);
    });

    // Translate for quiz type
    for (const qtu of this.listqtype) {
      qtu.display = translate(qtu.i18term);
    }

    // Get date range display tring
    this.listRanges = getAllStaticsDateRangeEnumStrings();

    // Other strings
    arstrs = ['Home.Amount', 'Home.Type', 'Home.Date', 'Home.CorrectedAmount', 'FailedAmount'];
    this.xAxisLabelQuizAmountByDate = translate('Home.Date');
    this.yAxisLabelQuizAmountByDate = translate('Home.Amount');
    this.xAxisLabelItemAmountByDate = translate('Home.Date');
    this.yAxisLabelItemAmountByDate = translate('Home.Amount');
    this.xAxisLabelItemAmountByType = translate('Home.Type');
    this.yAxisLabelItemAmountByType = translate('Home.Amount');

    // Attended user
    this._userDetailService.fetchAllUsers().subscribe((listUsrs) => {
      if (listUsrs !== null && listUsrs !== undefined || listUsrs.length > 0) {
        this.listUsers = listUsrs;
      }
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataSource = new QuizDataSource(this, this.paginator, this.sort);
  }

  public onUserChanged(evnt: any) {
    if (this.curUser !== undefined && this.curUser !== null && this.curUser.length > 0) {
      this.fetchQuizData();
    }
  }
  public onDateRangeChanged(event: any) {
    if (this.curUser !== undefined && this.curUser !== null && this.curUser.length > 0) {
      this.fetchQuizData();
//   this.dataTrendSucceedRate = [{
//     name: "加法练习",
//     series: [{
//       name: "4", value: 100
//     }, {
//       name: "5", value: 80
//     }, {
//       name: "7", value: 100
//     }, {
//       name: "10", value: 90
//     }]
//   }, {
//     name: "减法练习",
//     series: [
//       {name: "6", value: 100},
//       {name: "8", value: 100}
//     ]
//   }];
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

  private fetchQuizData() {
    const apiurl = environment.APIBaseUrl + 'quiz';
    const { BeginDate: bgn, EndDate: end } = getStatisticsDateRangeDate(this.curRange);

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
    let params = new HttpParams();
    params = params.set('usrid', this.curUser);
    params = params.set('dtBegin', bgn.format(DateFormat));
    params = params.set('dtEnd', end.format(DateFormat));
    this._http.get(apiurl, {
      headers: headers,
      params: params,
      withCredentials: true
    }).pipe(
      map((response: HttpResponse<any>) => {
        return <any>response;
      }))
      .subscribe(x => {
        const ndata: APIQuiz[] = [];
        this.dataQuizAmountByDate = [];
        this.dataQuizAmountByType = [];
        this.dataItemAmountByDate = [];
        this.dataItemAmountByType = [];

        if (x instanceof Array && x.length > 0) {
          for (const si of x) {
            const aq: APIQuiz = new APIQuiz();
            aq.TotalScore = +si.totalScore;
            aq.TotalAverageTime = +si.totalAverageTime;
            aq.basicInfo = si.basicInfo;

            for (const flog of si.failLogs) {
              const fl = new APIQuizFailLog();
              fl.expected = flog.expected;
              fl.inputted = flog.inputted;
              fl.quizFailIndex = flog.quizFailIndex;
              aq.failLogs.push(flog);
            }

            aq.quizID = +si.quizID;
            aq.quizType = +si.quizType;
            aq.submitDate = si.submitDate;

            let itemtotalamt = 0;
            let failtotalamt = 0;
            for (const sec of si.sections) {
              const sc = new APIQuizSection();
              sc.failedItems = sec.failedItems;
              sc.sectionID = sec.sectionID;
              sc.timeSpent = sec.timeSpent;
              sc.totalItems = sec.totalItems;

              failtotalamt += sc.failedItems;
              itemtotalamt += sc.totalItems;
              aq.sections.push(sc);
            }

            // Amount by date
            let idx = this.dataQuizAmountByDate.findIndex((val) => {
              return val.name === aq.submitDate;
            });
            if (idx === -1) {
              this.dataQuizAmountByDate.push({
                name: aq.submitDate,
                value: 1
              });

              this.dataItemAmountByDate.push({
                name: aq.submitDate,
                series: [{
                  name: 'Success',
                  value: itemtotalamt - failtotalamt,
                },
                {
                  name: 'Failed',
                  value: itemtotalamt - failtotalamt,
                }]
              });
            } else {
              this.dataQuizAmountByDate[idx].value++;
              this.dataItemAmountByDate[idx].series[0].value += (itemtotalamt - failtotalamt);
              this.dataItemAmountByDate[idx].series[1].value += failtotalamt;
            }

            // Amount by type
            idx = this.dataQuizAmountByType.findIndex(val => {
              return val.quizType === aq.quizType;
            });
            if (idx === -1) {
              let typename = '';
              for (const qtu of this.listqtype) {
                if (qtu.qtype === <QuizTypeEnum>(+aq.quizType)) {
                  typename = qtu.display;
                }
              }

              this.dataQuizAmountByType.push({
                quizType: aq.quizType,
                name: typename,
                value: 1
              });

              this.dataItemAmountByType.push({
                name: typename,
                series: [{
                  name: 'Success',
                  value: itemtotalamt - failtotalamt,
                },
                {
                  name: 'Failed',
                  value: itemtotalamt - failtotalamt,
                }]
              });
            } else {
              this.dataQuizAmountByType[idx].value++;
              this.dataItemAmountByType[idx].series[0].value += (itemtotalamt - failtotalamt);
              this.dataItemAmountByType[idx].series[1].value += failtotalamt;
            }

            ndata.push(aq);
          }
        }

        this.listQuizSubject.next(ndata);
      });
  }
}
