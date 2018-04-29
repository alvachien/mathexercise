import * as moment from 'moment';
import { DateFormat } from './datedef';
import { QuizTypeEnum, QuizTypeEnum2UIString,
  QuizBasicControl, PrimarySchoolMathFAOControl, PrimarySchoolMathMixOpControl } from './quizconcept';

/**
 * Award plan JSON: Communicate with API
 */
export interface AwardPlanJson {
  planID: number;
  targetUser: string;
  createdBy?: string;
  validFrom: string;
  validTo: string;
  quizType: number;
  quizControl?: string;
  minQuizScore?: number;
  maxQuizAvgTime?: number;
  award: number;
}

/**
 * Award plan
 */
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

  private _validfrom: moment.Moment;
  get ValidFrom(): moment.Moment {
    return this._validfrom;
  }
  set ValidFrom(vf: moment.Moment) {
    this._validfrom = vf;
  }
  get ValidFromFormatString() {
    return this._validfrom.format(DateFormat);
  }

  private _validto: moment.Moment;
  get ValidTo(): moment.Moment {
    return this._validto;
  }
  set ValidTo(vt: moment.Moment) {
    this._validto = vt;
  }
  get ValidToFormatString() {
    return this._validto.format(DateFormat);
  }

  private _qtype: QuizTypeEnum;
  get QuizType(): QuizTypeEnum {
    return this._qtype;
  }
  set QuizType(qt: QuizTypeEnum) {
    this._qtype = qt;

    switch (this._qtype) {
      case QuizTypeEnum.add:
      case QuizTypeEnum.sub:
      case QuizTypeEnum.multi:
      case QuizTypeEnum.div: {
        if (this._control === undefined
        || !(this._control instanceof PrimarySchoolMathFAOControl)) {
          this._control = new PrimarySchoolMathFAOControl();
        }
      }
      break;

      case QuizTypeEnum.mixedop: {
        if (this._control === undefined
          || !(this._control instanceof PrimarySchoolMathMixOpControl)) {
          this._control = new PrimarySchoolMathMixOpControl();
        }
      }
      break;

      default: {
        this._control = undefined;
      }
      break;
    }
  }

  private _minScore: number;
  get MinQuizScore(): number {
    return this._minScore;
  }
  set MinQuizScore(scr: number) {
    this._minScore = scr;
  }

  private _maxAvgTime: number;
  get MaxQuizAvgTime(): number {
    return this._maxAvgTime;
  }
  set MaxQuizAvgTime(qat: number) {
    this._maxAvgTime = qat;
  }

  private _award: number;
  get Award(): number {
    return this._award;
  }
  set Award(awd: number) {
    this._award = awd;
  }

  private _control: QuizBasicControl;
  get QuizControl(): QuizBasicControl {
    return this._control;
  }
  set QuizControl(ctrl: QuizBasicControl) {
    this._control = ctrl;
  }

  constructor() {
    this.ValidFrom = moment();
    this.ValidTo = moment().add(30, 'd');
  }

  get getAwardScoreCondition(): string {
    if (Number.isInteger(this._minScore)) {
      return 'Home.AwardPlanScoreConidiotn';
    }
    return '';
  }
  get getAwardScoreConditionParam(): any {
    return {
      score: this._minScore
    };
  }
  get getAwardAvgTimeCondition(): string {
    if (Number.isInteger(this._maxAvgTime)) {
      return 'Home.AwardPlanAvgTimeCondition';
    }
    return '';
  }
  get getAwardAvgTimeConditionParam(): any {
    return {
      avgtime: this._maxAvgTime
    };
  }

  get QuizTypeUIString(): string {
    return QuizTypeEnum2UIString(this._qtype);
  }

  public parseData(jdata: AwardPlanJson) {
    this._id = jdata.planID;
    this._tgtuser = jdata.targetUser;
    if (jdata.createdBy) {
      this._crtby = jdata.createdBy;
    }
    this._validfrom = moment(jdata.validFrom, DateFormat);
    this._validto = moment(jdata.validTo, DateFormat);
    this._qtype = +jdata.quizType;
    if (jdata.quizControl) {
      switch (this._qtype) {
        case QuizTypeEnum.add:
        case QuizTypeEnum.sub:
        case QuizTypeEnum.multi:
        case QuizTypeEnum.div: {
          this._control = new PrimarySchoolMathFAOControl();
          this._control.restoreFromString(jdata.quizControl);
        }
        break;

        case QuizTypeEnum.mixedop: {
          this._control = new PrimarySchoolMathMixOpControl();
          this._control.restoreFromString(jdata.quizControl);
        }
        break;

        default:
        break;
      }
    }
    if (jdata.minQuizScore) {
      this._minScore = jdata.minQuizScore;
    }
    if (jdata.maxQuizAvgTime) {
      this._maxAvgTime = jdata.maxQuizAvgTime;
    }
    this._award = jdata.award;
  }

  public prepareData(): AwardPlanJson {
    const rst: AwardPlanJson = {
      planID: this._id,
      targetUser: this._tgtuser,
      createdBy: this._crtby,
      validFrom: this._validfrom.format(DateFormat),
      validTo: this._validto.format(DateFormat),
      quizType: this._qtype,
      quizControl: this._control === undefined ? undefined : this._control.storeToString(),
      minQuizScore: this._minScore,
      maxQuizAvgTime: this._maxAvgTime,
      award: this._award
    };

    return rst;
  }
}

/**
 * User Award JSON format
 */
export interface UserAwardJson {
  awardID: number;
  userID: string;
  awardDate: string;
  award: number;
  awardPlanID?: number;
  quizType?: number;
  quizID?: number;
  usedReason?: string;
  punish?: boolean;
}

/**
 * User Award
 */
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

  private _awdDate: moment.Moment;
  get AwardDate(): moment.Moment {
    return this._awdDate;
  }
  set AwardDate(ad: moment.Moment) {
    this._awdDate = ad;
  }
  get AwardDateFormatString(): string {
    return this._awdDate.format(DateFormat);
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

  private _quiztype: QuizTypeEnum;
  get QuizType(): QuizTypeEnum {
    return this._quiztype;
  }
  set QuizType(qt: QuizTypeEnum) {
    this._quiztype = qt;
  }
  get QuizTypeString(): string {
    return QuizTypeEnum2UIString(this._quiztype);
  }

  private _usdrsn: string;
  get UsedReason(): string {
    return this._usdrsn;
  }
  set UsedReason(ur: string) {
    this._usdrsn = ur;
  }

  private _punish: boolean;
  get Punish(): boolean {
    return this._punish;
  }
  set Punish(isp: boolean) {
    this._punish = isp;
  }

  constructor() {
    this._awdDate = moment();
  }

  public parseData(jdata: UserAwardJson) {
    this._id = +jdata.awardID;
    this._userid = jdata.userID;
    this._awdDate = moment(jdata.awardDate, DateFormat);
    this._awd = jdata.award;
    this._awdpid = jdata.awardPlanID;
    this._quizid = jdata.quizID;
    this._quiztype = +jdata.quizType;
    this._usdrsn = jdata.usedReason;
    this._punish = jdata.punish;
  }

  public prepareData(): UserAwardJson {
    const data: UserAwardJson = {
      awardID: this._id,
      userID: this._userid,
      awardDate: this._awdDate.format(DateFormat),
      award: this._awd,
      awardPlanID: this._awdpid,
      quizID: this._quizid,
      usedReason: this._usdrsn,
      punish: this._punish
    };

    return data;
  }
}
