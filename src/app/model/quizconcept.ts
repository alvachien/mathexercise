
import { QuizSplitter } from './quizconstants';
import * as moment from 'moment';
import { DateFormat } from './datedef';
import { IStorableObject, StorableObject } from './uicommon';

/**
 * Quiz type
 */
export enum QuizTypeEnum {
  add = 1,
  sub = 2,
  multi = 3,
  div = 4,
  cal24 = 6,          // Calculate
  sudou = 7,          // Sudou
  typing = 8,         // Typing
  mixedop = 9,        // Mixed Operation
  minesweep = 10,     // Mine Sweeper
  gobang = 11,        // Gobang, also known as 'row of five'
  chinesechess = 12,  // Chinese Chess

  /** Number range: 90 - 120 reserved for formulas
   * Logic:
   * Use the quiz type - formula base => real form type PrimarySchoolFormulaEnum
  */
  formula_base = 90,  // Forumla base
  formula_top = 120,  // Forumla top

  /**
   * Obsoleted
   */
  formula = 5,        // OBSELETED
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
export abstract class QuizItem extends StorableObject {
  private _index: number;
  get QuizIndex(): number {
    return this._index;
  }
  set QuizIndex(idx: number) {
    this._index = idx;
  }

  constructor() {
    super();
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

  protected storeToJsonObject(): any {
    return super.storeToJsonObject();
  }
  protected restoreFromJsonObject(data: any) {
    super.restoreFromJsonObject(data);
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
 * Control of the quiz
 */
export class QuizBasicControl extends StorableObject {
  private _numOfQ: number;
  private _failFactor: number;
  get numberOfQuestions(): number {
    return this._numOfQ;
  }
  set numberOfQuestions(noq: number) {
    this._numOfQ = noq;
  }

  get failFactor(): number {
    return this._failFactor;
  }
  set failFactor(ff: number) {
    this._failFactor = ff;
  }

  constructor() {
    super();

    this.failFactor = 0;
    this._numOfQ = 1;
  }

  isEqual(other: QuizBasicControl): boolean {
    return this._numOfQ === other._numOfQ
      && this._failFactor === other._failFactor;
  }

  protected storeToJsonObject(): any {
    const jobj: any = super.storeToJsonObject();
    jobj.numofq = this._numOfQ;
    jobj.failfact = this._failFactor;
    return jobj;
  }
  protected restoreFromJsonObject(data: any) {
    super.restoreFromJsonObject(data);
    if (data && data.numofq) {
      this._numOfQ = +data.numofq;
    }
    if (data && data.failfact) {
      this._failFactor = +data.failfact;
    }
  }
}

export class PrimarySchoolMathMixOpControl extends QuizBasicControl {
  private _numberBegin: number;
  private _numberEnd: number;
  private _numOfOp: number;
  private _decimalPlaces: number;
  private _decimalOccurs: boolean;
  private _negativeOccurs: boolean;
  get numberBegin(): number {
    return this._numberBegin;
  }
  set numberBegin(lnb: number) {
    this._numberBegin = lnb;
  }
  get numberEnd(): number {
    return this._numberEnd;
  }
  set numberEnd(lne: number) {
    this._numberEnd = lne;
  }
  get numberOfOperators(): number {
    return this._numOfOp;
  }
  set numberOfOperators(noo: number) {
    this._numOfOp = noo;
  }
  get decimalPlaces(): number {
    return this._decimalPlaces;
  }
  set decimalPlaces(dp: number) {
    this._decimalPlaces = dp;
  }
  get decimalOccur(): boolean {
    return this._decimalOccurs;
  }
  set decimalOccur(doc: boolean) {
    this._decimalOccurs = doc;
  }
  get negativeOccur(): boolean {
    return this._negativeOccurs;
  }
  set negativeOccur(noc: boolean) {
    this._negativeOccurs = noc;
  }

  constructor() {
    super();

    this._numberBegin = 1;
    this._numberEnd = 100;
    this._numOfOp = 1;
    this._decimalPlaces = 0;
    this._decimalOccurs = false;
    this._negativeOccurs = false;
  }

  isEqual(other: PrimarySchoolMathMixOpControl): boolean {
    if (!super.isEqual(other)) {
      return false;
    }

    return this._numberBegin === other._numberBegin
      && this._numberEnd === other._numberEnd
      && this._numOfOp === other._numOfOp
      && this._decimalPlaces === other._decimalPlaces
      && this._decimalOccurs === other._decimalOccurs
      && this._negativeOccurs === other._negativeOccurs
      ;
  }
  protected storeToJsonObject(): any {
    const jobj: any = super.storeToJsonObject();
    jobj.nbgn = this._numberBegin;
    jobj.nend = this._numberEnd;
    jobj.noop = this._numOfOp;
    jobj.dplace = this._decimalPlaces;
    jobj.dpocur = this._decimalOccurs;
    jobj.ngocur = this._negativeOccurs;
    return jobj;
  }
  protected restoreFromJsonObject(data: any) {
    super.restoreFromJsonObject(data);
    if (data && data.nbgn) {
      this._numberBegin = +data.nbgn;
    }
    if (data && data.nend) {
      this._numberEnd = +data.nend;
    }
    if (data && data.noop) {
      this._numOfOp = +data.noop;
    } else {
      this._numOfOp = 1;
    }
    if (data && data.dplace) {
      this._decimalPlaces = data.dplace;
    } else {
      this._decimalPlaces = 0;
    }
    if (data && data.dpocur) {
      this._decimalOccurs = data.dpocur;
    } else {
      this._decimalOccurs = false;
    }
    if (data && data.ngocur) {
      this._negativeOccurs = data.ngocur;
    } else {
      this._negativeOccurs = false;
    }
  }
}

export class PrimarySchoolMathFAOControl extends QuizBasicControl {
  private _leftNumberBegin: number;
  private _leftNumberEnd: number;
  private _rightNumberBegin: number;
  private _rightNumberEnd: number;
  private _decimalPlaces: number;

  get leftNumberBegin(): number {
    return this._leftNumberBegin;
  }
  set leftNumberBegin(lnb: number) {
    this._leftNumberBegin = lnb;
  }
  get leftNumberEnd(): number {
    return this._leftNumberEnd;
  }
  set leftNumberEnd(lne: number) {
    this._leftNumberEnd = lne;
  }
  get rightNumberBegin(): number {
    return this._rightNumberBegin;
  }
  set rightNumberBegin(rnb: number) {
    this._rightNumberBegin = rnb;
  }
  get rightNumberEnd(): number {
    return this._rightNumberEnd;
  }
  set rightNumberEnd(rne: number) {
    this._rightNumberEnd = rne;
  }
  get decimalPlaces(): number {
    return this._decimalPlaces;
  }
  set decimalPlaces(dp: number) {
    this._decimalPlaces = dp;
  }

  constructor() {
    super();
    this._leftNumberBegin = 1;
    this._leftNumberEnd = 1000;
    this._rightNumberBegin = 1;
    this._rightNumberEnd = 1000;
    this._decimalPlaces = 0;
  }

  isEqual(other: PrimarySchoolMathFAOControl): boolean {
    if (!super.isEqual(other)) {
      return false;
    }

    return this._leftNumberBegin === other._leftNumberBegin
      && this._leftNumberEnd === other._leftNumberEnd
      && this._rightNumberBegin === other._rightNumberBegin
      && this._rightNumberEnd === other._rightNumberEnd
      && this._decimalPlaces === other._decimalPlaces;
  }
  protected storeToJsonObject(): any {
    const jobj: any = super.storeToJsonObject();
    jobj.lftbgn = this._leftNumberBegin;
    jobj.lftend = this._leftNumberEnd;
    jobj.rgtbgn = this._rightNumberBegin;
    jobj.rgtend = this._rightNumberEnd;
    jobj.dplace = this._decimalPlaces;
    return jobj;
  }
  protected restoreFromJsonObject(data: any) {
    super.restoreFromJsonObject(data);
    if (data && data.lftbgn) {
      this._leftNumberBegin = +data.lftbgn;
    }
    if (data && data.lftend) {
      this._leftNumberEnd = +data.lftend;
    }
    if (data && data.rgtbgn) {
      this._rightNumberBegin = +data.rgtbgn;
    }
    if (data && data.rgtend) {
      this._rightNumberEnd = +data.rgtend;
    }
    if (data && data.dplace) {
      this._decimalPlaces = data.dplace;
    }
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
  public Start(qcontrol: QuizBasicControl) {
    if (this._isStarted || this._curRun !== null) {
      throw new Error('Quiz already started!');
    }

    // Empty the elder run
    this.init();

    this._faileFactor = qcontrol.failFactor;
    this._curRun = new PrimarySchoolMathQuizSection(this._curRunID, qcontrol.numberOfQuestions);

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
