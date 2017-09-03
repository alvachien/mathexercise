import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers, URLSearchParams } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { LogLevel, UserAuthInfo, AwardPlan, AwardPlanJson } from '../model';
import { AuthService } from './auth.service';

@Injectable()
export class AwardPlanService {
  private _awardPlans: AwardPlan[];
  public dataChangedSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private _http: Http,
    private _authService: AuthService) {
    this._awardPlans = [];
  }

  public fetchPlansForUser(usr: string): Observable<any> {
    const apiurl = environment.APIBaseUrl + 'AwardPlan';

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
    const params: URLSearchParams = new URLSearchParams();
    params.set('tgtuser', usr);

    const options = new RequestOptions({ search: params, headers: headers }); // Create a request option
    return this._http.get(apiurl, options)
      .map((response: Response) => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log(response);
        }

        this._awardPlans = []; // Clear it first
        const rjs = response.json();
        if (rjs instanceof Array && rjs.length > 0) {
          for (const si of rjs) {
            const ap: AwardPlan = new AwardPlan();
            ap.parseData(<AwardPlanJson>si);

            this._awardPlans.push(ap);
          }
        }

        return this._awardPlans;
      });
  }

  public triggerDataChange() {
    this.dataChangedSubject.next(true);
  }

  public createAwardPlan() {
    // Todo
  }

  public deleteAwardPlan(data: any) {
    // Todo
  }
}
