
import { QuizSplitter } from './quizconstants';
import * as moment from 'moment';
import { DateFormat } from './datedef';

/**
 * Quiz type
 */
export enum QuizTypeEnum {
  add = 1,
  sub = 2,
  multi = 3,
  div = 4,
  formula = 5,
  cal24 = 6,        // Calculate
  sudou = 7,        // Sudou
  typing = 8,       // Typing
  mixedop = 9,      // Mixed Operation
  minesweep = 10,   // Mine Sweeper
  gobang = 11,      // Gobang, also known as 'row of five'
  chinesechess = 12 // Chinese Chess
}

export interface QuizTypeUI {
  qtype: QuizTypeEnum;
  i18term: string;
  display: string;
}

export interface UserQuizInfo {
  quizid: number;
  quizdate: moment.Moment;
  quiztype: QuizTypeEnum;
  quizscore: number;
  quiztime: number;
}

/**
 * Get I18N string for specified quiz type
 * @param qt Quiz type
 */
export function QuizTypeEnum2UIString(qt: QuizTypeEnum): string {
  let rst = '';
  switch (qt) {
    case QuizTypeEnum.add: rst = 'Home.AdditionExercises'; break;
    case QuizTypeEnum.sub: rst = 'Home.SubtractionExercises'; break;
    case QuizTypeEnum.multi: rst = 'Home.MultiplicationExercises'; break;
    case QuizTypeEnum.div: rst = 'Home.DivisionExercises'; break;
    case QuizTypeEnum.formula: rst = 'Home.FormulaExercises'; break;
    case QuizTypeEnum.cal24: rst = 'Home.Calculate24'; break;
    case QuizTypeEnum.sudou: rst = 'Home.Sudou'; break;
    case QuizTypeEnum.typing: rst = 'Home.TypingTutor'; break;
    case QuizTypeEnum.mixedop: rst = 'Home.MixedOperations'; break;
    case QuizTypeEnum.minesweep: rst = 'Home.Minesweeper'; break;
    case QuizTypeEnum.gobang: rst = 'Home.Gobang'; break;
    case QuizTypeEnum.chinesechess: rst = 'Home.ChineseChess'; break;
    default: break;
  }

  return rst;
}

/**
 * Degree of difficulity
 */
export enum QuizDegreeOfDifficulity {
  easy = 0,
  medium = 1,
  hard = 2
}

/**
 * Get I18N string for difficulity, returns a string
 * @param qd Degree of difficulity
 */
export function QuizDegreeOfDifficulity2UIString(qd: QuizDegreeOfDifficulity): string {
  let rst = '';
  switch (qd) {
    case QuizDegreeOfDifficulity.easy: rst = 'Home.Easy'; break;
    case QuizDegreeOfDifficulity.medium: rst = 'Home.Medium'; break;
    case QuizDegreeOfDifficulity.hard: rst = 'Home.Hard'; break;
    default: break;
  }

  return rst;
}

/**
 * Quiz item
 */
export abstract class QuizItem {
  private _index: number;
  get QuizIndex(): number {
    return this._index;
  }
  set QuizIndex(idx: number) {
    this._index = idx;
  }

  constructor() {
    this._index = 0;
  }

  public IsCorrect(): boolean {
    if (!this.canCalcResult()) {
      return false;
    }

    return true;
  }

  public getQuizFormat(): string {
    return '';
  }

  public storeToString(): string {
    const jobj: any = this.storeToJsonObject();
    return JSON && JSON.stringify(jobj);
  }
  public restoreFromString(str: string) {
    const jobj = JSON.parse(str);
    this.restoreFromJsonObject(jobj);

    if (this.canCalcResult()) {
      this.calcResult();
    }
  }

  protected storeToJsonObject(): any {
    return {};
  }
  protected restoreFromJsonObject(data: any) {
    // Do nothing
  }

  protected canCalcResult(): boolean {
    return true; // Default is true
  }
  protected calcResult(): void {
    // Do nothing
  }
}

/**
 * Math quiz item for Primary School
 */
export class PrimarySchoolMathQuizItem extends QuizItem {
  public IsCorrect(): boolean {
    if (!super.IsCorrect()) {
      return false;
    }
    return true;
  }

  public getQuizFormat(): string {
    const rststr = super.getQuizFormat();
    return rststr;
  }

  public getCorrectFormula(): string {
    return '';
  }

  public getInputtedForumla(): string {
    return '';
  }

  protected storeToJsonObject(): any {
    return super.storeToJsonObject();
  }

  protected restoreFromJsonObject(data: any): void {
    super.restoreFromJsonObject(data);
  }

  protected canCalcResult(): boolean {
    if (!super.canCalcResult()) {
      return false;
    }
    return true;
  }
  protected calcResult(): void {
    // Do nothing
  }
}

/**
 * Quiz item for FAO
 * four arithmetic operations
 */
export class PrimarySchoolMathFAOQuizItem extends PrimarySchoolMathQuizItem {
  protected _leftNumber: number;
  protected _rightNumber: number;
  protected _decimalPlaces: number;

  get LeftNumber(): number {
    return this._leftNumber;
  }
  get RightNumber(): number {
    return this._rightNumber;
  }
  get decimalPlaces(): number {
    return this._decimalPlaces;
  }

  constructor(lft?: number, right?: number, dplace?: number) {
    super();

    if (dplace) {
      this._decimalPlaces = dplace;
    } else {
      this._decimalPlaces = 0; // By default, it is 0
    }

    if (lft) {
      if (this._decimalPlaces > 0) {
        this._leftNumber = parseFloat(lft.toFixed(this._decimalPlaces));
      } else {
        this._leftNumber = Math.round(lft);
      }
    }
    if (right) {
      if (this._decimalPlaces > 0) {
        this._rightNumber = parseFloat(right.toFixed(this._decimalPlaces));
      } else {
        this._rightNumber = Math.round(right);
      }
    }

    if (this.canCalcResult()) {
      this.calcResult();
    }
  }

  public IsCorrect(): boolean {
    if (!super.IsCorrect()) {
      return false;
    }
    return true;
  }

  public getQuizFormat(): string {
    const rststr = super.getQuizFormat();
    return rststr;
  }

  public getCorrectFormula(): string {
    const rststr = super.getCorrectFormula();
    return rststr;
  }

  public getInputtedForumla(): string {
    const rststr = super.getInputtedForumla();
    return rststr;
  }

  protected storeToJsonObject(): any {
    const jobj = super.storeToJsonObject();
    jobj.leftNumber = this._leftNumber;
    jobj.rightNumber = this._rightNumber;
    jobj.decimalPlaces = this.decimalPlaces;
    return jobj;
  }
  protected restoreFromJsonObject(jobj: any) {
    if (jobj && jobj.leftNumber) {
      this._leftNumber = +jobj.leftNumber;
    }
    if (jobj && jobj.rightNumber) {
      this._rightNumber = +jobj.rightNumber;
    }
    if (jobj && jobj.decimalPlaces) {
      this._decimalPlaces = +jobj.decimalPlaces;
    } else {
      this._decimalPlaces = 0;
    }
  }
  protected canCalcResult(): boolean {
    if (!super.canCalcResult()) {
      return false;
    }
    if (this._leftNumber === undefined || this._rightNumber === undefined) {
      return false;
    }

    return true;
  }
  protected calcResult(): void {
    super.calcResult();
  }
}

/**
 * Quiz section
 */
export class PrimarySchoolMathQuizSection {
  private _sectionNumber: number;
  get SectionNumber(): number {
    return this._sectionNumber;
  }

  private _itemCount: number;
  get ItemsCount(): number {
    return this._itemCount;
  }
  set ItemsCount(ic: number) {
    this._itemCount = ic;
  }

  private _itemFailed: number;
  get ItemsFailed(): number {
    return this._itemFailed;
  }
  set ItemsFailed(ifed: number) {
    this._itemFailed = ifed;
  }

  private _startPoint: number;
  private _timeSpent: number;
  get TimeSpent(): number {
    return this._timeSpent;
  }

  constructor(scn: number, ic: number) {
    this._sectionNumber = scn;

    this.ItemsCount = ic;
  }

  public SectionStart() {
    this._startPoint = new Date().getTime();
  }
  public SectionComplete() {
    const stoppnt = new Date().getTime();
    this._timeSpent = Math.round((stoppnt - this._startPoint) / 1000);
  }

  public getSummaryInfo(): string {
    let rst: string = 'BATCH#' + this.SectionNumber.toString() + ';';
    rst = rst + ' total items: ' + this.ItemsCount.toString() + '; '
      + (this.ItemsFailed > 0 ? ' Failed : ' + this.ItemsFailed.toString() : '');
    rst = rst += ' Time spent: ' + this.TimeSpent.toString() + ' s';
    return rst;
  }
}

/**
 * Math Quiz base info
 */
export interface PrimarySchoolQuizBaseInfo {
  getBaseInfo(): string;
}

/**
 * Math quiz for Primary School
 */
export class PrimarySchoolMathQuiz {
  private _elderRun: PrimarySchoolMathQuizSection[] = [];
  private _curRun: PrimarySchoolMathQuizSection;
  private _faileFactor: number;
  private _isStarted: boolean;
  private _qtype: QuizTypeEnum;
  private _qbaseinfo: string;
  private _curRunID: number; // Current run ID
  private _failedItems: PrimarySchoolMathQuizItem[] = [];

  // Elder runs
  public ElderRuns(): PrimarySchoolMathQuizSection[] {
    return this._elderRun;
  }

  // Current run/section
  public CurrentRun(): PrimarySchoolMathQuizSection {
    return this._curRun;
  }

  // Failed factor
  get FailedFactor(): number {
    return this._faileFactor;
  }
  set FailedFactor(ff: number) {
    this._faileFactor = ff;
  }

  // Is started
  get IsStarted(): boolean {
    return this._isStarted;
  }

  // Quiz type
  get QuizType(): QuizTypeEnum {
    return this._qtype;
  }
  set QuizType(qt: QuizTypeEnum) {
    this._qtype = qt;
  }

  // Quiz base info
  get BasicInfo(): string {
    return this._qbaseinfo;
  }
  set BasicInfo(bi: string) {
    this._qbaseinfo = bi;
  }

  // Failed items
  get FailedItems(): PrimarySchoolMathQuizItem[] {
    return this._failedItems;
  }

  /**
   * Constructor
   */
  constructor() {
    this.init();
  }

  /**
   * Initial the internal variables
   */
  private init(): void {
    this._curRunID = 1;
    this._faileFactor = 0;
    this._isStarted = false;
    this._curRun = null;
    this._elderRun = [];
  }

  /**
   * Start the quiz
   * @param startnum: Initial number of the questions
   * @param failfactor: Factor of the failure
   */
  public Start(startnum: number, failfactor: number) {
    if (this._isStarted || this._curRun !== null) {
      throw new Error('Quiz already started!');
    }

    // Empty the elder run
    this.init();

    this._faileFactor = failfactor;
    this._curRun = new PrimarySchoolMathQuizSection(this._curRunID, startnum);

    this._isStarted = true;
  }

  /**
   * Submit current run(section)
   *  If there are failed items and factor of failure is not zero, a new run(section ) will be started
   * @param failedItems The failed items
   */
  public SubmitCurrentRun(failedItems?: PrimarySchoolMathQuizItem[]) {
    if (failedItems !== null && failedItems !== undefined && failedItems.length > 0) {
      this._curRun.ItemsFailed = failedItems.length;
      for (const fi of failedItems) {
        this._failedItems.push(fi);
      }
    } else {
      this._curRun.ItemsFailed = 0;
    }
    this._curRun.SectionComplete();
    this._elderRun.push(this._curRun);

    const ncnt = Math.round(this._curRun.ItemsFailed * this._faileFactor);
    if (ncnt > 0) {
      const curID = this._curRun.SectionNumber;
      this._curRun = new PrimarySchoolMathQuizSection(curID + 1, ncnt);
    } else {
      this.Stop();
    }
  }

  private Stop() {
    // As no failure, stop the current quiz
    this._curRun = null;
    this._curRunID = 1;
    this._isStarted = false;
  }
}

/**
 * Interface when communicating with API after Quiz submitted successfully
 */
export interface QuizCreateResultJSON {
  quizID: number;
  totalAwardPoint: number;
  awardIDList: number[];
}

/**
 * API for quiz
 * Used to communicate with API
 */
export class APIQuizSection {
  sectionID: number;
  timeSpent: number;
  totalItems: number;
  failedItems: number;

  public fromPSMathQuizSection(qs: PrimarySchoolMathQuizSection) {
    this.sectionID = qs.SectionNumber;
    this.timeSpent = qs.TimeSpent;
    this.totalItems = qs.ItemsCount;
    this.failedItems = qs.ItemsFailed;
  }
}

/**
 * Failured log
 */
export class APIQuizFailLog {
  quizFailIndex: number;
  expected: string;
  inputted: string;

  public fromPSMathQuizFailed(fl: PrimarySchoolMathQuizItem) {
    this.quizFailIndex = fl.QuizIndex;
    this.expected = fl.storeToString();
    this.inputted = fl.getInputtedForumla();
  }
}

/**
 * Quiz of API
 */
export class APIQuiz {
  quizID: number;
  quizType: QuizTypeEnum;
  basicInfo: string;
  submitDate: string;
  attendUser: string;
  failLogs: APIQuizFailLog[] = [];
  sections: APIQuizSection[] = [];
  get quizTypeString(): string {
    return QuizTypeEnum2UIString(this.quizType);
  }

  private _totalScore: number;
  get TotalScore(): number {
    return this._totalScore;
  }
  set TotalScore(ts: number) {
    this._totalScore = ts;
  }

  private _totalAverageTime: number;
  get TotalAverageTime(): number {
    return this._totalAverageTime;
  }
  set TotalAverageTime(tat: number) {
    this._totalAverageTime = tat;
  }

  // get averageScore(): number {
  //     let total: number = 0;
  //     let corr: number = 0;
  //     for(let sec of this.sections) {
  //         total += sec.totalItems;
  //         corr += (sec.totalItems - sec.failedItems);
  //     }
  //     return Math.round(100 * corr / total);
  // }
  // get averageTimeSpent(): number {
  //     let total: number = 0;
  //     let tspent: number = 0;
  //     for(let sec of this.sections) {
  //         total += sec.totalItems;
  //         tspent += sec.timeSpent;
  //     }
  //     return Math.round(tspent / total);
  // }

  public fromPSMathQuiz(objQuiz: PrimarySchoolMathQuiz, atuser: string) {
    this.quizType = objQuiz.QuizType;
    this.basicInfo = objQuiz.BasicInfo;
    this.submitDate = moment().format(DateFormat);
    this.attendUser = atuser;

    for (const fl of objQuiz.FailedItems) {
      const flog: APIQuizFailLog = new APIQuizFailLog();
      flog.fromPSMathQuizFailed(fl);
      this.failLogs.push(flog);
    }

    for (const qs of objQuiz.ElderRuns()) {
      const qsect: APIQuizSection = new APIQuizSection();
      qsect.fromPSMathQuizSection(qs);

      this.sections.push(qsect);
    }
  }
}
