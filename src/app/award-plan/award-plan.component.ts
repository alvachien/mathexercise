import { Component, OnInit,ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http';
import { MdDialog, MdPaginator } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { AwardPlan, QuizTypeEnum, QuizTypeEnum2UIString, LogLevel, DateFormat, UserDetailInfo, UIMode } from '../model';
import { AwardPlanService, QuizAttendUser, UserDetailService, DialogService, AuthService } from '../services';
import { MessageDialogButtonEnum, MessageDialogInfo, MessageDialogComponent } from '../message-dialog';

/**
 * Award plan data source
 */
export class AwardPlanDataSource extends DataSource<any> {
  constructor(private _apService: AwardPlanService,
    private _paginator: MdPaginator) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<AwardPlan[]> {
    // return this._apService.listSubject.switchMap((v: boolean) => {
    //   if (this._selUser !== null && this._selUser !== undefined && this._selUser.length > 0) {
    //     return this._apService.fetchPlansForUser(this._selUser);
    //   } else {
    //     return Observable.of([]);
    //   }
    // });

    const displayDataChanges = [
      this._apService.listSubject,
      this._paginator.page,
    ];
    return Observable.merge(...displayDataChanges).map(() => {
      const data = this._apService.AwardPlans.slice();

      // Grab the page's slice of data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return data.splice(startIndex, this._paginator.pageSize);
    });
  }

  disconnect() { }
}

export interface QuizTypeUI {
  value: QuizTypeEnum;
  displayas: string;
}

@Component({
  selector: 'app-award-plan',
  templateUrl: './award-plan.component.html',
  styleUrls: ['./award-plan.component.scss']
})
export class AwardPlanComponent implements OnInit {
  displayedColumns = ['ID', 'ValidFrom', 'ValidTo', 'QuizType', 'AwardCondition', 'Award'];
  pageHeader: string;
  dataSource: AwardPlanDataSource = null;
  listUsers: QuizAttendUser[] = [];
  listQTypes: QuizTypeUI[] = [];
  @ViewChild(MdPaginator) paginator: MdPaginator;
  private uiMode: UIMode = UIMode.ListView;

  get IsListView(): boolean {
    return this.uiMode === UIMode.ListView;;
  }
  get IsViewChangable(): boolean {
    return this.uiMode === UIMode.Create
      || this.uiMode === UIMode.Update;
  }

  private _selUser: QuizAttendUser;
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

  private _curPlan: AwardPlan;
  get CurrentPlan(): AwardPlan {
    return this._curPlan;
  }

  constructor(private _http: HttpClient,
    private _dialog: MdDialog,
    public _apService: AwardPlanService,
    private _authService: AuthService,
    private _userDetailService: UserDetailService) {

    this._selUser = null;
    for (const qt in QuizTypeEnum) {
      if (!Number.isNaN(+qt)) {
        const qtu: QuizTypeUI = {
          value: +qt,
          displayas: QuizTypeEnum2UIString(+qt)
        };
        this.listQTypes.push(qtu);
      }
    }

    // Attended user
    this._userDetailService.fetchAllUsers().subscribe((listUsrs) => {
      if (listUsrs !== null && listUsrs !== undefined || listUsrs.length > 0) {
        this.listUsers = listUsrs;
      }
    });

    this.setListView();
  }

  ngOnInit() {
    this.dataSource = new AwardPlanDataSource(this._apService, this.paginator);
  }

  public onCreatePlan() {
    this._curPlan = new AwardPlan();
    this._curPlan.TargetUser = this.SelectedUser.attenduser;
    this._curPlan.CreatedBy = this._authService.authSubject.getValue().getUserId();

    this.uiMode = UIMode.Create;
    this.pageHeader = 'Home.CreateAwardPlan';
  }

  public onEditPlan(row) {
    // Todo
    try {
      this._curPlan = row;
      this.uiMode = UIMode.Update;
      this.pageHeader = 'Home.EditAwardPlan';
    } catch (exp) {
      console.error(exp);
    }
  }

  public onDeletePlan(row) {
    const dlginfo: MessageDialogInfo = {
      Header: 'Home.ConfirmOnDeletion',
      Content: 'Home.ConfirmOnDeletionDetail',
      Button: MessageDialogButtonEnum.okcancel
    };

    this._dialog.open(MessageDialogComponent, {
      disableClose: false,
      width: '500px',
      data: dlginfo
    }).afterClosed().subscribe(x => {
      // Do nothing!
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`AC Math Exericse [Debug]: Message Dialog Result ${x}`);
      }

      if (x) {
        this._apService.deleteAwardPlan(row);
      }
    });
  }

  public onUserChanged(event) {
    // Refetch the whole plan list!
    if (this._selUser === null) {
      this._apService.fetchPlansForUser();
    } else {
      this._apService.fetchPlansForUser(this._selUser.attenduser);
    }
  }

  public canDeactivate(): boolean {
    if (this.uiMode === UIMode.Create || this.uiMode === UIMode.Update) {
      const dlginfo: MessageDialogInfo = {
        Header: 'Home.Error',
        Content: 'Home.QuizIsOngoing',
        Button: MessageDialogButtonEnum.onlyok
      };
      this._dialog.open(MessageDialogComponent, {
        disableClose: false,
        width: '500px',
        data: dlginfo
      }).afterClosed().subscribe(x => {
        // Do nothing!
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log(`AC Math Exericse [Debug]: Message Dialog Result ${x}`);
        }
      });
      return false;
    }

    return true;
  }

  public CanDetailPlanSubmit(): boolean {
    if (this.uiMode === UIMode.ListView || this.uiMode === UIMode.Display) {
      return false;
    }

    if (this.CurrentPlan === null || this.CurrentPlan === undefined) {
      return false;
    }

    if (this.CurrentPlan.ValidTo < this.CurrentPlan.ValidFrom) {
      return false;
    }

    if (this.CurrentPlan.QuizType === null || this.CurrentPlan.QuizType === undefined) {
      return false;
    }

    if (this.CurrentPlan.Award === null || this.CurrentPlan.Award === undefined || this.CurrentPlan.Award <= 0) {
      return false;
    }

    return true;
  }

  public onDetailPlanSubmit(): void {
    if ((this.CurrentPlan.ID)) {
      // Update mode
      this.onChangePlanImpl();
    } else {
      // Create mode
      this.onCreatePlanImpl();
    }
  }

  private onCreatePlanImpl(): void {
    this._apService.createEvent.subscribe(x => {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log('AC Math Exericse [Debug]: ' + x);
      }

      // Show a dialog for success
      const dlginfo: MessageDialogInfo = {
        Header: 'Home.Success',
        Content: 'Home.AwardPlanCreatedSuccessfully',
        Button: MessageDialogButtonEnum.onlyok
      };
      this._dialog.open(MessageDialogComponent, {
        disableClose: false,
        width: '500px',
        data: dlginfo
      }).afterClosed().subscribe(x => {
        // Do nothing!
        this.setListView();
      });
    }, error => {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.log('AC Math Exericse [Debug]: ' + error);
      }
      // Also show a dialog for error
      const dlginfo: MessageDialogInfo = {
        Header: 'Home.Error',
        Content: error,
        Button: MessageDialogButtonEnum.onlyok
      };
      this._dialog.open(MessageDialogComponent, {
        disableClose: false,
        width: '500px',
        data: dlginfo
      }).afterClosed().subscribe(x => {
        // Do nothing!
        //this.setListView();
      });
    });

    this.CurrentPlan.TargetUser = this.SelectedUser.attenduser;
    this._apService.createAwardPlan(this.CurrentPlan);
  }

  private onChangePlanImpl(): void {
    this._apService.changeEvent.subscribe(x => {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log('AC Math Exericse [Debug]: ' + x);
      }

      if (x instanceof AwardPlan) {
        // Show a dialog for success
        const dlginfo: MessageDialogInfo = {
          Header: 'Home.Success',
          Content: 'Home.AwardPlanCreatedSuccessfully',
          Button: MessageDialogButtonEnum.onlyok
        };
        this._dialog.open(MessageDialogComponent, {
          disableClose: false,
          width: '500px',
          data: dlginfo
        }).afterClosed().subscribe(x2 => {
          // Do nothing!
          this.setListView();
        });
      } else {
        // Also show a dialog for error
        const dlginfo: MessageDialogInfo = {
          Header: 'Home.Error',
          Content: x === null? 'Home.Error' : x,
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

    this._apService.changeAwardPlan(this.CurrentPlan);
  }

  public onDetailPlanCancel(): void {
    this._curPlan = null;

    this.setListView();
  }

  private setListView() {
    this.pageHeader = 'Home.AwardPlan';
    this.uiMode = UIMode.ListView;
  }
}
