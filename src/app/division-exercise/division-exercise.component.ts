import { Component, OnInit } from '@angular/core';
import { PrimarySchoolMathQuiz, PrimarySchoolMathQuizSection, DivisionQuizItem,
  DefaultQuizAmount, DefaultFailedQuizFactor } from '../model';
import { MdDialog } from '@angular/material';
import { DialogService } from '../dialog.service';
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

@Component({
  selector: 'app-division-exercise',
  templateUrl: './division-exercise.component.html',
  styleUrls: ['./division-exercise.component.scss']
})
export class DivisionExerciseComponent implements OnInit {
  StartQuizAmount: number = DefaultQuizAmount;
  FailedQuizFactor: number = DefaultFailedQuizFactor;

  DivisorRangeBgn: number = 1;
  DivisorRangeEnd: number = 10;
  DividendRangeBgn: number = 10;
  DividendRangeEnd: number = 100;
  
  quizInstance: PrimarySchoolMathQuiz = null;
  QuizItems: DivisionQuizItem[] = [];
  DisplayedQuizItems: DivisionQuizItem[] = [];
  UsedQuizAmount: number = 0;

  pageSize: number;
  pageIndex: number;

  constructor(private dialog: MdDialog,
    private _dlgsvc: DialogService,
    private _router: Router) {
    this.quizInstance = new PrimarySchoolMathQuiz();
  }

  ngOnInit() {
    // Reset the used quiz amount
    this.UsedQuizAmount = 0;
    this.pageSize = 10;
    this.pageIndex = 0;
  }

  private generateQuizItem(nIdx: number): DivisionQuizItem {
      let dq: DivisionQuizItem = new DivisionQuizItem(Math.floor(Math.random() * (this.DividendRangeEnd - this.DividendRangeBgn) + this.DividendRangeBgn ),
        Math.floor(Math.random() * (this.DivisorRangeEnd - this.DivisorRangeBgn) + this.DivisorRangeBgn));
      dq.QuizIndex = nIdx;

      return dq;
  }
  
  private generateQuizSection() {
    this.QuizItems = [];

    for (let i = 0; i < this.quizInstance.CurrentRun().ItemsCount; i++) {
      let dq: DivisionQuizItem = this.generateQuizItem(this.UsedQuizAmount + i + 1);

      this.QuizItems.push(dq);
    }
    this.UsedQuizAmount += this.QuizItems.length;    
  }

  public onPageChanged($event: PageEvent) {
    this.pageSize = $event.pageSize;
    this.pageIndex = $event.pageIndex;

    this.submitCurrentPage();
    this.prepareCurrentPage();
  }

  private submitCurrentPage() {
    if (this.DisplayedQuizItems.length > 0 ) {
      for(let qi of this.DisplayedQuizItems) {
        for(let qi2 of this.QuizItems) {
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
    let pageStart = this.pageIndex * this.pageSize;
    let pageEnd = pageStart + this.pageSize;

    this.DisplayedQuizItems = [];
    for(let i = 0; i < this.QuizItems.length; i ++) {
      if (i >= pageStart && i < pageEnd) {
        this.DisplayedQuizItems.push(this.QuizItems[i]);
      }
    }
  }

  public onQuizItemTrackBy(index: number, item: any) {
    return item.QuizIndex;
  }
  
  public onQuizStart(): void {
    // Start it!
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
        this.quizInstance.SubmitCurrentRun(this._dlgsvc.FailureItems.length);
        
        this.generateQuizSection();
        this.pageIndex = 0;
        this.prepareCurrentPage();

        // Current run
        this.quizInstance.CurrentRun().SectionStart();
      });
    } else {
      // Succeed!
      this.quizInstance.SubmitCurrentRun(0);

      this._dlgsvc.CurrentQuiz = this.quizInstance;
      // for (let run of this.quizInstance.ElderRuns()) {
      //   this._dlgsvc.SummaryInfos.push(run.getSummaryInfo());
      // }

      this._router.navigate(['/quiz-sum']);
    }
  }

}