import { Component, OnInit } from '@angular/core';
import { DialogService } from '../dialog.service';
import { DataSource } from '@angular/cdk';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { PrimarySchoolMathQuiz, PrimarySchoolMathQuizSection, MultiplicationQuizItem } from '../model';
import { slideInOutAnimation } from '../animation';

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
  animations: [slideInOutAnimation],

  // attach the slide in/out animation to the host (root) element of this component
  // host: { '[@slideInOutAnimation]': '' }
})
export class QuizSummaryComponent implements OnInit {
  displayedColumns = ['runid', 'totalamt', 'failedamt', 'timespent', 'avgtimespent'];
  quizDatabase: QuizSummaryDatabase;
  dataSource: QuizSummaryDataSource | null;

  constructor(private _dlgsvc: DialogService) {
  }

  ngOnInit() {
    this.quizDatabase = new QuizSummaryDatabase(this._dlgsvc.CurrentQuiz);
    // Workaround for https://github.com/angular/material2/issues/5593
    setTimeout(() => {
      this.dataSource = new QuizSummaryDataSource(this.quizDatabase);
    }, 1);
  }
}
