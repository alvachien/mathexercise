import { QuizSplitter } from './quizconstants';
import { PrimarySchoolFormulaEnum, getFormulaUIString } from './formuladef';
import { PrimarySchoolMathQuizItem } from './quizconcept';

/**
 * 
 * @param fe Formula
 */
export function isFormulaTypeEnabled(fe: PrimarySchoolFormulaEnum): boolean {
    switch(fe) {
        case PrimarySchoolFormulaEnum.CircumferenceOfCircle:
        case PrimarySchoolFormulaEnum.CircumferenceOfRectangle:
        case PrimarySchoolFormulaEnum.CircumferenceOfSquare:
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
    get FormulaType(): PrimarySchoolFormulaEnum{
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
        let idx = s.indexOf(QuizSplitter);
        let ntype: PrimarySchoolFormulaEnum = <PrimarySchoolFormulaEnum>parseInt(s.substring(0, idx - 1));
        switch(ntype) {
            case PrimarySchoolFormulaEnum.CircumferenceOfCircle:
            return FormulaCOfCircleQuizItem.restoreFromString(s.substring(idx + 1));
            
            case PrimarySchoolFormulaEnum.CircumferenceOfSquare:
            return FormulaCOfSquareQuizItem.restoreFromString(s.substring(idx + 1));

            case PrimarySchoolFormulaEnum.CircumferenceOfRectangle:
            return FormulaCOfRectangleQuizItem.restoreFromString(s.substring(idx + 1));

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
    get Circle(): number {
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
        let brst = super.IsCorrect();
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
        } else if(this._direct === FormulaCOfCircleCalcDirEum.Circum) {
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
        let frmstr: string = getFormulaUIString(this.FormulaType);

        return frmstr.replace('C', this._circum.toFixed(2)).replace('R', this._raidus.toFixed(2));
    }

    public getInputtedForumla(): string {
        let frmstr: string = getFormulaUIString(this.FormulaType);
        
        if (this._direct === FormulaCOfCircleCalcDirEum.Radius) {
            return frmstr.replace('C', this.InputtedResult.toFixed(2)).replace('R', this._raidus.toFixed(2));
        } else {
            return frmstr.replace('C', this._circum.toFixed(2)).replace('R', this.InputtedResult.toFixed(2));
        }
    }

    public storeToString(): string {
        let rstr = super.storeToString();

        if (this._direct === FormulaCOfCircleCalcDirEum.Radius) {
            rstr += QuizSplitter + "0" + QuizSplitter + this._raidus.toString();
        } else {
            rstr += QuizSplitter + "1" + QuizSplitter + this._circum.toString();            
        }

        return rstr;
    }

    public static restoreFromString(s: string): FormulaCOfCircleQuizItem | null {
        try {
            let idx = s.indexOf(QuizSplitter);
            
            let nbol: number = parseInt(s.substring(0, idx - 1));
            let nnum: number = parseFloat(s.substring(idx + 1));
            return new FormulaCOfCircleQuizItem(nnum, <FormulaCOfCircleCalcDirEum>nbol);
        }
        catch(exp) {
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
    get Circle(): number {
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
        let brst = super.IsCorrect();
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
        } else if(this._direct === FormulaCOfSquareCalcDirEum.Circum) {
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
        let frmstr: string = getFormulaUIString(this.FormulaType);
        
        return frmstr.replace('C', this._circum.toFixed(2)).replace('a', this._edge.toFixed(2));
    }

    public getInputtedForumla(): string {
        let frmstr: string = getFormulaUIString(this.FormulaType);
        
        if (this._direct === FormulaCOfSquareCalcDirEum.Edge) {
            return frmstr.replace('C', this.InputtedResult.toFixed(2)).replace('a', this._edge.toFixed(2));
        } else if(this._direct === FormulaCOfSquareCalcDirEum.Circum) {
            return frmstr.replace('C', this._circum.toFixed(2)).replace('a', this.InputtedResult.toFixed(2));
        }
    }

    public storeToString(): string {
        let rstr = super.storeToString();
        
        if (this._direct === FormulaCOfSquareCalcDirEum.Edge) {
            rstr += QuizSplitter + "0" + QuizSplitter + this._edge.toString();
        } else if(this._direct === FormulaCOfSquareCalcDirEum.Circum) {
            rstr += QuizSplitter + "1" + QuizSplitter + this._circum.toString();            
        }

        return rstr;
    }

    public static restoreFromString(s: string): FormulaCOfSquareQuizItem | null {
        try {
            let idx = s.indexOf(QuizSplitter);
            
            let nbol: number = parseInt(s.substring(0, idx - 1));
            let nnum: number = parseFloat(s.substring(idx + 1));

            return new FormulaCOfSquareQuizItem(nnum, <FormulaCOfSquareCalcDirEum>nbol);
        }
        catch(exp) {
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
    get Circle(): number {
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
        console.log("AC Math Exercise [Debug]: constructor of FormulaCOfRectangleQuizItem: " + num1.toString() + ", " + num2.toString() + ", " + dir.toString())

        if (dir === FormulaCOfRectangleCalcDirEum.LongEdgeAndShortEdge) {
            this._direct = dir;
            this._longedge = num1;
            this._shortedge = num2;
            this._circum = parseFloat((2 * (this._longedge + this._shortedge)).toFixed(2));
        } else if(dir === FormulaCOfRectangleCalcDirEum.LongEdgeAndCircum) {
            this._direct = dir;
            this._longedge = num1;            
            this._circum = num2;
            this._shortedge = parseFloat(( (this._circum - 2 * this._longedge ) / 2 ).toFixed(2));
        } else if(dir === FormulaCOfRectangleCalcDirEum.ShortEdgeAndCircum) {
            this._direct = dir;
            this._shortedge = num1;
            this._circum = num2;
            this._longedge = parseFloat(( (this._circum - 2 * this._shortedge ) / 2 ).toFixed(2));
        } else {
            throw new Error("Unsupported direction!");
        }
    }

    public IsCorrect(): boolean {
        let brst = super.IsCorrect();
        if (!brst) {
            return false;
        }

        if (this._direct === FormulaCOfRectangleCalcDirEum.LongEdgeAndShortEdge) {
            if (this._circum.toFixed(2) === this.InputtedResult.toFixed(2)) {
                return true;
            }
        } else if(this._direct === FormulaCOfRectangleCalcDirEum.LongEdgeAndCircum) {
            if (this._shortedge.toFixed(2) === this.InputtedResult.toFixed(2)) {
                return true;
            }
        } else if(this._direct === FormulaCOfRectangleCalcDirEum.ShortEdgeAndCircum) {
            if (this._longedge.toFixed(2) === this.InputtedResult.toFixed(2)) {
                return true;
            }
        }

        return false;
    }
    
    public getQuizFormat(): string {
        if (this._direct === FormulaCOfRectangleCalcDirEum.LongEdgeAndShortEdge) {
            return `Home.CircumferenceOfRectangleQuizForCFormat`;
        } else if(this._direct === FormulaCOfRectangleCalcDirEum.LongEdgeAndCircum) {
            return `Home.CircumferenceOfRectangleQuizForEFormat`;
        } else if(this._direct === FormulaCOfRectangleCalcDirEum.ShortEdgeAndCircum) {
            return `Home.CircumferenceOfRectangleQuizForEFormat`;
        }
    }

    public getQuizFormatParam(): any {
        if (this._direct === FormulaCOfRectangleCalcDirEum.LongEdgeAndShortEdge) {
            return { 
                longedge: this._longedge,
                shortedge: this._shortedge
            };
        } else if(this._direct === FormulaCOfRectangleCalcDirEum.LongEdgeAndCircum) {
            return { 
                circum: this._circum,
                edge: this._longedge
            };
        } else if(this._direct === FormulaCOfRectangleCalcDirEum.ShortEdgeAndCircum) {
            return { 
                circum: this._circum,
                edge: this._shortedge
            };
        }
    }

    public getCorrectFormula(): string {
        let frmstr: string = getFormulaUIString(this.FormulaType);
        
        return frmstr.replace('C', this._circum.toFixed(2)).replace('a', this._longedge.toFixed(2)).replace('b', this._shortedge.toFixed(2));
    }

    public getInputtedForumla(): string {
        let frmstr: string = getFormulaUIString(this.FormulaType);
        
        if (this._direct === FormulaCOfRectangleCalcDirEum.LongEdgeAndShortEdge) {
            return frmstr.replace('C', this.InputtedResult.toFixed(2)).replace('a', this._longedge.toFixed(2)).replace('b', this._shortedge.toFixed(2));
        } else if(this._direct === FormulaCOfRectangleCalcDirEum.LongEdgeAndCircum) {
            return frmstr.replace('C', this._circum.toFixed(2)).replace('a', this._longedge.toFixed(2)).replace('b', this.InputtedResult.toFixed(2));
        } else if(this._direct === FormulaCOfRectangleCalcDirEum.ShortEdgeAndCircum) {
            return frmstr.replace('C', this._circum.toFixed(2)).replace('a', this.InputtedResult.toFixed(2)).replace('b', this._shortedge.toFixed(2));
        }
    }

    public storeToString(): string {
        let rstr = super.storeToString();
        
        if (this._direct === FormulaCOfRectangleCalcDirEum.LongEdgeAndShortEdge) {
            rstr += QuizSplitter + "0" + QuizSplitter + this._longedge.toString() + QuizSplitter + this._shortedge.toString();
        } else if(this._direct === FormulaCOfRectangleCalcDirEum.LongEdgeAndCircum) {
            rstr += QuizSplitter + "1" + QuizSplitter + this._longedge.toString() + QuizSplitter + this._circum.toString();
        } else if(this._direct === FormulaCOfRectangleCalcDirEum.ShortEdgeAndCircum) {
            rstr += QuizSplitter + "2" + QuizSplitter + this._shortedge.toString() + QuizSplitter + this._circum.toString();
        }

        return rstr;
    }

    public static restoreFromString(s: string): FormulaCOfRectangleQuizItem | null {
        try {
            let idx = s.indexOf(QuizSplitter);
            let idx2 = s.indexOf(QuizSplitter, idx + 1);
            
            let ndir: number = <FormulaCOfRectangleCalcDirEum>parseInt(s.substring(0, idx - 1));
            let nnum1: number = parseFloat(s.substring(idx + 1, idx2 - 1));
            let nnum2: number = parseFloat(s.substring(idx2 + 1));
            return new FormulaCOfRectangleQuizItem(nnum1, nnum2, ndir);
        }
        catch(exp) {
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
 * C = 2(a+b)
 */
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


