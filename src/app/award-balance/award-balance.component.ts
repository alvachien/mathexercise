import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { MdDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { UserAward, QuizTypeEnum, QuizTypeEnum2UIString, LogLevel } from '../model';
import { AwardBalanceService, QuizAttendUser, UserDetailService, DialogService, AuthService } from '../services';
import { MessageDialogButtonEnum, MessageDialogInfo, MessageDialogComponent } from '../message-dialog';

/**
 * Award plan data source
 */
export class AwardBalanceDataSource extends DataSource<any> {
  constructor() {
    super();
  }

  private _abService: AwardBalanceService = null;
  set AwardBalanceService(ab: AwardBalanceService) {
    this._abService = ab;
  }

  private _curuser: string;
  get CurrentUser(): string {
    return this._curuser;
  }
  set CurrentUser(cu: string) {
    this._curuser = cu;
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<UserAward[]> {
    return this._abService.dataChangedSubject.switchMap((v: boolean) => {
      if (this._curuser !== null && this._curuser !== undefined && this._curuser.length > 0) {
        return this._abService.fetchAwardsForUser(this._curuser);
      } else {
        return Observable.of([]);
      }
    });
  }

  disconnect() { }
}


@Component({
  selector: 'app-award-balance',
  templateUrl: './award-balance.component.html',
  styleUrls: ['./award-balance.component.scss']
})
export class AwardBalanceComponent implements OnInit {
  displayedColumns = ['ID', 'AwardDate', 'AwardPlanID', 'QuizID', 'Award', 'UsedReason'];
  dataSource: AwardBalanceDataSource = null;
  listUsers: QuizAttendUser[] = [];

  private _curUser: QuizAttendUser;
  get CurrentUser(): QuizAttendUser {
    return this._curUser;
  }
  set CurrentUser(cu: QuizAttendUser) {
    if ((this._curUser === null || this._curUser === undefined)
      && (cu !== null && cu !== undefined)) {
      this._curUser = cu;
      this.dataSource.CurrentUser = this._curUser.attenduser;
    } else if ((this._curUser !== null || this._curUser !== undefined)
      && (cu === null && cu === undefined)) {
      this._curUser = null;
      this.dataSource.CurrentUser = null;
    } else if ((this._curUser !== null || this._curUser !== undefined)
      && (cu !== null && cu !== undefined)
      && this._curUser.attenduser !== cu.attenduser) {
      this._curUser = cu;
      this.dataSource.CurrentUser = this._curUser.attenduser;
    }
  }

  constructor(private _http: Http,
    private _dialog: MdDialog,
    private _abService: AwardBalanceService,
    private _authService: AuthService,
    private _userDetailService: UserDetailService) {
    this.dataSource = new AwardBalanceDataSource();
    this.dataSource.AwardBalanceService = this._abService;

    // Attended user
    this._userDetailService.fetchAllUsers().subscribe((listUsrs) => {
      if (listUsrs !== null && listUsrs !== undefined || listUsrs.length > 0) {
        this.listUsers = listUsrs;
      }
    });
  }

  ngOnInit() {
  }
  public onUserChanged(event) {
    // User selection changed
    // Refetch the whole plan list!
    this._abService.triggerDataChange();
  }

  public canDeactivate(): boolean {
    return true;
  }

  public onCreateNewExpense(): void {

  }

  public onEditAward(data) {

  }

  public onDeleteAward(data) {
    
  }
}
