import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { LogLevel, UserAuthInfo, UserAward, UserAwardJson } from '../model';
import { AuthService } from './auth.service';

@Injectable()
export class AwardBalanceService {
  private _awards: UserAward[];
  public dataChangedSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private _http: HttpClient,
    private _authService: AuthService) {
    this._awards = [];
  }

  public fetchAwardsForUser(usr: string): Observable<any> {
    const apiurl = environment.APIBaseUrl + 'UserAward';

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
              .append('Accept', 'application/json')
              .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
    let params: HttpParams = new HttpParams();
    params = params.append('userid', usr);

    return this._http.get(apiurl, {
          headers: headers,
          params: params,
          withCredentials: true
       })
      .map((response: Response) => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log(response);
        }

        this._awards = []; // Clear it first
        const rjs = response.json();

        if (rjs instanceof Array && rjs.length > 0) {
          for (const si of rjs) {
            const ap: UserAward = new UserAward();
            ap.parseData(<UserAwardJson>si);
            this._awards.push(ap);
          }
        }

        return this._awards;
      });
  }

  public triggerDataChange() {
    this.dataChangedSubject.next(true);
  }
}
