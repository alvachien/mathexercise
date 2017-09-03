import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers, URLSearchParams } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { LogLevel, UserAuthInfo, UserAward, UserAwardJson } from '../model';
import { AuthService } from './auth.service';

@Injectable()
export class AwardBalanceService {
  private _awards: UserAward[];
  public dataChangedSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  
  constructor(private _http: Http,
    private _authService: AuthService) {
    this._awards = [];
  }

  public fetchAwardsForUser(usr: string): Observable<any> {
    let apiurl = environment.APIBaseUrl + 'UserAward';

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
    let params: URLSearchParams = new URLSearchParams();
    params.set('userid', usr);

    let options = new RequestOptions({ search: params, headers: headers }); // Create a request option
    return this._http.get(apiurl, options)
      .map((response: Response) => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log(response);
        }

        this._awards = []; // Clear it first
        let rjs = response.json();

        let totalPoints: number = 0;
        if (rjs instanceof Array && rjs.length > 0) {
          for (let si of rjs) {
            let ap: UserAward = new UserAward();
            ap.parseData(<UserAwardJson>si);
            totalPoints += ap.Award;
            this._awards.push(ap);
          }
        }

        // Calculate the sum
        let aptotal: UserAward = new UserAward();
        aptotal.Award = totalPoints;
        //aptotal.AwardDate = 'SUM';
        this._awards.push(aptotal);

        return this._awards;
      });
  }

  public triggerDataChange() {
    this.dataChangedSubject.next(true);
  }
}
