import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { DialogService } from '../dialog.service';
import { DataSource } from '@angular/cdk';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { PrimarySchoolMathQuiz, PrimarySchoolMathQuizSection, MultiplicationQuizItem } from '../model';
import { slideInOutAnimation } from '../animation';
import { environment } from '../../environments/environment';

export interface QuizSummaryInfo {
  id: number;
  totalamt: number;
  failedamt: number;
  timespent: number;
  avgtimespent: number;
}

export class QuizSummaryDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<QuizSummaryInfo[]> = new BehaviorSubject<QuizSummaryInfo[]>([]);
  get data(): QuizSummaryInfo[] { return this.dataChange.value; }

  constructor(quiz: PrimarySchoolMathQuiz) {
    if (quiz !== null) {
      for (let run of quiz.ElderRuns()) {
        this.addSummary({
          id: run.SectionNumber,
          totalamt: run.ItemsCount,
          failedamt: run.ItemsFailed,
          timespent: run.TimeSpent,
          avgtimespent: Math.round(run.TimeSpent / run.ItemsCount)
        });
      }
    }
  }

  addSummary(si: QuizSummaryInfo) {
    const copiedData = this.data.slice();
    copiedData.push(si);
    this.dataChange.next(copiedData);
  }
  // resetSummaries() {
  //   const copiedData = this.data.slice();
  //   if (copiedData.length > 0) {
  //     copiedData.splice(0);
  //     this.dataChange.next(copiedData);
  //   }
  // }
}

export class QuizSummaryDataSource extends DataSource<any> {
  constructor(private _quizDatabase: QuizSummaryDatabase) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<QuizSummaryInfo[]> {
    return this._quizDatabase.dataChange;
  }

  disconnect() { }
}

@Component({
  selector: 'app-quiz-summary',
  templateUrl: './quiz-summary.component.html',
  styleUrls: ['./quiz-summary.component.scss'],
  // make slide in/out animation available to this component
  //animations: [slideInOutAnimation],

  // attach the slide in/out animation to the host (root) element of this component
  //host: { '[@slideInOutAnimation]': '' }
})
export class QuizSummaryComponent implements OnInit {
  displayedColumns = ['runid', 'totalamt', 'failedamt', 'timespent', 'avgtimespent'];
  quizDatabase: QuizSummaryDatabase;
  dataSource: QuizSummaryDataSource | null;

  constructor(private _dlgsvc: DialogService,
    private _http: Http) {
  }

  ngOnInit() {
    this.quizDatabase = new QuizSummaryDatabase(this._dlgsvc.CurrentQuiz);
    // Workaround for https://github.com/angular/material2/issues/5593
    setTimeout(() => {
      this.dataSource = new QuizSummaryDataSource(this.quizDatabase);
    }, 1);
  }

  public onSave(): void {
    // Save it to DB
    let apiurl = environment.APIBaseUrl + 'Quiz';

    let result:any = {};
    result.quizType = this._dlgsvc.CurrentQuiz.QuizType;
    result.submitDate = new Date();
    result.attendUser = 'test';

    result.failLogs = [];
    for(let fl of this._dlgsvc.CurrentQuiz.FailedItems) {
      let flog: any = {};
      flog.quizFailIndex = fl.QuizIndex;
      flog.expected = fl.getCorrectFormula();
      flog.inputted = fl.getInputtedForumla();
      result.failLogs.push(flog);
    }

    result.sections = [];
    for(let qs of this._dlgsvc.CurrentQuiz.ElderRuns()) {
      let qsect: any = {};
      qsect.sectionID = qs.SectionNumber;
      qsect.timeSpent = qs.TimeSpent;
      qsect.totalItems = qs.ItemsCount;
      qsect.failedItems = qs.ItemsFailed;
      result.sections.push(qsect);
    }
    let data = JSON && JSON.stringify(result);

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    //headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
    let options = new RequestOptions({ headers: headers }); // Create a request option
    this._http.post(apiurl, data, options)
      .map((response: Response) => {
        console.log(response);
        return response.json();
      })
      .subscribe(x => {
        console.log(x);
      });
  }
}
