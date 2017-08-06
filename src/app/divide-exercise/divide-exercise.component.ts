import { Component, OnInit } from '@angular/core';

// 和 sum
// 差 difference
// 积 product
// 商 quotient
// dividend 被除数  numerator 分子
// divisor 除数 denominator 分母
// quotient 商 
// remainder 余数

class DividedQuiz {
  public QuizIndex: number;
  public Dividend: number;
  public Divisor: number;
  public Quotient: number;
  public Remainder: number;

  public InputtedQuotient: number;
  public InputtedRemainder: number;

  public getFormattedString() :string {
    return this.QuizIndex.toString() + ": " + this.Dividend.toString() 
      + " ÷ " + this.Divisor.toString() + " = " + this.Quotient.toString() 
      + ((this.Remainder === 0)? "" : ("... " + this.Remainder.toString()));
  }
}

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
  IsQuizStarted: boolean = false;
  IsQuizCompleted: boolean = false;
  failedQuizs: string[] = [];
  QuizSummaryInfo: string = '';
  
  public Quizs: DividedQuiz[] = [];
  private latestQuizIndex: number;
  private quizTimeSpent: number;
  private quizTimeStart: number;

  constructor() { }

  ngOnInit() {
  }

  public onQuizStart(): void {
    if (this.StartQuizAmount <= 0) {
      this.IsQuizStarted = false;
      return;
    }

    this.Quizs = [];
    this.latestQuizIndex = 0;
    this.quizTimeSpent = 0;
    this.quizTimeStart = new Date().getTime(); // Start the time
    this.IsQuizCompleted = false;
    for(let i = 0; i < this.StartQuizAmount; i++) {

      let dq: DividedQuiz = this.generateQuiz(i + 1);

      this.Quizs.push(dq);
    }
    this.latestQuizIndex = this.StartQuizAmount;

    this.IsQuizStarted = true;
  }

  private generateQuiz(nIdx: number): DividedQuiz {
      let dq: DividedQuiz = new DividedQuiz();
      dq.QuizIndex = nIdx;
      dq.Dividend = Math.floor(Math.random() * (this.DividendRangeEnd - this.DividendRangeBgn) + this.DividendRangeBgn );
      dq.Divisor = Math.floor(Math.random() * (this.DivisorRangeEnd - this.DivisorRangeBgn) + this.DivisorRangeBgn );
      if (dq.Divisor === 0) {
        dq.Divisor += 1;
      }
      dq.Quotient = Math.floor(dq.Dividend / dq.Divisor);
      dq.Remainder = dq.Dividend % dq.Divisor;

      return dq;
  }
  public IsQuizFulfilled(): boolean {
    if (this.Quizs.length <= 0) {
      return true;
    }
    for(let quiz of this.Quizs) {
      if (quiz.InputtedQuotient === undefined
      || quiz.InputtedRemainder === undefined
      || quiz.InputtedQuotient === null
      || quiz.InputtedRemainder === null){
        return false;
      }
    }

    return true;
  }

  public onQuizSubmit(): void {
    const end = new Date().getTime();
    this.quizTimeSpent += (end - this.quizTimeStart);

    this.failedQuizs = [];
    let failed: DividedQuiz[] = [];
    for(let quiz of this.Quizs) {
      if (quiz.InputtedQuotient === quiz.Quotient
        && quiz.InputtedRemainder === quiz.Remainder) {
          // Correct!
      } else {
        failed.push(quiz);
        this.failedQuizs.push(quiz.getFormattedString() + "; inputted is:  "
          + quiz.InputtedQuotient.toString()  + " ... "
          + quiz.InputtedRemainder.toString());
      }
    }

    if (failed.length > 0) {
      this.Quizs = [];
      let nNew = failed.length * this.FailedQuizFactor;
      for(let i = 0; i < nNew; i++) {
        let dq = this.generateQuiz(i + 1 + this.latestQuizIndex);
        this.Quizs.push(dq);
      }

      this.latestQuizIndex += nNew;
      this.quizTimeStart = new Date().getTime();
    } else {
      // Quiz is stopped!
      this.IsQuizStarted = false;
      this.IsQuizCompleted = true;

      this.QuizSummaryInfo = 'Total spent: ' + (this.quizTimeSpent / 1000).toString() + " second with amount of quizs: " + this.latestQuizIndex.toString();
    }
  }
}
