import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../services';

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
    private _zone: NgZone) {
    //this.UserID = this._authService.authSubject.
  }

  ngOnInit() {
    this._authService.authContent.subscribe(x => {
      this._zone.run(() => {
        if (x.isAuthorized)         {
          this.UserID = x.getUserId();
          this.Mailbox = x.getUserMailbox();
        }
      });
    }, error => {
      // if (environment.LoggingLevel >= LogLevel.Error) {
      //   console.error("AC Math Exercise: Log [Error]: Failed in subscribe to User", error);
      // }
    }, () => {
      // Completed
    });
  }
}
