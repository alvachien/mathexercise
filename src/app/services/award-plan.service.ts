import { Injectable, EventEmitter } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, finalize, map, startWith } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LogLevel, UserAuthInfo, AwardPlan, AwardPlanJson } from '../model';
import { AuthService } from './auth.service';

@Injectable()
export class AwardPlanService {
  constructor(private _http: HttpClient,
    private _authService: AuthService) {
  }

  /**
   * Fetch plans for specified user
   * @param usr User
   */
  public fetchPlansForUser(usr?: string, allowInvalid?: boolean): Observable<any> {
    const apiurl = environment.APIBaseUrl + 'AwardPlan';

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
    let params: HttpParams = new HttpParams();
    if (usr) {
      params = params.set('tgtuser', usr);
    }
    if (allowInvalid) {
      params = params.set('incInvalid', allowInvalid.toString());
    }

    return this._http.get(apiurl, { headers: headers, params: params, withCredentials: true })
      .pipe(map((response: HttpResponse<any>) => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log(response);
        }

        const aplans = [];
        const rjs = <any>response;
        if (rjs instanceof Array && rjs.length > 0) {
          for (const si of rjs) {
            const ap: AwardPlan = new AwardPlan();
            ap.parseData(<AwardPlanJson>si);

            aplans.push(ap);
          }
        }

        return aplans;
      }));
  }

  /**
   * Create an award plan
   * @param aplan Award plan to create
   */
  public createAwardPlan(aplan: AwardPlan): Observable<any> {
    // Submit to the API
    const apiurl = environment.APIBaseUrl + 'AwardPlan';

    const data = aplan.prepareData();
    const jdata = JSON && JSON.stringify(data);

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    return this._http.post(apiurl, jdata, {
        headers: headers,
        withCredentials: true
      })
      .pipe(map((response: HttpResponse<any>) => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log('AC Math Exercise [Debug]: Map in createAwardPlan of AwardPlanService: ' + response);
        }

        const ap: AwardPlan = new AwardPlan;
        ap.parseData(<any>response);
        return ap;
      }));
  }

  public changeAwardPlan(aplan: AwardPlan): Observable<any> {
    // Submit to the API
    const apiurl = environment.APIBaseUrl + 'AwardPlan/' + aplan.ID;

    const data = aplan.prepareData();
    const jdata = JSON && JSON.stringify(data);

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
              .append('Accept', 'application/json')
              .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    return this._http.put(apiurl, data, {
        headers: headers,
        withCredentials: true
      })
      .pipe(map((response: HttpResponse<any>) => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log('AC Math Exercise [Debug]:' + response);
        }

        const aplan2: AwardPlan = new AwardPlan();
        aplan2.parseData(<any>response);
        return aplan2;
      }));
  }

  public deleteAwardPlan(aplanid: number): Observable<any> {
    // Submit to the API
    const apiurl = environment.APIBaseUrl + 'AwardPlan/' + aplanid;

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
              .append('Accept', 'application/json')
              .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    return this._http.delete(apiurl, {
        headers: headers,
        withCredentials: true
      })
      .pipe(map((response: HttpResponse<any>) => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log('AC Math Exercise [Debug]:' + response);
        }

        return <any>response;
      }));
  }
}
