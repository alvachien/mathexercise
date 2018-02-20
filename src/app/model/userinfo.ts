import { User } from 'oidc-client';

export const AuthorityControl_Create = 'C';
export const AuthorityControl_Update = 'U';
export const AuthorityControl_Delete = 'D';


/**
 * UserDetailInfoJson: Format to communicate with API
 */
export interface UserDetailInfoJson {
  userID: string;
  displayAs: string;
  others: string;
  awardControl: string;
  awardPlanControl: string;
}

/**
 * User detail
 */
export class UserDetailInfo {
  private _awardControl: string;
  private _awardPlanControl: string;
  public UserId: string;
  public DisplayAs: string;
  public Others: string;

  constructor() {
    this.UserId = '';
    this.DisplayAs = '';
    this.Others = '';
    this._awardControl = '';
    this._awardPlanControl = '';
  }

  get AwardCreate(): boolean {
    return this._awardControl.includes(AuthorityControl_Create);
  }
  set AwardCreate(ac: boolean) {
    if (ac) {
      if (!this._awardControl.includes(AuthorityControl_Create)) {
        this._awardControl += AuthorityControl_Create;
      }
    } else {
      if (this._awardControl.includes(AuthorityControl_Create)) {
        this._awardControl = this._awardControl.replace(AuthorityControl_Create, '');
      }
    }
  }
  get AwardUpdate(): boolean {
    return this._awardControl.includes(AuthorityControl_Update);
  }
  set AwardUpdate(ac: boolean) {
    if (ac) {
      if (!this._awardControl.includes(AuthorityControl_Update)) {
        this._awardControl += AuthorityControl_Update;
      }
    } else {
      if (this._awardControl.includes(AuthorityControl_Update)) {
        this._awardControl = this._awardControl.replace(AuthorityControl_Update, '');
      }
    }
  }
  get AwardDelete(): boolean {
    return this._awardControl.includes(AuthorityControl_Delete);
  }
  set AwardDelete(ac: boolean) {
    if (ac) {
      if (!this._awardControl.includes(AuthorityControl_Delete)) {
        this._awardControl += AuthorityControl_Delete;
      }
    } else {
      if (this._awardControl.includes(AuthorityControl_Delete)) {
        this._awardControl = this._awardControl.replace(AuthorityControl_Delete, '');
      }
    }
  }

  get AwardPlanCreate(): boolean {
    return this._awardPlanControl.includes(AuthorityControl_Create);
  }
  set AwardPlanCreate(ac: boolean) {
    if (ac) {
      if (!this._awardPlanControl.includes(AuthorityControl_Create)) {
        this._awardPlanControl += AuthorityControl_Create;
      }
    } else {
      if (this._awardPlanControl.includes(AuthorityControl_Create)) {
        this._awardPlanControl = this._awardPlanControl.replace(AuthorityControl_Create, '');
      }
    }
  }
  get AwardPlanUpdate(): boolean {
    return this._awardPlanControl.includes(AuthorityControl_Update);
  }
  set AwardPlanUpdate(ac: boolean) {
    if (ac) {
      if (!this._awardPlanControl.includes(AuthorityControl_Update)) {
        this._awardPlanControl += AuthorityControl_Update;
      }
    } else {
      if (this._awardPlanControl.includes(AuthorityControl_Update)) {
        this._awardPlanControl = this._awardPlanControl.replace(AuthorityControl_Update, '');
      }
    }
  }
  get AwardPlanDelete(): boolean {
    return this._awardPlanControl.includes(AuthorityControl_Delete);
  }
  set AwardPlanDelete(ac: boolean) {
    if (ac) {
      if (!this._awardPlanControl.includes(AuthorityControl_Delete)) {
        this._awardPlanControl += AuthorityControl_Delete;
      }
    } else {
      if (this._awardPlanControl.includes(AuthorityControl_Delete)) {
        this._awardPlanControl = this._awardPlanControl.replace(AuthorityControl_Delete, '');
      }
    }
  }

  public clone(): UserDetailInfo {
    const udi = new UserDetailInfo();
    udi.UserId = this.UserId;
    udi.DisplayAs = this.DisplayAs;
    udi.Others = this.Others;
    udi._awardControl = this._awardControl;
    udi._awardPlanControl = this._awardPlanControl;
    return udi;
  }

  public onSetData(data: UserDetailInfoJson) {
    this.UserId = data.userID;
    this.DisplayAs = data.displayAs;
    this.Others = data.others;
    this._awardControl = data.awardControl;
    this._awardPlanControl = data.awardPlanControl;
  }

  public generateJSON(): UserDetailInfoJson {
    return {
      userID: this.UserId,
      displayAs: this.DisplayAs,
      others: this.Others,
      awardControl: this._awardControl,
      awardPlanControl: this._awardPlanControl
    };
  }
}

/**
 * Auth info of the user
 */
export class UserAuthInfo {
  public isAuthorized: boolean;
  private currentUser: User;
  private userName: string;
  private userId: string;
  private userMailbox: string;
  private accessToken: string;

  public setContent(user: User): void {
    if (user) {
      this.currentUser = user;
      this.isAuthorized = true;

      this.userName = user.profile.name;
      this.userId = user.profile.sub;
      this.userMailbox = user.profile.mail;
      this.accessToken = user.access_token;
    } else {
      this.cleanContent();
    }
  }

  public cleanContent(): void {
    this.currentUser = null;
    this.isAuthorized = false;
  }

  public getUserName(): string {
    return this.userName;
  }
  public getUserId(): string {
    return this.userId;
  }
  public getAccessToken(): string {
    return this.accessToken;
  }
  public getUserMailbox(): string {
    return this.userMailbox;
  }
}
