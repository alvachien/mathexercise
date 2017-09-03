import { User } from 'oidc-client';

export class UserDetail {
    public UserId: string;
    public DisplayAs: string;
    public Email: string;
    public Others: string;

    public onSetData(data: any) {
        this.UserId = data.userID;
        this.DisplayAs = data.displayAs;
        this.Email = data.email;
        this.Others = data.others;
    }
}

export class UserHistory {
    public UserId: string;
    public SeqNo: number;
    public HistType: number;
    public TimePoint: Date;
    public Others: string;

    public onSetData(data: any) {

        this.UserId = data.userId;
        this.SeqNo = data.seqNo;
        this.HistType = data.histType;
        this.TimePoint = data.timePoint;
        this.Others = data.others;
    }
}

export class UserAuthInfo {
    public isAuthorized: boolean;
    private currentUser: User;
    private userName: string;
    private userId: string;
    private userMailbox: string;
    private accessToken: string;

    public setContent(user: User) : void {
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

    public cleanContent() : void {
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
