import { Component, OnInit } from '@angular/core';
import {
  PrimarySchoolMathQuiz, PrimarySchoolMathQuizSection, PrimarySchoolMathQuizItem, QuizTypeEnum,
  DefaultQuizAmount, DefaultFailedQuizFactor, PrimaySchoolFormulaEnum, getFormulaNameString, getFormulaUIString,
  FormulaCOfCircleQuizItem, FormulaCOfSquareQuizItem, FormulaCOfRectangleQuizItem, FormulaDistAndSpeedQuizItem
} from '../model';
import { MdDialog } from '@angular/material';
import { DialogService } from '../services';
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

  NumberRangeBgn: number = 1;
  NumberRangeEnd: number = 10;

  quizInstance: PrimarySchoolMathQuiz = null;
  QuizItems: PrimarySchoolMathQuizItem[] = [];
  DisplayedQuizItems: PrimarySchoolMathQuizItem[] = [];

  formulaDef: any[] = [];

  //pageEvent: PageEvent;
  pageSize: number;
  pageIndex: number;

  constructor(private dialog: MdDialog,
    private _dlgsvc: DialogService,
    private _router: Router) {
    for (let item in PrimaySchoolFormulaEnum) {
      if (isNaN(Number(item))) {
        //console.log(item);
      } else {
        let str0: string = getFormulaNameString(Number(item));
        let str1: string = getFormulaUIString(Number(item));
        let lf: any = { name: str0, formula: str1, selected: false };
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

  // private generateQuizItem(idx: number): AdditionQuizItem {
  //   let qz: AdditionQuizItem = new AdditionQuizItem(Math.floor(Math.random() * (this.LeftNumberRangeEnd - this.LeftNumberRangeBgn) + this.LeftNumberRangeBgn),
  //     Math.floor(Math.random() * (this.RightNumberRangeEnd - this.RightNumberRangeBgn) + this.RightNumberRangeBgn));
  //   qz.QuizIndex = idx;
  //   return qz;
  // }

  // private generateQuizSection() {
  //   this.QuizItems = [];

  //   for (let i = 0; i < this.quizInstance.CurrentRun().ItemsCount; i++) {
  //     let dq: AdditionQuizItem = this.generateQuizItem(this.UsedQuizAmount + i + 1);

  //     this.QuizItems.push(dq);
  //   }
  //   this.UsedQuizAmount += this.QuizItems.length;
  // }

  // public onPageChanged($event: PageEvent) {
  //   this.pageSize = $event.pageSize;
  //   this.pageIndex = $event.pageIndex;

  //   this.submitCurrentPage();
  //   this.prepareCurrentPage();
  // }
  
  public CanStart(): boolean {
    if (this.StartQuizAmount <= 0) {
      return false;
    }

    let ncnt: number = 0;
    for (let fs of this.formulaDef) {
      if (fs.selected === true) {
        ncnt++;
      }
    }
    if (ncnt === 0) {
      return false;
    }

    return true;
  }

  public onQuizStart(): void {
    // Start it!
    this.quizInstance.BasicInfo = '[' + this.NumberRangeBgn.toString() + '...' + this.NumberRangeEnd.toString() + ']'
      + ' '; 
      // Todo: selected formula!

    this.quizInstance.Start(this.StartQuizAmount, this.FailedQuizFactor);

    // Generated section
    // Todo
    // this.generateQuizSection();
    // this.pageIndex = 0;
    // this.prepareCurrentPage();

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

    return false;
  }

  public onQuizSubmit(): void {

  }
}
