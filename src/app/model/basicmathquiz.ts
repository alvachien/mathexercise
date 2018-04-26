
import { QuizItem, PrimarySchoolMathQuizItem, PrimarySchoolMathFAOQuizItem } from './quizconcept';

/**
 * Math quiz item for additon part
 */
export class AdditionQuizItem extends PrimarySchoolMathFAOQuizItem {
  private _result: number;
  private _inputtedResult: number;

  get Result(): number {
    return this._result;
  }
  get InputtedResult(): number {
    return this._inputtedResult;
  }
  set InputtedResult(ir: number) {
    this._inputtedResult = ir;
  }

  public static restoreFromString(s: string): AdditionQuizItem {
    const qi: PrimarySchoolMathFAOQuizItem = super.restoreFromString(s);
    return new AdditionQuizItem(qi.LeftNumber, qi.RightNumber);
  }

  public IsCorrect(): boolean {
    const brst = super.IsCorrect();
    if (!brst) {
      return brst;
    }

    if (this._inputtedResult === null || this._inputtedResult === undefined) {
      return false;
    }

    if (this._inputtedResult === this._result) {
      return true;
    }

    return false;
  }

  constructor(lft: number, right: number, dplace?: number) {
    super(lft, right, dplace);

    this._result = this.LeftNumber + this.RightNumber;
    if (!dplace) {
      this._result = Math.round(this._result);
    } else {
      this._result = parseFloat(this._result.toFixed(dplace));
    }
  }

  public getCorrectFormula(): string {
    return this.LeftNumber.toString()
      + ' + ' + this.RightNumber.toString() + ' = ' + this.Result.toString();
  }

  public getInputtedForumla(): string {
    return this.LeftNumber.toString()
      + ' + ' + this.RightNumber.toString() + ' = '
      + ((this.InputtedResult !== undefined && this.InputtedResult !== null) ? this.InputtedResult.toString() : '');
  }

  public getQuizFormat(): string {
    const rststr = super.getQuizFormat();
    return rststr + this.LeftNumber.toString()
      + ' + ' + this.RightNumber.toString() + ' = ';
  }
}

/**
 * Math quiz item for subtraction part
 */
export class SubtractionQuizItem extends PrimarySchoolMathFAOQuizItem {
  private _result: number;
  private _inputtedResult: number;

  get Result(): number {
    return this._result;
  }
  get InputtedResult(): number {
    return this._inputtedResult;
  }
  set InputtedResult(ir: number) {
    this._inputtedResult = ir;
  }

  public static restoreFromString(s: string): SubtractionQuizItem {
    const qi: PrimarySchoolMathFAOQuizItem = super.restoreFromString(s);
    return new SubtractionQuizItem(qi.LeftNumber, qi.RightNumber);
  }

  public IsCorrect(): boolean {
    const brst = super.IsCorrect();
    if (!brst) {
      return brst;
    }

    if (this._inputtedResult === null || this._inputtedResult === undefined) {
      return false;
    }

    if (this._inputtedResult === this._result) {
      return true;
    }

    return false;
  }

  constructor(lft: number, right: number, dplace?: number) {
    super(lft, right, dplace);

    this._result = this.LeftNumber - this.RightNumber;
    if (!dplace) {
      this._result = Math.round(this._result);
    } else {
      this._result = parseFloat(this._result.toFixed(dplace));
    }
  }

  public getCorrectFormula(): string {
    return this.LeftNumber.toString()
      + ' - ' + this.RightNumber.toString() + ' = ' + this.Result.toString();
  }

  public getInputtedForumla(): string {
    return this.LeftNumber.toString()
      + ' - ' + this.RightNumber.toString() + ' = '
      + ((this.InputtedResult !== undefined && this.InputtedResult !== null) ? this.InputtedResult.toString() : '');
  }

  public getQuizFormat(): string {
    const rststr = super.getQuizFormat();
    return rststr + this.LeftNumber.toString()
      + ' - ' + this.RightNumber.toString() + ' = ';
  }
}

/**
 * Math quiz item for multiplication part
 */
export class MultiplicationQuizItem extends PrimarySchoolMathFAOQuizItem {
  private _result: number;
  private _inputtedResult: number;

  get Result(): number {
    return this._result;
  }
  get InputtedResult(): number {
    return this._inputtedResult;
  }
  set InputtedResult(ir: number) {
    this._inputtedResult = ir;
  }

  public static restoreFromString(s: string): MultiplicationQuizItem {
    const qi: PrimarySchoolMathFAOQuizItem = super.restoreFromString(s);
    return new MultiplicationQuizItem(qi.LeftNumber, qi.RightNumber);
  }

  public IsCorrect(): boolean {
    const brst = super.IsCorrect();
    if (!brst) {
      return brst;
    }

    if (this._inputtedResult === null || this._inputtedResult === undefined) {
      return false;
    }

    if (this._inputtedResult === this._result) {
      return true;
    }

    return false;
  }

  constructor(lft: number, right: number, dplace?: number) {
    super(lft, right, dplace);

    this._result = this.LeftNumber * this.RightNumber;
    if (!dplace) {
      this._result = Math.round(this._result);
    } else {
      this._result = parseFloat(this._result.toFixed(dplace));
    }
  }

  public getCorrectFormula(): string {
    return this.LeftNumber.toString()
      + ' × ' + this.RightNumber.toString() + ' = '
      + this.Result.toString();
  }

  public getInputtedForumla(): string {
    return this.LeftNumber.toString()
      + ' × ' + this.RightNumber.toString() + ' = '
      + ((this.InputtedResult !== undefined && this.InputtedResult !== null) ? this.InputtedResult.toString() : '');
  }

  public getQuizFormat(): string {
    const rststr = super.getQuizFormat();
    return rststr + this.LeftNumber.toString()
      + ' × ' + this.RightNumber.toString() + ' = ';
  }
}

/**
 * Math quiz item for division  part
 */
export class DivisionQuizItem extends PrimarySchoolMathFAOQuizItem {
  private _quotient: number;
  private _remainder: number;
  private _inputtedQuotient: number;
  private _inputtedRemainder: number;

  get Dividend(): number {
    return this.LeftNumber;
  }
  get Divisor(): number {
    return this.RightNumber;
  }

  get Quotient(): number {
    return this._quotient;
  }
  get Remainder(): number {
    return this._remainder;
  }
  get InputtedQuotient(): number {
    return this._inputtedQuotient;
  }
  set InputtedQuotient(ir: number) {
    this._inputtedQuotient = ir;
  }
  get InputtedRemainder(): number {
    return this._inputtedRemainder;
  }
  set InputtedRemainder(ir: number) {
    this._inputtedRemainder = ir;
  }
  public static restoreFromString(s: string): DivisionQuizItem {
    const qi: PrimarySchoolMathFAOQuizItem = super.restoreFromString(s);
    return new DivisionQuizItem(qi.LeftNumber, qi.RightNumber);
  }

  constructor(lft: number, right: number, dplace?: number) {
    super(lft, right, dplace);

    this._quotient = Math.floor(this.LeftNumber / this.RightNumber);
    this._remainder = this.LeftNumber % this.RightNumber;
    if (dplace) {
      this._quotient = parseFloat(this._quotient.toFixed(dplace));
    } else {
      this._quotient = Math.floor(this.LeftNumber / this.RightNumber);
    }
  }

  public IsCorrect(): boolean {
    const brst = super.IsCorrect();
    if (!brst) {
      return brst;
    }

    if (this._inputtedQuotient === null || this._inputtedQuotient === undefined
      || this._inputtedRemainder === null || this._inputtedRemainder === null) {
      return false;
    }

    if (this._inputtedQuotient === this._quotient && this._inputtedRemainder === this._remainder) {
      return true;
    }

    return false;
  }

  public getCorrectFormula(): string {
    return this.LeftNumber.toString()
      + ' ÷ ' + this.RightNumber.toString() + ' = ' + this.Quotient.toString()
      + ((this.Remainder === 0) ? '' : ('... ' + this.Remainder.toString()));
  }

  public getInputtedForumla(): string {
    return this.LeftNumber.toString()
      + ' ÷ ' + this.RightNumber.toString() + ' = '
      + ((this.InputtedQuotient !== undefined && this.InputtedQuotient !== null) ? this.InputtedQuotient.toString() : '')
      + ((this.InputtedRemainder !== undefined && this.InputtedRemainder !== null) ? ' ... ' + this.InputtedRemainder.toString() : '');
  }

  public getQuizFormat(): string {
    const rststr = super.getQuizFormat();
    return rststr + this.LeftNumber.toString()
      + ' ÷ ' + this.RightNumber.toString() + ' = ';
  }
}

/**
 * Mixed operation quiz
 */
export class MixedOperationQuizItem extends PrimarySchoolMathQuizItem {
  private _formula: string;
  private _result: number;
  private _inputtedResult: number;

  get Formula(): string {
    return this._formula;
  }
  get Result(): number {
    return this._result;
  }

  get InputtedResult(): number {
    return this._inputtedResult;
  }
  set InputtedResult(ia: number) {
    this._inputtedResult = ia;
  }

  public static restoreFromString(s: string): MixedOperationQuizItem {
    return new MixedOperationQuizItem(s);
  }

  constructor(frm: string) {
    super();

    this._formula = frm;
    this._result = <number>eval(this._formula);
  }

  public IsCorrect(): boolean {
    const brst = super.IsCorrect();
    if (!brst) {
      return brst;
    }

    if (this._result === this._inputtedResult) {
      return true;
    }

    return false;
  }

  public getCorrectFormula(): string {
    return this.getQuizFormat() + this.Result.toString();
  }

  public getInputtedForumla(): string {
    return this.getQuizFormat() + this.InputtedResult.toString();
  }

  public getQuizFormat(): string {
    const rststr = super.getQuizFormat();
    return rststr + this._formula.replace('*', '×').replace('/', '÷') + ' = ';
  }

  public storeToString(): string {
    let rstr = super.storeToString();
    rstr = rstr + this._formula;
    return rstr;
  }
}
