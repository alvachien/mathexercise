import { Component, OnInit, NgZone } from '@angular/core';
import { PrimarySchoolMathQuiz, PrimarySchoolMathQuizSection, MultiplicationQuizItem,
  DefaultQuizAmount, DefaultFailedQuizFactor, QuizTypeEnum,
  LogLevel, UserAuthInfo, PrimarySchoolMathFAOControl
} from '../model';
import { MatDialog } from '@angular/material';
import { DialogService } from '../services/dialog.service';
import { NavigationService } from '../services/navigation.service';
import { QuizFailureDlgComponent } from '../quiz-failure-dlg/quiz-failure-dlg.component';
import { QuizSummaryComponent } from '../quiz-summary/quiz-summary.component';
import { Router } from '@angular/router';
import { slideInOutAnimation } from '../animation';
import { PageEvent } from '@angular/material';
import { environment } from '../../environments/environment';
import { MessageDialogButtonEnum, MessageDialogInfo, MessageDialogComponent } from '../message-dialog';

@Component({
  selector: 'app-multiplication-quiz',
  templateUrl: './multiplication-quiz.component.html',
  styleUrls: ['./multiplication-quiz.component.scss'],
})
export class MultiplicationQuizComponent implements OnInit {
  quizControl: PrimarySchoolMathFAOControl;
  quizInstance: PrimarySchoolMathQuiz = null;
  QuizItems: MultiplicationQuizItem[] = [];
  DisplayedQuizItems: MultiplicationQuizItem[] = [];
  UsedQuizAmount = 0;

  pageSize: number;
  pageIndex: number;

  constructor(private dialog: MatDialog,
    private _dlgsvc: DialogService,
    private _nvgService: NavigationService,
    private _zone: NgZone,
    private _router: Router) {
    this.quizInstance = new PrimarySchoolMathQuiz();
    this.quizInstance.QuizType = QuizTypeEnum.multi;

    this.quizControl = new PrimarySchoolMathFAOControl();
    this.quizControl.leftNumberBegin = 1;
    this.quizControl.leftNumberEnd = 1000;
    this.quizControl.rightNumberBegin = 1;
    this.quizControl.rightNumberEnd = 1000;
    this.quizControl.decimalPlaces = 0;
    this.quizControl.numberOfQuestions = 50;
    this.quizControl.failFactor = 3;
  }

  ngOnInit() {
    // Reset the used quiz amount
    this.UsedQuizAmount = 0;
    this.pageSize = 10;
    this.pageIndex = 0;

    // Check the navigation service
    if (this._nvgService.currentQuizControl !== undefined
      && this._nvgService.currentQuizControl instanceof PrimarySchoolMathFAOControl) {
      this.quizControl = this._nvgService.currentQuizControl;
      // After the setting, clear the service
      this._nvgService.currentQuizControl = undefined;
    }
  }

  private generateQuizItem(idx: number): MultiplicationQuizItem {
    const rnum1 = Math.random() * (this.quizControl.leftNumberEnd - this.quizControl.leftNumberBegin) + this.quizControl.leftNumberBegin;
    const rnum2 = Math.random() * (this.quizControl.rightNumberEnd - this.quizControl.rightNumberBegin) + this.quizControl.rightNumberBegin;
    const qz: MultiplicationQuizItem = new MultiplicationQuizItem(
      rnum1, rnum2, this.quizControl.decimalPlaces
    );
    qz.QuizIndex = idx;
    return qz;
  }

  private generateQuizSection() {
    this.QuizItems = [];

    for (let i = 0; i < this.quizInstance.CurrentRun().ItemsCount; i++) {
      const dq: MultiplicationQuizItem = this.generateQuizItem(this.UsedQuizAmount + i + 1);

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
    if (this.quizControl === undefined
      || !this.quizControl.isValid()) {
      return false;
    }

    if (this.quizInstance.IsStarted) {
      return false;
    }

    return true;
  }

  public onQuizStart(): void {
    // Start it!
    this.quizInstance.BasicInfo = this.quizControl.storeToString();
    this._zone.run(() => {
      this.quizInstance.Start(this.quizControl);
    });

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
      // for (let run of this.quizInstance.ElderRuns()) {
      //   this._dlgsvc.SummaryInfos.push(run.getSummaryInfo());
      // }

      this._router.navigate(['/quiz-sum']);
    }
  }
}
