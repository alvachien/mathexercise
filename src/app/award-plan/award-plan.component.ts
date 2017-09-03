import { Component, OnInit } from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { AwardPlan } from '../model';

export class AwardPlanDataSource extends DataSource<any> {
  private _arPlans: AwardPlan[] = [];
  get AwardPlans(): AwardPlan[] {
    return this._arPlans;
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<AwardPlan[]> {
    return Observable.of(this._arPlans);
  }

  disconnect() {}
}

@Component({
  selector: 'app-award-plan',
  templateUrl: './award-plan.component.html',
  styleUrls: ['./award-plan.component.scss']
})
export class AwardPlanComponent implements OnInit {
  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  dataSource = new AwardPlanDataSource();

  constructor() { }

  ngOnInit() {
  }

}
