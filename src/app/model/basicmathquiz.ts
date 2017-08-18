
import { QuizItem, PrimarySchoolMathQuizItem } from './quizconcept';

/**
 * Math quiz item for additon part
 */
export class AdditionQuizItem extends PrimarySchoolMathQuizItem {
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
        let brst = super.IsCorrect();
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

    constructor(lft: number, right: number) {
        super(lft, right);

        this._result = Math.round(this.LeftNumber + this.RightNumber);    
    }

    public getCorrectFormula(): string {
        return this.LeftNumber.toString()
            + " + " + this.RightNumber.toString() + " = " + this.Result.toString();
    }

    public getInputtedForumla(): string {
        return this.LeftNumber.toString()
            + " + " + this.RightNumber.toString() + " = " + ((this.InputtedResult !== undefined && this.InputtedResult !== null)? this.InputtedResult.toString() : "");
    }
    
    public getFormattedString(): string {
        let rststr = super.getFormattedString();
        return rststr + this.LeftNumber.toString()
            + " + " + this.RightNumber.toString() + " = ";
    }

    public static restoreFromString(s: string): AdditionQuizItem {
        let qi: PrimarySchoolMathQuizItem = super.restoreFromString(s);
        return new AdditionQuizItem(qi.LeftNumber, qi.RightNumber);
    }
}

/**
 * Math quiz item for subtraction part
 */
export class SubtractionQuizItem extends PrimarySchoolMathQuizItem {
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
        let brst = super.IsCorrect();
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

    constructor(lft: number, right: number) {
        super(lft, right);

        this._result = Math.round(this.LeftNumber - this.RightNumber);    
    }

    public getCorrectFormula(): string {
        return this.LeftNumber.toString()
            + " - " + this.RightNumber.toString() + " = " + this.Result.toString();
    }

    public getInputtedForumla(): string {
        return this.LeftNumber.toString()
            + " - " + this.RightNumber.toString() + " = " 
            + ((this.InputtedResult !== undefined && this.InputtedResult !== null)? this.InputtedResult.toString() : "");
    }
    
    public getFormattedString(): string {
        let rststr = super.getFormattedString();
        return rststr + this.LeftNumber.toString()
            + " - " + this.RightNumber.toString() + " = ";
    }

    public static restoreFromString(s: string): SubtractionQuizItem {
        let qi: PrimarySchoolMathQuizItem = super.restoreFromString(s);
        return new SubtractionQuizItem(qi.LeftNumber, qi.RightNumber);
    }    
}

/**
 * Math quiz item for multiplication part
 */
export class MultiplicationQuizItem extends PrimarySchoolMathQuizItem {
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
        let brst = super.IsCorrect();
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

    constructor(lft: number, right: number) {
        super(lft, right);

        this._result = Math.round(this.LeftNumber * this.RightNumber);    
    }

    public getCorrectFormula(): string {
        return this.LeftNumber.toString()
            + " × " + this.RightNumber.toString() + " = " 
            + this.Result.toString();
    }

    public getInputtedForumla(): string {
        return this.LeftNumber.toString()
            + " × " + this.RightNumber.toString() + " = " 
            + ((this.InputtedResult !== undefined && this.InputtedResult !== null)? this.InputtedResult.toString() : "");
    }
    
    public getFormattedString(): string {
        let rststr = super.getFormattedString();
        return rststr + this.LeftNumber.toString()
            + " × " + this.RightNumber.toString() + " = ";
    }

    public static restoreFromString(s: string): MultiplicationQuizItem {
        let qi: PrimarySchoolMathQuizItem = super.restoreFromString(s);
        return new MultiplicationQuizItem(qi.LeftNumber, qi.RightNumber);
    }    
}

/**
 * Math quiz item for division  part
 */
export class DivisionQuizItem extends PrimarySchoolMathQuizItem {
    private _quotient: number;
    private _remainder: number;
    private _inputtedQuotient: number;
    private _inputtedRemainder: number;

    get Dividend(): number {
        return this.LeftNumber;;
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

    constructor(lft: number, right: number) {
        super(lft, right);

        this._quotient = Math.floor(this.LeftNumber / this.RightNumber);
        this._remainder = this.LeftNumber % this.RightNumber;
    }

    public IsCorrect(): boolean {
        let brst = super.IsCorrect();
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
            + " ÷ " + this.RightNumber.toString() + " = " + this.Quotient.toString()
            + ((this.Remainder === 0) ? "" : ("... " + this.Remainder.toString()));
    }

    public getInputtedForumla(): string {
        return this.LeftNumber.toString()
            + " ÷ " + this.RightNumber.toString() + " = " 
            + ((this.InputtedQuotient !== undefined && this.InputtedQuotient !== null)? this.InputtedQuotient.toString() : "")
            + ((this.InputtedRemainder !== undefined && this.InputtedRemainder !== null)? " ... " + this.InputtedRemainder.toString() : "");
    }

    public getFormattedString(): string {
        let rststr = super.getFormattedString();
        return rststr + this.LeftNumber.toString()
            + " ÷ " + this.RightNumber.toString() + " = ";
    }
    
    public static restoreFromString(s: string): DivisionQuizItem {
        let qi: PrimarySchoolMathQuizItem = super.restoreFromString(s);
        return new DivisionQuizItem(qi.LeftNumber, qi.RightNumber);
    }    
}

