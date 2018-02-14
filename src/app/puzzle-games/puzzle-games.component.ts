import {
  Component, ViewChild, ElementRef, AfterContentInit, NgZone,
  OnInit, Renderer, HostListener, ViewChildren, QueryList
} from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import {
  RPN, SudouUnit, Sudou, generateValidSudou, SudouSize,
  PrimarySchoolMathQuiz, QuizTypeEnum, PrimarySchoolMathQuizItem,
  Cal24QuizItem, SudouQuizItem, LogLevel, QuizDegreeOfDifficulity, QuizDegreeOfDifficulity2UIString
} from '../model';
import { environment } from '../../environments/environment';
import { DialogService } from '../services/dialog.service';
import { PgSummaryDlgInfo, PgSummaryDlgComponent } from '../pg-summary-dlg';
import { MessageDialogButtonEnum, MessageDialogInfo, MessageDialogComponent } from '../message-dialog';
import { QuizService } from '../services/quiz.service';

/**
 * UI for degree of difficulity
 */
export interface DegreeOfDifficulityUI {
  value: QuizDegreeOfDifficulity;
  displayas: string;
}

@Component({
  selector: 'app-puzzle-games',
  templateUrl: './puzzle-games.component.html',
  styleUrls: ['./puzzle-games.component.scss']
})
export class PuzzleGamesComponent implements OnInit {

  /**
   * UI part
   */
  indexTab: number;
  listDod: DegreeOfDifficulityUI[];

  /**
   * Cal24 part
   */
  Cal24Input = '';
  Cal24items: number[] = [];
  private Cal24NumberRangeBgn = 1;
  private Cal24NumberRangeEnd = 9;
  Cal24Quiz: PrimarySchoolMathQuiz;
  Cal24SurrendString = '';
  @ViewChild('cal24btntbr') cal24BtnToolbar: ElementRef;

  /**
   * Sudou part
   */
  sudouQuiz: PrimarySchoolMathQuiz;
  sudouDoD: QuizDegreeOfDifficulity;
  sudouInstance: Sudou;

  /**
   * Typing tour
   */
  typingQuiz: PrimarySchoolMathQuiz;
  typingMaxLength: number;
  typingIncCaptial: boolean;
  typingIncNumber: boolean;
  typingIncSymbols: boolean;
  typingExpected: string;

  /**
   * Minesweeper
   */
  mineSweepQuiz: PrimarySchoolMathQuiz;
  mineSweepDoD: QuizDegreeOfDifficulity;

  /**
   * Gobang - row of five
   */
  gobangQuiz: PrimarySchoolMathQuiz;
  gobangDoD: QuizDegreeOfDifficulity;

  /**
   * Chinese Chess
   */
  chnchessQuiz: PrimarySchoolMathQuiz;
  chnchessDoD: QuizDegreeOfDifficulity;

  constructor(private _dlgsvc: DialogService,
    private _dialog: MatDialog,
    private _zone: NgZone,
    private _router: Router,
    private _quizService: QuizService) {
    this.indexTab = 0; // Defaul tab
    this.listDod = [];
    for (const dod in QuizDegreeOfDifficulity) {
      if (Number.isNaN(+dod)) {
      } else {
        const dodui: DegreeOfDifficulityUI = {
          value: +dod,
          displayas: QuizDegreeOfDifficulity2UIString(+dod)
        };
        this.listDod.push(dodui);
      }
    }

    this.Cal24Quiz = new PrimarySchoolMathQuiz();
    this.Cal24Quiz.QuizType = QuizTypeEnum.cal24;

    this.sudouQuiz = new PrimarySchoolMathQuiz();
    this.sudouQuiz.QuizType = QuizTypeEnum.sudou;
    this.sudouDoD = QuizDegreeOfDifficulity.medium;

    this.typingQuiz = new PrimarySchoolMathQuiz();
    this.typingQuiz.QuizType = QuizTypeEnum.typing;
    this.typingMaxLength = 20;
    this.typingIncCaptial = true;
    this.typingIncNumber = true;
    this.typingIncSymbols = true;
    this.typingExpected = '';

    this.mineSweepQuiz = new PrimarySchoolMathQuiz();
    this.mineSweepQuiz.QuizType = QuizTypeEnum.minesweep;
    this.mineSweepDoD = QuizDegreeOfDifficulity.hard;

    this.gobangQuiz = new PrimarySchoolMathQuiz();
    this.gobangQuiz.QuizType = QuizTypeEnum.gobang;
    this.gobangDoD = QuizDegreeOfDifficulity.hard;

    this.chnchessQuiz = new PrimarySchoolMathQuiz();
    this.chnchessQuiz.QuizType = QuizTypeEnum.chinesechess;
    this.chnchessDoD = QuizDegreeOfDifficulity.hard;
  }

  ngOnInit() {
  }

  public onTabSelectChanged(event: MatTabChangeEvent) {
    this.indexTab = event.index;
  }

  public canDeactivate(): boolean {
    if (this.Cal24Quiz.IsStarted || this.sudouQuiz.IsStarted || this.typingQuiz.IsStarted || this.mineSweepQuiz.IsStarted
      || this.gobangQuiz.IsStarted || this.chnchessQuiz.IsStarted) {
      const dlginfo: MessageDialogInfo = {
        Header: 'Home.Error',
        Content: 'Home.QuizIsOngoing',
        Button: MessageDialogButtonEnum.onlyok
      };

      this._dialog.open(MessageDialogComponent, {
        disableClose: false,
        width: '500px',
        data: dlginfo
      }).afterClosed().subscribe(x => {
        // Do nothing!
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log(`AC Math Exericse [Debug]: Message Dialog Result ${x}`);
        }
      });
      return false;
    }

    return true;
  }

  /**
   * Cal24 part
   */
  private Cal24(arnum: any[], nlen: number, targetNum: number): boolean {
    const opArr = new Array('+', '-', '*', '/');
    for (let i = 0; i < nlen; i++) {
      for (let j = i + 1; j < nlen; j++) {
        const numij = [arnum[i], arnum[j]];
        arnum[j] = arnum[nlen - 1];
        for (let k = 0; k < opArr.length; k++) {
          const k1: number = k % 2;
          let k2 = 0;
          if (!k1) {
            k2 = 1;
          }
          arnum[i] = '(' + numij[k1] + opArr[k] + numij[k2] + ')';
          if (this.Cal24(arnum, nlen - 1, targetNum)) {
            this.Cal24SurrendString = arnum[0];
            return true;
          }
        }
        arnum[i] = numij[0];
        arnum[j] = numij[1];
      }
    }

    const objRN = new RPN();
    const tmprest = objRN.buildExpress(arnum[0]);
    const result = objRN.WorkoutResult();

    return (nlen === 1) && (result === targetNum);
  }

  public CanCal24Start(): boolean {
    if (this.Cal24Quiz.IsStarted || this.sudouQuiz.IsStarted || this.typingQuiz.IsStarted || this.mineSweepQuiz.IsStarted
      || this.gobangQuiz.IsStarted || this.chnchessQuiz.IsStarted) {
      return false;
    }

    return true;
  }

  public OnCal24Start(): void {

    this.Cal24Input = ''; // Clear the inputs
    this.Cal24items = [];

    while (this.Cal24items.length < 4) {
      const nNum = Math.floor(Math.random() * (this.Cal24NumberRangeEnd - this.Cal24NumberRangeBgn)) + this.Cal24NumberRangeBgn;
      const nExistIdx = this.Cal24items.findIndex((val) => { return val === nNum; });
      if (nExistIdx === -1) {
        this.Cal24items.push(nNum);
      }
    }

    // Enable the buttons
    if (this.cal24BtnToolbar) {
      let btnidx = 0;
      for (const btn of this.cal24BtnToolbar.nativeElement.children) {
        if (!this.Cal24items.includes(btnidx + 1)) {
          btn.disabled = true;
        } else {
          btn.disabled = false;
        }

        btnidx ++;
      }
    }

    this.Cal24Quiz.BasicInfo = this.Cal24items.join(',');
    this.Cal24Quiz.Start(1, 0); // Single item and no failor
    this.Cal24Quiz.CurrentRun().SectionStart();
  }

  public CanCal24Submit(): boolean {
    if (!this.Cal24Quiz.IsStarted) {
      return false;
    }
    if (this.Cal24Input.length <= 0) {
      return false;
    }

    return true;
  }

  public OnCal24Append(char: string): void {
    this.Cal24Input += char;
  }
  public OnCal24Backspace(): void {
    if (this.Cal24Input.length > 1) {
      this.Cal24Input = this.Cal24Input.substring(0, this.Cal24Input.length - 1);
    } else {
      this.Cal24Input = '';
    }
  }
  public OnCal24Reset(): void {
    this.Cal24Input = '';
  }

  public OnCal24Submit(): void {
    let rst = 0;
    let errmsg = '';

    try {
      let realstring = this.Cal24Input.replace('×', '*');
      realstring = realstring.replace('÷', '/');
      rst = <number>eval(realstring);
    } catch (exp) {
      errmsg = exp.toString();
    }

    if (rst !== 24) {
      const dlginfo: MessageDialogInfo = {
        Header: 'Home.Error',
        Content: errmsg ? errmsg : (this.Cal24Input + ' = ' + rst.toString() + ' != 24'),
        Button: MessageDialogButtonEnum.onlyok
      };

      this._dialog.open(MessageDialogComponent, {
        disableClose: false,
        width: '500px',
        data: dlginfo
      }).afterClosed().subscribe(x => {
        // Do nothing!
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log(`AC Math Exericse [Debug]: Message Dialog Result ${x}`);
        }
      });
    } else {
      // Success
      this.Cal24Quiz.SubmitCurrentRun();

      // Save it!
      this._quizService.saveDB(this.Cal24Quiz).subscribe(x => {
        // Do nothing for now
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log(`AC Math Exericse [Debug]: Save quiz: ${x}`);
        }
      }, error => {
        if (environment.LoggingLevel >= LogLevel.Error) {
          console.error(`AC Math Exericse [Debug]: Error in save quiz ${error}`);
        }
      });

      const di: PgSummaryDlgInfo = {
        gameWin: true,
        timeSpent: this.Cal24Quiz.ElderRuns()[0].TimeSpent,
        haveARetry: true
      };

      this._dialog.open(PgSummaryDlgComponent, {
        width: '500px',
        data: di
      }).afterClosed().subscribe(x => {
        if (di.haveARetry) {
          this.OnCal24Start();
        }
      });
    }
  }

  public OnCal24Surrender(): void {
    const arnums: number[] = [];
    for (const n of this.Cal24items) {
      arnums.push(n);
    }

    const fitem: Cal24QuizItem = new Cal24QuizItem();
    fitem.IsSurrended = true;
    fitem.Items = this.Cal24items;
    const fitems = [];
    fitems.push(fitem);
    this.Cal24Quiz.SubmitCurrentRun(fitems);

    // Save it!
    this._quizService.saveDB(this.Cal24Quiz).subscribe(x => {
      // Do nothing for now
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`AC Math Exericse [Debug]: Save quiz: ${x}`);
      }
    }, error => {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.error(`AC Math Exericse [Debug]: Error in save quiz ${error}`);
      }
    });

    // Prepare the dialog for the correct answer
    const dlginfo: MessageDialogInfo = {
      Header: 'Home.Error',
      Content: '',
      Button: MessageDialogButtonEnum.onlyok
    };
    if (this.Cal24(arnums, arnums.length, 24)) {
      dlginfo.Content = this.Cal24SurrendString + ' = 24';
    } else {
      // No suitable errors
      dlginfo.Content = 'Home.Cal24NoSolution';
    }

    this._dialog.open(MessageDialogComponent, {
      disableClose: false,
      width: '500px',
      data: dlginfo
    }).afterClosed().subscribe(x => {
      // Do nothing!
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`AC Math Exericse [Debug]: Message Dialog Result ${x}`);
      }

      const di: PgSummaryDlgInfo = {
        gameWin: false,
        timeSpent: this.Cal24Quiz.ElderRuns()[0].TimeSpent,
        haveARetry: true
      };

      this._dialog.open(PgSummaryDlgComponent, {
        width: '500px',
        data: di
      }).afterClosed().subscribe((x) => {
        if (di.haveARetry) {
          this.OnCal24Start();
        }
      });
    });
  }

  /**
   * Sudou part
   */
  public CanSudouStart(): boolean {
    if (this.Cal24Quiz.IsStarted || this.sudouQuiz.IsStarted || this.typingQuiz.IsStarted || this.mineSweepQuiz.IsStarted
      || this.gobangQuiz.IsStarted || this.chnchessQuiz.IsStarted) {
      return false;
    }

    return true;
  }

  public OnSudouStart(): void {
    this.sudouInstance = generateValidSudou();

    this.sudouQuiz.BasicInfo = this.sudouInstance.print2String().substring(0, 45);
    this.sudouQuiz.Start(1, 0); // Single item and no failor
    this.sudouQuiz.CurrentRun().SectionStart();
  }

  public OnSudouSurrender(): void {
    const fitem: SudouQuizItem = new SudouQuizItem();
    fitem.IsSurrended = true;
    fitem.DetailInfo = this.sudouQuiz.BasicInfo.substring(0, 45);
    const fitems = [];
    fitems.push(fitem);
    this.sudouQuiz.SubmitCurrentRun(fitems);

    // Save it!
    this._quizService.saveDB(this.sudouQuiz).subscribe(x => {
      // Do nothing for now
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`AC Math Exericse [Debug]: Save quiz: ${x}`);
      }
    }, error => {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.error(`AC Math Exericse [Debug]: Error in save quiz ${error}`);
      }
    });

    const di: PgSummaryDlgInfo = {
      gameWin: false,
      timeSpent: this.sudouQuiz.ElderRuns()[0].TimeSpent,
      haveARetry: true
    };

    this._dialog.open(PgSummaryDlgComponent, {
      width: '500px',
      data: di
    }).afterClosed().subscribe(x => {
      if (di.haveARetry) {
        this.OnSudouStart();
      }
    });
  }

  public OnSudouComplete(): void {
    this.sudouQuiz.SubmitCurrentRun();
    // Save it!
    this._quizService.saveDB(this.sudouQuiz).subscribe(x => {
      // Do nothing for now
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`AC Math Exericse [Debug]: Save quiz: ${x}`);
      }
    }, error => {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.error(`AC Math Exericse [Debug]: Error in save quiz ${error}`);
      }
    });

    const di: PgSummaryDlgInfo = {
      gameWin: true,
      timeSpent: this.sudouQuiz.ElderRuns()[0].TimeSpent,
      haveARetry: true
    };

    this._dialog.open(PgSummaryDlgComponent, {
      width: '500px',
      data: di
    }).afterClosed().subscribe(x => {
      if (di.haveARetry) {
        this.OnSudouStart();
      }
    });
  }

  /**
   * Typing tour
   */
  private typingGenerateExpectedString() {
    let basic = 'abcdefghijklmnopqrstuvwxyz';
    if (this.typingIncCaptial) {
      basic = basic + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (this.typingIncNumber) {
      basic = basic + '0123456789';
    }
    if (this.typingIncSymbols) {
      basic = basic + ',.;\'`!@#$%^&*()_+-=[]{}\|<>?:';
    }

    this.typingExpected = '';
    for (let i = 0; i < this.typingMaxLength; i++) {
      const word = basic.charAt(Math.floor(Math.random() * basic.length));
      this.typingExpected += word;
    }
  }

  public CanTypingStart(): boolean {
    if (this.Cal24Quiz.IsStarted || this.sudouQuiz.IsStarted || this.typingQuiz.IsStarted || this.mineSweepQuiz.IsStarted
      || this.gobangQuiz.IsStarted || this.chnchessQuiz.IsStarted) {
      return false;
    }

    return true;
  }

  public OnTypingStart(): void {
    this.typingGenerateExpectedString();

    this.typingQuiz.BasicInfo = this.typingMaxLength.toString() + ';'
      + (this.typingIncCaptial ? '1' : '0') + ';'
      + (this.typingIncNumber ? '1' : '0') + ';'
      + (this.typingIncSymbols ? '1' : '0') + ';';
    this.typingQuiz.Start(1, 0); // Single item and no failor
    this.typingQuiz.CurrentRun().SectionStart();
  }

  public OnTypingSurrender(): void {
    const fitem: SudouQuizItem = new SudouQuizItem();
    fitem.IsSurrended = true;
    fitem.DetailInfo = this.typingQuiz.BasicInfo.substring(0, 45);

    const fitems = [];
    fitems.push(fitem);
    this.typingQuiz.SubmitCurrentRun(fitems);

    // Save it!
    this._quizService.saveDB(this.typingQuiz).subscribe(x => {
      // Do nothing for now
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`AC Math Exericse [Debug]: Save quiz: ${x}`);
      }
    }, error => {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.log(`AC Math Exericse [Debug]: Error in save quiz ${error}`);
      }
    });

    const di: PgSummaryDlgInfo = {
      gameWin: false,
      timeSpent: this.typingQuiz.ElderRuns()[0].TimeSpent,
      haveARetry: true
    };

    this._dialog.open(PgSummaryDlgComponent, {
      width: '500px',
      data: di
    }).afterClosed().subscribe(x => {
      if (di.haveARetry) {
        this.OnTypingStart();
      }
    });
  }

  public OnTypingComplete(): void {
    this.typingQuiz.SubmitCurrentRun();
    // Save it!
    this._quizService.saveDB(this.typingQuiz).subscribe(x => {
      // Do nothing for now
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`AC Math Exericse [Debug]: Save quiz: ${x}`);
      }
    }, error => {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.log(`AC Math Exericse [Debug]: Error in save quiz ${error}`);
      }
    });

    const di: PgSummaryDlgInfo = {
      gameWin: true,
      timeSpent: this.typingQuiz.ElderRuns()[0].TimeSpent,
      haveARetry: true
    };

    this._dialog.open(PgSummaryDlgComponent, {
      width: '500px',
      data: di
    }).afterClosed().subscribe(x => {
      if (di.haveARetry) {
        this.OnTypingStart();
      }
    });
  }

  /**
   * Minesweeper
   */
  public CanMineSweepStart(): boolean {
    if (this.Cal24Quiz.IsStarted || this.sudouQuiz.IsStarted || this.typingQuiz.IsStarted || this.mineSweepQuiz.IsStarted
      || this.gobangQuiz.IsStarted || this.chnchessQuiz.IsStarted) {
      return false;
    }

    return true;
  }

  public OnMineSweepStart(): void {
    this.mineSweepQuiz.BasicInfo = '';
    this.mineSweepQuiz.Start(1, 0); // Single item and no failor
    this.mineSweepQuiz.CurrentRun().SectionStart();
  }

  public onMinesweeperStarted(data: any): void {
    // Just do nothing for now.
    // this.mineSweepQuiz.BasicInfo = '';
    // this.mineSweepQuiz.Start(1, 0); // Single item and no failor
    // this.mineSweepQuiz.CurrentRun().SectionStart();
  }

  public onMinesweeperFinished(rst: boolean): void {
    if (rst) {
      // Succeed
      this.mineSweepQuiz.SubmitCurrentRun();
    } else {
      // Failed
      // Failed item => Need add
      this.mineSweepQuiz.SubmitCurrentRun();
    }

    // Save it!
    this._quizService.saveDB(this.mineSweepQuiz).subscribe(x => {
      // Do nothing for now
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`AC Math Exericse [Debug]: Save quiz: ${x}`);
      }
    }, error => {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.log(`AC Math Exericse [Debug]: Error in save quiz ${error}`);
      }
    });

    const di: PgSummaryDlgInfo = {
      gameWin: rst,
      timeSpent: this.mineSweepQuiz.ElderRuns()[0].TimeSpent,
      haveARetry: true
    };

    this._dialog.open(PgSummaryDlgComponent, {
      width: '500px',
      data: di
    }).afterClosed().subscribe(x => {
      if (di.haveARetry) {
        this.OnMineSweepStart();
      }
    });
  }

  public OnMineSweepSurrender(): void {
    this.mineSweepQuiz.SubmitCurrentRun();
    // Save it!
    this._quizService.saveDB(this.mineSweepQuiz).subscribe(x => {
      // Do nothing for now
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`AC Math Exericse [Debug]: Save quiz: ${x}`);
      }
    }, error => {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.log(`AC Math Exericse [Debug]: Error in save quiz ${error}`);
      }
    });

    const di: PgSummaryDlgInfo = {
      gameWin: false,
      timeSpent: this.mineSweepQuiz.ElderRuns()[0].TimeSpent,
      haveARetry: true
    };

    this._dialog.open(PgSummaryDlgComponent, {
      width: '500px',
      data: di
    }).afterClosed().subscribe(x => {
      if (di.haveARetry) {
        this.OnMineSweepStart();
      }
    });
  }

  /**
   * Gobang
   */
  public CanGobangStart(): boolean  {
    if (this.Cal24Quiz.IsStarted || this.sudouQuiz.IsStarted || this.typingQuiz.IsStarted || this.mineSweepQuiz.IsStarted
      || this.gobangQuiz.IsStarted || this.chnchessQuiz.IsStarted) {
      return false;
    }

    return true;
  }

  public OnGobangStart(): void {
    this.gobangQuiz.BasicInfo = '';
    this.gobangQuiz.Start(1, 0); // Single item and no failor
    this.gobangQuiz.CurrentRun().SectionStart();
  }

  public onGobangStarted(data: any): void {
    // Do nothing so far
  }

  public onGobangFinished(rst: boolean): void {
    if (rst) {
      // Succeed
      this.gobangQuiz.SubmitCurrentRun();
    } else {
      // Failed
      // Failed item => Need add
      this.gobangQuiz.SubmitCurrentRun();
    }

    // Save it!
    this._quizService.saveDB(this.gobangQuiz).subscribe(x => {
      // Do nothing for now
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`AC Math Exericse [Debug]: Save quiz: ${x}`);
      }
    }, error => {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.log(`AC Math Exericse [Debug]: Error in save quiz ${error}`);
      }
    });

    const di: PgSummaryDlgInfo = {
      gameWin: rst,
      timeSpent: this.gobangQuiz.ElderRuns()[0].TimeSpent,
      haveARetry: true
    };

    this._dialog.open(PgSummaryDlgComponent, {
      width: '500px',
      data: di
    }).afterClosed().subscribe(x => {
      if (di.haveARetry) {
        this.OnGobangStart();
      }
    });
  }

  public OnGobangSurrender(): void {
    this.gobangQuiz.SubmitCurrentRun();

    // Save it!
    this._quizService.saveDB(this.gobangQuiz).subscribe(x => {
      // Do nothing for now
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`AC Math Exericse [Debug]: Save quiz: ${x}`);
      }
    }, error => {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.log(`AC Math Exericse [Debug]: Error in save quiz ${error}`);
      }
    });

    const di: PgSummaryDlgInfo = {
      gameWin: false,
      timeSpent: this.gobangQuiz.ElderRuns()[0].TimeSpent,
      haveARetry: true
    };

    this._dialog.open(PgSummaryDlgComponent, {
      width: '500px',
      data: di
    }).afterClosed().subscribe(x => {
      if (di.haveARetry) {
        this.OnGobangStart();
      }
    });
  }

  /**
   * Chinese Chess
   */
  public OnChineseChessStart(): void {
    this.chnchessQuiz.BasicInfo = '';
    this.chnchessQuiz.Start(1, 0); // Single item and no failor
    this.chnchessQuiz.CurrentRun().SectionStart();
  }

  public onChineseChessStarted(data: any): void {
    // Do nothing
  }

  public CanChineseChessStart(): boolean {
    if (this.Cal24Quiz.IsStarted || this.sudouQuiz.IsStarted || this.typingQuiz.IsStarted || this.mineSweepQuiz.IsStarted
      || this.gobangQuiz.IsStarted || this.chnchessQuiz.IsStarted) {
      return false;
    }

    return true;
  }

  public OnChineseChessSurrender(): void {
    this.chnchessQuiz.SubmitCurrentRun();
    // Save it!
    this._quizService.saveDB(this.chnchessQuiz).subscribe(x => {
      // Do nothing for now
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`AC Math Exericse [Debug]: Save quiz: ${x}`);
      }
    }, error => {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.log(`AC Math Exericse [Debug]: Error in save quiz ${error}`);
      }
    });

    const di: PgSummaryDlgInfo = {
      gameWin: false,
      timeSpent: this.chnchessQuiz.ElderRuns()[0].TimeSpent,
      haveARetry: true
    };

    this._dialog.open(PgSummaryDlgComponent, {
      width: '500px',
      data: di
    }).afterClosed().subscribe(x => {
      if (di.haveARetry) {
        this.OnChineseChessStart();
      }
    });
  }

  public onChineseChessFinished(rst: boolean): void {
    if (rst) {
      // Succeed
      this.chnchessQuiz.SubmitCurrentRun();
    } else {
      // Failed
      // Failed item => Need add
      this.chnchessQuiz.SubmitCurrentRun();
    }

    // Save it!
    this._quizService.saveDB(this.chnchessQuiz).subscribe(x => {
      // Do nothing for now
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`AC Math Exericse [Debug]: Save quiz: ${x}`);
      }
    }, error => {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.log(`AC Math Exericse [Debug]: Error in save quiz ${error}`);
      }
    });

    const di: PgSummaryDlgInfo = {
      gameWin: rst,
      timeSpent: this.chnchessQuiz.ElderRuns()[0].TimeSpent,
      haveARetry: true
    };

    this._dialog.open(PgSummaryDlgComponent, {
      width: '500px',
      data: di
    }).afterClosed().subscribe(x => {
      if (di.haveARetry) {
        this.OnChineseChessStart();
      }
    });
  }
}
