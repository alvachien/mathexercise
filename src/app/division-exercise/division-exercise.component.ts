import { Component, OnInit } from '@angular/core';
import { PrimarySchoolMathQuiz, PrimarySchoolMathQuizSection, DivisionQuizItem,
  DefaultQuizAmount, DefaultFailedQuizFactor, QuizTypeEnum, LogLevel } from '../model';
import { MatDialog } from '@angular/material';
import { DialogService } from '../services/dialog.service';
import { QuizFailureDlgComponent } from '../quiz-failure-dlg/quiz-failure-dlg.component';
import { QuizSummaryComponent } from '../quiz-summary/quiz-summary.component';
import { Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { PageEvent } from '@angular/material';
import { MessageDialogButtonEnum, MessageDialogInfo, MessageDialogComponent } from '../message-dialog';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-division-exercise',
  templateUrl: './division-exercise.component.html',
  styleUrls: ['./division-exercise.component.scss']
})
export class DivisionExerciseComponent implements OnInit {
  StartQuizAmount: number = DefaultQuizAmount;
  FailedQuizFactor: number = DefaultFailedQuizFactor;

  DivisorRangeBgn = 1;
  DivisorRangeEnd = 100;
  DividendRangeBgn = 500;
  DividendRangeEnd = 1000;
  decimalPlaces = 0;

  quizInstance: PrimarySchoolMathQuiz = null;
  QuizItems: DivisionQuizItem[] = [];
  DisplayedQuizItems: DivisionQuizItem[] = [];
  UsedQuizAmount = 0;

  pageSize: number;
  pageIndex: number;

  constructor(private dialog: MatDialog,
    private _dlgsvc: DialogService,
    private _router: Router) {
    this.quizInstance = new PrimarySchoolMathQuiz();
    this.quizInstance.QuizType = QuizTypeEnum.div;
  }

  ngOnInit() {
    // Reset the used quiz amount
    this.UsedQuizAmount = 0;
    this.pageSize = 10;
    this.pageIndex = 0;
  }

  private generateQuizItem(nIdx: number): DivisionQuizItem {
    const rnum1 = Math.random() * (this.DividendRangeEnd - this.DividendRangeBgn) + this.DividendRangeBgn;
    const rnum2 = Math.random() * (this.DivisorRangeEnd - this.DivisorRangeBgn) + this.DivisorRangeBgn;
    const dq: DivisionQuizItem = new DivisionQuizItem(rnum1, rnum2, this.decimalPlaces);
    dq.QuizIndex = nIdx;

    return dq;
  }

  private generateQuizSection() {
    this.QuizItems = [];

    for (let i = 0; i < this.quizInstance.CurrentRun().ItemsCount; i++) {
      const dq: DivisionQuizItem = this.generateQuizItem(this.UsedQuizAmount + i + 1);

      this.QuizItems.push(dq);
    }
    this.UsedQuizAmount += this.QuizItems.length;
  }

  public canDeactivate(): boolean {
    if (this.quizInstance.IsStarted) {
      const dlginfo: MessageDialogInfo = {
        Header: 'Home.Error',
        Content: 'Home.QuizIsOngoing',
        Button: MessageDialogButtonEnum.onlyok
      };

      this.dialog.open(MessageDialogComponent, {
        disableClose: false,
        width: '500px',
        data: dlginfo
      }).afterClosed().subscribe(x => {
        // Do nothing!
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log(`AC Math Exercise [Debug]: Message dialog result ${x}`);
        }
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
    if (this.DisplayedQuizItems.length > 0 ) {
      for (const qi of this.DisplayedQuizItems) {
        for (const qi2 of this.QuizItems) {
          if (qi.QuizIndex === qi2.QuizIndex) {
            qi2.InputtedQuotient = qi.InputtedQuotient;
            qi2.InputtedRemainder = qi.InputtedRemainder;
            break;
          }
        }
      }
    }
  }

  private prepareCurrentPage() {
    const pageStart = this.pageIndex * this.pageSize;
    const pageEnd = pageStart + this.pageSize;

    this.DisplayedQuizItems = [];
    for (let i = 0; i < this.QuizItems.length; i ++) {
      if (i >= pageStart && i < pageEnd) {
        this.DisplayedQuizItems.push(this.QuizItems[i]);
      }
    }
  }

  public onQuizItemTrackBy(index: number, item: any) {
    return item.QuizIndex;
  }

  public CanStart(): boolean {
    if (this.StartQuizAmount <= 0 || this.DividendRangeBgn <= 0
      || this.DividendRangeEnd <= this.DividendRangeBgn
      || this.DivisorRangeBgn <= 0
      || this.DivisorRangeEnd <= this.DivisorRangeBgn) {
      return false;
    }

    if (this.quizInstance.IsStarted) {
      return false;
    }

    return true;
  }

  public onQuizStart(): void {
    // Start it!
    this.quizInstance.BasicInfo = '[' + this.DivisorRangeBgn.toString() + '...' + this.DivisorRangeEnd.toString() + ']'
      + ' ÷ [' + this.DividendRangeBgn.toString() + '...' + this.DividendRangeEnd.toString() + ']';
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
    for (const quiz of this.QuizItems) {
      if (quiz.InputtedQuotient === undefined
        || quiz.InputtedQuotient === null
        || quiz.InputtedRemainder === undefined
        || quiz.InputtedRemainder === null) {
        return false;
      }
    }

    return true;
  }

  public onQuizSubmit(): void {
    this._dlgsvc.FailureItems = [];
    for (const quiz of this.QuizItems) {
      if (!quiz.IsCorrect()) {
        this._dlgsvc.FailureItems.push(quiz);
      }
    }

    if (this._dlgsvc.FailureItems.length > 0) {
      this._dlgsvc.CurrentScore = Math.round(100 - 100 * this._dlgsvc.FailureItems.length / this.QuizItems.length);
      const dialogRef = this.dialog.open(QuizFailureDlgComponent, {
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
