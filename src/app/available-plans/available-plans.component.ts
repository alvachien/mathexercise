import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AwardPlan, QuizTypeEnum, QuizTypeEnum2UIString, LogLevel, DateFormat, UserDetailInfo, UIMode } from '../model';
import { AwardPlanService, QuizAttendUser, UserDetailService, DialogService, AuthService, NavigationService } from '../services';
import { MessageDialogButtonEnum, MessageDialogInfo, MessageDialogComponent } from '../message-dialog';

@Component({
  selector: 'app-available-plans',
  templateUrl: './available-plans.component.html',
  styleUrls: ['./available-plans.component.scss']
})
export class AvailablePlansComponent implements OnInit, AfterViewInit {
  private _curuser: string;
  displayedColumns = ['ID', 'ValidFrom', 'ValidTo', 'QuizType', 'AwardCondition', 'Award'];
  dataSource = new MatTableDataSource<AwardPlan>();

  @Input()
  set CurrentUser(curUser: string) {
    if (this._curuser !== curUser) {
      this._curuser = curUser;

      this._planService.fetchPlansForUser(this._curuser, false)
        .subscribe(x => {
          this.dataSource.data = x;
        }, error => {
          // TBD.
        }, () => {
          // DO nothing
        });
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _planService: AwardPlanService,
    private _router: Router,
    private _nvgService: NavigationService) {
    // Do nothing
  }

  ngOnInit() {
    // Do nothing
  }

  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onTryPlan(aplan: AwardPlan) {
    // Navigate to
    switch (aplan.QuizType) {
      case QuizTypeEnum.add:
      case QuizTypeEnum.sub:
      case QuizTypeEnum.multi:
      case QuizTypeEnum.div:
      case QuizTypeEnum.mixedop:
      {
        this._nvgService.currentQuizControl = aplan.QuizControl;
        if (aplan.QuizType === QuizTypeEnum.add) {
          this._router.navigate(['/add-ex']);
        } else if (aplan.QuizType === QuizTypeEnum.sub) {
          this._router.navigate(['/sub-ex']);
        } else if (aplan.QuizType === QuizTypeEnum.multi) {
          this._router.navigate(['/multi-ex']);
        } else if (aplan.QuizType === QuizTypeEnum.div) {
          this._router.navigate(['/divide-ex']);
        } else if (aplan.QuizType === QuizTypeEnum.mixedop) {
          this._router.navigate(['/mixop-ex']);
        }
      }
      break;

      default:
      break;
    }
  }
}
