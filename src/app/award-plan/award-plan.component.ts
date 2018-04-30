import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http';
import { MatDialog, MatPaginator, MatTableDataSource, MatSort, MatSelect } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, merge, of as observableOf } from 'rxjs';
import { map, startWith, switchMap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AwardPlan, QuizTypeEnum, QuizTypeEnum2UIString, LogLevel, DateFormat, UserDetailInfo, UIMode } from '../model';
import { AwardPlanService, QuizAttendUser, UserDetailService, DialogService, AuthService } from '../services';
import { MessageDialogButtonEnum, MessageDialogInfo, MessageDialogComponent } from '../message-dialog';

export interface QuizTypeUI {
  value: QuizTypeEnum;
  displayas: string;
}

@Component({
  selector: 'app-award-plan',
  templateUrl: './award-plan.component.html',
  styleUrls: ['./award-plan.component.scss']
})
export class AwardPlanComponent implements OnInit, AfterViewInit {
  private uiMode: UIMode = UIMode.ListView;
  private _selUser: QuizAttendUser;
  private _allowInvalid = false;
  private _curPlan: AwardPlan;

  displayedColumns = ['ID', 'ValidFrom', 'ValidTo', 'QuizType', 'AwardCondition', 'Award'];
  pageHeader: string;
  dataSource = new MatTableDataSource<AwardPlan>();
  isLoadingResults: boolean;
  listUsers: QuizAttendUser[] = [];
  listQTypes: QuizTypeUI[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('ctrlSel') ctrlSelect: MatSelect;

  get IsListView(): boolean {
    return this.uiMode === UIMode.ListView; ;
  }
  get IsViewChangable(): boolean {
    return this.uiMode === UIMode.Create
      || this.uiMode === UIMode.Update;
  }

  get SelectedUser(): QuizAttendUser {
    return this._selUser;
  }

  set SelectedUser(cu: QuizAttendUser) {
    if (this._selUser === undefined && (cu !== undefined)) {
      this._selUser = cu;
    } else if (this._selUser !== undefined && cu === undefined) {
      this._selUser = undefined;
    } else if (this._selUser !== undefined
      && cu !== undefined
      && this._selUser.attenduser !== cu.attenduser) {
      this._selUser = cu;
    }
  }
  get allowInvalid(): boolean {
    return this._allowInvalid;
  }
  set allowInvalid(ai: boolean) {
    if (this._allowInvalid !== ai) {
      this._allowInvalid = ai;

      this.onRefreshPlan();
      // this.onUserChanged(null);
    }
  }

  // Current logon user - authority control!
  get CurrentUser(): UserDetailInfo {
    return this._userDetailService.UserDetailInfoInstance;
  }

  get CurrentPlan(): AwardPlan {
    return this._curPlan;
  }

  constructor(private _http: HttpClient,
    private _dialog: MatDialog,
    private _router: Router,
    public _apService: AwardPlanService,
    private _authService: AuthService,
    private _userDetailService: UserDetailService) {

    this.isLoadingResults = false;
    this._selUser = undefined;
    for (const qt in QuizTypeEnum) {
      if (!Number.isNaN(+qt)) {
        const qtu: QuizTypeUI = {
          value: +qt,
          displayas: QuizTypeEnum2UIString(+qt)
        };
        this.listQTypes.push(qtu);
      }
    }

    this.setListView();
  }

  ngOnInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // Attended user
    this._userDetailService.fetchAllUsers().subscribe((listUsrs) => {
      if (listUsrs !== undefined && listUsrs instanceof Array && listUsrs.length > 0) {
        this.listUsers = listUsrs;
      }

      merge(this.sort.sortChange, this.ctrlSelect.selectionChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this._apService.fetchPlansForUser(
            this.SelectedUser === undefined ? undefined : this.SelectedUser.attenduser,
            this._allowInvalid);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;

          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => this.dataSource.data = data);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  public onRefreshPlan() {
    // this.onUserChanged(null);
  }

  public onCreatePlan() {
    this._curPlan = new AwardPlan();
    this._curPlan.TargetUser = this.SelectedUser.attenduser;
    this._curPlan.CreatedBy = this._authService.authSubject.getValue().getUserId();

    this.uiMode = UIMode.Create;
    this.pageHeader = 'Home.CreateAwardPlan';
  }

  public onCreatePlanByCopy(row: AwardPlan) {
    this._curPlan = new AwardPlan();
    this._curPlan.TargetUser = row.TargetUser;
    this._curPlan.CreatedBy = this._authService.authSubject.getValue().getUserId();
    this._curPlan.Award = row.Award;
    this._curPlan.MaxQuizAvgTime = row.MaxQuizAvgTime;
    this._curPlan.MinQuizScore = row.MinQuizScore;
    this._curPlan.QuizType = row.QuizType;
    this._curPlan.ValidFrom = row.ValidFrom;
    this._curPlan.ValidTo = row.ValidTo;

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
    this.CurrentPlan.TargetUser = this.SelectedUser.attenduser;
    this._apService.createAwardPlan(this.CurrentPlan)
      .subscribe(data => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log('AC Math Exericse [Debug]: ' + data);
        }

        const cdata = this.dataSource.data.slice();
        cdata.push(data);
        this.dataSource.data = cdata;

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
        }).afterClosed().subscribe((x2: any) => {
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
          // this.setListView();
        });
      }, () => {
        // Do nothing
      });
  }

  private onChangePlanImpl(): void {
    this._apService.changeAwardPlan(this.CurrentPlan)
      .subscribe(x => {
        const nplan: AwardPlan = <AwardPlan>x;
        const cdata: AwardPlan[] = this.dataSource.data.slice();
        let nidx = -1;
        cdata.forEach((element: AwardPlan, index) => {
          if (element.ID === nplan.ID) {
            nidx = index;
          }
        });
        if (nidx !== -1) {
          cdata.splice(nidx, 1);
        }
        cdata.push(nplan);
        this.dataSource.data = cdata;

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
      }, error => {
        // Also show a dialog for error
        const dlginfo: MessageDialogInfo = {
          Header: 'Home.Error',
          Content: error === null ? 'Home.Error' : error,
          Button: MessageDialogButtonEnum.onlyok
        };
        this._dialog.open(MessageDialogComponent, {
          disableClose: false,
          width: '500px',
          data: dlginfo
        }).afterClosed().subscribe(x2 => {
          // Do nothing!
          // this.setListView();
        });
      }, () => {
        // Do nothing
      });
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
