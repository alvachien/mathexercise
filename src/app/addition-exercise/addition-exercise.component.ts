import { Component, OnInit } from '@angular/core';
import { PrimarySchoolMathQuiz, PrimarySchoolMathQuizSection, AdditionQuizItem } from '../model';
import { MdDialog } from '@angular/material';
import { DialogService } from '../dialog.service';
import { QuizFailureDlgComponent } from '../quiz-failure-dlg/quiz-failure-dlg.component';
import { QuizSummaryComponent } from '../quiz-summary/quiz-summary.component';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-addition-exercise',
  templateUrl: './addition-exercise.component.html',
  styleUrls: ['./addition-exercise.component.scss']
})
export class AdditionExerciseComponent implements OnInit {
  StartQuizAmount: number = 20;
  FailedQuizFactor: number = 1;
  LeftNumberRangeBgn: number = 1;
  LeftNumberRangeEnd: number = 10;
  RightNumberRangeBgn: number = 1;
  RightNumberRangeEnd: number = 10;

  quizInstance: PrimarySchoolMathQuiz = null;
  QuizItems: AdditionQuizItem[] = [];  

  pageSize: number;  

  constructor(private dialog: MdDialog,
    private _dlgsvc: DialogService,
    private _router: Router) {
    this.quizInstance = new PrimarySchoolMathQuiz();
    this.pageSize = 10; // Default page size
  }

  ngOnInit() {
  }

  private generateQuizItem(idx: number): AdditionQuizItem {
    let qz: AdditionQuizItem = new AdditionQuizItem(Math.floor(Math.random() * (this.LeftNumberRangeEnd - this.LeftNumberRangeBgn) + this.LeftNumberRangeBgn),
      Math.floor(Math.random() * (this.RightNumberRangeEnd - this.RightNumberRangeBgn) + this.RightNumberRangeBgn));
    qz.QuizIndex = idx;
    return qz;
  }

  public onPageChanged($event: PageEvent) {
  }

  public onQuizStart(): void {
    // Start it!
    this.quizInstance.Start(this.StartQuizAmount, this.FailedQuizFactor);

    // Generated items
    for (let i = 0; i < this.quizInstance.CurrentRun().ItemsCount; i++) {

      let dq: AdditionQuizItem = this.generateQuizItem(i + 1);

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
    this._dlgsvc.FailureItems = [];
    for (let quiz of this.QuizItems) {
      if (!quiz.IsCorrect()) {
        this._dlgsvc.FailureItems.push(quiz);
      }
    }

    if (this._dlgsvc.FailureItems.length > 0) {
      let dialogRef = this.dialog.open(QuizFailureDlgComponent, {
        disableClose: false,
        width: '500px'
      });

      dialogRef.afterClosed().subscribe(x => {
        this.quizInstance.SubmitCurrentRun(this._dlgsvc.FailureItems.length);
        this.QuizItems = [];

        for (let i = 0; i < this.quizInstance.CurrentRun().ItemsCount; i++) {
          let dq: AdditionQuizItem = this.generateQuizItem(i + 1);

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
}
