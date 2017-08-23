
import { PrimaySchoolFormulaEnum } from './formuladef';
import { PrimarySchoolMathQuizItem } from './quizconcept';

// CircumferenceOfCircle   = 10,
export class FormulaCOfCircleQuizItem extends PrimarySchoolMathQuizItem {
    private _raidus: number;
    get Radius(): number {
        return this._raidus;
    }
    set Radius(r: number) {
        this._raidus = r;
    }

    public IsCorrect(): boolean {
        let brst = super.IsCorrect();
        if (!brst) {
            return false;
        }
        return true;
    }

    public getQuizFormat(): string {
        let rststr = super.getQuizFormat();
        return rststr;
    }

    public getCorrectFormula(): string {
        return '';
    }

    public getInputtedForumla(): string {
        return '';
    }

    public storeToString(): string {
        let rstr = super.storeToString();
        return rstr;
    }

    public static restoreFromString(s: string): PrimarySchoolMathQuizItem | null {
        return null;
    }
}

// CircumferenceOfSquare   = 11,
export class FormulaCOfSquareQuizItem extends PrimarySchoolMathQuizItem {
    private _edge: number;
    get Edge(): number {
        return this._edge;
    }
    set Edge(ed: number) {
        this._edge = ed;
    }

    public IsCorrect(): boolean {
        let brst = super.IsCorrect();
        if (!brst) {
            return false;
        }
        return true;
    }

    public getQuizFormat(): string {
        let rststr = super.getQuizFormat();
        return rststr;
    }

    public getCorrectFormula(): string {
        return '';
    }

    public getInputtedForumla(): string {
        return '';
    }

    public storeToString(): string {
        let rstr = super.storeToString();
        return rstr;
    }

    public static restoreFromString(s: string): PrimarySchoolMathQuizItem | null {
        return null;
    }

}

// CircumferenceOfRectangle = 12,
export class FormulaCOfRectangleQuizItem extends PrimarySchoolMathQuizItem {
    private _longedge: number;
    private _shortedge: number;
    get LongEdge(): number {
        return this._longedge;
    }
    get ShortEdge(): number {
        return this._shortedge;
    }
    set LongEdge(le: number) {
        this._longedge = le;
    }
    set ShortEdge(se: number) {
        this._shortedge = se;
    }

    public IsCorrect(): boolean {
        let brst = super.IsCorrect();
        if (!brst) {
            return false;
        }
        return true;
    }

    public getQuizFormat(): string {
        let rststr = super.getQuizFormat();
        return rststr;
    }

    public getCorrectFormula(): string {
        return '';
    }

    public getInputtedForumla(): string {
        return '';
    }

    public storeToString(): string {
        let rstr = super.storeToString();
        return rstr;
    }

    public static restoreFromString(s: string): PrimarySchoolMathQuizItem | null {
        return null;
    }
}

// DistanceAndSpeed    = 20
export class FormulaDistAndSpeedQuizItem extends PrimarySchoolMathQuizItem {
    private _distance: number;
    private _speed: number;
    get Distance(): number {
        return this._distance;
    }
    get Speed(): number {
        return this._speed;
    }
    set Distance(le: number) {
        this._distance = le;
    }
    set Speed(se: number) {
        this._speed = se;
    }

    public IsCorrect(): boolean {
        let brst = super.IsCorrect();
        if (!brst) {
            return false;
        }
        return true;
    }

    public getQuizFormat(): string {
        let rststr = super.getQuizFormat();
        return rststr;
    }

    public getCorrectFormula(): string {
        return '';
    }

    public getInputtedForumla(): string {
        return '';
    }

    public storeToString(): string {
        let rstr = super.storeToString();
        return rstr;
    }

    public static restoreFromString(s: string): PrimarySchoolMathQuizItem | null {
        return null;
    }
}


