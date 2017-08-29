
import { QuizSplitter } from './quizconstants';
import { PrimarySchoolMathQuizItem } from './quizconcept';

/**
 * Quiz item for Cal24
 */
export class Cal24QuizItem extends PrimarySchoolMathQuizItem {
    private _isSurrended: boolean;
    get IsSurrended(): boolean {
        return this._isSurrended;
    }
    set IsSurrended(isrnd: boolean) {
        this._isSurrended = isrnd;
    }

    private _arItems: number[];
    get Items(): number[] {
        return this._arItems;
    }
    set Items(aits: number[]) {
        this._arItems = [];
        for(let it of aits) {
            this._arItems.push(it);
        }
    }

    public IsCorrect(): boolean {
        let brst = super.IsCorrect();
        if (!brst) {
            return false;
        }

        return !this.IsSurrended;
    }

    constructor() {
        super();
    }

    public getQuizFormat(): string {
        let rststr = super.getQuizFormat();
        return rststr + this._arItems.join(QuizSplitter);
    }

    public getCorrectFormula(): string {
        let rststr = super.getCorrectFormula();
        return rststr;
    }

    public getInputtedForumla(): string {
        let rststr = super.getInputtedForumla();
        return rststr;
    }

    public storeToString(): string {
        let rstr = super.storeToString();
        rstr = rstr + this._arItems.join(QuizSplitter);
        return rstr;
    }

    public static restoreFromString(s: string): Cal24QuizItem {
        let cqi: Cal24QuizItem = new Cal24QuizItem();
        // todo!!!

        return cqi;
    }
}

/**
 * Quiz item for Sudou
 */
export class SudouQuizItem extends PrimarySchoolMathQuizItem {
    private _isSurrended: boolean;
    get IsSurrended(): boolean {
        return this._isSurrended;
    }
    set IsSurrended(isrnd: boolean) {
        this._isSurrended = isrnd;
    }

    private _info: string;
    get DetailInfo(): string {
        return this._info;
    }
    set DetailInfo(di: string) {
        this._info = di;
    }

    public IsCorrect(): boolean {
        let brst = super.IsCorrect();
        if (!brst) {
            return false;
        }

        return !this.IsSurrended;
    }

    constructor() {
        super();
    }

    public getQuizFormat(): string {
        let rststr = super.getQuizFormat();
        return rststr + this._info;
    }

    public getCorrectFormula(): string {
        let rststr = super.getCorrectFormula();
        return rststr;
    }

    public getInputtedForumla(): string {
        let rststr = super.getInputtedForumla();
        return rststr;
    }

    public storeToString(): string {
        let rstr = super.storeToString();
        rstr = rstr + this._info;
        return rstr;
    }

    public static restoreFromString(s: string): Cal24QuizItem {
        let cqi: Cal24QuizItem = new Cal24QuizItem();
        // todo!!!

        return cqi;
    }
}
