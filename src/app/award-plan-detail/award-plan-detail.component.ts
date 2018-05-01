import { Component, OnInit } from '@angular/core';
import { Observable, merge, of as observableOf } from 'rxjs';
import { map, startWith, switchMap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AwardPlan, QuizTypeEnum, GetAllQuizTypeUIStrings, LogLevel, DateFormat,
  UserDetailInfo, UIMode, QuizTypeUI } from '../model';

@Component({
  selector: 'app-award-plan-detail',
  templateUrl: './award-plan-detail.component.html',
  styleUrls: ['./award-plan-detail.component.scss']
})
export class AwardPlanDetailComponent implements OnInit {
  private _curPlan: AwardPlan;
  get CurrentPlan(): AwardPlan {
    return this._curPlan;
  }

  constructor() { }

  ngOnInit() {
  }

}
