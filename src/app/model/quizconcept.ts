
import { QuizSplitter } from './quizconstants';

/**
 * Quiz type
 */
export enum QuizTypeEnum {
    add     = 1,
    sub     = 2,
    multi   = 3,
    div     = 4,
    formula = 5
}

export function QuizTypeEnum2UIString(qt: QuizTypeEnum): string {
    let rst: string;
    switch(qt) {
        case QuizTypeEnum.add: rst = 'Home.AdditionExercises'; break;
        case QuizTypeEnum.sub: rst = 'Home.SubtractionExercises'; break;
        case QuizTypeEnum.multi: rst = 'Home.MultiplicationExercises'; break;
        case QuizTypeEnum.div: rst = 'Home.DivisionExercises'; break;
        case QuizTypeEnum.formula: rst = 'Home.FormulaExercises'; break;
        default: rst = ''; break;
    }
    return rst;
}

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
        return '#' + this.QuizIndex.toString() + QuizSplitter;
    }

    public storeToString(): string {
        return '';
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

    public storeToString(): string {
        let rstr = super.storeToString();
        rstr = rstr + this._leftNumber.toString() + QuizSplitter + this._rightNumber.toString() + QuizSplitter;
        return rstr;
    }

    public static restoreFromString(s: string): PrimarySchoolMathQuizItem {
        // Now parse it!
        let idx = s.indexOf(QuizSplitter);
        let idx2 = s.indexOf(QuizSplitter, idx + 1);

        let leftNumber = parseInt(s.substring(0, idx));
        let rightNumber = parseInt(s.substring(idx + 1, idx2));

        return new PrimarySchoolMathQuizItem(leftNumber, rightNumber);
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
        this._timeSpent = Math.round((stoppnt - this._startPoint) / 1000);
    }

    public getSummaryInfo(): string {
        let rst: string = 'BATCH#' + this.SectionNumber.toString() + ';';
        rst = rst + ' total items: ' + this.ItemsCount.toString() + '; '
            + (this.ItemsFailed > 0? ' Failed : ' + this.ItemsFailed.toString() : '');
        rst = rst += ' Time spent: ' + this.TimeSpent.toString() + ' s';
        return rst;
    }
}

/**
 * Math Quiz base info
 */
export interface PrimarySchoolQuizBaseInfo {
    getBaseInfo(): string;
}

/**
 * Math quiz for Primary School
 */
export class PrimarySchoolMathQuiz {    
    // Elder runs
    private _elderRun: PrimarySchoolMathQuizSection[] = [];
    public ElderRuns(): PrimarySchoolMathQuizSection[] {
        return this._elderRun;
    }

    // Current run/section
    private _curRun: PrimarySchoolMathQuizSection;
    public CurrentRun(): PrimarySchoolMathQuizSection {
        return this._curRun;
    }

    // Failed factor
    private _faileFactor: number;
    get FailedFactor(): number {
        return this._faileFactor;
    }
    set FailedFactor(ff: number) {
        this._faileFactor = ff;
    }

    // Is started
    private _isStarted: boolean;
    get IsStarted(): boolean {
        return this._isStarted;
    }

    // Quiz type
    private _qtype: QuizTypeEnum;
    get QuizType(): QuizTypeEnum {
        return this._qtype;
    }
    set QuizType(qt: QuizTypeEnum) {
        this._qtype = qt;
    }
    // Quiz base info
    private _qbaseinfo: string;
    get BasicInfo(): string {
        return this._qbaseinfo;
    }
    set BasicInfo(bi: string) {
        this._qbaseinfo = bi;
    }

    // Current run ID
    private _curRunID: number;
    // Failed items
    private _failedItems: PrimarySchoolMathQuizItem[] = [];
    get FailedItems(): PrimarySchoolMathQuizItem[] {
        return this._failedItems;
    }

    constructor() {
        this._curRunID = 1;
        this._faileFactor = 0;
        this._isStarted = false;
        this._curRun = null;
    }

    /**
     * Start the quiz
     * @param startnum: Initial number of the questions 
     * @param failfactor: Factor of the failure
     */
    public Start(startnum: number, failfactor: number) {
        if (this._isStarted || this._curRun !== null) {
            throw new Error('Quiz already started!');
        }

        this._faileFactor = failfactor;
        this._curRun = new PrimarySchoolMathQuizSection(this._curRunID, startnum);
        this._isStarted = true;
    }

    /**
     * Submit current run(section)
     *  If there are failed items and factor of failure is not zero, a new run(section ) will be started
     * @param failedItems The failed items
     */
    public SubmitCurrentRun(failedItems?: PrimarySchoolMathQuizItem[]) {
        if (failedItems !== undefined && failedItems.length > 0) {
            this._curRun.ItemsFailed = failedItems.length;
            for(let fi of failedItems) {
                this._failedItems.push(fi);
            }
        } else {
            this._curRun.ItemsFailed = 0;            
        }
        this._curRun.SectionComplete();
        this._elderRun.push(this._curRun);

        if (this._curRun.ItemsFailed > 0) {
            let ncnt = Math.round(this._curRun.ItemsFailed * this._faileFactor);

            if (ncnt > 0) {
                let curID = this._curRun.SectionNumber;
                this._curRun = new PrimarySchoolMathQuizSection(curID + 1, ncnt);            
            }
        } 
    }
}
