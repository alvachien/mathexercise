import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserDetailService } from '../services/userdetail.service';
import { environment } from '../../environments/environment';
import { LogLevel } from '../model';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  UserID: string = '';
  Mailbox: string = '';
  DisplayAs: string = '';

  constructor(private _authService: AuthService,
    private _userDetailService: UserDetailService,
    private _zone: NgZone) {
    //this.UserID = this._authService.authSubject.
  }

  ngOnInit() {
    this._authService.authContent.subscribe(x => {
      this._zone.run(() => {
        if (x.isAuthorized) {
          this.UserID = x.getUserId();
          this.Mailbox = x.getUserName();
          this._userDetailService.fetchUserDetail().subscribe(x => {
            if (x !== null) {
              this.DisplayAs = x;
            }
          });
        }
      });
    }, error => {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.error("AC Math Exercise: Log [Error]: Failed in subscribe to User", error);
      }
    }, () => {
      // Completed
    });
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
    this._userDetailService.saveUserDetail(this.DisplayAs);
  }
}
