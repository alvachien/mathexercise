
import { QuizTypeEnum, QuizTypeEnum2UIString } from './quizconcept';

export class AwardPlan {
    private _id: number;
    get ID(): number {
        return this._id;
    }
    set ID(id: number) {
        this._id = id;
    }

    private _tgtuser: string;
    get TargetUser(): string {
        return this._tgtuser;
    }
    set TargetUser(tusr: string) {
        this._tgtuser = tusr;
    }

    private _crtby: string;
    get CreatedBy(): string {
        return this._crtby;
    }
    set CreatedBy(ctby: string) {
        this._crtby = ctby;
    }

    private _validfrom: Date;
    get ValidFrom(): Date {
        return this._validfrom;
    }
    set ValidFrom(vf: Date) {
        this._validfrom = vf;
    }

    private _validto: Date;
    get ValidTo(): Date {
        return this._validto;
    }
    set ValidTo(vt: Date) {
        this._validto = vt;
    }

    private _qtype: QuizTypeEnum;
    get QuizType(): QuizTypeEnum {
        return this._qtype;
    }
    set QuizType(qt: QuizTypeEnum) {
        this._qtype = qt;
    }

    private _minScore: number;
    get MinQuizScore(): number {
        return this._minScore;
    }
    set MinQuizScore(scr: number) {
        this._minScore = scr;
    }

    private _minAvgTime: number;
    get MinQuizAvgTime(): number {
        return this._minAvgTime;
    }
    set MinQuizAvgTime(qat: number) {
        this._minAvgTime = qat;
    }

    private _award: number;
    get Award(): number {
        return this._award;
    }
    set Award(awd: number) {
        this._award = awd;
    }

    constructor() {
        this.ValidFrom = new Date();
        this.ValidTo = new Date(this.ValidFrom.getTime() + 30 * 24 * 60 * 60 * 1000) ;
        //this.ValidTo = new Date(this.ValidFrom.GetY)
    }

    public getAwardScoreCondition(): string {
        if (Number.isInteger(this._minScore)) {
            return 'Home.AwardPlanScoreConidiotn';
        }
        return '';
    }
    public getAwardScoreConditionParam(): any {
        return {
            score: this._minScore
        };
    }
    public getAwardAvgTimeCondition(): string {
        if (Number.isInteger(this._minAvgTime)) {
            return 'Home.AwardPlanScoreConidiotn';
        }
        return '';
    }
    public getAwardAvgTimeConditionParam(): any {
        return {
            avgtime: this._minAvgTime
        };
    }

    public getQuizTypeUIString(): string {
        return QuizTypeEnum2UIString(this._qtype);
    }

    public parseData(jdata: AwardPlanJson) {
        this._id = jdata.planID;
        this._tgtuser = jdata.targetUser;
        if (jdata.createdBy) {
            this._crtby = jdata.createdBy;
        }
        this._validfrom = jdata.validFrom;
        this._validto = jdata.validTo;
        this._qtype = +jdata.quizType;
        if (jdata.minQuizScore) {
            this._minScore = jdata.minQuizScore;
        }
        if (jdata.minQuizAvgTime) {
            this._minAvgTime = jdata.minQuizAvgTime;
        }
        this._award = jdata.award;
    }
    public prepareData(): AwardPlanJson {
        let rst: AwardPlanJson = {
            planID: this._id,
            targetUser: this._tgtuser,
            createdBy: this._crtby,
            validFrom: this._validfrom,
            validTo: this._validto,
            quizType: this._qtype,
            minQuizScore: this._minScore,
            minQuizAvgTime: this._minAvgTime,
            award: this._award
        };
        return rst;
    }
}

export interface AwardPlanJson {
    planID: number;
    targetUser: string;
    createdBy?: string;
    validFrom: Date;
    validTo: Date;
    quizType: number;
    minQuizScore?: number;
    minQuizAvgTime?: number;
    award: number;
}

export interface UserAwardJson {
    awardID: number;
    userID: string;
    awardDate: Date;
    award: number;
    awardPlanID?: number;
    quizID?: number;
    usedReason?: string;
}

export class UserAward {
    private _id: number;
    get ID(): number {
        return this._id;
    }
    set ID(id: number) {
        this._id = id;
    }

    private _userid: string;
    get UserID(): string {
        return this._userid;
    }
    set UserID(uid: string) {
        this._userid = uid;
    }

    private _awdDate: Date;
    get AwardDate(): Date {
        return this._awdDate;
    }
    set AwardDate(ad: Date) {
        this._awdDate = ad;
    }

    private _awd: number;
    get Award(): number {
        return this._awd;
    }
    set Award(wd: number) {
        this._awd = wd;
    }

    private _awdpid: number;
    get AwardPlanID(): number {
        return this._awdpid;
    }
    set AwardPlanID(api: number) {
        this._awdpid = api;
    }

    private _quizid: number;
    get QuizID(): number {
        return this._quizid;
    }
    set QuizID(qi: number) {
        this._quizid = qi;
    }

    private _usdrsn: string;
    get UsedReason(): string {
        return this._usdrsn;
    }
    set UsedReason(ur: string) {
        this._usdrsn = ur;
    }

    public parseData(jdata: UserAwardJson) {
        this._id = +jdata.awardID;
        this._userid = jdata.userID;
        this._awdDate = jdata.awardDate;
        this._awd = jdata.award;
        this._awdpid = jdata.awardPlanID;
        this._quizid = jdata.quizID;
        this._usdrsn = jdata.usedReason;
    }

    public prepareData(): UserAwardJson {
        let data: UserAwardJson = {
            awardID: this._id,
            userID: this._userid,
            awardDate: this._awdDate,
            award: this._awd,
            awardPlanID: this._awdpid,
            quizID: this._quizid,
            usedReason: this._usdrsn        
        };

        return data;
    }
}