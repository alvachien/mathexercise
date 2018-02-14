import { Injectable, EventEmitter } from '@angular/core';
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

  // Events
  createEvent: EventEmitter<UserAward | string> = new EventEmitter(null);
  changeEvent: EventEmitter<UserAward | string> = new EventEmitter(null);
  deleteEvent: EventEmitter<boolean | string> = new EventEmitter(false);

  constructor(private _http: HttpClient,
    private _authService: AuthService) {
  }

  /**
   * Fetch all awards for specified user
   * @param usr User
   */
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
      .map((response: HttpResponse<any>) => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log(response);
        }

        const awards = []; // Clear it first
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

        this.dataChangedSubject.next(x);
      }, error => {
        if (environment.LoggingLevel >= LogLevel.Error) {
          console.error(`AC Math Exercise [Error]: Error occurred in fetchAwardsForUser in AwardBalanceService: ${error}`);
        }
      }, () => {
      });
  }

  /**
   * Create award
   * @param award Award object to create
   */
  public createAward(award: UserAward) {
    const apiurl = environment.APIBaseUrl + 'UserAward';

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    const data = award.prepareData();
    const jdata = JSON && JSON.stringify(data);

    this._http.post(apiurl, jdata, {
        headers: headers,
        withCredentials: true
      })
      .map((response: HttpResponse<any>) => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log(response);
        }

        const rjs = <any>response;

        const awards = this.Awards.slice();
        const ap: UserAward = new UserAward();
        ap.parseData(<UserAwardJson>rjs);
        awards.push(ap);

        this.dataChangedSubject.next(awards);
        return ap;
      })
      .subscribe(x => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log(`AC Math Exercise [Debug]: Succeed in createAward in AwardBalanceService: ${x}`);
        }

        this.createEvent.emit(x);
      }, error => {
        if (environment.LoggingLevel >= LogLevel.Error) {
          console.error(`AC Math Exercise [Error]: Error occurred in createAward in AwardBalanceService: ${error}`);
        }

        this.createEvent.emit(error);
      }, () => {
      });
  }

  /**
   * Update an award
   * @param award Award to be updated
   */
  public updateAward(award: UserAward) {
    const apiurl = environment.APIBaseUrl + 'UserAward/' + award.ID.toString();

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    const data = award.prepareData();
    const jdata = JSON && JSON.stringify(data);
    // let params: HttpParams = new HttpParams();
    // params = params.append('id', award.ID.toString());

    this._http.put(apiurl, jdata, {
        headers: headers,
        // params: params,
        withCredentials: true
      })
      .map((response: HttpResponse<any>) => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log(response);
        }

        const rjs = <any>response;
        const ap: UserAward = new UserAward();
        ap.parseData(<UserAwardJson>rjs);

        return ap;
      })
      .subscribe(x => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log(`AC Math Exercise [Debug]: Succeed in updateAward in AwardBalanceService: ${x}`);
        }

        this.changeEvent.emit(x);
      }, error => {
        if (environment.LoggingLevel >= LogLevel.Error) {
          console.error(`AC Math Exercise [Error]: Error occurred in updateAward in AwardBalanceService: ${error}`);
        }

        this.changeEvent.emit(error);
      }, () => {
      });
  }

  /**
   * Delete an award
   * @param awardid ID of award
   */
  public deleteAward(awardid: number) {
    const apiurl = environment.APIBaseUrl + 'UserAward/' + awardid.toString();

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
    // let params: HttpParams = new HttpParams();
    // params = params.append('id', awardid.toString());

    this._http.delete(apiurl, {
        headers: headers,
        // params: params,
        withCredentials: true
      })
      .map((response: HttpResponse<any>) => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log(response);
        }

        return response;
      })
      .subscribe(x => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log(`AC Math Exercise [Debug]: Succeed in deleteAward in AwardBalanceService: ${x}`);
        }

        if (x) {
          this.deleteEvent.emit(true);
        } else {
          this.deleteEvent.emit(false);
        }
      }, error => {
        if (environment.LoggingLevel >= LogLevel.Error) {
          console.error(`AC Math Exercise [Error]: Error occurred in deleteAward in AwardBalanceService: ${error}`);
        }

        this.deleteEvent.emit(error);
      }, () => {
      });
  }
}
