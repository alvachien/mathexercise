import { Component, OnInit } from '@angular/core';
import {
  PrimarySchoolMathQuiz, PrimarySchoolMathQuizSection, PrimarySchoolMathQuizItem,
  DefaultQuizAmount, DefaultFailedQuizFactor
} from '../model';
import { MdDialog } from '@angular/material';
import { DialogService } from '../dialog.service';
import { QuizFailureDlgComponent } from '../quiz-failure-dlg/quiz-failure-dlg.component';
import { QuizSummaryComponent } from '../quiz-summary/quiz-summary.component';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-formula-exercise',
  templateUrl: './formula-exercise.component.html',
  styleUrls: ['./formula-exercise.component.scss']
})
export class FormulaExerciseComponent implements OnInit {
  StartQuizAmount: number = DefaultQuizAmount;
  FailedQuizFactor: number = DefaultFailedQuizFactor;
  UsedQuizAmount: number = 0;

  LeftNumberRangeBgn: number = 1;
  LeftNumberRangeEnd: number = 10;
  RightNumberRangeBgn: number = 1;
  RightNumberRangeEnd: number = 10;

  quizInstance: PrimarySchoolMathQuiz = null;
  QuizItems: PrimarySchoolMathQuizItem[] = [];
  DisplayedQuizItems: PrimarySchoolMathQuizItem[] = [];

  //pageEvent: PageEvent;
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

  public onQuizStart(): void {

  }

  public CanSubmit(): boolean {    
    if (!this.quizInstance.IsStarted) {
      return false;
    }

    if (this.QuizItems.length <= 0) {
      return false;
    }
    return false;
  }

  public onQuizSubmit(): void {

  }
}
