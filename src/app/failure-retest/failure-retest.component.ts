import { Component, OnInit } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { DialogService } from '../services/dialog.service';
import { QuizTypeEnum, PrimarySchoolMathQuizItem, QuizTypeEnum2UIString, LogLevel,
  AdditionQuizItem, SubtractionQuizItem, MultiplicationQuizItem, DivisionQuizItem,
  FormulaQuizItemBase, PrimarySchoolFormulaEnum, FormulaCOfCircleQuizItem, FormulaCOfSquareQuizItem, FormulaCOfRectangleQuizItem,
  FormulaDistAndSpeedQuizItem, FormulaAreaOfRectangleQuizItem, FormulaAreaOfSquareQuizItem, FormulaEfficiencyProblemQuizItem,
} from '../model';
import { QuizFailureDlgComponent } from '../quiz-failure-dlg/quiz-failure-dlg.component';
import { MessageDialogButtonEnum, MessageDialogInfo, MessageDialogComponent } from '../message-dialog';
import { map, startWith } from 'rxjs/operators';

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
  selector: 'app-failure-retest',
  templateUrl: './failure-retest.component.html',
  styleUrls: ['./failure-retest.component.scss']
})
export class FailureRetestComponent implements OnInit {
  listFailItems: QuizFailureItem[] = [];

  constructor(private _http: HttpClient,
    private dialog: MatDialog,
    private _dlgsvc: DialogService,
    private _authService: AuthService,
    private _router: Router) {
  }

  ngOnInit() {
    const usr = this._authService.authSubject.getValue().getUserId();
    const apiurl = environment.APIBaseUrl + 'quizfailure/' + usr;

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
              .append('Accept', 'application/json')
              .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
    this._http.get(apiurl, {
        headers: headers,
        withCredentials: true
      })
      .pipe(map((response: HttpResponse<any>) => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log('AC Math Exericse [Debug]: ' + response);
        }
        return <any>response;
      }))
      .subscribe(x => {
        if (x instanceof Array && x.length > 0) {
          for (const si of x) {
            if (environment.LoggingLevel >= LogLevel.Debug) {
              console.log('AC Math Exericse [Debug]: ' + si);
            }
            const qi: QuizFailureItem = new QuizFailureItem();
            qi.quiztype = +si.quizType;
            qi.quizid = +si.quizID;
            qi.quizfailidx = +si.quizFailIndex;
            qi.quizitemstore = si.expected;
            qi.inputted = si.inputted;
            qi.submitdate = new Date(si.submitDate);
            switch (qi.quiztype) {
              case QuizTypeEnum.add: {
                const aqi: AdditionQuizItem = new AdditionQuizItem();
                aqi.restoreFromString(si.expected);
                qi.qsInstance = aqi;
              }
              break;

              case QuizTypeEnum.sub: {
                qi.qsInstance = new SubtractionQuizItem();
                qi.qsInstance.restoreFromString(si.expected);
              }
              break;

              case QuizTypeEnum.multi: {
                qi.qsInstance = new MultiplicationQuizItem();
                qi.qsInstance.restoreFromString(si.expected);
              }
              break;

              case QuizTypeEnum.div: {
                qi.qsInstance = new DivisionQuizItem();
                qi.qsInstance.restoreFromString(si.expected);
              }
              break;

              case QuizTypeEnum.formula: {
                // This is obsoleted
                // qi.qsInstance = new FormulaQuizItemBase.restoreFromString(si.expected);
              }
              break;

              default: {
                const nqtype: number = +qi.quiztype;
                if (nqtype >= +QuizTypeEnum.formula_base && nqtype <= +QuizTypeEnum.formula_top) {
                  const nformtype: PrimarySchoolFormulaEnum = <PrimarySchoolFormulaEnum>(nqtype - +QuizTypeEnum.formula_base);
                  switch (nformtype) {
                    case PrimarySchoolFormulaEnum.CircumferenceOfCircle: {
                      qi.qsInstance = new FormulaCOfCircleQuizItem();
                      qi.qsInstance.restoreFromString(si.expected);
                    }
                    break;

                    case PrimarySchoolFormulaEnum.CircumferenceOfSquare: {
                      qi.qsInstance = new FormulaCOfSquareQuizItem();
                      qi.qsInstance.restoreFromString(si.expected);
                    }
                    break;

                    case PrimarySchoolFormulaEnum.CircumferenceOfRectangle: {
                      qi.qsInstance = new FormulaCOfRectangleQuizItem();
                      qi.qsInstance.restoreFromString(si.expected);
                    }
                    break;

                    case PrimarySchoolFormulaEnum.DistanceAndSpeed: {
                      qi.qsInstance = new FormulaDistAndSpeedQuizItem();
                      qi.qsInstance.restoreFromString(si.expected);
                    }
                    break;

                    case PrimarySchoolFormulaEnum.AreaOfRectangle: {
                      qi.qsInstance = new FormulaAreaOfRectangleQuizItem();
                      qi.qsInstance.restoreFromString(si.expected);
                    }
                    break;

                    case PrimarySchoolFormulaEnum.AreaOfSquare: {
                      qi.qsInstance = new FormulaAreaOfSquareQuizItem();
                      qi.qsInstance.restoreFromString(si.expected);
                    }
                    break;

                    case PrimarySchoolFormulaEnum.EfficiencyProblem: {
                      qi.qsInstance = new FormulaEfficiencyProblemQuizItem();
                      qi.qsInstance.restoreFromString(si.expected);
                    }
                    break;

                    default: {
                      // No support type, just skip it!
                      if (environment.LoggingLevel >= LogLevel.Debug) {
                        console.log('AC Math Exericse [Debug]: No supported item found: ' + nformtype);
                      }
                    }
                    break;
                  }
                } else {
                  // No support type, just skip it!
                  if (environment.LoggingLevel >= LogLevel.Debug) {
                    console.log('AC Math Exericse [Debug]: No supported item found: ' + qi.quiztype);
                  }
                }
                continue;
              }
            }

            this.listFailItems.push(qi);
          }
        }
      });
  }

  public canDeactivate(): boolean {
    if (this.listFailItems.length > 0) {
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

  public IsFormulaType(qt: QuizTypeEnum): boolean {
    return qt === QuizTypeEnum.formula;
  }

  public CanSubmit(): boolean {
    if (this.listFailItems.length <= 0) {
      return false;
    }

    for (const fi of this.listFailItems) {
      switch (fi.quiztype) {
        case QuizTypeEnum.add: {
          const aqi: AdditionQuizItem = <AdditionQuizItem>fi.qsInstance;
          if (aqi.InputtedResult === undefined
            || aqi.InputtedResult === null) {
              return false;
          }
        }
        break;

        case QuizTypeEnum.sub: {
          const sqi: SubtractionQuizItem = <SubtractionQuizItem>fi.qsInstance;
          if (sqi.InputtedResult === undefined
          || sqi.InputtedResult === null) {
            return false;
          }
        }
        break;

        case QuizTypeEnum.multi: {
          const mqi: MultiplicationQuizItem = <MultiplicationQuizItem>fi.qsInstance;
          if (mqi.InputtedResult === undefined
            || mqi.InputtedResult === null) {
              return false;
          }
        }
        break;

        case QuizTypeEnum.div: {
          const dqi: DivisionQuizItem = <DivisionQuizItem>fi.qsInstance;
          if (dqi.InputtedQuotient === undefined || dqi.InputtedQuotient === null
            || dqi.InputtedRemainder === undefined || dqi.InputtedRemainder === null) {
              return false;
          }
        }
        break;

        case QuizTypeEnum.formula: {
          const fqi: FormulaQuizItemBase = <FormulaQuizItemBase>fi.qsInstance;
          if (fqi.InputtedResult === undefined
            || fqi.InputtedResult === null) {
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
    for (const fi of this.listFailItems) {
      switch (fi.quiztype) {
        case QuizTypeEnum.add: {
          const aqi: AdditionQuizItem = <AdditionQuizItem>fi.qsInstance;
          if (!aqi.IsCorrect()) {
            this._dlgsvc.FailureItems.push(aqi);
          }
        }
        break;

        case QuizTypeEnum.sub: {
          const sqi: SubtractionQuizItem = <SubtractionQuizItem>fi.qsInstance;
          if (!sqi.IsCorrect()) {
            this._dlgsvc.FailureItems.push(sqi);
          }
        }
        break;

        case QuizTypeEnum.multi: {
          const mqi: MultiplicationQuizItem = <MultiplicationQuizItem>fi.qsInstance;
          if (!mqi.IsCorrect()) {
            this._dlgsvc.FailureItems.push(mqi);
          }
        }
        break;

        case QuizTypeEnum.div: {
          const dqi: DivisionQuizItem = <DivisionQuizItem>fi.qsInstance;
          if (!dqi.IsCorrect()) {
            this._dlgsvc.FailureItems.push(dqi);
          }
        }
        break;

        case QuizTypeEnum.formula: {
          const fqi: FormulaQuizItemBase = <FormulaQuizItemBase>fi.qsInstance;
          if (!fqi.IsCorrect()) {
            this._dlgsvc.FailureItems.push(fqi);
          }
        }
        break;

        default: break;
      }
    }

    if (this._dlgsvc.FailureItems.length > 0) {
      this._dlgsvc.CurrentScore = Math.round(100 - 100 * this._dlgsvc.FailureItems.length / this.listFailItems.length);
      this.dialog.open(QuizFailureDlgComponent, {
        disableClose: false,
        width: '500px'
      }).afterClosed().subscribe(x => {
        // Do nothing!
      });
    } else {
      this.listFailItems = [];

      // Also show a dialog
      const dlginfo: MessageDialogInfo = {
        Header: 'Home.Finished',
        Content: 'Home.FailureRetestFinished',
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
        this._router.navigate(['/']);
      });
    }
  }
}
