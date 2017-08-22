
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

export function getFormulaNameString(fe: PrimaySchoolFormulaEnum): string {
    let rst: string = '';
    switch (fe) {
        case PrimaySchoolFormulaEnum.AreaOfCircle: {
            rst = 'Math.AreaOfCircle';
        }
        break;

        case PrimaySchoolFormulaEnum.AreaOfParallelogram: {
            rst = 'Math.AreaOfParallelogram';
        }
        break;

        case PrimaySchoolFormulaEnum.AreaOfRectangle: {
            rst = 'Math.AreaOfRectangle';
        }
        break;

        case PrimaySchoolFormulaEnum.AreaOfSquare: {
            rst = 'Math.AreaOfSquare';
        }
        break;

        case PrimaySchoolFormulaEnum.AreaOfTrapezoid: {
            rst = 'Math.AreaOfTrapezoid';
        }
        break;

        case PrimaySchoolFormulaEnum.AreaOfTriangle: {
            rst = 'Math.AreaOfTriangle';
        }
        break;

        case PrimaySchoolFormulaEnum.CircumferenceOfCircle: {
            rst = 'Math.CircumferenceOfCircle';
        }
        break;

        case PrimaySchoolFormulaEnum.CircumferenceOfSquare: {
            rst = 'Math.CircumferenceOfSquare';
        }
        break;

        case PrimaySchoolFormulaEnum.CircumferenceOfRectangle: {
            rst = 'Math.CircumferenceOfRectangle';
        }
        break;

        case PrimaySchoolFormulaEnum.DistanceAndSpeed: {
            rst = 'Math.DistanceAndSpeed';
        }
        break;
        
        default:
        break;
    }

    return rst;
}

export function getFormulaUIString(fe: PrimaySchoolFormulaEnum): string {
    let rst: string = '';
    switch (fe) {
        case PrimaySchoolFormulaEnum.AreaOfCircle: {
            rst = 'S = πr<sup>2</sup>';
        }
        break;

        case PrimaySchoolFormulaEnum.AreaOfParallelogram: {
            rst = 'S = ah';
        }
        break;

        case PrimaySchoolFormulaEnum.AreaOfRectangle: {
            rst = 'S = ab';
        }
        break;

        case PrimaySchoolFormulaEnum.AreaOfSquare: {
            rst = 'S = a<sup>2</sup>';
        }
        break;

        case PrimaySchoolFormulaEnum.AreaOfTrapezoid: {
            rst = 'S = (a+b)h/2';
        }
        break;

        case PrimaySchoolFormulaEnum.AreaOfTriangle: {
            rst = 'S = (ah)/ 2';
        }
        break;

        case PrimaySchoolFormulaEnum.CircumferenceOfCircle: {
            rst = 'C = πD = 2πR';
        }
        break;

        case PrimaySchoolFormulaEnum.CircumferenceOfSquare: {
            rst = 'C = 4a';
        }
        break;

        case PrimaySchoolFormulaEnum.CircumferenceOfRectangle: {
            rst = 'C = 2(a+b)';
        }
        break;

        case PrimaySchoolFormulaEnum.DistanceAndSpeed: {
            rst = 'S = vh';
        }
        break;
        
        default:
        break;
    }

    return rst;
}

