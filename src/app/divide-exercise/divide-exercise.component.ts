import { Component, OnInit } from '@angular/core';
import { PrimarySchoolMathQuiz, PrimarySchoolMathQuizSection, DivisionQuizItem } from '../model';
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

@Component({
  selector: 'app-divide-exercise',
  templateUrl: './divide-exercise.component.html',
  styleUrls: ['./divide-exercise.component.scss']
})
export class DivideExerciseComponent implements OnInit {
  StartQuizAmount: number = 100;
  FailedQuizFactor: number = 1;
  DivisorRangeBgn: number = 1;
  DivisorRangeEnd: number = 10;
  DividendRangeBgn: number = 10;
  DividendRangeEnd: number = 100;
  
  quizInstance: PrimarySchoolMathQuiz = null;
  QuizItems: DivisionQuizItem[] = [];

  constructor(private dialog: MdDialog,
    private _dlgsvc: DialogService,
    private _router: Router) {
    this.quizInstance = new PrimarySchoolMathQuiz();
  }

  ngOnInit() {
  }

  public onQuizStart(): void {
    // Start it!
    this.quizInstance.Start(this.StartQuizAmount, this.FailedQuizFactor);

    // Generated items
    for (let i = 0; i < this.quizInstance.CurrentRun().ItemsCount; i++) {
      let dq: DivisionQuizItem = this.generateQuizItem(i + 1);

      this.QuizItems.push(dq);
    }

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
    let failed: DivisionQuizItem[] = [];
    this._dlgsvc.FailureInfos = [];
    for (let quiz of this.QuizItems) {
      if (!quiz.IsCorrect()) {
        failed.push(quiz);
        this._dlgsvc.FailureInfos.push(quiz.getFormattedString());
      }
    }

    if (failed.length > 0) {
      let dialogRef = this.dialog.open(QuizFailureDlgComponent, {
        disableClose: false,
        width: '500px'
      });

      dialogRef.afterClosed().subscribe(x => {
        this.quizInstance.SubmitCurrentRun(failed.length);
        this.QuizItems = [];

        for (let i = 0; i < this.quizInstance.CurrentRun().ItemsCount; i++) {
          let dq: DivisionQuizItem = this.generateQuizItem(i + 1);

          this.QuizItems.push(dq);
        }

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

  private generateQuizItem(nIdx: number): DivisionQuizItem {
      let dq: DivisionQuizItem = new DivisionQuizItem(Math.floor(Math.random() * (this.DividendRangeEnd - this.DividendRangeBgn) + this.DividendRangeBgn ),
        Math.floor(Math.random() * (this.DivisorRangeEnd - this.DivisorRangeBgn) + this.DivisorRangeBgn));
      dq.QuizIndex = nIdx;

      return dq;
  }
}
