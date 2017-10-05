import { QuizSplitter } from './quizconstants';
import { PrimarySchoolFormulaEnum, getFormulaUIString } from './formuladef';
import { PrimarySchoolMathQuizItem } from './quizconcept';

/**
 *
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
      return true;

    default:
      return false;
  }
}

/**
 * Base class for Formula-based quiz item
 */
export class FormulaQuizItemBase extends PrimarySchoolMathQuizItem {
  private _frmtype: PrimarySchoolFormulaEnum;
  /**
   * Formula type
   */
  get FormulaType(): PrimarySchoolFormulaEnum {
    return this._frmtype;
  }
  
  constructor(frmtype: PrimarySchoolFormulaEnum) {
    super();
    this._frmtype = frmtype;
  }

  private _inputtedResult: number;
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

  /**
   * Store to string
   */
  public storeToString(): string {
    let srst = super.storeToString();
    if (srst !== null && srst !== undefined && srst.length > 0) {
      srst += (<number>this._frmtype).toString();
    } else {
      srst = (<number>this._frmtype).toString();
    }
    return srst;
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
  get Radius(): number {
    return this._raidus;
  }

  private _circum: number;
  get Circumference(): number {
    return this._circum;
  }

  private _direct: FormulaCOfCircleCalcDirEum;
  /**
   * Calculate direction
   */
  get CalcDirection(): FormulaCOfCircleCalcDirEum {
    return this._direct;
  }

  constructor(srcnum: number, bdir: FormulaCOfCircleCalcDirEum) {
    super(PrimarySchoolFormulaEnum.CircumferenceOfCircle);

    if (bdir === FormulaCOfCircleCalcDirEum.Radius) {
      this._direct = FormulaCOfCircleCalcDirEum.Radius;
      this._raidus = srcnum;
      this._circum = parseFloat((2 * this._raidus * Math.PI).toFixed(2));
    } else {
      this._direct = FormulaCOfCircleCalcDirEum.Circum;
      this._circum = srcnum;
      this._raidus = parseFloat((this._circum / Math.PI / 2).toFixed(2));
    }
  }

  public IsCorrect(): boolean {
    const brst = super.IsCorrect();
    if (!brst) {
      return false;
    }

    if (this._direct === FormulaCOfCircleCalcDirEum.Radius) {
      if (this._circum.toFixed(2) === this.InputtedResult.toFixed(2)) {
        return true;
      }
    } else if (this._direct === FormulaCOfCircleCalcDirEum.Circum) {
      if (this._raidus.toFixed(2) === this.InputtedResult.toFixed(2)) {
        return true;
      }
    }

    return false;
  }

  public getQuizFormat(): string {
    //let rststr = super.getQuizFormat();
    //return rststr ;

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

    return frmstr.replace('C', this._circum.toFixed(2)).replace('R', this._raidus.toFixed(2));
  }

  public getInputtedForumla(): string {
    const frmstr: string = getFormulaUIString(this.FormulaType);

    if (this._direct === FormulaCOfCircleCalcDirEum.Radius) {
      return frmstr.replace('C', this.InputtedResult.toFixed(2)).replace('R', this._raidus.toFixed(2));
    } else {
      return frmstr.replace('C', this._circum.toFixed(2)).replace('R', this.InputtedResult.toFixed(2));
    }
  }

  public storeToString(): string {
    let rstr = super.storeToString();

    if (this._direct === FormulaCOfCircleCalcDirEum.Radius) {
      rstr += QuizSplitter + '0' + QuizSplitter + this._raidus.toString();
    } else {
      rstr += QuizSplitter + '1' + QuizSplitter + this._circum.toString();
    }

    return rstr;
  }

  public static restoreFromString(s: string): FormulaCOfCircleQuizItem | null {
    try {
      const idx = s.indexOf(QuizSplitter);

      const nbol: number = parseInt(s.substring(0, idx));
      const nnum: number = parseFloat(s.substring(idx + 1));
      return new FormulaCOfCircleQuizItem(nnum, <FormulaCOfCircleCalcDirEum>nbol);
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
  get Edge(): number {
    return this._edge;
  }

  private _circum: number;
  get Circumference(): number {
    return this._circum;
  }

  private _direct: FormulaCOfSquareCalcDirEum;
  /**
   * Calculate direction
   */
  get CalcDirection(): FormulaCOfSquareCalcDirEum {
    return this._direct;
  }

  constructor(srcnum: number, bdir: FormulaCOfSquareCalcDirEum) {
    super(PrimarySchoolFormulaEnum.CircumferenceOfSquare);

    if (bdir === FormulaCOfSquareCalcDirEum.Edge) {
      this._direct = FormulaCOfSquareCalcDirEum.Edge;
      this._edge = srcnum;
      this._circum = parseFloat((4 * this._edge).toFixed(2));
    } else {
      this._direct = FormulaCOfSquareCalcDirEum.Circum;
      this._circum = srcnum;
      this._edge = parseFloat((this._circum / 4).toFixed(2));
    }
  }

  public IsCorrect(): boolean {
    const brst = super.IsCorrect();
    if (!brst) {
      return false;
    }

    if (this._direct === FormulaCOfSquareCalcDirEum.Edge) {
      if (this._circum.toFixed(2) === this.InputtedResult.toFixed(2)) {
        return true;
      }
    } else if (this._direct === FormulaCOfSquareCalcDirEum.Circum) {
      if (this._edge.toFixed(2) === this.InputtedResult.toFixed(2)) {
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

    return frmstr.replace('C', this._circum.toFixed(2)).replace('a', this._edge.toFixed(2));
  }

  public getInputtedForumla(): string {
    const frmstr: string = getFormulaUIString(this.FormulaType);

    if (this._direct === FormulaCOfSquareCalcDirEum.Edge) {
      return frmstr.replace('C', this.InputtedResult.toFixed(2)).replace('a', this._edge.toFixed(2));
    } else if (this._direct === FormulaCOfSquareCalcDirEum.Circum) {
      return frmstr.replace('C', this._circum.toFixed(2)).replace('a', this.InputtedResult.toFixed(2));
    }
  }

  public storeToString(): string {
    let rstr = super.storeToString();

    if (this._direct === FormulaCOfSquareCalcDirEum.Edge) {
      rstr += QuizSplitter + '0' + QuizSplitter + this._edge.toString();
    } else if (this._direct === FormulaCOfSquareCalcDirEum.Circum) {
      rstr += QuizSplitter + '1' + QuizSplitter + this._circum.toString();
    }

    return rstr;
  }

  public static restoreFromString(s: string): FormulaCOfSquareQuizItem | null {
    try {
      const idx = s.indexOf(QuizSplitter);

      const nbol: number = parseInt(s.substring(0, idx));
      const nnum: number = parseFloat(s.substring(idx + 1));

      return new FormulaCOfSquareQuizItem(nnum, <FormulaCOfSquareCalcDirEum>nbol);
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
  get LongEdge(): number {
    return this._longedge;
  }
  get ShortEdge(): number {
    return this._shortedge;
  }

  private _circum: number;
  get Circumference(): number {
    return this._circum;
  }

  private _direct: FormulaCOfRectangleCalcDirEum;
  /**
   * Calculate direction
   */
  get CalcDirection(): FormulaCOfRectangleCalcDirEum {
    return this._direct;
  }

  constructor(num1: number, num2: number, dir: FormulaCOfRectangleCalcDirEum) {
    super(PrimarySchoolFormulaEnum.CircumferenceOfRectangle);

    if (dir === FormulaCOfRectangleCalcDirEum.LongEdgeAndShortEdge) {
      this._direct = dir;
      this._longedge = num1;
      this._shortedge = num2;
      this._circum = parseFloat((2 * (this._longedge + this._shortedge)).toFixed(2));
    } else if (dir === FormulaCOfRectangleCalcDirEum.LongEdgeAndCircum) {
      this._direct = dir;
      this._longedge = num1;
      this._circum = num2;
      this._shortedge = parseFloat(((this._circum - 2 * this._longedge) / 2).toFixed(2));
    } else if (dir === FormulaCOfRectangleCalcDirEum.ShortEdgeAndCircum) {
      this._direct = dir;
      this._shortedge = num1;
      this._circum = num2;
      this._longedge = parseFloat(((this._circum - 2 * this._shortedge) / 2).toFixed(2));
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
      if (this._circum.toFixed(2) === this.InputtedResult.toFixed(2)) {
        return true;
      }
    } else if (this._direct === FormulaCOfRectangleCalcDirEum.LongEdgeAndCircum) {
      if (this._shortedge.toFixed(2) === this.InputtedResult.toFixed(2)) {
        return true;
      }
    } else if (this._direct === FormulaCOfRectangleCalcDirEum.ShortEdgeAndCircum) {
      if (this._longedge.toFixed(2) === this.InputtedResult.toFixed(2)) {
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

    return frmstr.replace('C', this._circum.toFixed(2)).replace('a', this._longedge.toFixed(2)).replace('b', this._shortedge.toFixed(2));
  }

  public getInputtedForumla(): string {
    const frmstr: string = getFormulaUIString(this.FormulaType);

    if (this._direct === FormulaCOfRectangleCalcDirEum.LongEdgeAndShortEdge) {
      return frmstr.replace('C', this.InputtedResult.toFixed(2)).replace('a', this._longedge.toFixed(2)).replace('b', this._shortedge.toFixed(2));
    } else if (this._direct === FormulaCOfRectangleCalcDirEum.LongEdgeAndCircum) {
      return frmstr.replace('C', this._circum.toFixed(2)).replace('a', this._longedge.toFixed(2)).replace('b', this.InputtedResult.toFixed(2));
    } else if (this._direct === FormulaCOfRectangleCalcDirEum.ShortEdgeAndCircum) {
      return frmstr.replace('C', this._circum.toFixed(2)).replace('a', this.InputtedResult.toFixed(2)).replace('b', this._shortedge.toFixed(2));
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

  private _direct: FormulaDistAndSpeedCalcDirEum;
  /**
   * Calculate direction
   */
  get CalcDirection(): FormulaDistAndSpeedCalcDirEum {
    return this._direct;
  }

  constructor(num1: number, num2: number, dir: FormulaDistAndSpeedCalcDirEum) {
    super(PrimarySchoolFormulaEnum.DistanceAndSpeed);

    if (dir === FormulaDistAndSpeedCalcDirEum.SpeedAndTime) {
      this._direct = dir;
      this._speed = num1;
      this._time = num2;
      this._distance = parseFloat((this._speed * this._time).toFixed(2));
    } else if (dir === FormulaDistAndSpeedCalcDirEum.SpeedAndDistance) {
      this._direct = dir;
      this._speed = num1;
      this._distance = num2;
      this._time = parseFloat((this._distance / this._speed).toFixed(2));
    } else if (dir === FormulaDistAndSpeedCalcDirEum.TimeAndDistance) {
      this._direct = dir;
      this._time = num1;
      this._distance = num2;
      this._speed = parseFloat((this._distance / this._time).toFixed(2));
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
      if (this._distance.toFixed(2) === this.InputtedResult.toFixed(2)) {
        return true;
      }
    } else if (this._direct === FormulaDistAndSpeedCalcDirEum.SpeedAndDistance) {
      if (this._time.toFixed(2) === this.InputtedResult.toFixed(2)) {
        return true;
      }
    } else if (this._direct === FormulaDistAndSpeedCalcDirEum.TimeAndDistance) {
      if (this._speed.toFixed(2) === this.InputtedResult.toFixed(2)) {
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

    return frmstr.replace('S', this._distance.toFixed(2)).replace('v', this._speed.toFixed(2)).replace('h', this._time.toFixed(2));
  }

  public getInputtedForumla(): string {
    const frmstr: string = getFormulaUIString(this.FormulaType);

    if (this._direct === FormulaDistAndSpeedCalcDirEum.SpeedAndTime) {
      return frmstr.replace('S', this.InputtedResult.toFixed(2)).replace('v', this._speed.toFixed(2)).replace('h', this._time.toFixed(2));
    } else if (this._direct === FormulaDistAndSpeedCalcDirEum.SpeedAndDistance) {
      return frmstr.replace('S', this._distance.toFixed(2)).replace('v', this._speed.toFixed(2)).replace('h', this.InputtedResult.toFixed(2));
    } else if (this._direct === FormulaDistAndSpeedCalcDirEum.TimeAndDistance) {
      return frmstr.replace('S', this._distance.toFixed(2)).replace('v', this.InputtedResult.toFixed(2)).replace('h', this._time.toFixed(2));
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
  get LongEdge(): number {
    return this._longedge;
  }
  get ShortEdge(): number {
    return this._shortedge;
  }

  private _area: number;
  get Area(): number {
    return this._area;
  }

  private _direct: FormulaAOfRectangleCalcDirEum;
  /**
   * Calculate direction
   */
  get CalcDirection(): FormulaAOfRectangleCalcDirEum {
    return this._direct;
  }

  constructor(num1: number, num2: number, dir: FormulaAOfRectangleCalcDirEum) {
    super(PrimarySchoolFormulaEnum.AreaOfRectangle);

    if (dir === FormulaAOfRectangleCalcDirEum.LongEdgeAndShortEdge) {
      this._direct = dir;
      this._longedge = num1;
      this._shortedge = num2;
      this._area = parseFloat((this._longedge * this._shortedge).toFixed(2));
    } else if (dir === FormulaAOfRectangleCalcDirEum.LongEdgeAndArea) {
      this._direct = dir;
      this._longedge = num1;
      this._area = num2;
      this._shortedge = parseFloat((this._area / this._longedge).toFixed(2));
    } else if (dir === FormulaAOfRectangleCalcDirEum.ShortEdgeAndArea) {
      this._direct = dir;
      this._shortedge = num1;
      this._area = num2;
      this._longedge = parseFloat((this._area / this._shortedge).toFixed(2));
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
      if (this._area.toFixed(2) === this.InputtedResult.toFixed(2)) {
        return true;
      }
    } else if (this._direct === FormulaAOfRectangleCalcDirEum.LongEdgeAndArea) {
      if (this._shortedge.toFixed(2) === this.InputtedResult.toFixed(2)) {
        return true;
      }
    } else if (this._direct === FormulaAOfRectangleCalcDirEum.ShortEdgeAndArea) {
      if (this._longedge.toFixed(2) === this.InputtedResult.toFixed(2)) {
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

    return frmstr.replace('S', this._area.toFixed(2)).replace('a', this._longedge.toFixed(2)).replace('b', this._shortedge.toFixed(2));
  }

  public getInputtedForumla(): string {
    const frmstr: string = getFormulaUIString(this.FormulaType);

    if (this._direct === FormulaAOfRectangleCalcDirEum.LongEdgeAndShortEdge) {
      return frmstr.replace('S', this.InputtedResult.toFixed(2)).replace('a', this._longedge.toFixed(2)).replace('b', this._shortedge.toFixed(2));
    } else if (this._direct === FormulaAOfRectangleCalcDirEum.LongEdgeAndArea) {
      return frmstr.replace('S', this._area.toFixed(2)).replace('a', this._longedge.toFixed(2)).replace('b', this.InputtedResult.toFixed(2));
    } else if (this._direct === FormulaAOfRectangleCalcDirEum.ShortEdgeAndArea) {
      return frmstr.replace('S', this._area.toFixed(2)).replace('a', this.InputtedResult.toFixed(2)).replace('b', this._shortedge.toFixed(2));
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
  get Edge(): number {
    return this._edge;
  }

  private _area: number;
  get Area(): number {
    return this._area;
  }

  private _direct: FormulaAreaOfSquareCalcDirEum;
  /**
   * Calculate direction
   */
  get CalcDirection(): FormulaAreaOfSquareCalcDirEum {
    return this._direct;
  }

  constructor(srcnum: number, bdir: FormulaAreaOfSquareCalcDirEum) {
    super(PrimarySchoolFormulaEnum.AreaOfSquare);

    if (bdir === FormulaAreaOfSquareCalcDirEum.Edge) {
      this._direct = FormulaAreaOfSquareCalcDirEum.Edge;
      this._edge = srcnum;
      this._area = parseFloat(Math.pow(this._edge, 2).toFixed(2));
    } else {
      this._direct = FormulaAreaOfSquareCalcDirEum.Area;
      this._area = srcnum;
      this._edge = parseFloat(Math.sqrt(this._area).toFixed(2));
    }
  }

  public IsCorrect(): boolean {
    const brst = super.IsCorrect();
    if (!brst) {
      return false;
    }

    if (this._direct === FormulaAreaOfSquareCalcDirEum.Edge) {
      if (this._area.toFixed(2) === this.InputtedResult.toFixed(2)) {
        return true;
      }
    } else if (this._direct === FormulaAreaOfSquareCalcDirEum.Area) {
      if (this._edge.toFixed(2) === this.InputtedResult.toFixed(2)) {
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

    return frmstr.replace('S', this._area.toFixed(2)).replace('a', this._edge.toFixed(2));
  }

  public getInputtedForumla(): string {
    const frmstr: string = getFormulaUIString(this.FormulaType);

    if (this._direct === FormulaAreaOfSquareCalcDirEum.Edge) {
      return frmstr.replace('S', this.InputtedResult.toFixed(2)).replace('a', this._edge.toFixed(2));
    } else if (this._direct === FormulaAreaOfSquareCalcDirEum.Area) {
      return frmstr.replace('S', this._area.toFixed(2)).replace('a', this.InputtedResult.toFixed(2));
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
