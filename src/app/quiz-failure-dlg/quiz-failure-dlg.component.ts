import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { DialogService } from '../services/dialog.service';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { PrimarySchoolMathQuiz, PrimarySchoolMathQuizSection, PrimarySchoolMathQuizItem  } from '../model';

export interface QuizFailureInfo {
  qid: number;
  expected: string;
  inputted: string;
}

export class QuizFailureDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<QuizFailureInfo[]> = new BehaviorSubject<QuizFailureInfo[]>([]);
  get data(): QuizFailureInfo[] { return this.dataChange.value; }

  constructor(fis: PrimarySchoolMathQuizItem[]) {
    if (fis !== null && fis.length > 0) {
      for (const fi of fis) {
        this.addRecord({
          qid: fi.QuizIndex,
          expected: fi.getCorrectFormula(),
          inputted: fi.getInputtedForumla()
        });
      }
    }
  }

  addRecord(si: QuizFailureInfo) {
    const copiedData = this.data.slice();
    copiedData.push(si);
    this.dataChange.next(copiedData);
  }
}

export class QuizFailureDataSource extends DataSource<any> {
  constructor(private _quizDatabase: QuizFailureDatabase) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<QuizFailureInfo[]> {
    return this._quizDatabase.dataChange;
  }

  disconnect() { }
}

@Component({
  selector: 'app-quiz-failure-dlg',
  templateUrl: './quiz-failure-dlg.component.html',
  styleUrls: ['./quiz-failure-dlg.component.scss']
})
export class QuizFailureDlgComponent implements OnInit {
  displayedColumns = ['qid', 'expected', 'inputted'];
  quizDatabase: QuizFailureDatabase;
  dataSource: QuizFailureDataSource | null;
  currentScore: number;

  constructor(private _dlgsvc: DialogService) {
  }

  ngOnInit() {
    this.currentScore = this._dlgsvc.CurrentScore;
    this.quizDatabase = new QuizFailureDatabase(this._dlgsvc.FailureItems);

    // Workaround for https://github.com/angular/material2/issues/5593
    setTimeout(() => {
      this.dataSource = new QuizFailureDataSource(this.quizDatabase);
    }, 1);
  }
}
