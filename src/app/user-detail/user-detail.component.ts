import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserDetailService } from '../services/userdetail.service';
import { environment } from '../../environments/environment';
import { LogLevel, UserDetailInfo } from '../model';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  UserID = '';
  Mailbox = '';
  DisplayAs = '';
  Others = '';
  awardPlanCreate = false;
  awardPlanUpdate = false;
  awardPlanDelete = false;
  awardCreate =  false;
  awardUpdate = false;
  awardDelete = false;
  instanceUserDetailInfo: UserDetailInfo = null;

  constructor(private _authService: AuthService,
    private _userDetailService: UserDetailService,
    private _zone: NgZone) {
  }

  ngOnInit() {
    if (this._userDetailService.IsUserDetailLoaded) {
      this.instanceUserDetailInfo = this._userDetailService.UserDetailInfoInstance.clone();

      this.UserID = this.instanceUserDetailInfo.UserId;
      this.DisplayAs = this.instanceUserDetailInfo.DisplayAs;
      this.Others = this.instanceUserDetailInfo.Others;

      this.awardPlanCreate = this.instanceUserDetailInfo.AwardPlanCreate;
      this.awardPlanUpdate = this.instanceUserDetailInfo.AwardPlanUpdate;
      this.awardPlanDelete = this.instanceUserDetailInfo.AwardPlanDelete;
      this.awardCreate = this.instanceUserDetailInfo.AwardCreate;
      this.awardUpdate = this.instanceUserDetailInfo.AwardUpdate;
      this.awardDelete = this.instanceUserDetailInfo.AwardDelete;
    } else {
      this._authService.authContent.subscribe(x => {
        this._zone.run(() => {
          if (x.isAuthorized) {
            this.UserID = x.getUserId();
            this.Mailbox = x.getUserName();
            this.DisplayAs = this.UserID;
          }
        });
      }, error => {
        if (environment.LoggingLevel >= LogLevel.Error) {
          console.error('AC Math Exercise [Error]: Failed in subscribe to User', error);
        }
      }, () => {
        // Completed
      });
    }
  }

  public CanSave(): boolean {
    if (this.UserID === null || this.UserID === undefined || this.UserID.length <= 0) {
      return false;
    }

    if (this.DisplayAs === null || this.DisplayAs === undefined || this.DisplayAs.length <= 0) {
      return false;
    }

    return true;
  }

  public onSave(): void {
    // Prepare for the save
    if (this.instanceUserDetailInfo === null) {
      this.instanceUserDetailInfo = new UserDetailInfo();
    }

    this.instanceUserDetailInfo.UserId = this.UserID;
    this.instanceUserDetailInfo.DisplayAs = this.DisplayAs;
    this.instanceUserDetailInfo.Others = this.Others;
    this.instanceUserDetailInfo.AwardCreate = this.awardCreate;
    this.instanceUserDetailInfo.AwardDelete = this.awardDelete;
    this.instanceUserDetailInfo.AwardUpdate = this.awardUpdate;
    this.instanceUserDetailInfo.AwardPlanCreate = this.awardPlanCreate;
    this.instanceUserDetailInfo.AwardPlanDelete = this.awardPlanDelete;
    this.instanceUserDetailInfo.AwardPlanUpdate = this.awardPlanUpdate;

    this._userDetailService.saveUserDetail(this.instanceUserDetailInfo);
  }
}
