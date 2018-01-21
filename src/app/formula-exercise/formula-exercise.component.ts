import { Component, OnInit } from '@angular/core';
import {
  PrimarySchoolMathQuiz, PrimarySchoolMathQuizSection, PrimarySchoolMathQuizItem, QuizTypeEnum, FormulaQuizItemBase,
  DefaultQuizAmount, DefaultFailedQuizFactor, PrimarySchoolFormulaEnum, getFormulaNameString, getFormulaUIString,
  FormulaCOfCircleCalcDirEum, FormulaCOfSquareCalcDirEum, FormulaCOfRectangleCalcDirEum, isFormulaTypeEnabled,
  FormulaCOfCircleQuizItem, FormulaCOfSquareQuizItem, FormulaCOfRectangleQuizItem, FormulaDistAndSpeedCalcDirEum, 
  FormulaDistAndSpeedQuizItem, FormulaEfficiencyProblemQuizItem,
  FormulaAOfRectangleCalcDirEum, FormulaAreaOfRectangleQuizItem, FormulaAreaOfSquareQuizItem, 
  FormulaAreaOfSquareCalcDirEum, FormulaEfficiencyProblemCalcDirEum
} from '../model';
import { MatDialog } from '@angular/material';
import { DialogService } from '../services/dialog.service';
import { QuizFailureDlgComponent } from '../quiz-failure-dlg/quiz-failure-dlg.component';
import { QuizSummaryComponent } from '../quiz-summary/quiz-summary.component';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material';
import { environment } from '../../environments/environment';
import { LogLevel, UserAuthInfo } from '../model';
import { MessageDialogButtonEnum, MessageDialogInfo, MessageDialogComponent } from '../message-dialog';

export interface formulaTypeUISelect {
  name: string;
  formula: string;
  selected: boolean;
  disabled: boolean;
  formulatype: PrimarySchoolFormulaEnum;
}

@Component({
  selector: 'app-formula-exercise',
  templateUrl: './formula-exercise.component.html',
  styleUrls: ['./formula-exercise.component.scss']
})
export class FormulaExerciseComponent implements OnInit {
  StartQuizAmount: number = DefaultQuizAmount;
  FailedQuizFactor: number = DefaultFailedQuizFactor;
  UsedQuizAmount: number = 0;

  NumberRangeBgn: number = 1;
  NumberRangeEnd: number = 10;
  AlloweDecimal: boolean = false;

  quizInstance: PrimarySchoolMathQuiz = null;
  QuizItems: FormulaQuizItemBase[] = [];
  DisplayedQuizItems: FormulaQuizItemBase[] = [];

  formulaDef: formulaTypeUISelect[] = [];

  //pageEvent: PageEvent;
  pageSize: number;
  pageIndex: number;

  constructor(private dialog: MatDialog,
    private _dlgsvc: DialogService,
    private _router: Router) {
    for (const item in PrimarySchoolFormulaEnum) {
      if (isNaN(Number(item))) {
        //console.log(item);
      } else {
        const lf: formulaTypeUISelect = {
          name: getFormulaNameString(Number(item)),
          formula: getFormulaUIString(Number(item)),
          selected: false,
          disabled: !isFormulaTypeEnabled(Number(item)),
          formulatype: Number(item)
        };
        this.formulaDef.push(lf);
      }
    }

    this.quizInstance = new PrimarySchoolMathQuiz();
    this.quizInstance.QuizType = QuizTypeEnum.formula;
  }

  ngOnInit() {
    // Reset the used quiz amount
    this.UsedQuizAmount = 0;
    this.pageSize = 10;
    this.pageIndex = 0;
  }

  private generateQuizItem(idx: number): FormulaQuizItemBase {
    const qztypamt = this.formulaDef.length;
    let qzidx: number;

    // Choose one type
    while (true) {
      qzidx = Math.round(Math.random() * qztypamt - 1);
      if (qzidx < 0) {
        qzidx = 0;
      } 

      if (!this.formulaDef[qzidx].disabled && this.formulaDef[qzidx].selected) {
        break;
      }
    }

    switch (this.formulaDef[qzidx].formulatype) {
      case PrimarySchoolFormulaEnum.CircumferenceOfCircle: {
        const qz: FormulaCOfCircleQuizItem = new FormulaCOfCircleQuizItem(
          Math.round(Math.random() * (this.NumberRangeEnd - this.NumberRangeBgn) + this.NumberRangeBgn),
          <FormulaCOfCircleCalcDirEum>Math.round(Math.random())
        );
        qz.QuizIndex = idx;
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log('AC Math Exercise [Debug]: generating Quiz Item for CircumferenceOfCircle: ' + qz.storeToString());
        }
        return qz;
      }

      case PrimarySchoolFormulaEnum.CircumferenceOfSquare: {
        const qz: FormulaCOfSquareQuizItem = new FormulaCOfSquareQuizItem(
          Math.round(Math.random() * (this.NumberRangeEnd - this.NumberRangeBgn) + this.NumberRangeBgn),
          <FormulaCOfSquareCalcDirEum>Math.round(Math.random())
        );
        qz.QuizIndex = idx;
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log('AC Math Exercise [Debug]: generating Quiz Item for CircumferenceOfSquare: ' + qz.storeToString() );
        }
        return qz;
      }

      case PrimarySchoolFormulaEnum.CircumferenceOfRectangle: {
        const qz: FormulaCOfRectangleQuizItem = new FormulaCOfRectangleQuizItem(
          Math.round(Math.random() * (this.NumberRangeEnd - this.NumberRangeBgn) + this.NumberRangeBgn),
          Math.round(Math.random() * (this.NumberRangeEnd - this.NumberRangeBgn) + this.NumberRangeBgn),
          <FormulaCOfRectangleCalcDirEum>Math.round(Math.random() * 2)
        );
        qz.QuizIndex = idx;

        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log('AC Math Exercise [Debug]: generating Quiz Item for CircumferenceOfRectangle: ' + qz.storeToString());
        }
        return qz;
      }

      case PrimarySchoolFormulaEnum.AreaOfRectangle: {
        const qz: FormulaAreaOfRectangleQuizItem = new FormulaAreaOfRectangleQuizItem(
          Math.round(Math.random() * (this.NumberRangeEnd - this.NumberRangeBgn) + this.NumberRangeBgn),
          Math.round(Math.random() * (this.NumberRangeEnd - this.NumberRangeBgn) + this.NumberRangeBgn),
          <FormulaAOfRectangleCalcDirEum>Math.round(Math.random() * 2)
        );
        qz.QuizIndex = idx;

        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log('AC Math Exercise [Debug]: generating Quiz Item for AreaOfRectangle: ' + qz.storeToString());
        }
        return qz;
      }

      case PrimarySchoolFormulaEnum.AreaOfSquare: {
        const qz: FormulaAreaOfSquareQuizItem = new FormulaAreaOfSquareQuizItem(
          Math.round(Math.random() * (this.NumberRangeEnd - this.NumberRangeBgn) + this.NumberRangeBgn),
          <FormulaAreaOfSquareCalcDirEum>Math.round(Math.random() * 2)
        );
        qz.QuizIndex = idx;

        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log('AC Math Exercise [Debug]: generating Quiz Item for AreaOfSquare: ' + qz.storeToString());
        }

        return qz;
      }

      case PrimarySchoolFormulaEnum.DistanceAndSpeed: {
        const qz: FormulaDistAndSpeedQuizItem = new FormulaDistAndSpeedQuizItem(
          Math.round(Math.random() * (this.NumberRangeEnd - this.NumberRangeBgn) + this.NumberRangeBgn),
          Math.round(Math.random() * (this.NumberRangeEnd - this.NumberRangeBgn) + this.NumberRangeBgn),
          <FormulaDistAndSpeedCalcDirEum>Math.round(Math.random() * 2)
        );
        qz.QuizIndex = idx;

        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log('AC Math Exercise [Debug]: generating Quiz Item for DistanceAndSpeed: ' + qz.storeToString());
        }
        return qz;
      }

      case PrimarySchoolFormulaEnum.EfficiencyProblem: {
        const qz: FormulaEfficiencyProblemQuizItem = new FormulaEfficiencyProblemQuizItem(
          Math.round(Math.random() * (this.NumberRangeEnd - this.NumberRangeBgn) + this.NumberRangeBgn),
          Math.round(Math.random() * (this.NumberRangeEnd - this.NumberRangeBgn) + this.NumberRangeBgn),
          <FormulaEfficiencyProblemCalcDirEum>Math.round(Math.random() * 2)
        );
        qz.QuizIndex = idx;

        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log('AC Math Exercise [Debug]: generating Quiz Item for EfficiencyProblem: ' + qz.storeToString());
        }
        return qz;
      }
      
      default: {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.error(`AC Math Exercise [Debug]: generating Quiz Item: FAILED: ${this.formulaDef[qzidx].formulatype}`);
        }
      }

      return null;
    }
  }

  private generateQuizSection() {
    this.QuizItems = [];

    for (let i = 0; i < this.quizInstance.CurrentRun().ItemsCount; i++) {
      const dq: FormulaQuizItemBase = this.generateQuizItem(this.UsedQuizAmount + i + 1);

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
    if (this.StartQuizAmount <= 0 || this.NumberRangeBgn < 0
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
    this.quizInstance.BasicInfo = '[' + this.NumberRangeBgn.toString() + '...' + this.NumberRangeEnd.toString() + ']';
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
