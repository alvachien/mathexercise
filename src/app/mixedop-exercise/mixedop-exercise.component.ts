import { Component, OnInit } from '@angular/core';
import { PrimarySchoolMathQuiz, PrimarySchoolMathQuizSection, PrimarySchoolMathQuizItem, QuizTypeEnum,
  DefaultQuizAmount, DefaultFailedQuizFactor, MixedOperationQuizItem, RPN
} from '../model';
import { MdDialog } from '@angular/material';
import { DialogService } from '../services/dialog.service';
import { QuizFailureDlgComponent } from '../quiz-failure-dlg/quiz-failure-dlg.component';
import { QuizSummaryComponent } from '../quiz-summary/quiz-summary.component';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material';
import { environment } from '../../environments/environment';
import { LogLevel, UserAuthInfo } from '../model';
import { MessageDialogButtonEnum, MessageDialogInfo, MessageDialogComponent } from '../message-dialog';

@Component({
  selector: 'app-mixedop-exercise',
  templateUrl: './mixedop-exercise.component.html',
  styleUrls: ['./mixedop-exercise.component.scss']
})
export class MixedopExerciseComponent implements OnInit {
  StartQuizAmount: number = DefaultQuizAmount;
  FailedQuizFactor: number = DefaultFailedQuizFactor;
  UsedQuizAmount = 0;

  NumberRangeBgn = 1;
  NumberRangeEnd = 100;
  NumberOfOperators = 2;
  AllowDecimal = false;
  AllowNegative = false;

  quizInstance: PrimarySchoolMathQuiz = null;
  QuizItems: MixedOperationQuizItem[] = [];
  DisplayedQuizItems: MixedOperationQuizItem[] = [];

  //pageEvent: PageEvent;
  pageSize: number;
  pageIndex: number;

  constructor(private dialog: MdDialog,
    private _dlgsvc: DialogService,
    private _router: Router) {
    this.quizInstance = new PrimarySchoolMathQuiz();
    this.quizInstance.QuizType = QuizTypeEnum.mixedop;
  }

  ngOnInit() {
    // Reset the used quiz amount
    this.UsedQuizAmount = 0;
    this.pageSize = 10;
    this.pageIndex = 0;
  }

  private generateQuizItem(idx: number): MixedOperationQuizItem {
    const operators = '+-*/';
    let strfrm = '';

    while (true) {
      strfrm = '';
      let step = 0;
      let bprv = false;

      while (step < this.NumberOfOperators) {
        if (strfrm.length <= 0) {
          const n1 = Math.round(Math.random() * (this.NumberRangeEnd - this.NumberRangeBgn) + this.NumberRangeBgn);
          strfrm = n1.toString();
        }

        let op: number = Math.round(Math.random() * 4);
        if (op < 0) {
          op = 0;
        } else if (op > 3) {
          op = 3;
        }

        let n2: number = Math.round(Math.random() * (this.NumberRangeEnd - this.NumberRangeBgn) + this.NumberRangeBgn);
        if (op === 3 && n2 > 100) {
          n2 = Math.round(Math.random() * 100);
        }

        if (bprv) {
          strfrm += operators.charAt(op).toString() + n2.toString() + ')';
          bprv = false;
        } else {
          const buse = Math.round(Math.random());
          if (buse === 0 && step < this.NumberOfOperators - 1) {
            strfrm += operators.charAt(op).toString() + '(' + n2.toString();
            bprv = true;
          } else {
            strfrm += operators.charAt(op).toString() + n2.toString();
            bprv = false;
          }
        }
        ++step;
      }

      const oprn: RPN = new RPN();
      oprn.buildExpress(strfrm);
      try {
        if (oprn.VerifyResult(this.AllowNegative, this.AllowDecimal)) {
          if (environment.LoggingLevel >= LogLevel.Debug) {
            console.log(`AC Math Exercise [Debug]: MixedOperation generation succeed: ${strfrm}`);
          }
          break;
        } else {
          if (environment.LoggingLevel >= LogLevel.Debug) {
            console.log(`AC Math Exercise [Debug]: MixedOperation generation FAILED: ${strfrm}`);
          }
        }
      }
      catch (exp) {
        if (environment.LoggingLevel >= LogLevel.Error) {
          console.log('AC Math Exericse [Debug]: ' + exp);
        }
      }
    }

    const qz: MixedOperationQuizItem = new MixedOperationQuizItem(strfrm);
    qz.QuizIndex = idx;
    return qz;
  }

  private generateQuizSection() {
    this.QuizItems = [];

    for (let i = 0; i < this.quizInstance.CurrentRun().ItemsCount; i++) {
      const dq: MixedOperationQuizItem = this.generateQuizItem(this.UsedQuizAmount + i + 1);

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
    if (this.DisplayedQuizItems.length > 0) {
      for (const qi of this.DisplayedQuizItems) {
        for (const qi2 of this.QuizItems) {
          if (qi.QuizIndex === qi2.QuizIndex) {
            qi2.InputtedResult = qi.InputtedResult;
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
    if (this.StartQuizAmount <= 0 || this.NumberOfOperators <= 1 || this.NumberRangeBgn < 0
      || this.NumberRangeEnd <= this.NumberRangeBgn) {
      return false;
    }

    if (this.quizInstance.IsStarted) {
      return false;
    }

    return true;
  }
  public onQuizStart(): void {
    // Start it!
    this.quizInstance.BasicInfo = '[' + this.NumberRangeBgn.toString() + '...' + this.NumberRangeEnd.toString() + '];'
      + this.NumberOfOperators.toString() + ';' + this.AllowNegative ? 'Neg;' : ';' + this.AllowDecimal ? 'Dec;' : ';';
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
      if (quiz.InputtedResult === undefined
        || quiz.InputtedResult === null) {
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

      this._router.navigate(['/quiz-sum']);
    }
  }
}
