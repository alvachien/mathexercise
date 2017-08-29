import { Component, OnInit } from '@angular/core';
import {
  PrimarySchoolMathQuiz, PrimarySchoolMathQuizSection, AdditionQuizItem,
  DefaultQuizAmount, DefaultFailedQuizFactor, QuizTypeEnum
} from '../model';
import { MdDialog } from '@angular/material';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material';
import { DialogService } from '../services/dialog.service';
import { QuizSummaryComponent } from '../quiz-summary/quiz-summary.component';
import { environment } from '../../environments/environment';
import { LogLevel, UserAuthInfo } from '../model';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { QuizFailureDlgComponent } from '../quiz-failure-dlg/quiz-failure-dlg.component';

@Component({
  selector: 'app-addition-exercise',
  templateUrl: './addition-exercise.component.html',
  styleUrls: ['./addition-exercise.component.scss']
})
export class AdditionExerciseComponent implements OnInit {
  StartQuizAmount: number = DefaultQuizAmount;
  FailedQuizFactor: number = DefaultFailedQuizFactor;
  UsedQuizAmount: number = 0;

  LeftNumberRangeBgn: number = 1;
  LeftNumberRangeEnd: number = 10;
  RightNumberRangeBgn: number = 1;
  RightNumberRangeEnd: number = 10;

  quizInstance: PrimarySchoolMathQuiz = null;
  QuizItems: AdditionQuizItem[] = [];
  DisplayedQuizItems: AdditionQuizItem[] = [];

  //pageEvent: PageEvent;
  pageSize: number;
  pageIndex: number;

  constructor(private dialog: MdDialog,
    private _dlgsvc: DialogService,
    private _router: Router) {
    this.quizInstance = new PrimarySchoolMathQuiz();
    this.quizInstance.QuizType = QuizTypeEnum.add;
  }

  ngOnInit() {
    // Reset the used quiz amount
    this.UsedQuizAmount = 0;
    this.pageSize = 10;
    this.pageIndex = 0;
  }

  private generateQuizItem(idx: number): AdditionQuizItem {
    let qz: AdditionQuizItem = new AdditionQuizItem(Math.floor(Math.random() * (this.LeftNumberRangeEnd - this.LeftNumberRangeBgn) + this.LeftNumberRangeBgn),
      Math.floor(Math.random() * (this.RightNumberRangeEnd - this.RightNumberRangeBgn) + this.RightNumberRangeBgn));
    qz.QuizIndex = idx;
    return qz;
  }

  private generateQuizSection() {
    this.QuizItems = [];

    for (let i = 0; i < this.quizInstance.CurrentRun().ItemsCount; i++) {
      let dq: AdditionQuizItem = this.generateQuizItem(this.UsedQuizAmount + i + 1);

      this.QuizItems.push(dq);
    }
    this.UsedQuizAmount += this.QuizItems.length;
  }

  public canDeactivate(): boolean {
    if (this.quizInstance.IsStarted) {
      this._dlgsvc.MessageDialogHeader = 'Home.Error';
      this._dlgsvc.MessageDialogContent = 'Home.QuizIsOngoing';
      let dialogRef = this.dialog.open(MessageDialogComponent, {
        disableClose: false,
        width: '500px'
      });

      dialogRef.afterClosed().subscribe(x => {
        // Do nothing!
      });
      return false;
    }

    return true;
  }

  public onPageChanged($event: PageEvent) {
    this.pageSize = $event.pageSize;
    this.pageIndex = $event.pageIndex;

    this.submitCurrentPage();
    this.prepareCurrentPage();
  }

  private submitCurrentPage() {
    if (this.DisplayedQuizItems.length > 0) {
      for (let qi of this.DisplayedQuizItems) {
        for (let qi2 of this.QuizItems) {
          if (qi.QuizIndex === qi2.QuizIndex) {
            qi2.InputtedResult = qi.InputtedResult;
            break;
          }
        }
      }
    }
  }

  private prepareCurrentPage() {
    let pageStart = this.pageIndex * this.pageSize;
    let pageEnd = pageStart + this.pageSize;

    this.DisplayedQuizItems = [];
    for (let i = 0; i < this.QuizItems.length; i++) {
      if (i >= pageStart && i < pageEnd) {
        this.DisplayedQuizItems.push(this.QuizItems[i]);
      }
    }
  }

  public onQuizItemTrackBy(index: number, item: any) {
    return item.QuizIndex;
  }

  public CanStart(): boolean {
    if (this.StartQuizAmount <= 0) {
      return false;
    }

    if (this.quizInstance.IsStarted) {
      return false;
    }

    return true;
  }
  public onQuizStart(): void {
    // Start it!
    this.quizInstance.BasicInfo = '[' + this.LeftNumberRangeBgn.toString() + '...' + this.LeftNumberRangeEnd.toString() + ']'
      + ' + [' + this.RightNumberRangeBgn.toString() + '...' + this.RightNumberRangeEnd.toString() + ']';
    this.quizInstance.Start(this.StartQuizAmount, this.FailedQuizFactor);

    // Generated section
    this.generateQuizSection();
    this.pageIndex = 0;
    this.prepareCurrentPage();

    // Current run
    this.quizInstance.CurrentRun().SectionStart();
  }

  public CanSubmit(): boolean {
    if (!this.quizInstance.IsStarted) {
      return false;
    }

    if (this.QuizItems.length <= 0) {
      return false;
    }

    this.submitCurrentPage();
    for (let quiz of this.QuizItems) {
      if (quiz.InputtedResult === undefined
        || quiz.InputtedResult === null) {
        return false;
      }
    }

    return true;
  }

  public onQuizSubmit(): void {
    this._dlgsvc.FailureItems = [];
    for (let quiz of this.QuizItems) {
      if (!quiz.IsCorrect()) {
        this._dlgsvc.FailureItems.push(quiz);
      }
    }

    if (this._dlgsvc.FailureItems.length > 0) {
      this._dlgsvc.CurrentScore = Math.round(100 - 100 * this._dlgsvc.FailureItems.length / this.QuizItems.length);
      let dialogRef = this.dialog.open(QuizFailureDlgComponent, {
        disableClose: false,
        width: '500px'
      });

      dialogRef.afterClosed().subscribe(x => {
        this.quizInstance.SubmitCurrentRun(this._dlgsvc.FailureItems);

        this.generateQuizSection();
        this.pageIndex = 0;
        this.prepareCurrentPage();

        // Current run
        this.quizInstance.CurrentRun().SectionStart();
      });
    } else {
      // Succeed!
      this.quizInstance.SubmitCurrentRun();

      this._dlgsvc.CurrentQuiz = this.quizInstance;
      // for (let run of this.quizInstance.ElderRuns()) {
      //   this._dlgsvc.SummaryInfos.push(run.getSummaryInfo());
      // }

      this._router.navigate(['/quiz-sum']);
    }
  }
}
