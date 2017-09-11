import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http';
import { MdDialog, MdPaginator } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { UserAward, QuizTypeEnum, QuizTypeEnum2UIString, LogLevel, DateFormat, UIMode } from '../model';
import { AwardBalanceService, QuizAttendUser, UserDetailService, DialogService, AuthService } from '../services';
import { MessageDialogButtonEnum, MessageDialogInfo, MessageDialogComponent } from '../message-dialog';

/**
 * Award plan data source
 */
export class AwardBalanceDataSource extends DataSource<any> {
  constructor(private _abService: AwardBalanceService,
    private _paginator: MdPaginator) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<UserAward[]> {
    const displayDataChanges = [
      this._abService.dataChangedSubject,
      this._paginator.page,
    ];

    // return this._abService.dataChangedSubject.switchMap((v: boolean) => {
    //   if (this._curuser !== null && this._curuser !== undefined && this._curuser.length > 0) {
    //     return this._abService.fetchAwardsForUser(this._curuser);
    //   } else {
    //     return Observable.of([]);
    //   }
    // });

    return Observable.merge(...displayDataChanges).map(() => {
      const data = this._abService.Awards.slice();

      // Grab the page's slice of data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return data.splice(startIndex, this._paginator.pageSize);
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
  dataSource: AwardBalanceDataSource | null;
  @ViewChild(MdPaginator) paginator: MdPaginator;
  listUsers: QuizAttendUser[] = [];
  _curMode: UIMode = UIMode.ListView;
  curAward: UserAward;

  get IsListView(): boolean {
    return this._curMode === UIMode.ListView;
  }
  get IsCreateView(): boolean {
    return this._curMode === UIMode.Create;
  }
  get IsUpdateView(): boolean {
    return this._curMode === UIMode.Update;
  }
  get IsDisplayView(): boolean {
    return this._curMode === UIMode.Display;
  }
  get IsViewChangable(): boolean {
    return this._curMode === UIMode.Create
      || this._curMode === UIMode.Update;
  }

  private _curUser: QuizAttendUser;
  get CurrentUser(): QuizAttendUser {
    return this._curUser;
  }
  set CurrentUser(cu: QuizAttendUser) {
    if ((this._curUser === null || this._curUser === undefined)
      && (cu !== null && cu !== undefined)) {
      this._curUser = cu;
    } else if ((this._curUser !== null || this._curUser !== undefined)
      && (cu === null && cu === undefined)) {
      this._curUser = null;
    } else if ((this._curUser !== null || this._curUser !== undefined)
      && (cu !== null && cu !== undefined)
      && this._curUser.attenduser !== cu.attenduser) {
      this._curUser = cu;
    }
  }

  constructor(private _http: HttpClient,
    private _dialog: MdDialog,
    public _abService: AwardBalanceService,
    private _authService: AuthService,
    private _userDetailService: UserDetailService) {
  }

  ngOnInit() {
    this.dataSource = new AwardBalanceDataSource(this._abService, this.paginator);
    
    // Attended user
    this._userDetailService.fetchAllUsers().subscribe((listUsrs) => {
      if (listUsrs !== null && listUsrs !== undefined || listUsrs.length > 0) {
        this.listUsers = listUsrs;
      }
    });
  }

  public onUserChanged(event) {
    // User selection changed
    // Refetch the whole plan list!
    this._abService.fetchAwardsForUser(this._curUser.attenduser);
  }

  public canDeactivate(): boolean {
    return true;
  }

  public onCreateNewExpense(): void {
    this.curAward = new UserAward();
    this._curMode = UIMode.Create;
  }

  public CanDetailAwardSubmit(): boolean {
    if (!this.IsViewChangable) {
      return false;
    }

    return true;
  }

  public onDetailAwardSubmit(): void {
    // Do the submit!
  }

  public onEditAward(data) {
    this.curAward = data.clone();
    this._curMode = UIMode.Display;
  }

  public onDeleteAward(data) {

  }

  public onDetailAwardCancel(): void {

  }
}
