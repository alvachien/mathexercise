import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http';
import { MatDialog, MatPaginator } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { UserAward, QuizTypeEnum, QuizTypeEnum2UIString, LogLevel, DateFormat, UIMode, UserDetailInfo } from '../model';
import { AwardBalanceService, QuizAttendUser, UserDetailService, DialogService, AuthService } from '../services';
import { MessageDialogButtonEnum, MessageDialogInfo, MessageDialogComponent } from '../message-dialog';

/**
 * Award plan data source
 */
export class AwardBalanceDataSource extends DataSource<any> {
  constructor(private _abService: AwardBalanceService,
    private _paginator: MatPaginator) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<UserAward[]> {
    const displayDataChanges = [
      this._abService.dataChangedSubject,
      this._paginator.page,
    ];

    //
    // Old style: handle it via SwitchMap!!!
    //
    // return this._abService.dataChangedSubject.switchMap((v: boolean) => {
    //   if (this._selUser !== null && this._selUser !== undefined && this._selUser.length > 0) {
    //     return this._abService.fetchAwardsForUser(this._selUser);
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
  displayedColumns = ['ID', 'AwardDate', 'AwardPlanID', 'QuizID', 'Award', 'Publish', 'UsedReason'];
  dataSource: AwardBalanceDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  listUsers: QuizAttendUser[] = [];
  _curMode: UIMode = UIMode.ListView;
  curAward: UserAward | null;
  private _awardBalance = 0;

  get AwardBalance(): number {
    return this._awardBalance;
  }

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

  private _selUser: QuizAttendUser;
  // Selected user
  get SelectedUser(): QuizAttendUser {
    return this._selUser;
  }
  set SelectedUser(cu: QuizAttendUser) {
    if ((this._selUser === null || this._selUser === undefined)
      && (cu !== null && cu !== undefined)) {
      this._selUser = cu;
    } else if ((this._selUser !== null || this._selUser !== undefined)
      && (cu === null && cu === undefined)) {
      this._selUser = null;
    } else if ((this._selUser !== null || this._selUser !== undefined)
      && (cu !== null && cu !== undefined)
      && this._selUser.attenduser !== cu.attenduser) {
      this._selUser = cu;
    }
  }

  // Current logon user - authority control!
  get CurrentUser(): UserDetailInfo {
    return this._userDetailService.UserDetailInfoInstance;
  }

  constructor(private _http: HttpClient,
    private _dialog: MatDialog,
    public _abService: AwardBalanceService,
    private _authService: AuthService,
    private _userDetailService: UserDetailService) {
      this._selUser = null;

      this._abService.dataChangedSubject.subscribe(() => {
        this.updateBalance();
      });
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
    this._abService.fetchAwardsForUser(this._selUser.attenduser);
  }

  public canDeactivate(): boolean {
    if (this._curMode === UIMode.Create || this._curMode === UIMode.Update) {
      return false;
    }

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

    if (!this.curAward.Award) {
      return false;
    }

    return true;
  }

  public onDetailAwardSubmit(): void {
    // Do the submit!
    if (this._curMode === UIMode.Create) {
      // Create mode!
      this._abService.createEvent.subscribe(x => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log('AC Math Exericse [Debug]: ' + x);
        }

        if (x instanceof UserAward) {
          // Show a dialog for success
          const dlginfo: MessageDialogInfo = {
            Header: 'Home.Success',
            Content: 'Home.AwardCreatedSuccessfully',
            Button: MessageDialogButtonEnum.onlyok
          };
          this._dialog.open(MessageDialogComponent, {
            disableClose: false,
            width: '500px',
            data: dlginfo
          }).afterClosed().subscribe(x => {
            // Do nothing!
            this._curMode = UIMode.ListView;
            this.curAward = null;
          });
        } else {
          // Also show a dialog for error
          const dlginfo: MessageDialogInfo = {
            Header: 'Home.Error',
            Content: x === null ? 'Home.Error' : x,
            Button: MessageDialogButtonEnum.onlyok
          };
          this._dialog.open(MessageDialogComponent, {
            disableClose: false,
            width: '500px',
            data: dlginfo
          }).afterClosed().subscribe(x2 => {
            // Do nothing!
            //this.setListView();
          });
        }
      });

      this.curAward.UserID = this.SelectedUser.attenduser;
      this._abService.createAward(this.curAward);
    } else if (this._curMode === UIMode.Update) {
      // Update mode!
      this._abService.changeEvent.subscribe(x => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log('AC Math Exericse [Debug]: ' + x);
        }

        if (x instanceof UserAward) {
          // Show a dialog for success
          const dlginfo: MessageDialogInfo = {
            Header: 'Home.Success',
            Content: 'Home.AwardChangedSuccessfully',
            Button: MessageDialogButtonEnum.onlyok
          };
          this._dialog.open(MessageDialogComponent, {
            disableClose: false,
            width: '500px',
            data: dlginfo
          }).afterClosed().subscribe(x => {
            // Do nothing!
            this._curMode = UIMode.ListView;
            this.curAward = null;
          });
        } else {
          // Also show a dialog for error
          const dlginfo: MessageDialogInfo = {
            Header: 'Home.Error',
            Content: x === null ? 'Home.Error' : x,
            Button: MessageDialogButtonEnum.onlyok
          };
          this._dialog.open(MessageDialogComponent, {
            disableClose: false,
            width: '500px',
            data: dlginfo
          }).afterClosed().subscribe(x2 => {
            // Do nothing!
            //this.setListView();
          });
        }
      });

      this._abService.updateAward(this.curAward);
    }
  }

  public onEditAward(data: UserAward) {
    this.curAward = data;
    this._curMode = UIMode.Update;
  }

  public onDeleteAward(data) {
    // Show a dialog for Confirm
    const dlginfo: MessageDialogInfo = {
      Header: 'Home.ConfirmOnDeletion',
      Content: 'Home.ConfirmOnDeletionDetail',
      Button: MessageDialogButtonEnum.yesno
    };
    this._dialog.open(MessageDialogComponent, {
      disableClose: false,
      width: '500px',
      data: dlginfo
    }).afterClosed().subscribe(x => {
      if (x) {
        this._abService.deleteEvent.subscribe(x => {
          this.curAward = null;
          this._curMode = UIMode.ListView;
        }, error => {
          const dlginfo2: MessageDialogInfo = {
            Header: 'Home.Error',
            Content: error ? error.toString() : 'Unknown reason',
            Button: MessageDialogButtonEnum.onlyok
          };
          this._dialog.open(MessageDialogComponent, {
            disableClose: false,
            width: '500px',
            data: dlginfo2
          });
        });

        this._abService.deleteAward(data.ID);
      }
    });
  }

  public onDetailAwardCancel(): void {
    this._curMode = UIMode.ListView;
    this.curAward = null;
  }

  private updateBalance() {
    this._awardBalance = 0;

    for (const ua of this._abService.Awards) {
      this._awardBalance += ua.Award;
    }
  }
}
