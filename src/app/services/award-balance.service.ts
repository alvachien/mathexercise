import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { LogLevel, UserAuthInfo, UserAward, UserAwardJson } from '../model';
import { AuthService } from './auth.service';

@Injectable()
export class AwardBalanceService {
  public dataChangedSubject: BehaviorSubject<UserAward[]> = new BehaviorSubject<UserAward[]>([]);
  get Awards(): UserAward[] {
    return this.dataChangedSubject.value;
  }

  constructor(private _http: HttpClient,
    private _authService: AuthService) {
  }

  public fetchAwardsForUser(usr: string) {
    const apiurl = environment.APIBaseUrl + 'UserAward';

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
              .append('Accept', 'application/json')
              .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
    let params: HttpParams = new HttpParams();
    params = params.append('userid', usr);

    this._http.get(apiurl, {
          headers: headers,
          params: params,
          withCredentials: true
       })
      .map((response: Response) => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log(response);
        }

        let awards = []; // Clear it first
        const rjs = <any>response;

        if (rjs instanceof Array && rjs.length > 0) {
          for (const si of rjs) {
            const ap: UserAward = new UserAward();
            ap.parseData(<UserAwardJson>si);
            awards.push(ap);
          }
        }

        return awards;
      })
      .subscribe(x => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log(`AC Math Exercise [Debug]: Succeed in fetchAwardsForUser in AwardBalanceService: ${x}`);
        }

        let copiedData = x;
        this.dataChangedSubject.next(copiedData);
      }, error => {
        if (environment.LoggingLevel >= LogLevel.Error) {
          console.log(`AC Math Exercise [Error]: Error occurred in fetchAwardsForUser in AwardBalanceService: ${error}`);
        }
      }, () => {

      });
  }
}
