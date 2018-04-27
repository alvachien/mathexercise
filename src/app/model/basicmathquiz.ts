
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

  public IsCorrect(): boolean {
    if (!super.IsCorrect()) {
      return false;
    }

    if (this._inputtedResult === null || this._inputtedResult === undefined) {
      return false;
    }

    if (this._inputtedResult === this._result) {
      return true;
    }

    return false;
  }

  constructor(lft?: number, right?: number, dplace?: number) {
    super(lft, right, dplace);
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

  protected storeToJsonObject(): any {
    const jobj = super.storeToJsonObject();
    return jobj;
  }

  protected restoreFromJsonObject(jobj: any): void {
    super.restoreFromJsonObject(jobj);
  }

  protected calcResult(): void {
    super.calcResult();

    this._result = this.LeftNumber + this.RightNumber;
    if (this._decimalPlaces === 0) {
      this._result = Math.round(this._result);
    } else {
      this._result = parseFloat(this._result.toFixed(this._decimalPlaces));
    }
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

  public IsCorrect(): boolean {
    if (!super.IsCorrect()) {
      return false;
    }

    if (this._inputtedResult === null || this._inputtedResult === undefined) {
      return false;
    }

    if (this._inputtedResult === this._result) {
      return true;
    }

    return false;
  }

  constructor(lft?: number, right?: number, dplace?: number) {
    super(lft, right, dplace);
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

  protected storeToJsonObject(): any {
    const jobj = super.storeToJsonObject();
    return jobj;
  }

  protected restoreFromJsonObject(jobj: any): void {
    super.restoreFromJsonObject(jobj);
  }

  protected calcResult(): void {
    super.calcResult();

    this._result = this.LeftNumber - this.RightNumber;
    if (this._decimalPlaces === 0) {
      this._result = Math.round(this._result);
    } else {
      this._result = parseFloat(this._result.toFixed(this._decimalPlaces));
    }
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

  public IsCorrect(): boolean {
    if (!super.IsCorrect()) {
      return false;
    }

    if (this._inputtedResult === null || this._inputtedResult === undefined) {
      return false;
    }

    if (this._inputtedResult === this._result) {
      return true;
    }

    return false;
  }

  constructor(lft?: number, right?: number, dplace?: number) {
    super(lft, right, dplace);
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

  protected storeToJsonObject(): any {
    const jobj = super.storeToJsonObject();
    return jobj;
  }

  protected restoreFromJsonObject(jobj: any): void {
    super.restoreFromJsonObject(jobj);
  }

  protected calcResult(): void {
    super.calcResult();

    this._result = this.LeftNumber * this.RightNumber;
    if (this._decimalPlaces === 0) {
      this._result = Math.round(this._result);
    } else {
      this._result = parseFloat(this._result.toFixed(this._decimalPlaces));
    }
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

  constructor(lft?: number, right?: number, dplace?: number) {
    super(lft, right, dplace);
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

  protected storeToJsonObject(): any {
    const jobj = super.storeToJsonObject();
    return jobj;
  }

  protected restoreFromJsonObject(jobj: any): void {
    super.restoreFromJsonObject(jobj);
  }

  protected canCalcResult(): boolean {
    if (!super.canCalcResult()) {
      return false;
    }

    if (this._rightNumber === 0) {
      return false;
    }

    return true;
  }

  protected calcResult(): void {
    super.calcResult();

    this._quotient = this.LeftNumber / this.RightNumber;
    this._remainder = this.LeftNumber % this.RightNumber;
    if (this._decimalPlaces > 0) {
      this._quotient = parseFloat(this._quotient.toFixed(this._decimalPlaces));
    } else {
      this._quotient = Math.floor(this._quotient);
    }
  }
}

/**
 * Mixed operation quiz
 */
export class MixedOperationQuizItem extends PrimarySchoolMathQuizItem {
  private _formula: string;
  private _result: number;
  private _inputtedResult: number;
  private _decimalPlace: number;

  get Formula(): string {
    return this._formula;
  }
  get Result(): number {
    return this._result;
  }
  get decimalPlace(): number {
    return this._decimalPlace;
  }

  get InputtedResult(): number {
    return this._inputtedResult;
  }
  set InputtedResult(ia: number) {
    this._inputtedResult = ia;
  }
  set decimalPlace(dplace: number) {
    this._decimalPlace = dplace;
  }

  constructor(frm?: string) {
    super();

    if (frm) {
      this._formula = frm;
    }

    if (this.canCalcResult()) {
      this.calcResult();
    }
  }

  public IsCorrect(): boolean {
    if (!super.IsCorrect()) {
      return false;
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

  protected storeToJsonObject(): any {
    const jobj = super.storeToJsonObject();
    jobj.forumla = this._formula;
    return jobj;
  }

  protected restoreFromJsonObject(jobj: any): void {
    super.restoreFromJsonObject(jobj);

    if (jobj && jobj.forumla) {
      this._formula = jobj.formula;
    }
  }

  protected canCalcResult(): boolean {
    if (!super.canCalcResult()) {
      return false;
    }

    if (this._formula === undefined || this._formula.length <= 0) {
      return false;
    }

    return true;
  }

  protected calcResult(): void {
    super.calcResult();

    this._result = <number>eval(this._formula);
    if (this._decimalPlace > 0) {
      this._result = parseFloat(this._result.toFixed(this._decimalPlace));
    } else {
      this._result = Math.floor(this._result);
    }
  }
}
