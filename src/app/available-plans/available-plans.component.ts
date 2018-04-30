import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { AwardPlan, QuizTypeEnum, QuizTypeEnum2UIString, LogLevel, DateFormat, UserDetailInfo, UIMode } from '../model';
import { AwardPlanService, QuizAttendUser, UserDetailService, DialogService, AuthService } from '../services';
import { MessageDialogButtonEnum, MessageDialogInfo, MessageDialogComponent } from '../message-dialog';

@Component({
  selector: 'app-available-plans',
  templateUrl: './available-plans.component.html',
  styleUrls: ['./available-plans.component.scss']
})
export class AvailablePlansComponent implements OnInit, AfterViewInit {
  private _curuser: string;
  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<AwardPlan>();

  @Input()
  set CurrentUser(curUser: string) {
    if (this._curuser !== curUser) {
      this._curuser = curUser;

      this._planService.fetchPlansForUser(this._curuser, false);
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _planService: AwardPlanService) {
  }

  ngOnInit() {
  }

  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
