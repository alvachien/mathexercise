import { QuizSplitter } from './quizconstants';
import { PrimarySchoolFormulaEnum, getFormulaUIString } from './formuladef';
import { PrimarySchoolMathQuizItem } from './quizconcept';

/**
 * Is Forumlat type is supported by current version
 * @param fe Formula
 */
export function isFormulaTypeEnabled(fe: PrimarySchoolFormulaEnum): boolean {
  switch (fe) {
    case PrimarySchoolFormulaEnum.AreaOfRectangle:
    case PrimarySchoolFormulaEnum.AreaOfSquare:
    case PrimarySchoolFormulaEnum.CircumferenceOfCircle:
    case PrimarySchoolFormulaEnum.CircumferenceOfRectangle:
    case PrimarySchoolFormulaEnum.CircumferenceOfSquare:
    case PrimarySchoolFormulaEnum.DistanceAndSpeed:
    case PrimarySchoolFormulaEnum.EfficiencyProblem:
      return true;

    default:
      return false;
  }
}

/**
 * Base class for Formula-based quiz item
 */
export class FormulaQuizItemBase extends PrimarySchoolMathQuizItem {
  protected _frmtype: PrimarySchoolFormulaEnum;
  protected _inputtedResult: number;
  protected _decimalPlaces: number;

  /**
   * Formula type
   */
  get FormulaType(): PrimarySchoolFormulaEnum {
    return this._frmtype;
  }
  /**
   * Decimal place
   */
  get decimalPlaces(): number {
    return this._decimalPlaces;
  }

  /**
   * Restore from string
   * @param s String to restore
   */
  public static restoreFromString(s: string): FormulaQuizItemBase | null {
    const idx = s.indexOf(QuizSplitter);
    const ntype: PrimarySchoolFormulaEnum = <PrimarySchoolFormulaEnum>parseInt(s.substring(0, idx));
    switch (ntype) {
      case PrimarySchoolFormulaEnum.CircumferenceOfCircle:
        return FormulaCOfCircleQuizItem.restoreFromString(s.substring(idx + 1));

      case PrimarySchoolFormulaEnum.CircumferenceOfSquare:
        return FormulaCOfSquareQuizItem.restoreFromString(s.substring(idx + 1));

      case PrimarySchoolFormulaEnum.CircumferenceOfRectangle:
        return FormulaCOfRectangleQuizItem.restoreFromString(s.substring(idx + 1));

      case PrimarySchoolFormulaEnum.AreaOfRectangle:
        return FormulaAreaOfRectangleQuizItem.restoreFromString(s.substring(idx + 1));

      case PrimarySchoolFormulaEnum.AreaOfSquare:
        return FormulaAreaOfSquareQuizItem.restoreFromString(s.substring(idx + 1));

      case PrimarySchoolFormulaEnum.DistanceAndSpeed:
        return FormulaDistAndSpeedQuizItem.restoreFromString(s.substring(idx + 1));

      default:
        break;
    }

    return null;
  }

  constructor(frmtype: PrimarySchoolFormulaEnum, dplace?: number) {
    super();

    this._frmtype = frmtype;
    if (dplace) {
      this._decimalPlaces = dplace;
    } else {
      this._decimalPlaces = 0;
    }
  }

  /**
   * Inputted result
   */
  get InputtedResult(): number {
    return this._inputtedResult;
  }
  set InputtedResult(ir: number) {
    this._inputtedResult = ir;
  }

  /**
   * Is correct
   */
  public IsCorrect(): boolean {
    return super.IsCorrect();
  }

  /**
   * Quiz format, show in UI
   */
  public getQuizFormat(): string {
    return super.getQuizFormat();
  }

  /**
   * Get format param
   */
  public getQuizFormatParam(): any {
    return null;
  }

  /**
   * Corrected formula
   */
  public getCorrectFormula(): string {
    return super.getCorrectFormula();
  }

  /**
   * Inputted formula
   */
  public getInputtedForumla(): string {
    return super.getInputtedForumla();
  }

  protected storeToJsonObject(): any {
    const jobj: any = super.storeToJsonObject();
    jobj.forumlaType = this._frmtype;
    jobj.decimalPlaces = this._decimalPlaces;
    return jobj;
  }

  protected restoreFromJsonObject(data: any): void {
    super.restoreFromJsonObject(data);

    if (data && data.forumlaType) {
      this._frmtype = data.forumlaType;
    }
    if (data && data.decimalPlaces) {
      this._decimalPlaces = data.decimalPlaces;
    }
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
 * Calculate Direction
 */
export enum FormulaCOfCircleCalcDirEum {
  Radius = 0,
  Circum = 1
}

/**
 * Quiz item to calculate circumference of circle
 * C = πD = 2πr
 */
export class FormulaCOfCircleQuizItem extends FormulaQuizItemBase {
  private _raidus: number;
  private _circum: number;
  private _direct: FormulaCOfCircleCalcDirEum;

  get Radius(): number {
    return this._raidus;
  }

  get Circumference(): number {
    return this._circum;
  }

  /**
   * Calculate direction
   */
  get CalcDirection(): FormulaCOfCircleCalcDirEum {
    return this._direct;
  }

  constructor(srcnum: number, bdir: FormulaCOfCircleCalcDirEum, dplace?: number) {
    super(PrimarySchoolFormulaEnum.CircumferenceOfCircle, dplace);

    this._direct = bdir;
    if (this._direct === FormulaCOfCircleCalcDirEum.Radius) {
      if (this._decimalPlaces > 0) {
        this._raidus = parseFloat(srcnum.toFixed(this._decimalPlaces));
      } else {
        this._raidus = Math.round(srcnum);
      }
    } else {
      if (this._decimalPlaces > 0) {
        this._circum = parseFloat(srcnum.toFixed(this._decimalPlaces));
      } else {
        this._circum = Math.round(srcnum);
      }
    }
   }

  public IsCorrect(): boolean {
    const brst = super.IsCorrect();
    if (!brst) {
      return false;
    }

    if (this._direct === FormulaCOfCircleCalcDirEum.Radius) {
      if (this._circum === this.InputtedResult) {
        return true;
      }
    } else if (this._direct === FormulaCOfCircleCalcDirEum.Circum) {
      if (this._raidus === this.InputtedResult) {
        return true;
      }
    }

    return false;
  }

  public getQuizFormat(): string {
    if (this._direct === FormulaCOfCircleCalcDirEum.Radius) {
      return `Home.CircumferenceOfCircleQuizForCFormat`;
    } else if (this._direct === FormulaCOfCircleCalcDirEum.Circum) {
      return `Home.CircumferenceOfCircleQuizForRFormat`;
    }
  }

  public getQuizFormatParam(): any {
    if (this._direct === FormulaCOfCircleCalcDirEum.Radius) {
      return { radius: this._raidus };
    }

    return { circum: this._circum };
  }

  public getCorrectFormula(): string {
    const frmstr: string = getFormulaUIString(this.FormulaType);

    return frmstr.replace('C', this._circum.toString()).replace('R', this._raidus.toString());
  }

  public getInputtedForumla(): string {
    const frmstr: string = getFormulaUIString(this.FormulaType);

    if (this._direct === FormulaCOfCircleCalcDirEum.Radius) {
      return frmstr.replace('C', this.InputtedResult.toString()).replace('R', this._raidus.toString());
    } else {
      return frmstr.replace('C', this._circum.toString()).replace('R', this.InputtedResult.toString());
    }
  }

  protected storeToJsonObject(): any {
    const jobj: any = super.storeToJsonObject();
    jobj.radius = this._raidus;
    jobj.circum = this._circum;
    jobj.direction = this._direct;
    return jobj;
  }

  protected restoreFromJsonObject(data: any): void {
    super.restoreFromJsonObject(data);

    if (data && data.radius) {
      this._raidus = data.radius;
    }
    if (data && data.circum) {
      this._circum = data.circum;
    }
    if (data && data.direction) {
      this._direct = data.direction;
    }
  }

  protected canCalcResult(): boolean {
    if (!super.canCalcResult()) {
      return false;
    }

    return true;
  }

  protected calcResult(): void {
    if (this._direct === FormulaCOfCircleCalcDirEum.Radius) {
      if (this._decimalPlaces > 0) {
        this._circum = parseFloat((2 * this._raidus * Math.PI).toFixed(this._decimalPlaces));
      } else {
        this._circum = Math.round(2 * this._raidus * Math.PI);
      }
    } else {
      if (this._decimalPlaces > 0) {
        this._raidus = parseFloat((this._circum / Math.PI / 2).toFixed(this._decimalPlaces));
      } else {
        this._raidus = Math.round(this._circum / Math.PI / 2);
      }
    }
  }
}

/**
 * Calculate type
 */
export enum FormulaCOfSquareCalcDirEum {
  Edge = 0,
  Circum = 1
}

/**
 * Quiz item to calculate circumference of Square
 * C = 4a
 */
// CircumferenceOfSquare   = 11,
//
export class FormulaCOfSquareQuizItem extends FormulaQuizItemBase {
  private _edge: number;
  private _circum: number;
  private _direct: FormulaCOfSquareCalcDirEum;

  get Edge(): number {
    return this._edge;
  }

  get Circumference(): number {
    return this._circum;
  }

  /**
   * Calculate direction
   */
  get CalcDirection(): FormulaCOfSquareCalcDirEum {
    return this._direct;
  }

  constructor(srcnum: number, bdir: FormulaCOfSquareCalcDirEum, dplace?: number) {
    super(PrimarySchoolFormulaEnum.CircumferenceOfSquare);

    this._direct = bdir;
    if (this._direct === FormulaCOfSquareCalcDirEum.Edge) {
      if (this._decimalPlaces > 0) {
        this._edge = parseFloat(srcnum.toFixed(this._decimalPlaces));
      } else {
        this._edge = Math.round(srcnum);
      }
    } else {
      if (this._decimalPlaces > 0) {
        this._circum = parseFloat(srcnum.toFixed(this._decimalPlaces));
      } else {
        this._circum = Math.round(srcnum);
      }
    }
  }

  public IsCorrect(): boolean {
    const brst = super.IsCorrect();
    if (!brst) {
      return false;
    }

    if (this._direct === FormulaCOfSquareCalcDirEum.Edge) {
      if (this._circum === this.InputtedResult) {
        return true;
      }
    } else if (this._direct === FormulaCOfSquareCalcDirEum.Circum) {
      if (this._edge === this.InputtedResult) {
        return true;
      }
    }

    return false;
  }

  public getQuizFormat(): string {
    if (this._direct === FormulaCOfSquareCalcDirEum.Edge) {
      return `Home.CircumferenceOfSquareQuizForCFormat`;
    } else if (this._direct === FormulaCOfSquareCalcDirEum.Circum) {
      return `Home.CircumferenceOfSquareQuizForEFormat`;
    }
  }

  public getQuizFormatParam(): any {
    if (this._direct === FormulaCOfSquareCalcDirEum.Edge) {
      return { edge: this._edge };
    }

    return { circum: this._circum };
  }

  public getCorrectFormula(): string {
    const frmstr: string = getFormulaUIString(this.FormulaType);

    return frmstr.replace('C', this._circum.toString()).replace('a', this._edge.toString());
  }

  public getInputtedForumla(): string {
    const frmstr: string = getFormulaUIString(this.FormulaType);

    if (this._direct === FormulaCOfSquareCalcDirEum.Edge) {
      return frmstr.replace('C', this.InputtedResult.toString()).replace('a', this._edge.toString());
    } else if (this._direct === FormulaCOfSquareCalcDirEum.Circum) {
      return frmstr.replace('C', this._circum.toString()).replace('a', this.InputtedResult.toString());
    }
  }

  protected storeToJsonObject(): any {
    const jobj: any = super.storeToJsonObject();
    jobj.edge = this._edge;
    jobj.circum = this._circum;
    jobj.direction = this._direct;
    return jobj;
  }

  protected restoreFromJsonObject(data: any): void {
    super.restoreFromJsonObject(data);

    if (data && data.edge) {
      this._edge = data.edge;
    }
    if (data && data.circum) {
      this._circum = data.circum;
    }
    if (data && data.direction) {
      this._direct = data.direction;
    }
  }

  protected canCalcResult(): boolean {
    if (!super.canCalcResult()) {
      return false;
    }

    return true;
  }

  protected calcResult(): void {
    if (this._direct === FormulaCOfSquareCalcDirEum.Edge) {
      if (this._decimalPlaces > 0) {
        this._circum = parseFloat((4 * this._edge).toFixed(this._decimalPlaces));
      } else {
        this._circum = Math.round(4 * this._edge);
      }
    } else {
      if (this._decimalPlaces > 0) {
        this._edge = parseFloat((this._circum / 4).toFixed(this._decimalPlaces));
      } else {
        this._edge = Math.round(this._circum / 4);
      }
    }
  }
}

/**
 * Calculate direction
 * The number must be in sequence because the generation using randomizing
 */
export enum FormulaCOfRectangleCalcDirEum {
  LongEdgeAndShortEdge = 0,
  LongEdgeAndCircum = 1,
  ShortEdgeAndCircum = 2
}

/**
 * Quiz item to calculate circumference of Rectangle
 * C = 2(a+b)
 */
// CircumferenceOfRectangle = 12,
export class FormulaCOfRectangleQuizItem extends FormulaQuizItemBase {
  private _longedge: number;
  private _shortedge: number;
  private _circum: number;
  private _direct: FormulaCOfRectangleCalcDirEum;

  get LongEdge(): number {
    return this._longedge;
  }
  get ShortEdge(): number {
    return this._shortedge;
  }

  get Circumference(): number {
    return this._circum;
  }

  /**
   * Calculate direction
   */
  get CalcDirection(): FormulaCOfRectangleCalcDirEum {
    return this._direct;
  }

  constructor(num1: number, num2: number, dir: FormulaCOfRectangleCalcDirEum, dplace?: number) {
    super(PrimarySchoolFormulaEnum.CircumferenceOfRectangle, dplace);

    this._direct = dir;
    if (dir === FormulaCOfRectangleCalcDirEum.LongEdgeAndShortEdge) {
      if (this._decimalPlaces > 0) {
        this._longedge = parseFloat(num1.toFixed(this._decimalPlaces));
        this._shortedge = parseFloat(num2.toFixed(this._decimalPlaces));
        this._circum = parseFloat((2 * (this._longedge + this._shortedge)).toFixed(this._decimalPlaces));
      } else {
        this._longedge = Math.round(num1);
        this._shortedge = Math.round(num2);
        this._circum = Math.round(2 * (this._longedge + this._shortedge));
      }
    } else if (dir === FormulaCOfRectangleCalcDirEum.LongEdgeAndCircum) {
      if (this._decimalPlaces > 0) {
        this._longedge = parseFloat(num1.toFixed(this._decimalPlaces));
        this._circum = parseFloat(num2.toFixed(this._decimalPlaces));
        this._shortedge = parseFloat(((this._circum - 2 * this._longedge) / 2).toFixed(this._decimalPlaces));
      } else {
        this._longedge = Math.round(num1);
        this._circum = Math.round(num2);
        this._shortedge = Math.round((this._circum - 2 * this._longedge) / 2);
      }
    } else if (dir === FormulaCOfRectangleCalcDirEum.ShortEdgeAndCircum) {
      if (this._decimalPlaces > 0) {
        this._shortedge = parseFloat(num1.toFixed(this._decimalPlaces));
        this._circum = parseFloat(num2.toFixed(this._decimalPlaces));
        this._longedge = parseFloat(((this._circum - 2 * this._shortedge) / 2).toFixed(this._decimalPlaces));
      } else {
        this._shortedge = Math.round(num1);
        this._circum = Math.round(num2);
        this._longedge = Math.round((this._circum - 2 * this._shortedge) / 2);
      }
    } else {
      throw new Error('Unsupported direction!');
    }
  }

  public IsCorrect(): boolean {
    const brst = super.IsCorrect();
    if (!brst) {
      return false;
    }

    if (this._direct === FormulaCOfRectangleCalcDirEum.LongEdgeAndShortEdge) {
      if (this._circum === this.InputtedResult) {
        return true;
      }
    } else if (this._direct === FormulaCOfRectangleCalcDirEum.LongEdgeAndCircum) {
      if (this._shortedge === this.InputtedResult) {
        return true;
      }
    } else if (this._direct === FormulaCOfRectangleCalcDirEum.ShortEdgeAndCircum) {
      if (this._longedge === this.InputtedResult) {
        return true;
      }
    }

    return false;
  }

  public getQuizFormat(): string {
    if (this._direct === FormulaCOfRectangleCalcDirEum.LongEdgeAndShortEdge) {
      return `Home.CircumferenceOfRectangleQuizForCFormat`;
    } else if (this._direct === FormulaCOfRectangleCalcDirEum.LongEdgeAndCircum) {
      return `Home.CircumferenceOfRectangleQuizForEFormat`;
    } else if (this._direct === FormulaCOfRectangleCalcDirEum.ShortEdgeAndCircum) {
      return `Home.CircumferenceOfRectangleQuizForEFormat`;
    }
  }

  public getQuizFormatParam(): any {
    if (this._direct === FormulaCOfRectangleCalcDirEum.LongEdgeAndShortEdge) {
      return {
        longedge: this._longedge,
        shortedge: this._shortedge
      };
    } else if (this._direct === FormulaCOfRectangleCalcDirEum.LongEdgeAndCircum) {
      return {
        circum: this._circum,
        edge: this._longedge
      };
    } else if (this._direct === FormulaCOfRectangleCalcDirEum.ShortEdgeAndCircum) {
      return {
        circum: this._circum,
        edge: this._shortedge
      };
    }
  }

  public getCorrectFormula(): string {
    const frmstr: string = getFormulaUIString(this.FormulaType);

    return frmstr.replace('C', this._circum.toString()).replace('a', this._longedge.toString()).replace('b', this._shortedge.toString());
  }

  public getInputtedForumla(): string {
    const frmstr: string = getFormulaUIString(this.FormulaType);

    if (this._direct === FormulaCOfRectangleCalcDirEum.LongEdgeAndShortEdge) {
      return frmstr.replace('C', this.InputtedResult.toString())
        .replace('a', this._longedge.toString())
        .replace('b', this._shortedge.toString());
    } else if (this._direct === FormulaCOfRectangleCalcDirEum.LongEdgeAndCircum) {
      return frmstr.replace('C', this._circum.toString())
        .replace('a', this._longedge.toString())
        .replace('b', this.InputtedResult.toString());
    } else if (this._direct === FormulaCOfRectangleCalcDirEum.ShortEdgeAndCircum) {
      return frmstr.replace('C', this._circum.toString())
        .replace('a', this.InputtedResult.toString())
        .replace('b', this._shortedge.toString());
    }
  }

  protected storeToJsonObject(): any {
    const jobj: any = super.storeToJsonObject();
    jobj.longEdge = this._longedge;
    jobj.shortEdge = this._shortedge;
    jobj.circum = this._circum;
    jobj.direction = this._direct;
    return jobj;
  }

  protected restoreFromJsonObject(data: any): void {
    super.restoreFromJsonObject(data);

    if (data && data.longEdge) {
      this._longedge = data.longEdge;
    }
    if (data && data.shortEdge) {
      this._shortedge = data.shortEdge;
    }
    if (data && data.circum) {
      this._circum = data.circum;
    }
    if (data && data.direction) {
      this._direct = data.direction;
    }
  }

  protected canCalcResult(): boolean {
    if (!super.canCalcResult()) {
      return false;
    }

    return true;
  }

  protected calcResult(): void {
    if (this._direct === FormulaCOfSquareCalcDirEum.Edge) {
      if (this._decimalPlaces > 0) {
        this._circum = parseFloat((4 * this._edge).toFixed(this._decimalPlaces));
      } else {
        this._circum = Math.round(4 * this._edge);
      }
    } else {
      if (this._decimalPlaces > 0) {
        this._edge = parseFloat((this._circum / 4).toFixed(this._decimalPlaces));
      } else {
        this._edge = Math.round(this._circum / 4);
      }
    }
  }

  public storeToString(): string {
    let rstr = super.storeToString();

    if (this._direct === FormulaCOfRectangleCalcDirEum.LongEdgeAndShortEdge) {
      rstr += QuizSplitter + '0' + QuizSplitter + this._longedge.toString() + QuizSplitter + this._shortedge.toString();
    } else if (this._direct === FormulaCOfRectangleCalcDirEum.LongEdgeAndCircum) {
      rstr += QuizSplitter + '1' + QuizSplitter + this._longedge.toString() + QuizSplitter + this._circum.toString();
    } else if (this._direct === FormulaCOfRectangleCalcDirEum.ShortEdgeAndCircum) {
      rstr += QuizSplitter + '2' + QuizSplitter + this._shortedge.toString() + QuizSplitter + this._circum.toString();
    }

    return rstr;
  }

  public static restoreFromString(s: string): FormulaCOfRectangleQuizItem | null {
    try {
      const idx = s.indexOf(QuizSplitter);
      const idx2 = s.indexOf(QuizSplitter, idx + 1);

      const ndir: number = <FormulaCOfRectangleCalcDirEum>parseInt(s.substring(0, idx));
      const nnum1: number = parseFloat(s.substring(idx + 1, idx2));
      const nnum2: number = parseFloat(s.substring(idx2 + 1));
      return new FormulaCOfRectangleQuizItem(nnum1, nnum2, ndir);
    }
    catch (exp) {
      console.error(exp);
    }

    return null;
  }
}

/**
 * Calculate direction
 * The number must be in sequence because the generation using randomizing
 */
export enum FormulaDistAndSpeedCalcDirEum {
  SpeedAndTime = 0,
  SpeedAndDistance = 1,
  TimeAndDistance = 2
}

/**
 * Quiz item to calculate distance and speed
 * S = vh
 */
// DistanceAndSpeed    = 20
export class FormulaDistAndSpeedQuizItem extends FormulaQuizItemBase {
  private _distance: number;
  private _speed: number;
  private _time: number;
  private _direct: FormulaDistAndSpeedCalcDirEum;

  /**
   * Distance
   */
  get Distance(): number {
    return this._distance;
  }
  /**
   * Speed
   */
  get Speed(): number {
    return this._speed;
  }
  /**
   * Time
   */
  get Time(): number {
    return this._time;
  }

  /**
   * Calculate direction
   */
  get CalcDirection(): FormulaDistAndSpeedCalcDirEum {
    return this._direct;
  }

  constructor(num1: number, num2: number, dir: FormulaDistAndSpeedCalcDirEum, dplace?: number) {
    super(PrimarySchoolFormulaEnum.DistanceAndSpeed, dplace);

    this._direct = dir;
    if (dir === FormulaDistAndSpeedCalcDirEum.SpeedAndTime) {
      if (this._decimalPlaces > 0) {
        this._speed = parseFloat(num1.toFixed(this._decimalPlaces));
        this._time = parseFloat(num2.toFixed(this._decimalPlaces));
        this._distance = parseFloat((this._speed * this._time).toFixed(this._decimalPlaces));
      } else {
        this._speed = Math.round(num1);
        this._time = Math.round(num2);
        this._distance = Math.round(this._speed * this._time);
      }
    } else if (dir === FormulaDistAndSpeedCalcDirEum.SpeedAndDistance) {
      if (this._decimalPlaces > 0) {
        this._speed = parseFloat(num1.toFixed(this._decimalPlaces));
        this._distance = parseFloat(num2.toFixed(this._decimalPlaces));
        this._time = parseFloat((this._distance / this._speed).toFixed(this._decimalPlaces));
      } else {
        this._speed = Math.round(num1);
        this._distance = Math.round(num2);
        this._time = Math.round(this._distance / this._speed);
      }
    } else if (dir === FormulaDistAndSpeedCalcDirEum.TimeAndDistance) {
      if (this._decimalPlaces > 0) {
        this._time = parseFloat(num1.toFixed(this._decimalPlaces));
        this._distance = parseFloat(num2.toFixed(this._decimalPlaces));
        this._speed = parseFloat((this._distance / this._time).toFixed(this._decimalPlaces));
      } else {
        this._time = Math.round(num1);
        this._distance = Math.round(num2);
        this._speed = Math.round(this._distance / this._time);
      }
    } else {
      throw new Error('Unsupported direction!');
    }
  }

  public IsCorrect(): boolean {
    const brst = super.IsCorrect();
    if (!brst) {
      return false;
    }

    if (this._direct === FormulaDistAndSpeedCalcDirEum.SpeedAndTime) {
      if (this._distance === this.InputtedResult) {
        return true;
      }
    } else if (this._direct === FormulaDistAndSpeedCalcDirEum.SpeedAndDistance) {
      if (this._time === this.InputtedResult) {
        return true;
      }
    } else if (this._direct === FormulaDistAndSpeedCalcDirEum.TimeAndDistance) {
      if (this._speed === this.InputtedResult) {
        return true;
      }
    }

    return false;
  }

  public getQuizFormat(): string {
    if (this._direct === FormulaDistAndSpeedCalcDirEum.SpeedAndTime) {
      return `Home.SpeedAndDistanceForDFormat`;
    } else if (this._direct === FormulaDistAndSpeedCalcDirEum.SpeedAndDistance) {
      return `Home.SpeedAndDistanceForTFormat`;
    } else if (this._direct === FormulaDistAndSpeedCalcDirEum.TimeAndDistance) {
      return `Home.SpeedAndDistanceForSFormat`;
    }
  }

  public getQuizFormatParam(): any {
    if (this._direct === FormulaDistAndSpeedCalcDirEum.SpeedAndTime) {
      return {
        speed: this._speed,
        time: this._time
      };
    } else if (this._direct === FormulaDistAndSpeedCalcDirEum.SpeedAndDistance) {
      return {
        speed: this._speed,
        distance: this._distance
      };
    } else if (this._direct === FormulaDistAndSpeedCalcDirEum.TimeAndDistance) {
      return {
        time: this._time,
        distance: this._distance
      };
    }
  }

  public getCorrectFormula(): string {
    const frmstr: string = getFormulaUIString(this.FormulaType);

    return frmstr.replace('S', this._distance.toString()).replace('v', this._speed.toString()).replace('h', this._time.toString());
  }

  public getInputtedForumla(): string {
    const frmstr: string = getFormulaUIString(this.FormulaType);

    if (this._direct === FormulaDistAndSpeedCalcDirEum.SpeedAndTime) {
      return frmstr.replace('S', this.InputtedResult.toString()).replace('v', this._speed.toString()).replace('h', this._time.toString());
    } else if (this._direct === FormulaDistAndSpeedCalcDirEum.SpeedAndDistance) {
      return frmstr.replace('S', this._distance.toString()).replace('v', this._speed.toString()).replace('h', this.InputtedResult.toString());
    } else if (this._direct === FormulaDistAndSpeedCalcDirEum.TimeAndDistance) {
      return frmstr.replace('S', this._distance.toString()).replace('v', this.InputtedResult.toString()).replace('h', this._time.toString());
    }
  }

  public storeToString(): string {
    let rstr = super.storeToString();

    if (this._direct === FormulaDistAndSpeedCalcDirEum.SpeedAndTime) {
      rstr += QuizSplitter + '0' + QuizSplitter + this._speed.toString() + QuizSplitter + this._time.toString();
    } else if (this._direct === FormulaDistAndSpeedCalcDirEum.SpeedAndDistance) {
      rstr += QuizSplitter + '1' + QuizSplitter + this._speed.toString() + QuizSplitter + this._time.toString();
    } else if (this._direct === FormulaDistAndSpeedCalcDirEum.TimeAndDistance) {
      rstr += QuizSplitter + '2' + QuizSplitter + this._time.toString() + QuizSplitter + this._distance.toString();
    }

    return rstr;
  }

  public static restoreFromString(s: string): FormulaDistAndSpeedQuizItem | null {
    try {
      const idx = s.indexOf(QuizSplitter);
      const idx2 = s.indexOf(QuizSplitter, idx + 1);

      const ndir: number = <FormulaDistAndSpeedCalcDirEum>parseInt(s.substring(0, idx));
      const nnum1: number = parseFloat(s.substring(idx + 1, idx2));
      const nnum2: number = parseFloat(s.substring(idx2 + 1));
      return new FormulaDistAndSpeedQuizItem(nnum1, nnum2, ndir);
    }
    catch (exp) {
      console.error(exp);
    }

    return null;
  }
}


/**
 * Calculate direction
 * The number must be in sequence because the generation using randomizing
 */
export enum FormulaAOfRectangleCalcDirEum {
  LongEdgeAndShortEdge = 0,
  LongEdgeAndArea = 1,
  ShortEdgeAndArea = 2
}

/**
 * Area of rectangle
 */
// AreaOfRectangle    = 2
export class FormulaAreaOfRectangleQuizItem extends FormulaQuizItemBase {
  private _longedge: number;
  private _shortedge: number;
  private _area: number;
  private _direct: FormulaAOfRectangleCalcDirEum;

  get LongEdge(): number {
    return this._longedge;
  }
  get ShortEdge(): number {
    return this._shortedge;
  }
  get Area(): number {
    return this._area;
  }

  /**
   * Calculate direction
   */
  get CalcDirection(): FormulaAOfRectangleCalcDirEum {
    return this._direct;
  }

  constructor(num1: number, num2: number, dir: FormulaAOfRectangleCalcDirEum, dplace?: number) {
    super(PrimarySchoolFormulaEnum.AreaOfRectangle, dplace);

    this._direct = dir;
    if (dir === FormulaAOfRectangleCalcDirEum.LongEdgeAndShortEdge) {
      if (this._decimalPlaces > 0) {
        this._longedge = parseFloat(num1.toFixed(this._decimalPlaces));
        this._shortedge = parseFloat(num2.toFixed(this._decimalPlaces));
        this._area = parseFloat((this._longedge * this._shortedge).toFixed(this._decimalPlaces));
      } else {
        this._longedge = Math.round(num1);
        this._shortedge = Math.round(num2);
        this._area = Math.round(this._longedge * this._shortedge);
      }
    } else if (dir === FormulaAOfRectangleCalcDirEum.LongEdgeAndArea) {
      if (this._decimalPlaces > 0) {
        this._longedge = parseFloat(num1.toFixed(this._decimalPlaces));
        this._area = parseFloat(num2.toFixed(this._decimalPlaces));
        this._shortedge = parseFloat((this._area / this._longedge).toFixed(this._decimalPlaces));
      } else {
        this._longedge = Math.round(num1);
        this._area = Math.round(num2);
        this._shortedge = Math.round(this._area / this._longedge);
      }
    } else if (dir === FormulaAOfRectangleCalcDirEum.ShortEdgeAndArea) {
      if (this._decimalPlaces > 0) {
        this._shortedge = parseFloat(num1.toFixed(this._decimalPlaces));
        this._area = parseFloat(num2.toFixed(this._decimalPlaces));
        this._longedge = parseFloat((this._area / this._shortedge).toFixed(this._decimalPlaces));
      } else {
        this._shortedge = Math.round(num1);
        this._area = Math.round(num2);
        this._longedge = Math.round(this._area / this._shortedge);
      }
    } else {
      throw new Error('Unsupported direction!');
    }
  }

  public IsCorrect(): boolean {
    const brst = super.IsCorrect();
    if (!brst) {
      return false;
    }

    if (this._direct === FormulaAOfRectangleCalcDirEum.LongEdgeAndShortEdge) {
      if (this._area === this.InputtedResult) {
        return true;
      }
    } else if (this._direct === FormulaAOfRectangleCalcDirEum.LongEdgeAndArea) {
      if (this._shortedge === this.InputtedResult) {
        return true;
      }
    } else if (this._direct === FormulaAOfRectangleCalcDirEum.ShortEdgeAndArea) {
      if (this._longedge === this.InputtedResult) {
        return true;
      }
    }

    return false;
  }

  public getQuizFormat(): string {
    if (this._direct === FormulaAOfRectangleCalcDirEum.LongEdgeAndShortEdge) {
      return `Home.AreaOfRectangleQuizForAFormat`;
    } else if (this._direct === FormulaAOfRectangleCalcDirEum.LongEdgeAndArea) {
      return `Home.AreaOfRectangleQuizForEFormat`;
    } else if (this._direct === FormulaAOfRectangleCalcDirEum.ShortEdgeAndArea) {
      return `Home.AreaOfRectangleQuizForEFormat`;
    }
  }

  public getQuizFormatParam(): any {
    if (this._direct === FormulaAOfRectangleCalcDirEum.LongEdgeAndShortEdge) {
      return {
        longedge: this._longedge,
        shortedge: this._shortedge
      };
    } else if (this._direct === FormulaAOfRectangleCalcDirEum.LongEdgeAndArea) {
      return {
        area: this._area,
        edge: this._longedge
      };
    } else if (this._direct === FormulaAOfRectangleCalcDirEum.ShortEdgeAndArea) {
      return {
        area: this._area,
        edge: this._shortedge
      };
    }
  }

  public getCorrectFormula(): string {
    const frmstr: string = getFormulaUIString(this.FormulaType);

    return frmstr.replace('S', this._area.toString()).replace('a', this._longedge.toString()).replace('b', this._shortedge.toString());
  }

  public getInputtedForumla(): string {
    const frmstr: string = getFormulaUIString(this.FormulaType);

    if (this._direct === FormulaAOfRectangleCalcDirEum.LongEdgeAndShortEdge) {
      return frmstr.replace('S', this.InputtedResult.toString())
        .replace('a', this._longedge.toString())
        .replace('b', this._shortedge.toString());
    } else if (this._direct === FormulaAOfRectangleCalcDirEum.LongEdgeAndArea) {
      return frmstr.replace('S', this._area.toString())
        .replace('a', this._longedge.toString())
        .replace('b', this.InputtedResult.toString());
    } else if (this._direct === FormulaAOfRectangleCalcDirEum.ShortEdgeAndArea) {
      return frmstr.replace('S', this._area.toString())
        .replace('a', this.InputtedResult.toString())
        .replace('b', this._shortedge.toString());
    }
  }

  public storeToString(): string {
    let rstr = super.storeToString();

    if (this._direct === FormulaAOfRectangleCalcDirEum.LongEdgeAndShortEdge) {
      rstr += QuizSplitter + '0' + QuizSplitter + this._longedge.toString() + QuizSplitter + this._shortedge.toString();
    } else if (this._direct === FormulaAOfRectangleCalcDirEum.LongEdgeAndArea) {
      rstr += QuizSplitter + '1' + QuizSplitter + this._longedge.toString() + QuizSplitter + this._area.toString();
    } else if (this._direct === FormulaAOfRectangleCalcDirEum.ShortEdgeAndArea) {
      rstr += QuizSplitter + '2' + QuizSplitter + this._shortedge.toString() + QuizSplitter + this._area.toString();
    }

    return rstr;
  }

  public static restoreFromString(s: string): FormulaAreaOfRectangleQuizItem | null {
    try {
      const idx = s.indexOf(QuizSplitter);
      const idx2 = s.indexOf(QuizSplitter, idx + 1);

      const ndir: number = <FormulaAOfRectangleCalcDirEum>parseInt(s.substring(0, idx));
      const nnum1: number = parseFloat(s.substring(idx + 1, idx2));
      const nnum2: number = parseFloat(s.substring(idx2 + 1));
      return new FormulaAreaOfRectangleQuizItem(nnum1, nnum2, ndir);
    }
    catch (exp) {
      console.error(exp);
    }

    return null;
  }
}

/**
 * Calculate type
 */
export enum FormulaAreaOfSquareCalcDirEum {
  Edge = 0,
  Area = 1
}

/**
 * Quiz item to calculate circumference of Square
 * C = 4a
 */
export class FormulaAreaOfSquareQuizItem extends FormulaQuizItemBase {
  private _edge: number;
  private _area: number;
  private _direct: FormulaAreaOfSquareCalcDirEum;

  get Edge(): number {
    return this._edge;
  }

  get Area(): number {
    return this._area;
  }

  /**
   * Calculate direction
   */
  get CalcDirection(): FormulaAreaOfSquareCalcDirEum {
    return this._direct;
  }

  constructor(srcnum: number, bdir: FormulaAreaOfSquareCalcDirEum, dplace?: number) {
    super(PrimarySchoolFormulaEnum.AreaOfSquare, dplace);

    if (bdir === FormulaAreaOfSquareCalcDirEum.Edge) {
      this._direct = FormulaAreaOfSquareCalcDirEum.Edge;
      if (this._decimalPlaces > 0) {
        this._edge = parseFloat(srcnum.toFixed(this._decimalPlaces));
        this._area = parseFloat(Math.pow(this._edge, 2).toFixed(this._decimalPlaces));
      } else {
        this._edge = Math.round(srcnum);
        this._area = Math.round(Math.pow(this._edge, 2));
      }
    } else {
      this._direct = FormulaAreaOfSquareCalcDirEum.Area;
      if (this._decimalPlaces > 0) {
        this._area = parseFloat(srcnum.toFixed(this._decimalPlaces));
        this._edge = parseFloat(Math.sqrt(this._area).toFixed(this._decimalPlaces));
      } else {
        this._area = Math.round(srcnum);
        this._edge = Math.round(Math.sqrt(this._area));
      }
    }
  }

  public IsCorrect(): boolean {
    const brst = super.IsCorrect();
    if (!brst) {
      return false;
    }

    if (this._direct === FormulaAreaOfSquareCalcDirEum.Edge) {
      if (this._area === this.InputtedResult) {
        return true;
      }
    } else if (this._direct === FormulaAreaOfSquareCalcDirEum.Area) {
      if (this._edge === this.InputtedResult) {
        return true;
      }
    }

    return false;
  }

  public getQuizFormat(): string {
    if (this._direct === FormulaAreaOfSquareCalcDirEum.Edge) {
      return `Home.AreaOfSquareQuizForAFormat`;
    } else if (this._direct === FormulaAreaOfSquareCalcDirEum.Area) {
      return `Home.AreaOfSquareQuizForEFormat`;
    }
  }

  public getQuizFormatParam(): any {
    if (this._direct === FormulaAreaOfSquareCalcDirEum.Area) {
      return { area: this._area };
    }

    return { edge: this._edge };
  }

  public getCorrectFormula(): string {
    const frmstr: string = getFormulaUIString(this.FormulaType);

    return frmstr.replace('S', this._area.toString()).replace('a', this._edge.toString());
  }

  public getInputtedForumla(): string {
    const frmstr: string = getFormulaUIString(this.FormulaType);

    if (this._direct === FormulaAreaOfSquareCalcDirEum.Edge) {
      return frmstr.replace('S', this.InputtedResult.toString()).replace('a', this._edge.toString());
    } else if (this._direct === FormulaAreaOfSquareCalcDirEum.Area) {
      return frmstr.replace('S', this._area.toString()).replace('a', this.InputtedResult.toString());
    }
  }

  public storeToString(): string {
    let rstr = super.storeToString();

    if (this._direct === FormulaAreaOfSquareCalcDirEum.Edge) {
      rstr += QuizSplitter + '0' + QuizSplitter + this._edge.toString();
    } else if (this._direct === FormulaAreaOfSquareCalcDirEum.Area) {
      rstr += QuizSplitter + '1' + QuizSplitter + this._area.toString();
    }

    return rstr;
  }

  public static restoreFromString(s: string): FormulaAreaOfSquareQuizItem | null {
    try {
      const idx = s.indexOf(QuizSplitter);

      const nbol: number = parseInt(s.substring(0, idx));
      const nnum: number = parseFloat(s.substring(idx + 1));

      return new FormulaAreaOfSquareQuizItem(nnum, <FormulaAreaOfSquareCalcDirEum>nbol);
    }
    catch (exp) {
      console.error(exp);
    }

    return null;
  }
}

/**
 * Calculate direction
 * The number must be in sequence because the generation using randomizing
 */
export enum FormulaEfficiencyProblemCalcDirEum {
  EfficiencyAndTime = 0,
  EfficiencyAndResult = 1,
  TimeAndResult = 2
}

/**
 * Quiz item to calculate efficiency problem
 * R = eh
 */
// EfficiencyProblem    = 21
export class FormulaEfficiencyProblemQuizItem extends FormulaQuizItemBase {
  private _result: number;
  private _efficiency: number;
  private _time: number;
  private _direct: FormulaEfficiencyProblemCalcDirEum;

  /**
   * Result
   */
  get Result(): number {
    return this._result;
  }
  /**
   * E
   */
  get Efficiency(): number {
    return this._efficiency;
  }
  /**
   * Time
   */
  get Time(): number {
    return this._time;
  }

  /**
   * Calculate direction
   */
  get CalcDirection(): FormulaEfficiencyProblemCalcDirEum {
    return this._direct;
  }

  constructor(num1: number, num2: number, dir: FormulaEfficiencyProblemCalcDirEum, dplace?: number) {
    super(PrimarySchoolFormulaEnum.EfficiencyProblem, dplace);

    this._direct = dir;
    if (dir === FormulaEfficiencyProblemCalcDirEum.EfficiencyAndTime) {
      if (this._decimalPlaces > 0) {
        this._efficiency = parseFloat(num1.toFixed(this._decimalPlaces));
        this._time = parseFloat(num2.toFixed(this._decimalPlaces));
        this._result = parseFloat((this._efficiency * this._time).toFixed(this._decimalPlaces));
      } else {
        this._efficiency = Math.round(num1);
        this._time = Math.round(num2);
        this._result = Math.round(this._efficiency * this._time);
      }
    } else if (dir === FormulaEfficiencyProblemCalcDirEum.EfficiencyAndResult) {
      if (this._decimalPlaces > 0) {
        this._efficiency = parseFloat(num1.toFixed(this._decimalPlaces));
        this._result = parseFloat(num2.toFixed(this._decimalPlaces));
        this._time = parseFloat((this._result / this._efficiency).toFixed(this._decimalPlaces));
      } else {
        this._efficiency = Math.round(num1);
        this._result = Math.round(num2);
        this._time = Math.round(this._result / this._efficiency);
      }
    } else if (dir === FormulaEfficiencyProblemCalcDirEum.TimeAndResult) {
      if (this._decimalPlaces > 0) {
        this._time = parseFloat(num1.toFixed(this._decimalPlaces));
        this._result = parseFloat(num2.toFixed(this._decimalPlaces));
        this._efficiency = parseFloat((this._result / this._time).toFixed(this._decimalPlaces));
      } else {
        this._time = Math.round(num1);
        this._result = Math.round(num2);
        this._efficiency = Math.round(this._result / this._time);
      }
    } else {
      throw new Error('Unsupported direction!');
    }
  }

  public IsCorrect(): boolean {
    const brst = super.IsCorrect();
    if (!brst) {
      return false;
    }

    if (this._direct === FormulaEfficiencyProblemCalcDirEum.EfficiencyAndTime) {
      if (this._result === this.InputtedResult) {
        return true;
      }
    } else if (this._direct === FormulaEfficiencyProblemCalcDirEum.EfficiencyAndResult) {
      if (this._time === this.InputtedResult) {
        return true;
      }
    } else if (this._direct === FormulaEfficiencyProblemCalcDirEum.TimeAndResult) {
      if (this._efficiency === this.InputtedResult) {
        return true;
      }
    }

    return false;
  }

  public getQuizFormat(): string {
    if (this._direct === FormulaEfficiencyProblemCalcDirEum.EfficiencyAndTime) {
      return `Home.EfficiencyProblemForRFormat`;
    } else if (this._direct === FormulaEfficiencyProblemCalcDirEum.EfficiencyAndResult) {
      return `Home.EfficiencyProblemForTFormat`;
    } else if (this._direct === FormulaEfficiencyProblemCalcDirEum.TimeAndResult) {
      return `Home.EfficiencyProblemForEFormat`;
    }
  }

  public getQuizFormatParam(): any {
    if (this._direct === FormulaEfficiencyProblemCalcDirEum.EfficiencyAndTime) {
      return {
        efficiency: this._efficiency,
        time: this._time
      };
    } else if (this._direct === FormulaEfficiencyProblemCalcDirEum.EfficiencyAndResult) {
      return {
        efficiency: this._efficiency,
        result: this._result
      };
    } else if (this._direct === FormulaEfficiencyProblemCalcDirEum.TimeAndResult) {
      return {
        time: this._time,
        result: this._result
      };
    }
  }

  public getCorrectFormula(): string {
    const frmstr: string = getFormulaUIString(this.FormulaType);

    return frmstr.replace('R', this._result.toString()).replace('e', this._efficiency.toString()).replace('h', this._time.toString());
  }

  public getInputtedForumla(): string {
    const frmstr: string = getFormulaUIString(this.FormulaType);

    if (this._direct === FormulaEfficiencyProblemCalcDirEum.EfficiencyAndTime) {
      return frmstr.replace('R', this.InputtedResult.toString())
        .replace('e', this._efficiency.toString())
        .replace('h', this._time.toString());
    } else if (this._direct === FormulaEfficiencyProblemCalcDirEum.EfficiencyAndResult) {
      return frmstr.replace('R', this._result.toString())
        .replace('e', this._efficiency.toString())
        .replace('h', this.InputtedResult.toString());
    } else if (this._direct === FormulaEfficiencyProblemCalcDirEum.TimeAndResult) {
      return frmstr.replace('R', this._result.toString())
        .replace('e', this.InputtedResult.toString())
        .replace('h', this._time.toString());
    }
  }

  public storeToString(): string {
    let rstr = super.storeToString();

    if (this._direct === FormulaEfficiencyProblemCalcDirEum.EfficiencyAndTime) {
      rstr += QuizSplitter + '0' + QuizSplitter + this._efficiency.toString() + QuizSplitter + this._time.toString();
    } else if (this._direct === FormulaEfficiencyProblemCalcDirEum.EfficiencyAndResult) {
      rstr += QuizSplitter + '1' + QuizSplitter + this._efficiency.toString() + QuizSplitter + this._time.toString();
    } else if (this._direct === FormulaEfficiencyProblemCalcDirEum.TimeAndResult) {
      rstr += QuizSplitter + '2' + QuizSplitter + this._time.toString() + QuizSplitter + this._result.toString();
    }

    return rstr;
  }

  public static restoreFromString(s: string): FormulaEfficiencyProblemQuizItem | null {
    try {
      const idx = s.indexOf(QuizSplitter);
      const idx2 = s.indexOf(QuizSplitter, idx + 1);

      const ndir: number = <FormulaEfficiencyProblemCalcDirEum>parseInt(s.substring(0, idx));
      const nnum1: number = parseFloat(s.substring(idx + 1, idx2));
      const nnum2: number = parseFloat(s.substring(idx2 + 1));
      return new FormulaEfficiencyProblemQuizItem(nnum1, nnum2, ndir);
    }
    catch (exp) {
      console.error(exp);
    }

    return null;
  }
}
