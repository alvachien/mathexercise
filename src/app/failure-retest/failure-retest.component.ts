import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { MdDialog } from '@angular/material';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { DialogService } from '../services/dialog.service';
import { QuizTypeEnum, PrimarySchoolMathQuizItem, QuizTypeEnum2UIString,
  AdditionQuizItem, SubtractionQuizItem, MultiplicationQuizItem, DivisionQuizItem } from '../model';
import { QuizFailureDlgComponent } from '../quiz-failure-dlg/quiz-failure-dlg.component';
  
export class QuizFailureItem {
  public quiztype: QuizTypeEnum;
  public quizid: number;
  public quizfailidx: number;
  public submitdate: Date;
  public inputted: string;
  public quizitemstore: string;
  public qsInstance: PrimarySchoolMathQuizItem;
}

@Component({
  selector: 'failure-retest-complete-dialog',
  templateUrl: 'failure-retest-complete-dialog.html',
})
export class FailureRetestCompleteDialog {}

@Component({
  selector: 'app-failure-retest',
  templateUrl: './failure-retest.component.html',
  styleUrls: ['./failure-retest.component.scss']
})
export class FailureRetestComponent implements OnInit {
  listFailItems: QuizFailureItem[] = [];

  constructor(private _http: Http,
    private dialog: MdDialog,
    private _dlgsvc: DialogService,
    private _authService: AuthService,
    private _router: Router) {
  }

  ngOnInit() {
    let usr = this._authService.authSubject.getValue().getUserId();
    let apiurl = environment.APIBaseUrl + 'quizfailure/' + usr;

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
    let options = new RequestOptions({ headers: headers }); // Create a request option
    this._http.get(apiurl, options)
      .map((response: Response) => {
        console.log(response);
        return response.json();
      })
      .subscribe(x => {
        if (x instanceof Array && x.length > 0) {
          for (let si of x) {
            console.log(si);
            let qi: QuizFailureItem = new QuizFailureItem();
            qi.quiztype = si.quizType;
            qi.quizid = si.quizID;
            qi.quizfailidx = si.quizFailIndex;
            qi.quizitemstore = si.expected;
            qi.inputted = si.inputted;
            qi.submitdate = new Date(si.submitDate);
            switch(qi.quiztype) {
              case QuizTypeEnum.add: qi.qsInstance = AdditionQuizItem.restoreFromString(si.expected); break;
              case QuizTypeEnum.sub: qi.qsInstance = SubtractionQuizItem.restoreFromString(si.expected); break;
              case QuizTypeEnum.multi: qi.qsInstance = MultiplicationQuizItem.restoreFromString(si.expected); break;
              case QuizTypeEnum.div: qi.qsInstance = DivisionQuizItem.restoreFromString(si.expected); break;
              default: break;
            }
            console.log(qi);

            this.listFailItems.push(qi);
          }
        }
      });
  }

  public getUIStringForType(qt: QuizTypeEnum): string {
    return QuizTypeEnum2UIString(qt);
  }

  public IsASMType(qt: QuizTypeEnum): boolean {
    return (qt === QuizTypeEnum.add
      || qt === QuizTypeEnum.sub
      || qt === QuizTypeEnum.multi);
  }

  public IsDivType(qt: QuizTypeEnum): boolean {
    return qt === QuizTypeEnum.div;
  }

  public CanSubmit(): boolean {
    if (this.listFailItems.length <= 0) {
      return false;
    }

    for(let fi of this.listFailItems) {
      switch(fi.quiztype) {
        case QuizTypeEnum.add: {
          let aqi: AdditionQuizItem = <AdditionQuizItem>fi.qsInstance;
          if (aqi.InputtedResult === undefined
            || aqi.InputtedResult === null) {
              return false;
          }
        }
        break;

        case QuizTypeEnum.sub: {
          let sqi: SubtractionQuizItem = <SubtractionQuizItem>fi.qsInstance;
          if (sqi.InputtedResult === undefined 
          || sqi.InputtedResult === null) {
            return false;
          }
        }
        break;

        case QuizTypeEnum.multi: {
          let mqi: MultiplicationQuizItem = <MultiplicationQuizItem>fi.qsInstance;
          if (mqi.InputtedResult === undefined
            || mqi.InputtedResult === null) {
              return false;
          }
        }
        break;

        case QuizTypeEnum.div: {
          let dqi: DivisionQuizItem = <DivisionQuizItem>fi.qsInstance;
          if (dqi.InputtedQuotient === undefined || dqi.InputtedQuotient === null
            || dqi.InputtedRemainder === undefined || dqi.InputtedRemainder === null) {
              return false;
          }
        }
        break;

        default:
        return false;
      }
    }

    return true;
  }

  public onQuizSubmit() {
    this._dlgsvc.FailureItems = [];
    for(let fi of this.listFailItems) {
      switch(fi.quiztype) {
        case QuizTypeEnum.add: {
          let aqi: AdditionQuizItem = <AdditionQuizItem>fi.qsInstance;
          if (!aqi.IsCorrect()) {
            this._dlgsvc.FailureItems.push(aqi);
          }
        }
        break;

        case QuizTypeEnum.sub: {
          let sqi: SubtractionQuizItem = <SubtractionQuizItem>fi.qsInstance;
          if (!sqi.IsCorrect()) {
            this._dlgsvc.FailureItems.push(sqi);
          }
        }
        break;

        case QuizTypeEnum.multi: {
          let mqi: MultiplicationQuizItem = <MultiplicationQuizItem>fi.qsInstance;
          if (!mqi.IsCorrect()) {
            this._dlgsvc.FailureItems.push(mqi);
          }
        }
        break;

        case QuizTypeEnum.div: {
          let dqi: DivisionQuizItem = <DivisionQuizItem>fi.qsInstance;
          if (!dqi.IsCorrect()) {
            this._dlgsvc.FailureItems.push(dqi);
          }
        }
        break;

        default: break;
      }

      if (this._dlgsvc.FailureItems.length > 0) {
        this._dlgsvc.CurrentScore = Math.round(100 - 100 * this._dlgsvc.FailureItems.length / this.listFailItems.length);
        let dialogRef = this.dialog.open(QuizFailureDlgComponent, {
          disableClose: false,
          width: '500px'
        });
  
        dialogRef.afterClosed().subscribe(x => {
          // Do nothing!
        });
      } else {
        // Also show a dialog
        this.dialog.open(FailureRetestCompleteDialog).afterClosed().subscribe(() => {
          // Navigate it back to home page
          this._router.navigate(['/']);
        });
      }
    }
  }
}
