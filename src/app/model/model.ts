
/**
 * Constants
 */
export const DefaultQuizAmount: number = 10;
export const DefaultFailedQuizFactor: number = 3;

/**
 * Quiz item
 */
export class QuizItem {
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
        return true;
    }

    public getFormattedString(): string {
        return '#' + this.QuizIndex.toString() + '; ';
    }
}

/**
 * Math quiz item for Primary School
 */
export class PrimarySchoolMathQuizItem extends QuizItem {
    private _leftNumber: number;
    private _rightNumber: number;

    get LeftNumber(): number {
        return this._leftNumber;
    }
    get RightNumber(): number {
        return this._rightNumber;
    }

    constructor(lft: number, right: number) {
        super();

        this._leftNumber = Math.round(lft);
        this._rightNumber = Math.round(right);
    }

    public IsCorrect(): boolean {
        let brst = super.IsCorrect();
        if (!brst) {
            return false;
        }
        return true;

    }

    public getFormattedString(): string {
        let rststr = super.getFormattedString();
        return rststr;
    }

    public getCorrectFormula(): string {
        return '';
    }

    public getInputtedForumla(): string {
        return '';
    }
}

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
            + " + " + this.RightNumber.toString() + " = " + this.Result.toString()
            + ((this.InputtedResult !== undefined && this.InputtedResult !== null)? "; Inputted: " + this.InputtedResult.toString() : "");
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
            + " - " + this.RightNumber.toString() + " = " + this.Result.toString()
            + ((this.InputtedResult !== undefined && this.InputtedResult !== null)? "; Inputted: " + this.InputtedResult.toString() : "");
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
            + " × " + this.RightNumber.toString() + " = " + this.Result.toString()
            + ((this.InputtedResult !== undefined && this.InputtedResult !== null)? "; Inputted: " + this.InputtedResult.toString() : "");
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
            + " ÷ " + this.RightNumber.toString() + " = " + this.Quotient.toString()
            + ((this.Remainder === 0) ? "" : ("... " + this.Remainder.toString()))
            + ((this.InputtedQuotient !== undefined && this.InputtedQuotient !== null)? "; Inputted: " + this.InputtedQuotient.toString() : "")
            + ((this.InputtedRemainder !== undefined && this.InputtedRemainder !== null)? " ... " + this.InputtedRemainder.toString() : "");
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

    constructor(scn: number, ic: number)  {
        this._sectionNumber = scn;
        this.ItemsCount = ic;
    }

    public SectionStart() {
        this._startPoint = new Date().getTime();
    }
    public SectionComplete() {
        const stoppnt = new Date().getTime();
        this._timeSpent = stoppnt - this._startPoint;
    }

    public getSummaryInfo(): string {
        let rst: string = 'BATCH#' + this.SectionNumber.toString() + ';';
        rst = rst + ' total items: ' + this.ItemsCount.toString() + '; '
            + (this.ItemsFailed > 0? ' Failed : ' + this.ItemsFailed.toString() : '');
        rst = rst += ' Time spent: ' + Math.round(this.TimeSpent / 1000).toString() + ' s';
        return rst;
    }
}

/**
 * Math quiz for Primary School
 */
export class PrimarySchoolMathQuiz {    
    private _elderRun: PrimarySchoolMathQuizSection[] = [];
    public ElderRuns(): PrimarySchoolMathQuizSection[] {
        return this._elderRun;
    }

    private _curRun: PrimarySchoolMathQuizSection;
    public CurrentRun(): PrimarySchoolMathQuizSection {
        return this._curRun;
    }

    private _faileFactor: number;
    get FailedFactor(): number {
        return this._faileFactor;
    }
    set FailedFactor(ff: number) {
        this._faileFactor = ff;
    }
    private _isStarted: boolean;
    get IsStarted(): boolean {
        return this._isStarted;
    }
    private _curRunID: number;

    constructor() {
        this._curRunID = 1;
        this._faileFactor = 0;
        this._isStarted = false;
        this._curRun = null;
    }

    public Start(startnum: number, failfactor: number) {
        if (this._isStarted || this._curRun !== null) {
            throw new Error('Quiz already started!');
        }

        this._faileFactor = failfactor;
        this._curRun = new PrimarySchoolMathQuizSection(this._curRunID, startnum);
        this._isStarted = true;
    }

    public SubmitCurrentRun(failcnt: number) {
        this._curRun.SectionComplete();
        this._elderRun.push(this._curRun);

        if (failcnt > 0) {
            let ncnt = Math.round(failcnt * this._faileFactor);

            let curID = this._curRun.SectionNumber;
            this._curRun = new PrimarySchoolMathQuizSection(curID + 1, ncnt);            
        } 
    }
}
