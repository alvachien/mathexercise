import { Component, OnInit } from '@angular/core';
import { PrimarySchoolMathQuiz, PrimarySchoolMathQuizSection, SubtractionQuizItem } from '../model';
import { MdDialog } from '@angular/material';
import { DialogService } from '../dialog.service';
import { QuizFailureDlgComponent } from '../quiz-failure-dlg/quiz-failure-dlg.component';
import { QuizSummaryComponent } from '../quiz-summary/quiz-summary.component';

@Component({
  selector: 'app-subtraction-exercise',
  templateUrl: './subtraction-exercise.component.html',
  styleUrls: ['./subtraction-exercise.component.scss']
})
export class SubtractionExerciseComponent implements OnInit {
  StartQuizAmount: number = 20;
  FailedQuizFactor: number = 1;
  LeftNumberRangeBgn: number = 1;
  LeftNumberRangeEnd: number = 10;
  RightNumberRangeBgn: number = 1;
  RightNumberRangeEnd: number = 10;

  quizInstance: PrimarySchoolMathQuiz = null;
  QuizItems: SubtractionQuizItem[] = [];

  constructor(private dialog: MdDialog,
    private _dlgsvc: DialogService) {
    this.quizInstance = new PrimarySchoolMathQuiz();
  }

  ngOnInit() {
  }

  private generateQuizItem(idx: number): SubtractionQuizItem {
    let qz: SubtractionQuizItem = new SubtractionQuizItem(Math.floor(Math.random() * (this.LeftNumberRangeEnd - this.LeftNumberRangeBgn) + this.LeftNumberRangeBgn),
      Math.floor(Math.random() * (this.RightNumberRangeEnd - this.RightNumberRangeBgn) + this.RightNumberRangeBgn));
    qz.QuizIndex = idx;
    return qz;
  }

  public onQuizStart(): void {
    // Start it!
    this.quizInstance.Start(this.StartQuizAmount, this.FailedQuizFactor);

    // Generated items
    for (let i = 0; i < this.quizInstance.CurrentRun().ItemsCount; i++) {

      let dq: SubtractionQuizItem = this.generateQuizItem(i + 1);

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
      if (quiz.InputtedResult === undefined
        || quiz.InputtedResult === null) {
        return false;
      }
    }

    return true;
  }

  public onQuizSubmit(): void {
    let failed: SubtractionQuizItem[] = [];
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
        width: '700px'
      });

      dialogRef.afterClosed().subscribe(x => {
        this.quizInstance.SubmitCurrentRun(failed.length);
        this.QuizItems = [];

        for (let i = 0; i < this.quizInstance.CurrentRun().ItemsCount; i++) {
          let dq: SubtractionQuizItem = this.generateQuizItem(i + 1);

          this.QuizItems.push(dq);
        }

        // Current run
        this.quizInstance.CurrentRun().SectionStart();
      });
    } else {
      // Succeed!
      this.quizInstance.SubmitCurrentRun(0);

      for (let run of this.quizInstance.ElderRuns()) {
        this._dlgsvc.SummaryInfos.push(run.getSummaryInfo());
      }

      let dialogRef = this.dialog.open(QuizSummaryComponent, {
        disableClose: false,
        width: '700px'
      });
    }
  }
}
